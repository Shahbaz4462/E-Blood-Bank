require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;
let MONGODB_URI = process.env.MONGODB_URI;

// Function to connect to MongoDB with Retries
const connectDB = async (retries = 5) => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ MongoDB connected successfully to Atlas/Local");
  } catch (err) {
    console.error(`❌ Connection failed (${retries} retries left):`, err.message);
    
    if (retries > 0) {
      console.log("Retrying in 5 seconds...");
      setTimeout(() => connectDB(retries - 1), 5000);
    } else {
      console.log("--------------------------------------------------");
      console.log("FATAL ERROR: Could not connect to the database.");
      console.log("1. Check your .env file MONGODB_URI");
      console.log("2. Ensure your IP (175.107.223.6) is whitelisted in Atlas");
      console.log("3. Check your internet connection");
      console.log("--------------------------------------------------");
      process.exit(1);
    }
  }
};

connectDB();

app.get("/", (req, res) => {
  res.send("E-Blood Bank API is running...");
});

// Routes
const authRoutes = require("./routes/authRoutes");
const organizationRoutes = require("./routes/organizationRoutes");
const adminRoutes = require("./routes/adminRoutes");
const bloodRequestRoutes = require("./routes/bloodRequestRoutes");
const donationRoutes = require("./routes/donationRoutes");
const publicRoutes = require("./routes/publicRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/organization", organizationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/blood-requests", bloodRequestRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/public", publicRoutes);

// Socket.io for chat
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
// Restart trigger 2
