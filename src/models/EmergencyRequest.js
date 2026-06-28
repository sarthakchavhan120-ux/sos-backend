const mongoose = require('mongoose')

const emergencyRequestSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  patientName: { type: String, required: true },
  patientPhone: { type: String, required: true },
  serviceType: { type: String, enum: ['ambulance', 'police', 'fire', 'disaster', 'women', 'child', 'senior', 'national'], required: true },
  department: { type: String, enum: ['ambulance', 'police', 'fire', 'disaster'], required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  googleMapsLink: { type: String },
  address: { type: String },
  status: { type: String, enum: ['waiting', 'accepted', 'ontheway', 'completed', 'rejected'], default: 'waiting' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  assignedAt: { type: Date },
  completedAt: { type: Date },
}, { timestamps: true })

module.exports = mongoose.model('EmergencyRequest', emergencyRequestSchema)