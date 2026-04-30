const accountModel = require('../models/account.model');
const AppError = require('../utils/AppError');

const createAccount = async (userId) => {
  // Enforce one account per user
  const existingAccount = await accountModel.findOne({ user: userId });
  if (existingAccount) {
    throw new AppError('User already has an account', 400);
  }

  const account = await accountModel.create({
    user: userId,
  });

  return account;
};

const getUserAccounts = async (userId) => {
  const accounts = await accountModel.find({ user: userId });
  return accounts;
};

const getAccountBalance = async (accountId, userId) => {
  let query = { user: userId };
  if (accountId) {
    query._id = accountId;
  }

  const account = await accountModel.findOne(query);

  if (!account) {
    throw new AppError('Account not found', 404);
  }

  const balance = await account.getBalance();
  return { accountId: account._id, balance };
};

module.exports = {
  createAccount,
  getUserAccounts,
  getAccountBalance,
};
