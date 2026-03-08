const express = require("express");
const Complaint = require("../models/Complaint");
const auth = require("../middleware/auth");
const router = express.Router();

// GET /api/complaints
router.get("/", auth, async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/complaints
router.post("/", auth, async (req, res) => {
  try {
    const complaint = await Complaint.create(req.body);
    res.status(201).json(complaint);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
