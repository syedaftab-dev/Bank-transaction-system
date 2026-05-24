const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');
const blackListModel = require('../models/blacklist.model');
const redisClient = require('../config/redis');
const AppError = require('../utils/AppError');
const emailService = require('./email.service');
const accountService = require('./account.service');

const signToken = (id) => {
  return jwt.sign({ userId: id }, process.env.JWT_SECRET, {
    expiresIn: '3d',
  });
};

const registerUser = async (userData) => {
  const { name, email, password } = userData;

  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    throw new AppError('Email already exists', 400);
  }

  const user = await userModel.create({
    name,
    email,
    password,
  });

  // Automatically create an account for the new user
  await accountService.createAccount(user._id);

  const token = signToken(user._id);

  // Send welcome email (non-blocking)
  emailService.sendRegistrationEmail(user.email, user.name).catch(console.error);

  return { user, token };
};

const loginUser = async (email, password) => {
  if (!email || !password) {
    throw new AppError('Please provide email and password', 400);
  }

  const user = await userModel.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Incorrect email or password', 401);
  }

  const token = signToken(user._id);

  return { user, token };
};

const logoutUser = async (token) => {
  if (!token) return;

  // 1. Blacklist in Redis (Fast) - TTL 3 days
  const THREE_DAYS_IN_SECONDS = 3 * 24 * 60 * 60;
  await redisClient.set(`blacklist:${token}`, 'true', 'EX', THREE_DAYS_IN_SECONDS);

  // 2. Blacklist in MongoDB (Persistence)
  await blackListModel.create({ token });
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
};
