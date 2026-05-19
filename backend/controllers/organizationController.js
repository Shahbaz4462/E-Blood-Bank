const User = require("../models/User");
const Transaction = require("../models/Transaction");

// @desc    Get organization inventory
// @route   GET /api/organization/inventory
// @access  Private (Organization)
const getInventory = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user.inventory);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Update organization inventory
// @route   POST /api/organization/inventory
// @access  Private (Organization)
const updateInventory = async (req, res) => {
  try {
    const { bloodGroup, quantity, type, personName, location, note } = req.body;
    const user = await User.findById(req.user._id);

    if (!user.inventory[bloodGroup] && user.inventory[bloodGroup] !== 0) {
      return res.status(400).json({ message: "Invalid blood group" });
    }

    // Update quantity
    if (type === "inventory_add" || type === "donation") {
      user.inventory[bloodGroup] += Number(quantity);
    } else if (type === "inventory_remove" || type === "request") {
      if (user.inventory[bloodGroup] < Number(quantity)) {
        return res.status(400).json({ message: "Insufficient stock" });
      }
      user.inventory[bloodGroup] -= Number(quantity);
    }

    await user.save();

    // Create transaction record
    const transaction = await Transaction.create({
      organizationId: req.user._id,
      type,
      bloodGroup,
      quantity,
      personName,
      location,
      note
    });

    res.json({ inventory: user.inventory, transaction });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get all transactions for organization
// @route   GET /api/organization/transactions
// @access  Private (Organization)
const getTransactions = async (req, res) => {
  try {
    const { startDate, endDate, type } = req.query;
    let query = { organizationId: req.user._id };

    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    if (type) {
      query.type = type;
    }

    const transactions = await Transaction.find(query).sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get organization stats (Daily, Weekly, Monthly)
// @route   GET /api/organization/stats
// @access  Private (Organization)
const getStats = async (req, res) => {
  try {
    const orgId = req.user._id;
    
    const startOfDay = new Date();
    startOfDay.setHours(0,0,0,0);

    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0,0,0,0);

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0,0,0,0);

    const stats = {
      daily: await Transaction.countDocuments({ organizationId: orgId, createdAt: { $gte: startOfDay } }),
      weekly: await Transaction.countDocuments({ organizationId: orgId, createdAt: { $gte: startOfWeek } }),
      monthly: await Transaction.countDocuments({ organizationId: orgId, createdAt: { $gte: startOfMonth } }),
      total: await Transaction.countDocuments({ organizationId: orgId })
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getInventory,
  updateInventory,
  getTransactions,
  getStats
};
