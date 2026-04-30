const express = require('express');
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const accountController = require("../controllers/account.controller");

// ! POST /api/accounts/create
router.post("/create", authMiddleware.authMiddleware, accountController.createAccountController);

// ! GET /api/accounts/my-account - Get user's primary account
router.get("/my-account", authMiddleware.authMiddleware, accountController.getMyAccountController);

// ! GET /api/accounts/balance - Get balance of the user's primary account
router.get("/balance", authMiddleware.authMiddleware, accountController.getAccountBalanceController);

// ! GET /api/accounts/balance/:accountId - Get balance of a specific account
router.get("/balance/:accountId", authMiddleware.authMiddleware, accountController.getAccountBalanceController);

// ! GET /api/accounts - Get all accounts
router.get("/", authMiddleware.authMiddleware, accountController.getUserAccountsController);

module.exports = router;