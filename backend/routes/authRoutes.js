import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "aruvadai-dev-secret";

function createToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "12h" });
}

// Register a new user (optional – useful for first-time setup)
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists with this email" });
    }

    const user = new User({ name, email, password });
    await user.save();

    const token = createToken(user._id);
    res.status(201).json({
      message: "User registered successfully",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error: error.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Normalize email (lowercase, trim)
    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      console.log(`❌ Login attempt failed: User not found - ${normalizedEmail}`);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.verifyPassword(password);
    if (!isMatch) {
      console.log(`❌ Login attempt failed: Invalid password for ${normalizedEmail}`);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = createToken(user._id);
    console.log(`✅ Login successful: ${user.name} (${user.email})`);
    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
});

export default router;


