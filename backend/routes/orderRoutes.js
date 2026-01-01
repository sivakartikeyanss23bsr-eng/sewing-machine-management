const router = require("express").Router();
const pool = require("../db");

router.post("/", async (req, res) => {
  const { user_id, total } = req.body;
  await pool.query(
    "INSERT INTO orders (user_id, total, status) VALUES ($1,$2,$3)",
    [user_id, total, "Pending"]
  );
  res.json({ message: "Order placed" });
});

module.exports = router;
