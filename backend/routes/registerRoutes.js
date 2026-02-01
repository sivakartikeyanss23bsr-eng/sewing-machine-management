const router = require("express").Router();
const { register } = require("../controllers/registerController");

// Direct registration without OTP
router.post("/register", register);

module.exports = router;
