const Donation = require("../models/Donation");
const User = require("../models/User");
const BloodRequest = require("../models/BloodRequest");

// @desc    Create donation record
// @route   POST /api/donations
// @access  Private
const createDonation = async (req, res) => {
  try {
    const {
      donor,
      donorName,
      donorRole,
      recipient,
      recipientName,
      recipientRole,
      bloodGroup,
      units,
      location,
      city,
      status,
      notes,
      bloodRequestId,
    } = req.body;

    const donation = await Donation.create({
      donor,
      donorName,
      donorRole,
      recipient,
      recipientName,
      recipientRole,
      bloodGroup,
      units,
      location,
      city,
      status,
      notes,
      bloodRequestId,
    });

    res.status(201).json(donation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get all donations (with filtering)
// @route   GET /api/donations
// @access  Private
const getDonations = async (req, res) => {
  try {
    const { donor, recipient, bloodGroup, status, city, search, page, limit } = req.query;
    let query = {};

    if (donor) query.donor = donor;
    if (recipient) query.recipient = recipient;
    if (bloodGroup) query.bloodGroup = bloodGroup;
    if (status) query.status = status;
    if (city) query.city = city;

    // Search filter
    if (search) {
      const searchRegex = new RegExp(search, "i");
      query.$or = [
        { donorName: searchRegex },
        { recipientName: searchRegex },
        { location: searchRegex },
        { city: searchRegex },
      ];
    }

    // Role-based filtering
    if (req.user.role === "donor" && !req.query.all) {
      query.donor = req.user._id;
    } else if (req.user.role === "recipient" && !req.query.all) {
      query.recipient = req.user._id;
    } else if (req.user.role === "organization" && !req.query.all) {
      query.$or = [{ donor: req.user._id }, { recipient: req.user._id }];
    }

    // Pagination
    if (page) {
      const pageNum = parseInt(page) || 1;
      const limitNum = parseInt(limit) || 10;
      const skipNum = (pageNum - 1) * limitNum;

      const total = await Donation.countDocuments(query);
      const donations = await Donation.find(query)
        .populate("donor", "name email phone city")
        .populate("recipient", "name email phone city")
        .populate("bloodRequestId", "status urgency")
        .sort({ donationDate: -1 })
        .skip(skipNum)
        .limit(limitNum);

      return res.json({
        donations,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        total,
      });
    } else {
      const donations = await Donation.find(query)
        .populate("donor", "name email phone city")
        .populate("recipient", "name email phone city")
        .populate("bloodRequestId", "status urgency")
        .sort({ donationDate: -1 });
      return res.json(donations);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get donation by ID
// @route   GET /api/donations/:id
// @access  Private
const getDonationById = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id)
      .populate("donor", "name email phone city address")
      .populate("recipient", "name email phone city address")
      .populate("bloodRequestId");

    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    res.json(donation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Update donation
// @route   PUT /api/donations/:id
// @access  Private
const updateDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    // Only donor, recipient, or admin can update
    if (
      donation.donor.toString() !== req.user._id.toString() &&
      donation.recipient?.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(401).json({ message: "Not authorized" });
    }

    donation.status = req.body.status || donation.status;
    donation.notes = req.body.notes || donation.notes;
    donation.units = req.body.units || donation.units;

    const updatedDonation = await donation.save();
    res.json(updatedDonation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get donation statistics
// @route   GET /api/donations/stats
// @access  Private
const getDonationStats = async (req, res) => {
  try {
    const stats = {
      totalDonations: await Donation.countDocuments({ status: "Completed" }),
      myDonations: await Donation.countDocuments({ donor: req.user._id, status: "Completed" }),
      totalUnits: await Donation.aggregate([
        { $match: { status: "Completed" } },
        { $group: { _id: null, total: { $sum: "$units" } } },
      ]),
      byBloodGroup: await Donation.aggregate([
        { $match: { status: "Completed" } },
        { $group: { _id: "$bloodGroup", count: { $sum: 1 }, units: { $sum: "$units" } } },
      ]),
      recentDonations: await Donation.find({ status: "Completed" })
        .populate("donor", "name bloodGroup")
        .sort({ donationDate: -1 })
        .limit(10),
    };

    res.json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  createDonation,
  getDonations,
  getDonationById,
  updateDonation,
  getDonationStats,
};
