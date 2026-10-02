require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const assetRoutes = require("./routes/assetRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");

const app = express();

// Connect MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Authentication routes
app.use("/api/auth", authRoutes);

// Asset routes
app.use("/api/assets", assetRoutes);

// Asset Assignment routes
app.use("/api/assignments", assignmentRoutes);

// Test route
app.get("/", (req, res) => {
    res.json({
        message: "Company IT Asset Management API is running"
    });
});

// Port
const PORT = process.env.PORT || 5001;

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});