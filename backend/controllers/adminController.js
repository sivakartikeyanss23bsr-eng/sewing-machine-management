const pool = require("../db");

exports.getDashboardStats = async (req, res) => {
  try {
    const orders = await pool.query("SELECT COUNT(*) FROM orders");
    const revenue = await pool.query("SELECT SUM(total) FROM orders");
    const services = await pool.query("SELECT COUNT(*) FROM services");

    res.json({
      totalOrders: orders.rows[0].count,
      totalRevenue: revenue.rows[0].sum || 0,
      totalServices: services.rows[0].count
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
