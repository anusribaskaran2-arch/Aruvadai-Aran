import express from "express";
import Crop from "../models/cropModel.js";

const router = express.Router();

// ✅ GET all crops
router.get("/", async (_req, res) => {
  try {
    const crops = await Crop.find().sort({ createdAt: -1 });
    res.json(crops);
  } catch (error) {
    res.status(500).json({ message: "Error fetching crops" });
  }
});

// ✅ POST new crop
router.post("/", async (req, res) => {
  try {
    const { name, quantity, village } = req.body;

    if (!name || quantity === undefined || !village) {
      return res.status(400).json({ message: "Missing required crop fields" });
    }

    const newCrop = new Crop({ name, quantity, village });
    const savedCrop = await newCrop.save();
    res.status(201).json({
      message: "Crop added successfully",
      crop: savedCrop,
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding crop", error: error.message });
  }
});

export default router;
