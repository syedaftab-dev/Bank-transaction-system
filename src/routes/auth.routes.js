const express = require('express');

const router = express.Router();
const authController = require("../controller/auth.controller");

// * POST /api/auth/register
router.post("/register",authController.userRegisterController);

// router.post("/login");

// export the router so it can be used by app.js
module.exports = router;
