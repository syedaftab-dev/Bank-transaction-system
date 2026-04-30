const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const blackListModel = require("../models/blacklist.model");
const redisClient = require("../config/redis");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

const verifyAndFetchUser = async (req, selectFields = "") => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
        throw new AppError("Unauthorized access, token is missing", 401);
    }

    // 1. Check Redis blacklist (O(1))
    const isBlacklistedRedis = await redisClient.get(`blacklist:${token}`);
    if (isBlacklistedRedis) {
        throw new AppError("Unauthorized access, token is invalid", 401);
    }

    // 2. Check MongoDB blacklist (Fallback)
    const isBlackListedDB = await blackListModel.findOne({ token });
    if (isBlackListedDB) {
        throw new AppError("Unauthorized access, token is invalid", 401);
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.userId).select(selectFields);

        if (!user) {
            throw new AppError("User belonging to this token no longer exists", 401);
        }

        return user;
    } catch (err) {
        throw new AppError("Unauthorized access, invalid token", 401);
    }
};

const authMiddleware = catchAsync(async (req, res, next) => {
    req.user = await verifyAndFetchUser(req);
    next();
});

const authSystemUserMiddleware = catchAsync(async (req, res, next) => {
    const user = await verifyAndFetchUser(req, "+systemUser");

    if (!user.systemUser) {
        throw new AppError("Forbidden access, only system user can perform this action", 403);
    }

    req.user = user;
    next();
});

module.exports = {
    authMiddleware,
    authSystemUserMiddleware
};