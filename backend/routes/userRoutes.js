const router = require("express").Router();
const { authenticateToken, requireAdmin } = require("../middleware/auth");
const pool = require("../db");

// Get all users (admin only)
router.get("/", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT user_id, name, email, role, phone, is_verified FROM users ORDER BY user_id DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get user by ID (admin only)
router.get("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT user_id, name, email, role, phone, is_verified FROM users WHERE user_id = $1",
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update user role (admin only)
router.put("/:id/role", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }
    
    const result = await pool.query(
      "UPDATE users SET role = $1 WHERE user_id = $2 RETURNING user_id, name, email, role",
      [role, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating user role:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete user (admin only)
router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      "DELETE FROM users WHERE user_id = $1 RETURNING user_id, name, email",
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json({ message: "User deleted successfully", user: result.rows[0] });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
