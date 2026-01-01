const pool = require("../db");

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
    res.json({
  token,
  role: user.role
});


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
