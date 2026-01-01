const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// OTP verification route
router.post("/verify-otp", authController.verifyOtp);

module.exports = router;
