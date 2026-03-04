const { Router } = require("express");
const { authMiddleware } = require("../middleware/auth.middleware");

const transactionRouter = Router();

//  ! post/api/transactions
transactionRouter.post("/", authMiddleware.authMiddleware,)