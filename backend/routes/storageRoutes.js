import express from "express";
import Storage from "../models/Storage.js";

const router = express.Router();

// ✅ GET all storages
router.get("/", async (req, res) => {
  try {
    const storages = await Storage.find();
    res.json(storages);
  } catch (err) {
    res.status(500).json({ message: "Error fetching storages" });
  }
});

// ✅ POST new storage (user input)
router.post("/", async (req, res) => {
  try {
    const { place, capacity, available_space, contact } = req.body;
    const newStorage = new Storage({ place, capacity, available_space, contact });
    await newStorage.save();
    res.status(201).json(newStorage);
  } catch (err) {
    res.status(500).json({ message: "Error adding storage", error: err.message });
  }
});

export default router;
