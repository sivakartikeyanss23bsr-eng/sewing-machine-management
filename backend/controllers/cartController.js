const pool = require("../db");

// Add product to cart
exports.addToCart = async (req, res) => {
  const { product_id, quantity } = req.body;
  const userId = req.user.user_id; // Get user_id from JWT token

  try {
    // Check if product exists and has sufficient stock
    const productCheck = await pool.query(
      "SELECT stock FROM products WHERE product_id = $1",
      [product_id]
    );

    if (productCheck.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    const currentStock = productCheck.rows[0].stock;
    const requestedQuantity = quantity || 1;

    if (currentStock < requestedQuantity) {
      return res.status(400).json({ message: "Insufficient stock available" });
    }

    // Add to cart or update quantity
    await pool.query(
      `INSERT INTO cart (user_id, product_id, quantity)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, product_id)
       DO UPDATE SET quantity = cart.quantity + EXCLUDED.quantity`,
      [userId, product_id, requestedQuantity]
    );

    res.json({ message: "Product added to cart" });
  } catch (err) {
    console.error("Error adding to cart:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get cart items
exports.getCart = async (req, res) => {
  const userId = req.user.user_id;

  try {
    const result = await pool.query(
      `SELECT c.cart_id, p.name, p.price, p.image_url, p.stock, c.quantity,
              (p.price * c.quantity) AS total
       FROM cart c
       JOIN products p ON c.product_id = p.product_id
       WHERE c.user_id = $1
       ORDER BY c.created_at DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching cart:", err);
    res.status(500).json({ error: err.message });
  }
};

// Update quantity
exports.updateQuantity = async (req, res) => {
  const { cart_id, quantity } = req.body;
  const userId = req.user.user_id;

  try {
    // Validate quantity
    if (quantity <= 0) {
      return res.status(400).json({ message: "Quantity must be greater than 0" });
    }

    // Check if cart item belongs to user and get product stock
    const cartCheck = await pool.query(
      `SELECT c.product_id, p.stock 
       FROM cart c 
       JOIN products p ON c.product_id = p.product_id 
       WHERE c.cart_id = $1 AND c.user_id = $2`,
      [cart_id, userId]
    );

    if (cartCheck.rows.length === 0) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    const availableStock = cartCheck.rows[0].stock;

    if (availableStock < quantity) {
      return res.status(400).json({ message: "Insufficient stock available" });
    }

    await pool.query(
      "UPDATE cart SET quantity = $1 WHERE cart_id = $2 AND user_id = $3",
      [quantity, cart_id, userId]
    );

    res.json({ message: "Quantity updated" });
  } catch (err) {
    console.error("Error updating quantity:", err);
    res.status(500).json({ error: err.message });
  }
};

// Remove item
exports.removeItem = async (req, res) => {
  const { cartId } = req.params;
  const userId = req.user.user_id;

  try {
    const result = await pool.query(
      "DELETE FROM cart WHERE cart_id = $1 AND user_id = $2 RETURNING *",
      [cartId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.json({ message: "Item removed from cart" });
  } catch (err) {
    console.error("Error removing item:", err);
    res.status(500).json({ error: err.message });
  }
};
