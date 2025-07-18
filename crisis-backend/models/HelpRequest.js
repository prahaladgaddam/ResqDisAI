// crisis-backend/models/HelpRequest.js
const mongoose = require('mongoose');

const HelpRequestSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  phoneNumber: {
    type: String,
    required: false,
  },
  source: {
    type: String,
    enum: ["app", "sms", "twitter", "call"],
    default: "app",
  },
  status: {
    type: String,
    enum: ["pending", "rescued", "dispatched", "closed"],
    default: "pending",
  },
  urgency: {
    type: String,
    enum: ["critical", "urgent", "request", "low"],
    default: "request",
  },
  requestTypes: {
    type: [String],
    default: []
  },
  notes: {
    type: String,
    required: false
  },
  reporterName: {
    type: String,
    required: false
  },
  numPeople: {
    type: Number,
    default: 1
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('HelpRequest', HelpRequestSchema);