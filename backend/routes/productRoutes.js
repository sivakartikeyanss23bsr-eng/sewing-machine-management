const router = require("express").Router();
const pool = require("../db");

router.get("/", async (req, res) => {
  const products = await pool.query("SELECT * FROM products");
  res.json(products.rows);
});

module.exports = router;
