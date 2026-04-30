const userModel = require('../models/user.model');
const accountModel = require('../models/account.model');
const catchAsync = require('../utils/catchAsync');

const searchUsersController = catchAsync(async (req, res, next) => {
  const { q } = req.query;
  
  if (!q) {
    return res.status(200).json([]);
  }

  // Search by name or email, case insensitive, exclude current user
  const users = await userModel.find({
    _id: { $ne: req.user._id },
    $or: [
      { name: { $regex: q, $options: 'i' } },
      { email: { $regex: q, $options: 'i' } }
    ]
  }).select('name email');

  // Need to get accounts for these users because frontend expects user.account._id
  const usersWithAccounts = await Promise.all(users.map(async (user) => {
    const account = await accountModel.findOne({ user: user._id });
    if (account) {
        return {
            _id: user._id,
            name: user.name,
            email: user.email,
            account: { _id: account._id }
        };
    }
    return null;
  }));

  res.status(200).json(usersWithAccounts.filter(u => u !== null));
});

module.exports = {
  searchUsersController,
};
