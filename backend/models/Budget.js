const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema({
  budgetUsed: { type: Number, default: 0 },
  budgetTotal: { type: Number, default: 100000 },
  photosUploaded: { type: Number, default: 0 },
  reportsPending: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model("Budget", budgetSchema);
