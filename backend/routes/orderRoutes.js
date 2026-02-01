const router = require("express").Router();
const orderController = require("../controllers/orderController");
const { authenticateToken, requireAdmin } = require("../middleware/auth");

router.post("/", authenticateToken, orderController.createOrder);
router.get("/", authenticateToken, requireAdmin, orderController.getAllOrders);
router.get("/user", authenticateToken, orderController.getUserOrders);
router.put("/:id", authenticateToken, requireAdmin, orderController.updateOrderStatus);
router.get("/:id/history", authenticateToken, orderController.getOrderStatusHistory);

module.exports = router;
