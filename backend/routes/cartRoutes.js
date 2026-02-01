const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const { authenticateToken } = require("../middleware/auth");

router.post("/add", authenticateToken, cartController.addToCart);
router.get("/", authenticateToken, cartController.getCart);
router.put("/update", authenticateToken, cartController.updateQuantity);
router.delete("/remove/:cartId", authenticateToken, cartController.removeItem);

module.exports = router;
