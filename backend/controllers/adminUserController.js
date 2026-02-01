const pool = require("../db");
const bcrypt = require("bcryptjs");

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    // Only admin can view all users
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const result = await pool.query(`
      SELECT user_id, name, email, phone, role, is_verified
      FROM users 
      ORDER BY user_id DESC
    `);
    
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: err.message });
  }
};

// Add new user (admin only)
exports.addUser = async (req, res) => {
  try {
    // Only admin can add users
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const { name, email, password, phone, role = 'user' } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: "Role must be 'user' or 'admin'" });
    }

    // Check if user already exists
    const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const result = await pool.query(
      `INSERT INTO users (name, email, password, phone, role, is_verified) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING user_id, name, email, phone, role, is_verified`,
      [name, email, hashedPassword, phone || null, role, true]
    );

    res.status(201).json({ 
      message: "User created successfully",
      user: result.rows[0]
    });

  } catch (err) {
    console.error("Error adding user:", err);
    res.status(500).json({ error: err.message });
  }
};

// Update user (admin only)
exports.updateUser = async (req, res) => {
  try {
    // Only admin can update users
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const { id } = req.params;
    const { name, email, phone, role, is_verified } = req.body;

    // Validation
    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    if (role && !['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: "Role must be 'user' or 'admin'" });
    }

    // Check if user exists
    const existingUser = await pool.query("SELECT * FROM users WHERE user_id = $1", [id]);
    if (existingUser.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if email is being changed and if it conflicts with another user
    if (email !== existingUser.rows[0].email) {
      const emailCheck = await pool.query("SELECT * FROM users WHERE email = $1 AND user_id != $2", [email, id]);
      if (emailCheck.rows.length > 0) {
        return res.status(400).json({ message: "Email already exists for another user" });
      }
    }

    // Update user
    const result = await pool.query(
      `UPDATE users 
       SET name = $1, email = $2, phone = $3, role = $4, is_verified = $5
       WHERE user_id = $6
       RETURNING user_id, name, email, phone, role, is_verified`,
      [name, email, phone || null, role || existingUser.rows[0].role, is_verified !== undefined ? is_verified : existingUser.rows[0].is_verified, id]
    );

    res.json({ 
      message: "User updated successfully",
      user: result.rows[0]
    });

  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ error: err.message });
  }
};

// Delete user (admin only)
exports.deleteUser = async (req, res) => {
  try {
    // Only admin can delete users
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const { id } = req.params;

    // Check if user exists
    const existingUser = await pool.query("SELECT * FROM users WHERE user_id = $1", [id]);
    if (existingUser.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent admin from deleting themselves
    if (existingUser.rows[0].user_id === req.user.user_id) {
      return res.status(400).json({ message: "Cannot delete your own account" });
    }

    // Check if user has active orders or cart items
    const cartCheck = await pool.query("SELECT COUNT(*) as count FROM cart WHERE user_id = $1", [id]);
    if (cartCheck.rows[0].count > 0) {
      return res.status(400).json({ 
        message: "Cannot delete user. User has active cart items." 
      });
    }

    const orderCheck = await pool.query("SELECT COUNT(*) as count FROM orders WHERE user_id = $1", [id]);
    if (orderCheck.rows[0].count > 0) {
      return res.status(400).json({ 
        message: "Cannot delete user. User has order history." 
      });
    }

    // Delete user
    await pool.query("DELETE FROM users WHERE user_id = $1", [id]);

    res.json({ message: "User deleted successfully" });

  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ error: err.message });
  }
};

// Reset user password (admin only)
exports.resetPassword = async (req, res) => {
  try {
    // Only admin can reset passwords
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ message: "New password is required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    // Check if user exists
    const existingUser = await pool.query("SELECT * FROM users WHERE user_id = $1", [id]);
    if (existingUser.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await pool.query("UPDATE users SET password = $1 WHERE user_id = $2", [hashedPassword, id]);

    res.json({ message: "Password reset successfully" });

  } catch (err) {
    console.error("Error resetting password:", err);
    res.status(500).json({ error: err.message });
  }
};
