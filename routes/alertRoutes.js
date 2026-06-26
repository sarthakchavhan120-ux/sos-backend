import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";
import express from "express";
import Alert from "../models/Alert.js";


const router = express.Router();
// SEND SOS ALERT (POST)
router.post("/sos",authMiddleware, async (req, res) => {
  try {
    const alert = await Alert.create(req.body);
    const mapLink = `https://www.google.com/maps?q=${req.body.latitude},${req.body.longitude}`;

    res.json({
      success: true,
      message: "SOS Alert Sent",
      data: alert
    });
  } catch (err) {
    res.status(500).json(err);
  }
});


// 👇 ADD THIS HERE (NEW API)
router.get("/all",async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: alerts.length,
      data: alerts
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// UPDATE ALERT STATUS
router.put("/resolve/:id", async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { status: "Resolved" },
      { new: true }
    );

    res.json({
      success: true,
      message: "Alert Resolved",
      data: alert
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});
export default router;