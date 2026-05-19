const express = require("express");
const router = express.Router();
const { getLandingStats, submitContactForm } = require("../controllers/publicController");

router.get("/stats", getLandingStats);
router.post("/contact", submitContactForm);

module.exports = router;
