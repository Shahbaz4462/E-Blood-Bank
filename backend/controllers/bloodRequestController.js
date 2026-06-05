const BloodRequest = require("../models/BloodRequest");
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const Donation = require("../models/Donation");

// Helper to update organization inventory and log transaction when blood request completes
const updateInventoryOnRequestCompletion = async (request) => {
  try {
    const quantity = Number(request.units);
    const bloodGroup = request.bloodGroup;
    
    if (request.type === "request") {
      // Requester (Receiver) receives blood. Acceptor (Provider) gives blood.
      
      // Requester is Organization
      if (request.requesterRole === "organization") {
        const org = await User.findById(request.requester);
        if (org) {
          if (!org.inventory) org.inventory = {};
          org.inventory[bloodGroup] = (org.inventory[bloodGroup] || 0) + quantity;
          await org.save();
          
          // Log transaction
          await Transaction.create({
            organizationId: org._id,
            type: "request", // matching "request" received
            bloodGroup,
            quantity,
            personName: request.acceptedBy ? (await User.findById(request.acceptedBy))?.name || "Donor" : "Donor",
            location: request.location,
            status: "Completed",
            note: `Received ${quantity} units of ${bloodGroup} from request`
          });
        }
      }
      
      // Acceptor is Organization
      if (request.acceptedByRole === "organization") {
        const org = await User.findById(request.acceptedBy);
        if (org) {
          if (!org.inventory) org.inventory = {};
          org.inventory[bloodGroup] = Math.max(0, (org.inventory[bloodGroup] || 0) - quantity);
          await org.save();
          
          // Log transaction
          await Transaction.create({
            organizationId: org._id,
            type: "inventory_remove", // matching "request" provided
            bloodGroup,
            quantity,
            personName: request.requesterName,
            location: request.location,
            status: "Completed",
            note: `Distributed ${quantity} units of ${bloodGroup} for request`
          });
        }
      }
    } else if (request.type === "donation_offer") {
      // Requester (Provider) gives blood. Acceptor (Receiver) receives blood.
      
      // Requester is Organization
      if (request.requesterRole === "organization") {
        const org = await User.findById(request.requester);
        if (org) {
          if (!org.inventory) org.inventory = {};
          org.inventory[bloodGroup] = Math.max(0, (org.inventory[bloodGroup] || 0) - quantity);
          await org.save();
          
          // Log transaction
          await Transaction.create({
            organizationId: org._id,
            type: "donation", // matching donation distribution
            bloodGroup,
            quantity,
            personName: request.acceptedBy ? (await User.findById(request.acceptedBy))?.name || "Recipient" : "Recipient",
            location: request.location,
            status: "Completed",
            note: `Distributed ${quantity} units of ${bloodGroup} via donation offer`
          });
        }
      }
      
      // Acceptor is Organization
      if (request.acceptedByRole === "organization") {
        const org = await User.findById(request.acceptedBy);
        if (org) {
          if (!org.inventory) org.inventory = {};
          org.inventory[bloodGroup] = (org.inventory[bloodGroup] || 0) + quantity;
          await org.save();
          
          // Log transaction
          await Transaction.create({
            organizationId: org._id,
            type: "request", // matching donation received
            bloodGroup,
            quantity,
            personName: request.requesterName,
            location: request.location,
            status: "Completed",
            note: `Received ${quantity} units of ${bloodGroup} from donation offer`
          });
        }
      }
    }
  } catch (error) {
    console.error("Error in updateInventoryOnRequestCompletion helper:", error);
  }
};


