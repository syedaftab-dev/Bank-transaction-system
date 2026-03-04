const { Router } = require("express");
const { authMiddleware } = require("../middleware/auth.middleware");
const transactionController = require("../controller/transaction.controller");

const transactionRouter = Router();

//  ! post/api/transactions
transactionRouter.post("/", authMiddleware.authMiddleware,transactionController.createdTransactionController);

module.exports = transactionRouter;