const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  club: { type: String, required: true },
  status: { type: String, enum: ["approved", "pending", "warning"], default: "pending" },
  rating: { type: String, default: "--" },
  date: { type: String, required: true },
  time: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Event", eventSchema);
