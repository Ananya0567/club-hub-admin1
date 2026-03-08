const express = require("express");
const Club = require("../models/Club");
const auth = require("../middleware/auth");
const router = express.Router();

// GET /api/clubs
router.get("/", auth, async (req, res) => {
  try {
    const clubs = await Club.find().sort({ name: 1 });
    res.json(clubs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/clubs
router.post("/", auth, async (req, res) => {
  try {
    const club = await Club.create(req.body);
    res.status(201).json(club);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/clubs/:id
router.put("/:id", auth, async (req, res) => {
  try {
    const club = await Club.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!club) return res.status(404).json({ message: "Club not found" });
    res.json(club);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/clubs/:id
router.delete("/:id", auth, async (req, res) => {
  try {
    await Club.findByIdAndDelete(req.params.id);
    res.json({ message: "Club deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
