const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Login route
router.post("/login", authController.login);

// OTP verification route
router.post("/verify-otp", authController.verifyOtp);

module.exports = router;
