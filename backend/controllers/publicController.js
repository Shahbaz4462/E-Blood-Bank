const User = require("../models/User");
const BloodRequest = require("../models/BloodRequest");

const getLandingStats = async (req, res) => {
  try {
    const donorsCount = await User.countDocuments({ role: "donor" });
    const hospitalsCount = await User.countDocuments({ role: "organization" });
    const requestsCount = await BloodRequest.countDocuments();
    
    const fulfilledRequests = await BloodRequest.find({ status: "Fulfilled" });
    // 1 unit of blood can save up to 3 lives
    const livesSaved = fulfilledRequests.reduce((sum, req) => sum + req.units, 0) * 3;

    res.json({
      donors: donorsCount,
      livesSaved: livesSaved || 0,
      hospitals: hospitalsCount,
      requests: requestsCount
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const submitContactForm = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: "Name, email, and message are required." });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Please provide a valid email address." });
    }
    
    console.log(`Contact Form Submission: ${name} (${email}) - ${subject} - ${message}`);
    res.status(200).json({ message: "Your message has been sent successfully. We will get back to you soon!" });
  } catch (error) {
    console.error("Contact Form Error:", error);
    res.status(500).json({ message: "An error occurred while submitting your message." });
  }
};

module.exports = { getLandingStats, submitContactForm };
