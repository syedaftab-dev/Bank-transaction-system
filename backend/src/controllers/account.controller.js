const accountService = require('../services/account.service');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const mongoose = require('mongoose');

const createAccountController = catchAsync(async (req, res, next) => {
  const account = await accountService.createAccount(req.user._id);

  res.status(201).json({
    status: 'success',
    message: 'Account created successfully',
    account,
  });
});

const getUserAccountsController = catchAsync(async (req, res, next) => {
  const accounts = await accountService.getUserAccounts(req.user._id);

  res.status(200).json({
    status: 'success',
    accounts,
  });
});

const getAccountBalanceController = catchAsync(async (req, res, next) => {
  const { accountId } = req.params;

  if (accountId && !mongoose.Types.ObjectId.isValid(accountId)) {
    return next(new AppError('Invalid account ID', 400));
  }

  const data = await accountService.getAccountBalance(accountId, req.user._id);

  res.status(200).json({
    status: 'success',
    ...data,
  });
});

const getMyAccountController = catchAsync(async (req, res, next) => {
  let accounts = await accountService.getUserAccounts(req.user._id);
  
  if (!accounts || accounts.length === 0) {
    // Lazy initialization: create an account if it doesn't exist (fixes old users)
    const newAccount = await accountService.createAccount(req.user._id);
    return res.status(200).json(newAccount);
  }
  
  // Return the first account directly to match frontend expectation
  res.status(200).json(accounts[0]);
});

module.exports = {
  createAccountController,
  getUserAccountsController,
  getAccountBalanceController,
  getMyAccountController,
};