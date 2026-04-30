const express = require('express');
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { validate, authSchemas } = require("../middleware/validation.middleware");

// * POST /api/auth/register
router.post("/register", validate(authSchemas.register), authController.userRegisterController);

// * POST /api/auth/login
router.post("/login", validate(authSchemas.login), authController.userLoginController);

// * POST /api/auth/logout
router.post("/logout", authController.userLogoutController);

module.exports = router;
