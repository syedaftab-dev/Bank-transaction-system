const { Router } = require("express");
const auth = require("../middleware/auth.middleware");
const transactionController = require("../controller/transaction.controller");

const transactionRouter = Router();

//  ! POST /api/transactions
transactionRouter.post("/", auth.authMiddleware, transactionController.createdTransactionController);

// POST /api/transactions/system/initial-funds — create initial funds (system user only)
transactionRouter.post("/system/initial-funds", auth.authSystemUserMiddleware, transactionController.createInitialFundsController);

module.exports = transactionRouter;