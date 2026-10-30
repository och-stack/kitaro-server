
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const healthRoutes = require("./routes/health");
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const postcodeRoutes = require("./routes/postcode");
const wasteRecordRoutes = require("./routes/wasteRecords");
const adminWasteRecordRoutes = require("./routes/adminWasteRecords");
const analyticsRoutes = require("./routes/analytics");

const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
  })
);

// Health-check endpoints
app.use("/api/health", healthRoutes);

// Authentication endpoints
app.use("/api/auth", authRoutes);

// Profile endpoints
app.use("/api/profile", profileRoutes);

// Postcode and area lookup
app.use("/api/postcode", postcodeRoutes);

// Waste-record endpoints
app.use("/api/waste-records", wasteRecordRoutes);

// Admin waste-record endpoints
app.use("/api/admin/waste-records", adminWasteRecordRoutes);

// SQL analytics endpoints
app.use("/api/analytics", analyticsRoutes);

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Central error handler
app.use(errorHandler);

// Export app for Vercel
module.exports = app;

// Start server locally
if (require.main === module) {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`KITARO server running on port ${PORT}`);
  });
}
