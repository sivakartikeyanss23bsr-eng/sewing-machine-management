const pool = require("../db");

exports.getCompanyInfo = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM company LIMIT 1");
    if (result.rows.length === 0) {
      return res.json({
        name: "Sewing Machine Company",
        description: "We provide high-quality sewing machines and services.",
        contact: "contact@sewingmachine.com",
        address: "123 Sewing Street, City, Country"
      });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
