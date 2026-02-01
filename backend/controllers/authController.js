const pool = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Login Controller
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (result.rows.length === 0)
      return res.status(400).json({ message: "Invalid credentials" });

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { user_id: user.user_id, role: user.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1h" }
    );

    res.json({ token, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// OTP Verification Controller
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const result = await pool.query(
      "SELECT * FROM email_otp WHERE email=$1 AND otp=$2",
      [email, otp]
    );

    if (result.rows.length === 0)
      return res.status(400).json({ message: "Invalid OTP" });

    await pool.query(
      "UPDATE users SET is_verified=true WHERE email=$1",
      [email]
    );

    await pool.query(
      "DELETE FROM email_otp WHERE email=$1",
      [email]
    );

    res.json({ message: "Email verified successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
