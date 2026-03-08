const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  targetType: { type: String, enum: ["club", "event"], required: true },
  targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, default: "" },
}, { timestamps: true });

feedbackSchema.index({ student: 1, targetType: 1, targetId: 1 }, { unique: true });

module.exports = mongoose.model("Feedback", feedbackSchema);
