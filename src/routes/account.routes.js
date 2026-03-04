const express = require('express');
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const accountController = require("../controller/account.controller");

// ! post /api/accounts

router.post("/",authMiddleware.authMiddleware,accountController.createAccountController);

// ! get /api/accounts    get all accounts of the user
router.get("/",authMiddleware.authMiddleware,accountController.getUserAccountsController);


// ! get /api/accounts/balance/:accountId
router.get("/balance/:accountId",authMiddleware.authMiddleware,accountController.getAccountBalanceController);


module.exports = router;