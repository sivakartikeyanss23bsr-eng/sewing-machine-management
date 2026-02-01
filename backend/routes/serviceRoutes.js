const router = require("express").Router();
const {
  createServiceRequest,
  getAllServiceRequests,
  updateServiceRequest,
  getUserServiceRequests
} = require("../controllers/serviceController");
const { authenticateToken } = require("../middleware/auth");

router.post("/", authenticateToken, createServiceRequest);
router.get("/", authenticateToken, getAllServiceRequests);
router.get("/user", authenticateToken, getUserServiceRequests);
router.put("/:id", authenticateToken, updateServiceRequest);

module.exports = router;
