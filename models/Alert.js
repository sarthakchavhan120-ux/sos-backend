import mongoose from "mongoose";

const alertSchema = new mongoose.Schema({
  name: String,
  phone: String,
  location: String,
  latitude: String,
  longitude: String,
  message: String,

  status: {
    type: String,
    default: "Pending"
  }

}, {
  timestamps: true
});

export default mongoose.model("Alert", alertSchema);