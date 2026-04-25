import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import cropRoutes from "./routes/cropRoutes.js";
import storageRoutes from "./routes/storageRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ✅ Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/farmvault";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => {
    console.log("❌ MongoDB connection error:", err.message);
    console.log("⚠️  Server will continue but database operations may fail.");
    console.log("💡 Make sure MongoDB is running or set MONGO_URI in .env file");
  });

// ✅ Health check
app.get("/", (_req, res) => {
  res.send("🌾 Aruvadai Aran FarmVault Backend is running successfully!");
});

// ✅ API health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ 
    status: "ok", 
    message: "Backend is running",
    timestamp: new Date().toISOString()
  });
});

// ✅ Feature routes
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/contacts", contactRoutes); // Alias for convenience
app.use("/api/crops", cropRoutes);
app.use("/api/storages", storageRoutes);

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
