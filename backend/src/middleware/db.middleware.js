const mongoose = require('mongoose');
const AppError = require('../utils/AppError');

const checkDbConnection = (req, res, next) => {
    if (mongoose.connection.readyState !== 1) {
        return next(new AppError('Database connection is not established. Please check your network or MongoDB configuration.', 503));
    }
    next();
};

module.exports = checkDbConnection;
