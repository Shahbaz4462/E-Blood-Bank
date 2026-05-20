const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "fallback_secret", {
    expiresIn: "30d",
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const {
      role, name, email, password, phone, city, address, 
      bloodGroup, gender, dateOfBirth, licenseNumber, website
    } = req.body;

    const trimmedEmail = email ? email.trim().toLowerCase() : "";

    // Validation checks
    if (!name || !trimmedEmail || !password || !phone || !address) {
      return res.status(400).json({ message: "Name, email, phone, address, and password are required fields." });
    }

    // Email validation (Basic format)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({ message: "Please provide a valid email address." });
    }

    // Pakistani Phone Number Validation (e.g., 03xxxxxxxxx or +923xxxxxxxxx)
    const phoneRegex = /^((\+92)?(0092)?(92)?(0)?)(3[0-9]{2})[0-9]{7}$/;
    if (!phoneRegex.test(phone.replace(/\s|-/g, ""))) {
      return res.status(400).json({ message: "Please provide a valid Pakistani phone number (e.g., 03001234567)." });
    }

    // Password Validation: min 8 chars, 1 capital, 1 number, 1 special char
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]:;"'<>,.?/\\|`~-]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ message: "Password must be at least 8 characters long, contain at least one capital letter, one number, and one special character." });
    }

    // Check if user exists
    const userExists = await User.findOne({ email: trimmedEmail });

    if (userExists) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    // Automatically parse city and generate dummy license number for organization if missing
    let extractedCity = city || "";
    if (!extractedCity && address) {
      const parts = address.split(",");
      extractedCity = parts.length > 1 ? parts[parts.length - 2].trim() : address.trim();
    }
    if (!extractedCity) extractedCity = "Not Specified";

    let finalLicense = licenseNumber;
    if (role === "organization" && !finalLicense) {
      finalLicense = "LIC-" + Math.floor(100000 + Math.random() * 900000);
    }

    // Create user
    const user = await User.create({
      role, name, email: trimmedEmail, password, phone, city: extractedCity, address,
      bloodGroup, gender, dateOfBirth, licenseNumber: finalLicense, website
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Check for user
    const user = await User.findOne({ email: trimmedEmail }).select("+password");

    if (!user) {
      console.log(`Login failed: User not found for email ${trimmedEmail}`);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.matchPassword(password);

    if (isMatch) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      console.log(`Login failed: Password mismatch for email ${trimmedEmail}`);
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const nodemailer = require("nodemailer");

// @desc    Send Email Helper
const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"E-Blood Bank" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  await transporter.sendMail(mailOptions);
};

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a simple 6-digit token
    const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    // Send Real Email
    const message = `You are receiving this email because you requested a password reset. Your 6-digit token is: ${resetToken}. It will expire in 10 minutes.`;
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #e11d48;">E-Blood Bank Password Reset</h2>
        <p>You requested a password reset. Please use the following 6-digit token to complete the process:</p>
        <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #e11d48; margin: 20px 0; text-align: center;">${resetToken}</div>
        <p>This token will expire in 10 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
      </div>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: "Password Reset Token - E-Blood Bank",
        message,
        html
      });

      res.json({ message: "Reset token sent to your email." });
    } catch (emailError) {
      console.error("Email send error:", emailError);
      // Fallback for demo: still return the token if email fails (optional, but requested real email)
      res.json({ 
        message: "Reset token generated, but failed to send email. Check console (simulated).", 
        debug_token: resetToken 
      });
    }

    console.log(`Password reset token for ${email}: ${resetToken}`);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;
    const user = await User.findOne({ 
      email,
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({ message: "Password reset successful" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.phone = req.body.phone || user.phone;
      user.city = req.body.city || user.city;
      user.address = req.body.address || user.address;
      user.gender = req.body.gender || user.gender;
      user.dateOfBirth = req.body.dateOfBirth || user.dateOfBirth;
      user.bloodGroup = req.body.bloodGroup || user.bloodGroup;
      user.isAvailable = req.body.isAvailable !== undefined ? req.body.isAvailable : user.isAvailable;
      user.licenseNumber = req.body.licenseNumber !== undefined ? req.body.licenseNumber : user.licenseNumber;
      user.website = req.body.website !== undefined ? req.body.website : user.website;

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        phone: updatedUser.phone,
        city: updatedUser.city,
        address: updatedUser.address,
        bloodGroup: updatedUser.bloodGroup,
        gender: updatedUser.gender,
        dateOfBirth: updatedUser.dateOfBirth,
        lastDonationDate: updatedUser.lastDonationDate,
        isAvailable: updatedUser.isAvailable,
        licenseNumber: updatedUser.licenseNumber,
        website: updatedUser.website,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Change Password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select("+password");

    if (user && (await user.matchPassword(currentPassword))) {
      user.password = newPassword;
      await user.save();
      res.json({ message: "Password changed successfully" });
    } else {
      res.status(401).json({ message: "Invalid current password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Delete Account
// @route   DELETE /api/auth/account
// @access  Private
const deleteAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      await User.deleteOne({ _id: req.user._id });
      res.json({ message: "Account deleted successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get all available donors
// @route   GET /api/auth/donors
// @access  Private (Authenticated users)
const getAvailableDonors = async (req, res) => {
  try {
    const { bloodGroup } = req.query;
    let query = { role: "donor", isAvailable: true };
    if (bloodGroup) query.bloodGroup = bloodGroup;

    const donors = await User.find(query).select("name email phone city address bloodGroup isAvailable lastDonationDate");
    res.json(donors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateProfile,
  changePassword,
  deleteAccount,
  forgotPassword,
  resetPassword,
  getAvailableDonors,
};
