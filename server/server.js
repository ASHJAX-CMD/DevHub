
require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// ⚠️ Handle JSON for regular API calls (but not file uploads)
app.use(express.json());

// ✅ Serve uploaded files statically (e.g., /uploads/filename.jpg)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", require("./routes/authRoutes")); // if needed
app.use("/api/posts", require("./routes/postRoutes")); // for createPost route

// Health check
app.get("/", (req, res) => {
  res.send("✅ API is running");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
