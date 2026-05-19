const express = require("express");
const router = express.Router();
const { 
  getInventory, 
  updateInventory, 
  getTransactions, 
  getStats 
} = require("../controllers/organizationController");
const { protect } = require("../middlewares/authMiddleware");

router.use(protect); // All organization routes are protected

router.get("/inventory", getInventory);
router.post("/inventory", updateInventory);
router.get("/transactions", getTransactions);
router.get("/stats", getStats);

module.exports = router;
