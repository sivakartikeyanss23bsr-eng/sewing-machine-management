const pool = require("../db");

exports.createServiceRequest = async (req, res) => {
  try {
    const { issue } = req.body;
    const userId = req.user.user_id; // Get user_id from JWT token

    // Validation
    if (!issue) {
      return res.status(400).json({ message: "Issue description is required" });
    }

    await pool.query(
      "INSERT INTO services (user_id, issue, status) VALUES ($1, $2, $3)",
      [userId, issue, "Pending"]
    );

    res.status(201).json({ message: "Service request submitted successfully" });
  } catch (err) {
    console.error("Error creating service request:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getAllServiceRequests = async (req, res) => {
  try {
    // Only admin can see all service requests
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    
    const result = await pool.query(`
      SELECT s.*, u.name, u.email, u.phone, u.address 
      FROM services s 
      LEFT JOIN users u ON s.user_id = u.user_id 
      ORDER BY s.service_id DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching all service requests:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getUserServiceRequests = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const result = await pool.query("SELECT * FROM services WHERE user_id = $1 ORDER BY service_id DESC", [userId]);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching user service requests:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateServiceRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Only admin can update service requests
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    // Validate status
    const validStatuses = ['Pending', 'Processing', 'Completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status. Must be: Pending, Processing, or Completed" });
    }

    await pool.query(
      "UPDATE services SET status = $1 WHERE service_id = $2",
      [status, id]
    );

    res.json({ message: "Service request updated successfully" });
  } catch (err) {
    console.error("Error updating service request:", err);
    res.status(500).json({ error: err.message });
  }
};
