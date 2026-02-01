const router = require("express").Router();
const adminUserController = require("../controllers/adminUserController");
const { authenticateToken, requireAdmin } = require("../middleware/auth");

router.get("/", authenticateToken, requireAdmin, adminUserController.getAllUsers);
router.post("/", authenticateToken, requireAdmin, adminUserController.addUser);
router.put("/:id", authenticateToken, requireAdmin, adminUserController.updateUser);
router.delete("/:id", authenticateToken, requireAdmin, adminUserController.deleteUser);
router.post("/:id/reset-password", authenticateToken, requireAdmin, adminUserController.resetPassword);

module.exports = router;
