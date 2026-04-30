const authService = require('../services/auth.service');
const catchAsync = require('../utils/catchAsync');

const createSendToken = (user, token, statusCode, res, message) => {
  const cookieOptions = {
    expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  };

  res.cookie('token', token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    message,
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
  });
};

const userRegisterController = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;
  const result = await authService.registerUser({ name, email, password });

  createSendToken(result.user, result.token, 201, res, 'User created successfully');
});

const userLoginController = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const result = await authService.loginUser(email, password);

  createSendToken(result.user, result.token, 200, res, 'User logged in successfully');
});

const userLogoutController = catchAsync(async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  
  await authService.logoutUser(token);

  res.clearCookie('token');
  res.status(200).json({
    status: 'success',
    message: 'User logged out successfully',
  });
});

module.exports = {
  userRegisterController,
  userLoginController,
  userLogoutController,
};
