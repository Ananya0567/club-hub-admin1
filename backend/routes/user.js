import express from "express";
import User from "../models/User.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    let allowedRoles = [];

    if (req.user.role === "admin") allowedRoles = ["faculty"];
    if (req.user.role === "faculty") allowedRoles = ["admin", "student"];
    if (req.user.role === "student") allowedRoles = ["faculty"];

    console.log("LOGGED USER:", req.user.name, req.user.role);
    console.log("ALLOWED ROLES:", allowedRoles);

    const users = await User.find({
      _id: { $ne: req.user._id },
      role: { $in: allowedRoles },
    })
      .select("_id name email role department")
      .sort({ role: 1, name: 1 });

    console.log("MESSAGE USERS FOUND:", users.length);

    res.json(users);
  } catch (err) {
    console.error("GET USERS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;