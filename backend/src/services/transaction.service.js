const mongoose = require('mongoose');
const accountModel = require('../models/account.model');
const transactionModel = require('../models/transaction.model');
const ledgerModel = require('../models/ledger.model');
const AppError = require('../utils/AppError');

const createTransfer = async ({ fromAccount, toAccount, amount, idempotencyKey, user, pin }) => {
  // 1. Basic Validations
  if (!fromAccount || !toAccount || !amount || !idempotencyKey || !pin) {
    throw new AppError('FromAccount, toAccount, amount, idempotencyKey, and PIN are required', 400);
  }

  if (fromAccount === toAccount) {
    throw new AppError('Cannot transfer to the same account', 400);
  }

  // 2. Check Idempotency
  const existingTx = await transactionModel.findOne({ idempotencyKey });
  if (existingTx) {
    if (existingTx.status === 'COMPLETED') return existingTx;
    if (existingTx.status === 'PENDING') throw new AppError('Transaction is already in progress', 409);
    throw new AppError(`Transaction previously failed with status: ${existingTx.status}`, 400);
  }

  // 3. Fetch accounts and validate ownership/status
  const fromAcc = await accountModel.findOne({ _id: fromAccount, user: user._id }).select('+pin');
  const toAcc = await accountModel.findById(toAccount);

  if (!fromAcc) throw new AppError('Source account not found or access denied', 404);
  if (!toAcc) throw new AppError('Destination account not found', 404);

  // Verify PIN
  const isPinValid = await fromAcc.verifyPin(pin);
  if (!isPinValid) {
    throw new AppError('Invalid transaction PIN', 401);
  }

  if (fromAcc.status !== 'ACTIVE' || toAcc.status !== 'ACTIVE') {
    throw new AppError('One or both accounts are not active', 400);
  }

  // 4. Check Balance
  const balance = await fromAcc.getBalance();
  if (balance < amount) {
    throw new AppError(`Insufficient balance. Current balance is ${balance}`, 400);
  }

  // 5. Manual Atomic Update (Since local MongoDB is not a replica set)
  console.log('Processing transfer without native transactions (standalone mode)...');
  
  let transaction;
  try {
    console.log('Creating transaction record...');
    transaction = await transactionModel.create({
      fromAccount,
      toAccount,
      amount,
      idempotencyKey,
      status: 'PENDING'
    });

    console.log('Debiting sender...');
    await ledgerModel.create({
      account: fromAccount,
      amount,
      transaction: transaction._id,
      type: 'DEBIT'
    });

    console.log('Crediting receiver...');
    await ledgerModel.create({
      account: toAccount,
      amount,
      transaction: transaction._id,
      type: 'CREDIT'
    });

    // Mark as Completed
    transaction.status = 'COMPLETED';
    await transaction.save();

    console.log('Transfer completed successfully.');
    
    return transaction;
  } catch (error) {
    console.error('Transfer failed:', error.message);
    if (transaction) {
        await transactionModel.findByIdAndUpdate(transaction._id, { status: 'FAILED' });
    }
    throw error;
  }
};


const createInitialFunds = async ({ toAccount, amount, idempotencyKey, systemUser }) => {
  if (!toAccount || !amount || !idempotencyKey) {
    throw new AppError('toAccount, amount, and idempotencyKey are required', 400);
  }

  const toAcc = await accountModel.findById(toAccount);
  if (!toAcc) throw new AppError('Invalid toAccount', 404);

  const fromAcc = await accountModel.findOne({ user: systemUser._id });
  if (!fromAcc) throw new AppError('System account not found', 500);

  // Check Idempotency
  const existingTx = await transactionModel.findOne({ idempotencyKey });
  if (existingTx) return existingTx;

  let transaction;
  try {
    transaction = await transactionModel.create({
      fromAccount: fromAcc._id,
      toAccount,
      amount,
      idempotencyKey,
      status: 'PENDING'
    });

    await ledgerModel.create({
      account: fromAcc._id,
      amount,
      transaction: transaction._id,
      type: 'DEBIT'
    });

    await ledgerModel.create({
      account: toAccount,
      amount,
      transaction: transaction._id,
      type: 'CREDIT'
    });

    transaction.status = 'COMPLETED';
    await transaction.save();

    return transaction;
  } catch (error) {
    if (transaction) {
        await transactionModel.findByIdAndUpdate(transaction._id, { status: 'FAILED' });
    }
    throw error;
  }
};

const getTransactionsByUser = async (userId) => {
  // Find the user's account first
  const account = await accountModel.findOne({ user: userId });
  if (!account) {
    throw new AppError('No account found for this user', 404);
  }

  // Get all transactions where the user is sender or receiver
  const transactions = await transactionModel
    .find({
      $or: [
        { fromAccount: account._id },
        { toAccount: account._id },
      ],
    })
    .populate({
        path: 'fromAccount',
        populate: { path: 'user', select: 'name email' }
    })
    .populate({
        path: 'toAccount',
        populate: { path: 'user', select: 'name email' }
    })
    .sort({ createdAt: -1 })
    .lean();

  return transactions;
};

module.exports = {
  createTransfer,
  createInitialFunds,
  getTransactionsByUser,
};
