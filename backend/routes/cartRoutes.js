const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");

// Add item to cart
router.post("/", cartController.addToCart);

// Get user's cart
router.get("/", cartController.getCart);

// Remove item from cart
router.delete("/:cartId", cartController.removeFromCart);

// Update cart item quantity
router.put("/:cartId", cartController.updateCartItem);

module.exports = router;
