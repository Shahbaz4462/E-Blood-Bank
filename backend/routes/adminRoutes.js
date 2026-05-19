const express = require("express");
const router = express.Router();
const { 
  getAllUsers, 
  updateUser, 
  deleteUser, 
  getPlatformStats,
  getAllTransactions,
  resetUserPassword
} = require("../controllers/adminController");
const { protect, authorize } = require("../middlewares/authMiddleware");

router.use(protect);
router.use(authorize("admin")); // ONLY admins can access these routes

router.get("/users", getAllUsers);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);
router.put("/users/:id/reset-password", resetUserPassword);
router.get("/stats", getPlatformStats);
router.get("/transactions", getAllTransactions);

module.exports = router;
