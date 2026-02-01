const pool = require("../db");

// Get all products (public)
exports.getAllProducts = async (req, res) => {
  try {
    const products = await pool.query("SELECT * FROM products ORDER BY product_id DESC");
    res.json(products.rows);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get single product by ID
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM products WHERE product_id = $1", [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching product:", err);
    res.status(500).json({ error: err.message });
  }
};

// Add product (admin only)
exports.addProduct = async (req, res) => {
  try {
    // Only admin can add products
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const { name, price, category, stock, image_url, description, condition } = req.body;

    // Validation
    if (!name || !price || !category || !stock) {
      return res.status(400).json({ message: "Name, price, category, and stock are required" });
    }

    if (stock < 0) {
      return res.status(400).json({ message: "Stock cannot be negative" });
    }

    if (price <= 0) {
      return res.status(400).json({ message: "Price must be greater than 0" });
    }

    await pool.query(
      "INSERT INTO products (name, price, category, stock, image_url, description, condition) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [name, price, category, stock, image_url || null, description || null, condition || null]
    );

    res.status(201).json({ 
      message: "Product added successfully",
      product: {
        name,
        price,
        category,
        stock,
        image_url,
        description,
        condition
      }
    });
  } catch (err) {
    console.error("Error adding product:", err);
    res.status(500).json({ error: err.message });
  }
};

// Update product (admin only)
exports.updateProduct = async (req, res) => {
  try {
    // Only admin can update products
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const { id } = req.params;
    const { name, price, category, stock, image_url, description, condition } = req.body;

    // Validation
    if (!name || !price || !category || !stock) {
      return res.status(400).json({ message: "Name, price, category, and stock are required" });
    }

    if (stock < 0) {
      return res.status(400).json({ message: "Stock cannot be negative" });
    }

    if (price <= 0) {
      return res.status(400).json({ message: "Price must be greater than 0" });
    }

    // Check if product exists
    const existingProduct = await pool.query("SELECT * FROM products WHERE product_id = $1", [id]);
    if (existingProduct.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    const result = await pool.query(
      "UPDATE products SET name = $1, price = $2, category = $3, stock = $4, image_url = $5, description = $6, condition = $7 WHERE product_id = $8 RETURNING *",
      [name, price, category, stock, image_url || null, description || null, condition || null, id]
    );

    res.json({ 
      message: "Product updated successfully",
      product: result.rows[0]
    });
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ error: err.message });
  }
};

// Delete product (admin only)
exports.deleteProduct = async (req, res) => {
  try {
    // Only admin can delete products
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const { id } = req.params;

    // Check if product exists
    const existingProduct = await pool.query("SELECT * FROM products WHERE product_id = $1", [id]);
    if (existingProduct.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if product is in any active orders or cart
    const cartCheck = await pool.query("SELECT COUNT(*) as count FROM cart WHERE product_id = $1", [id]);
    if (cartCheck.rows[0].count > 0) {
      return res.status(400).json({ 
        message: "Cannot delete product. It is currently in users' carts." 
      });
    }

    await pool.query("DELETE FROM products WHERE product_id = $1", [id]);

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ error: err.message });
  }
};
