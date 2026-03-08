const express = require("express");
const Club = require("../models/Club");
const Event = require("../models/Event");
const Complaint = require("../models/Complaint");
const Budget = require("../models/Budget");
const auth = require("../middleware/auth");
const router = express.Router();

// GET /api/dashboard/metrics
router.get("/metrics", auth, async (req, res) => {
  try {
    const totalClubs = await Club.countDocuments();
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const eventsThisMonth = await Event.countDocuments({
      date: { $gte: startOfMonth.toISOString().split("T")[0] },
    });
    const pendingApprovals = await Event.countDocuments({ status: "pending" });
    const clubs = await Club.find();
    const avgRating = clubs.length
      ? parseFloat((clubs.reduce((sum, c) => sum + c.rating, 0) / clubs.length).toFixed(1))
      : 0;

    res.json({ totalClubs, eventsThisMonth, pendingApprovals, avgRating });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/dashboard/quick-stats
router.get("/quick-stats", auth, async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const upcomingEvents = await Event.countDocuments({ date: { $gte: today } });
    const budget = await Budget.findOne();
    const reportsPending = budget?.reportsPending || 0;

    // Sum all club members as total participants
    const clubs = await Club.find();
    const totalParticipants = clubs.reduce((sum, c) => sum + c.membersCount, 0);

    res.json({ upcomingEvents, reportsPending, totalParticipants });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/dashboard/budget
router.get("/budget", auth, async (req, res) => {
  try {
    let budget = await Budget.findOne();
    if (!budget) {
      budget = await Budget.create({ budgetUsed: 85000, budgetTotal: 100000, photosUploaded: 320, reportsPending: 3 });
    }
    res.json(budget);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/dashboard/monthly-events
router.get("/monthly-events", auth, async (req, res) => {
  try {
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const year = new Date().getFullYear();
    const result = [];

    for (let m = 0; m < 12; m++) {
      const start = `${year}-${String(m + 1).padStart(2, "0")}-01`;
      const end = `${year}-${String(m + 2).padStart(2, "0")}-01`;

      const all = await Event.countDocuments({ date: { $gte: start, $lt: end } });
      const pending = await Event.countDocuments({ date: { $gte: start, $lt: end }, status: "pending" });
      const confirmed = await Event.countDocuments({ date: { $gte: start, $lt: end }, status: "approved" });

      if (all > 0) {
        result.push({ month: months[m], all, pending, confirmed });
      }
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/dashboard/calendar/:date
router.get("/calendar/:date", auth, async (req, res) => {
  try {
    const { date } = req.params;
    const events = await Event.find({ date }).sort({ time: 1 });

    res.json({
      date,
      events: events.map((e) => ({
        time: e.time,
        title: e.name,
        club: e.club,
        status: e.status,
      })),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
