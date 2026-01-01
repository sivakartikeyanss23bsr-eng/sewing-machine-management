const pool = require("../db");

exports.placeOrder = async (req, res) => {
  try {
    const { user_id, total } = req.body;

    await pool.query(
      "INSERT INTO orders (user_id, total, status) VALUES ($1, $2, $3)",
      [user_id, total, "Pending"]
    );

    res.status(201).json({ message: "Order placed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await pool.query("SELECT * FROM orders");
    res.json(orders.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const { order_id } = req.params;

    await pool.query(
      "UPDATE orders SET status = $1 WHERE order_id = $2",
      ["Cancelled", order_id]
    );

    res.json({ message: "Order cancelled successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
