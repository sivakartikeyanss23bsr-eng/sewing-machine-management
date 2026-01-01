const router = require("express").Router();
const { sendOTP, verifyAndRegister } = require("../controllers/registerController");

// Send OTP to user's phone
router.post("/send-otp", sendOTP);

// Verify OTP and complete registration
router.post("/verify-and-register", verifyAndRegister);

module.exports = router;
