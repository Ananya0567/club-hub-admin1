const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
  text: { type: String, required: true },
  type: { type: String, enum: ["alert", "rating"], default: "alert" },
}, { timestamps: true });

module.exports = mongoose.model("Complaint", complaintSchema);
