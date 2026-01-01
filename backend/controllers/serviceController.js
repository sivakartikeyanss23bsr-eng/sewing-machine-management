const pool = require("../db");

exports.createServiceRequest = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      machine_model,
      purchase_date,
      complaint
    } = req.body;

    // Validation
    if (!name || !email || !phone || !machine_model || !purchase_date || !complaint) {
      return res.status(400).json({ message: "All fields are required" });
    }

    await pool.query(
      `INSERT INTO services 
      (name, email, phone, machine_model, purchase_date, complaint)
      VALUES ($1,$2,$3,$4,$5,$6)`,
      [name, email, phone, machine_model, purchase_date, complaint]
    );

    res.status(201).json({ message: "Service request submitted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllServiceRequests = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM services ORDER BY request_date DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
