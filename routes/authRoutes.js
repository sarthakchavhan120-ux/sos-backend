import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const user = await User.create({
    ...req.body,
    password: hashedPassword
  });

  res.json(user);
});

// LOGIN
router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) return res.json({ message: "User not found" });

  const isMatch = await bcrypt.compare(req.body.password, user.password);

  if (!isMatch) return res.json({ message: "Wrong password" });

  const token = jwt.sign({ id: user._id }, "secretkey");

  res.json({ token, user });
});

// ADD EMERGENCY CONTACT
router.post("/add-contact", authMiddleware, async (req, res) => {
  try {
    const { name, phone } = req.body;

    const user = await User.findById(req.user.id);

    user.emergencyContacts.push({
      name,
      phone
    });

    await user.save();

    res.json({
      success: true,
      message: "Emergency contact added",
      contacts: user.emergencyContacts
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// GET USER PROFILE
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    res.json({
      success: true,
      data: user
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});
export default router;