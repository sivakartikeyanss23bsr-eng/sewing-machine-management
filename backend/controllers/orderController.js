const pool = require("../db");

// Create order from cart
exports.createOrder = async (req, res) => {
  const { shipping_address, payment_method = 'COD' } = req.body;
  const userId = req.user.user_id;

  try {
    // Start transaction
    await pool.query('BEGIN');

    // Get cart items
    const cartItems = await pool.query(
      `SELECT c.product_id, c.quantity, p.price, p.stock, p.name
       FROM cart c 
       JOIN products p ON c.product_id = p.product_id 
       WHERE c.user_id = $1`,
      [userId]
    );

    if (cartItems.rows.length === 0) {
      await pool.query('ROLLBACK');
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Check stock availability
    for (const item of cartItems.rows) {
      if (item.stock < item.quantity) {
        await pool.query('ROLLBACK');
        return res.status(400).json({ 
          message: `Insufficient stock for ${item.name}. Available: ${item.stock}, Requested: ${item.quantity}` 
        });
      }
    }

    // Calculate total
    let totalAmount = 0;
    for (const item of cartItems.rows) {
      totalAmount += item.price * item.quantity;
    }

    // Generate tracking number
    const trackingNumber = 'TRK' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();

    // Create order
    const orderResult = await pool.query(
      `INSERT INTO orders (user_id, total, status, tracking_number, shipping_address, payment_method, estimated_delivery)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [userId, totalAmount, 'Order Confirmed', trackingNumber, shipping_address, payment_method, 
       new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)] // 7 days from now
    );

    const orderId = orderResult.rows[0].order_id;

    // Create order items
    for (const item of cartItems.rows) {
      await pool.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price_at_time, total_price)
         VALUES ($1, $2, $3, $4, $5)`,
        [orderId, item.product_id, item.quantity, item.price, item.price * item.quantity]
      );

      // Update product stock
      await pool.query(
        "UPDATE products SET stock = stock - $1 WHERE product_id = $2",
        [item.quantity, item.product_id]
      );
    }

    // Create initial status history
    await pool.query(
      `INSERT INTO order_status_history (order_id, status, notes)
       VALUES ($1, $2, $3)`,
      [orderId, 'Order Confirmed', 'Order has been placed successfully']
    );

    // Clear cart
    await pool.query("DELETE FROM cart WHERE user_id = $1", [userId]);

    await pool.query('COMMIT');

    res.json({ 
      message: "Order placed successfully",
      order_id: orderId,
      tracking_number: trackingNumber,
      total: totalAmount
    });

  } catch (err) {
    await pool.query('ROLLBACK');
    console.error("Error creating order:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get all orders (admin)
exports.getAllOrders = async (req, res) => {
  try {
    // Only admin can see all orders
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    
    const result = await pool.query(`
      SELECT o.*, u.name, u.email, u.phone
      FROM orders o 
      LEFT JOIN users u ON o.user_id = u.user_id 
      ORDER BY o.order_date DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching all orders:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get user orders
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user.user_id;
    
    const result = await pool.query(`
      SELECT o.*, 
             (SELECT json_agg(
               json_build_object(
                 'product_name', p.name,
                 'quantity', oi.quantity,
                 'price', oi.price_at_time,
                 'total', oi.total_price,
                 'image_url', p.image_url
               )
             ) FROM order_items oi 
             JOIN products p ON oi.product_id = p.product_id 
             WHERE oi.order_id = o.order_id) as items
      FROM orders o 
      WHERE o.user_id = $1 
      ORDER BY o.order_date DESC
    `, [userId]);
    
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching user orders:", err);
    res.status(500).json({ error: err.message });
  }
};

// Update order status (admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    // Only admin can update orders
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    // Validate status
    const validStatuses = ['Order Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    await pool.query('BEGIN');

    // Update order status
    await pool.query(
      "UPDATE orders SET status = $1 WHERE order_id = $2",
      [status, id]
    );

    // Add to status history
    await pool.query(
      "INSERT INTO order_status_history (order_id, status, notes) VALUES ($1, $2, $3)",
      [id, status, notes || `Status updated to ${status}`]
    );

    await pool.query('COMMIT');

    res.json({ message: "Order status updated successfully" });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error("Error updating order status:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get order status history
exports.getOrderStatusHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.user_id;
    
    // Check if order belongs to user or if admin
    const orderCheck = await pool.query(
      "SELECT user_id FROM orders WHERE order_id = $1",
      [id]
    );
    
    if (orderCheck.rows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    if (req.user.role !== "admin" && orderCheck.rows[0].user_id !== userId) {
      return res.status(403).json({ message: "Access denied" });
    }
    
    const result = await pool.query(
      "SELECT * FROM order_status_history WHERE order_id = $1 ORDER BY timestamp ASC",
      [id]
    );
    
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching order history:", err);
    res.status(500).json({ error: err.message });
  }
};
