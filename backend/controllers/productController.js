const pool = require("../db");

exports.getAllProducts = async (req, res) => {
  try {
    const products = await pool.query("SELECT * FROM products");
    res.json(products.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addProduct = async (req, res) => {
  try {
    const { name, price, category, stock, image_url, description, condition } = req.body;

    await pool.query(
      "INSERT INTO products (name, price, category, stock, image_url, description, condition) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [name, price, category, stock, image_url, description, condition]
    );

    res.status(201).json({ message: "Product added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
