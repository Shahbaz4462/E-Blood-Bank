const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getUserProfile, updateProfile, changePassword, deleteAccount, forgotPassword, resetPassword, getAvailableDonors } = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/profile", protect, getUserProfile);
router.get("/donors", protect, getAvailableDonors);
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);
router.delete("/account", protect, deleteAccount);

module.exports = router;
