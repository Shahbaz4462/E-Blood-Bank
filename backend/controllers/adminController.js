const User = require("../models/User");
const Transaction = require("../models/Transaction");
const BloodRequest = require("../models/BloodRequest");

// @desc    Get all users (Donors, Recipients, Organizations)
// @route   GET /api/admin/users
// @access  Private (Admin)
const getAllUsers = async (req, res) => {
  try {
    const { role } = req.query;
    let query = {};
    if (role) query.role = role;

    const users = await User.find(query).sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Update any user profile
// @route   PUT /api/admin/users/:id
// @access  Private (Admin)
const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.phone = req.body.phone || user.phone;
      user.city = req.body.city || user.city;
      user.address = req.body.address || user.address;
      user.bloodGroup = req.body.bloodGroup || user.bloodGroup;
      user.isVerified = req.body.isVerified !== undefined ? req.body.isVerified : user.isVerified;

      const updatedUser = await user.save();
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Delete any user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      await User.deleteOne({ _id: req.params.id });
      res.json({ message: "User removed successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Admin Reset User Password
// @route   PUT /api/admin/users/:id/reset-password
// @access  Private (Admin)
const resetUserPassword = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }
    
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]:;"'<>,.?/\\|`~-]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({ message: "Password must be at least 8 characters long, contain at least one capital letter, one number, and one special character." });
    }

    user.password = newPassword;
    await user.save();
    res.json({ message: "User password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get overall platform stats
// @route   GET /api/admin/stats
// @access  Private (Admin)
const getPlatformStats = async (req, res) => {
  try {
    const stats = {
      totalDonors: await User.countDocuments({ role: "donor" }),
      totalRecipients: await User.countDocuments({ role: "recipient" }),
      totalOrganizations: await User.countDocuments({ role: "organization" }),
      totalTransactions: await Transaction.countDocuments(),
      totalDonations: await BloodRequest.countDocuments({ status: "Completed" }),
      recentUsers: await User.find().sort({ createdAt: -1 }).limit(5)
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get all platform transactions
// @route   GET /api/admin/transactions
// @access  Private (Admin)
const getAllTransactions = async (req, res) => {
  try {
    const { bloodGroup, type } = req.query;
    let query = {};
    if (bloodGroup) query.bloodGroup = bloodGroup;
    if (type) query.type = type;

    const transactions = await Transaction.find(query)
      .populate("organizationId", "name email")
      .sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getAllUsers,
  updateUser,
  deleteUser,
  getPlatformStats,
  getAllTransactions,
  resetUserPassword
};
