const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
      enum: ["admin", "donor", "recipient", "organization"],
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false, // Don't return password by default
    },
    phone: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    // Donor / Recipient specific fields
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      required: function () {
        return this.role === "donor" || this.role === "recipient";
      },
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    dateOfBirth: {
      type: Date,
    },
    // Donor specific
    isAvailable: {
      type: Boolean,
      default: true,
    },
    lastDonationDate: {
      type: Date,
    },
    // Organization specific
    licenseNumber: {
      type: String,
      required: function () {
        return this.role === "organization";
      },
    },
    website: {
      type: String,
    },
    inventory: {
      "A+": { type: Number, default: 0 },
      "A-": { type: Number, default: 0 },
      "B+": { type: Number, default: 0 },
      "B-": { type: Number, default: 0 },
      "AB+": { type: Number, default: 0 },
      "AB-": { type: Number, default: 0 },
      "O+": { type: Number, default: 0 },
      "O-": { type: Number, default: 0 },
    },
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
    province: {
      type: String,
    },
    country: {
      type: String,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to check password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
