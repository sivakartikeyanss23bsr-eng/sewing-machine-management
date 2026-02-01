const router = require("express").Router();
const analyticsController = require("../controllers/analyticsController");
const { authenticateToken, requireAdmin } = require("../middleware/auth");

router.get("/dashboard", authenticateToken, requireAdmin, analyticsController.getDashboardAnalytics);
router.get("/profit", authenticateToken, requireAdmin, analyticsController.getProfitAnalysis);

module.exports = router;
