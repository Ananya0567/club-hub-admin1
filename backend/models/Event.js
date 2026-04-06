const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  club: { type: String, required: true },
  status: { type: String, enum: ["approved", "pending", "warning"], default: "pending" },
  rating: { type: String, default: "--" },
  date: { type: String, required: true },
  time: { type: String, required: true },
  description: { type: String, default: "" },
  budgetUsed: { type: Number, default: 0 },
  budgetProof: [{ type: String }],   // file paths for budget receipts
  photos: [{ type: String }],        // event photos uploaded by faculty
  documents: [{ type: String }],     // event documents/reports
}, { timestamps: true });

module.exports = mongoose.model("Event", eventSchema);
