const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    donorName: {
      type: String,
      required: true,
    },
    donorRole: {
      type: String,
      required: true,
      enum: ["donor", "organization"],
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    recipientName: {
      type: String,
    },
    recipientRole: {
      type: String,
      enum: ["recipient", "organization"],
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
    donationDate: {
      type: Date,
      default: Date.now,
    },
    location: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["Scheduled", "Completed", "Cancelled"],
      default: "Completed",
    },
    notes: {
      type: String,
    },
    bloodRequestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BloodRequest",
    },
  },
  {
    timestamps: true,
  }
);

const Donation = mongoose.model("Donation", donationSchema);

module.exports = Donation;
