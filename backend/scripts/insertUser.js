import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// Function to insert a user
async function insertUser(name, email, password) {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log(`⚠️  User with email ${email} already exists!`);
      return;
    }

    // Create new user (password will be hashed automatically by the pre-save hook)
    const user = new User({
      name: name || "Admin",
      email: email.toLowerCase().trim(),
      password: password, // Will be hashed by the pre-save hook
    });

    await user.save();
    console.log("✅ User inserted successfully!");
    console.log("User details:", {
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error("❌ Error inserting user:", error.message);
  } finally {
    mongoose.connection.close();
    console.log("🔌 MongoDB connection closed");
  }
}

// Get command line arguments
const args = process.argv.slice(2);

if (args.length < 2) {
  console.log("Usage: node insertUser.js <email> <password> [name]");
  console.log("Example: node insertUser.js user@example.com password123 \"John Doe\"");
  process.exit(1);
}

const email = args[0];
const password = args[1];
const name = args[2] || "Admin";

insertUser(name, email, password);



