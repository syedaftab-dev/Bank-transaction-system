const express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const userController = require("../controllers/user.controller");

// ! GET /api/users/search
router.get("/search", authMiddleware.authMiddleware, userController.searchUsersController);

module.exports = router;