// @desc    Create new blood request
// @route   POST /api/blood-requests
// @access  Private (Recipient/Organization)
const createBloodRequest = async (req, res) => {
  try {
    const { bloodGroup, units, urgency, location, message, phone, type } = req.body;

    const bloodRequest = await BloodRequest.create({
      requester: req.user._id,
      requesterName: req.user.name,
      requesterRole: req.user.role,
      type: type || "request",
      bloodGroup,
      units,
      urgency,
      location,
      city: req.user.city,
      phone: phone || req.user.phone,
      message,
    });

    res.status(201).json(bloodRequest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get all blood requests (with filtering)
// @route   GET /api/blood-requests
// @access  Private
const getBloodRequests = async (req, res) => {
  try {
    const { role, status, bloodGroup, history, search, page, limit } = req.query;
    let query = {};

    if (status) query.status = status;
    if (bloodGroup) query.bloodGroup = bloodGroup;

    // Search filter
    if (search) {
      const searchRegex = new RegExp(search, "i");
      query.$or = [
        { requesterName: searchRegex },
        { location: searchRegex },
        { city: searchRegex }
      ];
    }

    // Logic based on role:
    if (req.user.role === "recipient" && !req.query.all) {
      query.requester = req.user._id;
    } else if (req.user.role === "donor" && !req.query.all) {
      if (history === "true") {
        query.acceptedBy = req.user._id;
        query.status = "Completed";
      } else {
        if (!status) {
          query.$or = [
            { status: "Pending" },
            { acceptedBy: req.user._id }
          ];
        } else {
          query.acceptedBy = req.user._id;
        }
      }
    } else if (req.user.role !== "admin" && !req.query.all) {
      // Organizations see Pending requests, requests they've accepted, OR requests they've posted
      if (!status) {
        query.$or = [
          { status: "Pending" },
          { acceptedBy: req.user._id },
          { requester: req.user._id }
        ];
      }
    }

    // Pagination (conditional, only if page parameter is passed)
    if (page) {
      const pageNum = parseInt(page) || 1;
      const limitNum = parseInt(limit) || 10;
      const skipNum = (pageNum - 1) * limitNum;

      const total = await BloodRequest.countDocuments(query);
      const requests = await BloodRequest.find(query)
        .populate('requester', 'name phone email')
        .populate('acceptedBy', 'name phone email')
        .sort({ createdAt: -1 })
        .skip(skipNum)
        .limit(limitNum);

      return res.json({
        requests,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        total
      });
    } else {
      const requests = await BloodRequest.find(query)
        .populate('requester', 'name phone email')
        .populate('acceptedBy', 'name phone email')
        .sort({ createdAt: -1 });
      return res.json(requests);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Update blood request status
// @route   PUT /api/blood-requests/:id/status
// @access  Private
const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const request = await BloodRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Cancel logic
    if (status === "Cancelled") {
      // Only requester or admin can cancel
      if (request.requester.toString() !== req.user._id.toString() && req.user.role !== "admin") {
        return res.status(401).json({ message: "Not authorized to cancel this request" });
      }
      request.status = "Cancelled";
      await request.save();
      const updatedRequest = await BloodRequest.findById(req.params.id)
        .populate('requester', 'name phone email')
        .populate('acceptedBy', 'name phone email');
      return res.json(updatedRequest);
    }

    // Accept logic
    if (status === "Accepted" || status === "Approved") {
      // A pending request gets accepted by donor or organization
      if (request.status !== "Pending") {
        return res.status(400).json({ message: "Request is not pending" });
      }
      request.status = "Accepted";
      request.acceptedBy = req.user._id;
      request.acceptedByRole = req.user.role;
      request.donorConfirmed = false;
      request.recipientConfirmed = false;
      await request.save();
      const updatedRequest = await BloodRequest.findById(req.params.id)
        .populate('requester', 'name phone email')
        .populate('acceptedBy', 'name phone email');
      return res.json(updatedRequest);
    }

    // Blood Given logic (clicked by the acceptor - donor or organization)
    if (status === "Blood Given") {
      if (request.acceptedBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
        return res.status(401).json({ message: "Only the accepted donor/organization can mark blood as given" });
      }
      request.donorConfirmed = true;
      if (request.recipientConfirmed) {
        request.status = "Completed";
        if (request.acceptedByRole === "donor") {
          await User.findByIdAndUpdate(request.acceptedBy, { lastDonationDate: new Date() });
        }
        await updateInventoryOnRequestCompletion(request);
        
        // Create donation record
        try {
          await Donation.create({
            donor: request.acceptedBy,
            donorName: (await User.findById(request.acceptedBy))?.name || "Unknown",
            donorRole: request.acceptedByRole,
            recipient: request.requester,
            recipientName: request.requesterName,
            recipientRole: request.requesterRole,
            bloodGroup: request.bloodGroup,
            units: request.units,
            location: request.location,
            city: request.city,
            status: "Completed",
            bloodRequestId: request._id,
          });
        } catch (donationError) {
          console.error("Error creating donation record:", donationError);
        }
      } else {
        request.status = "Blood Given";
      }
      await request.save();
      const updatedRequest = await BloodRequest.findById(req.params.id)
        .populate('requester', 'name phone email')
        .populate('acceptedBy', 'name phone email');
      return res.json(updatedRequest);
    }

    // Blood Taken logic (clicked by the requester - recipient or organization)
    if (status === "Blood Taken") {
      if (request.requester.toString() !== req.user._id.toString() && req.user.role !== "admin") {
        return res.status(401).json({ message: "Only the requester can mark blood as taken" });
      }
      request.recipientConfirmed = true;
      if (request.donorConfirmed) {
        request.status = "Completed";
        if (request.acceptedByRole === "donor") {
          await User.findByIdAndUpdate(request.acceptedBy, { lastDonationDate: new Date() });
        }
        await updateInventoryOnRequestCompletion(request);
        
        // Create donation record
        try {
          await Donation.create({
            donor: request.acceptedBy,
            donorName: (await User.findById(request.acceptedBy))?.name || "Unknown",
            donorRole: request.acceptedByRole,
            recipient: request.requester,
            recipientName: request.requesterName,
            recipientRole: request.requesterRole,
            bloodGroup: request.bloodGroup,
            units: request.units,
            location: request.location,
            city: request.city,
            status: "Completed",
            bloodRequestId: request._id,
          });
        } catch (donationError) {
          console.error("Error creating donation record:", donationError);
        }
      } else {
        request.status = "Blood Taken";
      }
      await request.save();
      const updatedRequest = await BloodRequest.findById(req.params.id)
        .populate('requester', 'name phone email')
        .populate('acceptedBy', 'name phone email');
      return res.json(updatedRequest);
    }

    res.status(400).json({ message: "Invalid status transition" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get requests specifically for the logged in user
// @route   GET /api/blood-requests/my
// @access  Private
const getMyRequests = async (req, res) => {
  try {
    const requests = await BloodRequest.find({ requester: req.user._id })
      .populate('acceptedBy', 'name phone email')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  createBloodRequest,
  getBloodRequests,
  updateRequestStatus,
  getMyRequests,
};
