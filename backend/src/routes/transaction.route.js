const { Router } = require("express");
const auth = require("../middleware/auth.middleware");
const transactionController = require("../controllers/transaction.controller");
const { validate, transactionSchemas } = require("../middleware/validation.middleware");

const transactionRouter = Router();

//  ! GET /api/transactions
transactionRouter.get("/", auth.authMiddleware, transactionController.getUserTransactionsController);

//  ! POST /api/transactions
transactionRouter.post("/", auth.authMiddleware, validate(transactionSchemas.transfer), transactionController.createdTransactionController);

// POST /api/transactions/system/initial-funds — create initial funds (system user only)
transactionRouter.post("/system/initial-funds", auth.authSystemUserMiddleware, validate(transactionSchemas.initialFunds), transactionController.createInitialFundsController);

module.exports = transactionRouter;