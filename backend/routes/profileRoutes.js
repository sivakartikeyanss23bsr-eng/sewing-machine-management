const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");
const jwt = require("jsonwebtoken");

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Access denied" });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || "secret");
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token" });
  }
};

router.get("/", authenticateToken, profileController.getProfile);
router.put("/", authenticateToken, profileController.updateProfile);

module.exports = router;
