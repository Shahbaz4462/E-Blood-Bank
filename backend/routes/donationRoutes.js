const express = require("express");
const router = express.Router();
const {
  createDonation,
  getDonations,
  getDonationById,
  updateDonation,
  getDonationStats,
} = require("../controllers/donationController");
const { protect } = require("../middlewares/authMiddleware");

router.route("/").get(protect, getDonations).post(protect, createDonation);
router.route("/stats").get(protect, getDonationStats);
router
  .route("/:id")
  .get(protect, getDonationById)
  .put(protect, updateDonation);

module.exports = router;
