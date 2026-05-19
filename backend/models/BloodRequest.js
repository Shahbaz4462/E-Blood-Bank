const mongoose = require("mongoose");

const bloodRequestSchema = new mongoose.Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    requesterName: {
      type: String,
      required: true,
    },
    requesterRole: {
      type: String,
      required: true,
      enum: ["recipient", "organization"],
    },
    type: {
      type: String,
      required: true,
      enum: ["request", "donation_offer"], // donation_offer is when an org offers blood
      default: "request",
    },
    bloodGroup: {
      type: String,
      required: true,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    units: {
      type: Number,
      required: true,
      default: 1,
    },
    urgency: {
      type: String,
      required: true,
      enum: ["Normal", "Urgent", "Emergency"],
      default: "Normal",
    },
    location: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    message: {
      type: String,
    },
    status: {
      type: String,
      required: true,
      enum: ["Pending", "Accepted", "Blood Given", "Blood Taken", "Completed", "Cancelled"],
      default: "Pending",
    },
    acceptedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    acceptedByRole: {
      type: String,
    },
    donorConfirmed: {
      type: Boolean,
      default: false,
    },
    recipientConfirmed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const BloodRequest = mongoose.model("BloodRequest", bloodRequestSchema);

module.exports = BloodRequest;
