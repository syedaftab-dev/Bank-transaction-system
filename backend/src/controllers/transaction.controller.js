const transactionService = require('../services/transaction.service');
const catchAsync = require('../utils/catchAsync');

const createdTransactionController = catchAsync(async (req, res, next) => {
  const { fromAccount, toAccount, amount, idempotencyKey, pin } = req.body;

  const transaction = await transactionService.createTransfer({
    fromAccount,
    toAccount,
    amount,
    idempotencyKey,
    user: req.user,
    pin
  });

  res.status(201).json({
    status: 'success',
    message: 'Transaction completed successfully',
    transaction,
  });
});

const createInitialFundsController = catchAsync(async (req, res, next) => {
  const { toAccount, amount, idempotencyKey } = req.body;

  const transaction = await transactionService.createInitialFunds({
    toAccount,
    amount,
    idempotencyKey,
    systemUser: req.user,
  });

  res.status(201).json({
    status: 'success',
    message: 'Initial funds added successfully',
    transaction,
  });
});

const getUserTransactionsController = catchAsync(async (req, res, next) => {
  const transactions = await transactionService.getTransactionsByUser(req.user._id);

  // Return directly as array to match frontend expectation
  res.status(200).json(transactions);
});

module.exports = {
  createdTransactionController,
  createInitialFundsController,
  getUserTransactionsController,
};