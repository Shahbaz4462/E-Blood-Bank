const express = require("express");
const router = express.Router();
const { 
  createBloodRequest, 
  getBloodRequests, 
  updateRequestStatus,
  getMyRequests
} = require("../controllers/bloodRequestController");
const { protect } = require("../middlewares/authMiddleware");

router.use(protect);

router.post("/", createBloodRequest);
router.get("/", getBloodRequests);
router.get("/my", getMyRequests);
router.put("/:id/status", updateRequestStatus);

module.exports = router;
