const pool = require("../db");

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.user_id; // Assuming JWT middleware sets req.user

    const result = await pool.query(
      "SELECT user_id, name, email, gender, phone, dob, address, role FROM users WHERE user_id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { phone, address } = req.body;

    await pool.query(
      "UPDATE users SET phone = $1, address = $2 WHERE user_id = $3",
      [phone, address, userId]
    );

    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
