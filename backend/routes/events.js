import express from "express";
import Event from "../models/Event.js";
import Club from "../models/Club.js";
import EventRegistration from "../models/EventRegistration.js";
import auth from "../middleware/auth.js";
import permit from "../middleware/role.js";
import { upload } from "../middleware/upload.js";
import { generateQrCodeDataUrl } from "../utils/qr.js";
import { recalculateClubHealth } from "../services/healthService.js";
import { getIo } from "../socket.js";
import { fileToMeta } from "../utils/files.js";
import { createToken } from "../utils/auth.js";

const router = express.Router();

async function ensureEventAccess(user, event) {
  if (user.role === "admin") return true;

  if (user.role === "faculty") {
    return (user.assignedClubs || []).some(
      (clubId) => String(clubId) === String(event.clubId)
    );
  }

  return false;
}

// GET ALL EVENTS
router.get("/", auth, async (req, res) => {
  try {
    const query = {};

    if (req.user.role === "faculty") {
      query.clubId = { $in: req.user.assignedClubs || [] };
    }

    if (req.user.role === "student") {
      query.status = { $in: ["approved", "postponed"] };
    }

    if (req.query.status) query.status = req.query.status;
    if (req.query.clubId) query.clubId = req.query.clubId;
    if (req.query.search) {
      query.name = { $regex: req.query.search, $options: "i" };
    }

    const events = await Event.find(query)
      .populate("clubId", "name healthStatus")
      .populate("facultyId", "name email")
      .sort({ date: 1, time: 1 });

    return res.json(
      events.map((event) => ({
        ...event.toObject(),
        clubName: event.clubId?.name || "",
      }))
    );
  } catch (error) {
    console.error("GET EVENTS ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
});

// CREATE EVENT
router.post(
  "/",
  auth,
  permit("admin", "faculty"),
  upload.array("attachments", 10),
  async (req, res) => {
    try {
      console.log("BODY:", req.body);

      let { clubId } = req.body;

      if (req.user.role === "faculty") {
        clubId = req.user.assignedClubs?.[0];
      }

      if (!clubId) {
        return res.status(400).json({ message: "Club ID is required" });
      }

      const club = await Club.findById(clubId);
      if (!club) {
        return res.status(404).json({ message: "Club not found" });
      }

      const facultyIdToSave =
        req.user.role === "faculty"
          ? req.user._id
          : req.body.facultyId ||
            club.facultyId ||
            club.faculty ||
            club.facultyIds?.[0] ||
            null;

      console.log("FACULTY ID TO SAVE:", facultyIdToSave);

      const qrCodeToken = createToken();

      const event = await Event.create({
        name: req.body.name,
        description: req.body.description || "",
        clubId,
        facultyId: facultyIdToSave,
        date: req.body.date,
        time: req.body.time,
        endTime: req.body.endTime || "",
        location: req.body.location || "",
        maxCapacity: Number(req.body.maxCapacity || 100),
        planned: req.body.planned !== "false",
        budgetRequested: Number(req.body.budgetRequested || 0),
        budgetSpent: Number(req.body.budgetSpent || 0),
        status: req.user.role === "admin" ? "approved" : "pending",
        qrCodeToken,
        attachments: (req.files || []).map((file) =>
          fileToMeta(file, req.user._id, "faculty")
        ),
      });

      event.qrCodeDataUrl = await generateQrCodeDataUrl(
        JSON.stringify({
          eventId: String(event._id),
          token: qrCodeToken,
        })
      );

      await event.save();

      try {
        await recalculateClubHealth(clubId);
      } catch (healthError) {
        console.error("CLUB HEALTH UPDATE ERROR:", healthError.message);
      }

      try {
        const io = getIo();
        io.to("student").emit("event:created", event);
        io.to(`club:${clubId}`).emit("event:created", event);
      } catch (socketError) {
        console.error("SOCKET EMIT ERROR:", socketError.message);
      }

      return res.status(201).json(event);
    } catch (error) {
      console.error("CREATE EVENT ERROR:", error);
      return res.status(500).json({ message: error.message });
    }
  }
);

// UPDATE EVENT
router.put("/:id", auth, permit("admin", "faculty"), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event || !(await ensureEventAccess(req.user, event))) {
      return res.status(404).json({ message: "Event not found" });
    }

    const oldStatus = event.status;
    Object.assign(event, req.body);
    await event.save();

    if (oldStatus !== event.status) {
      const registrations = await EventRegistration.find({
        eventId: event._id,
        status: { $ne: "cancelled" },
      }).populate("studentId", "email name");

      console.log(
        "Event status updated. Registrations affected:",
        registrations.length
      );
    }

    await recalculateClubHealth(event.clubId);

    getIo().to(`club:${event.clubId}`).emit("event:updated", event);

    return res.json(event);
  } catch (error) {
    console.error("UPDATE EVENT ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
});

// DELETE EVENT
router.delete("/:id", auth, permit("admin", "faculty"), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    await event.deleteOne();

    return res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("DELETE EVENT ERROR:", err);
    return res.status(500).json({ message: "Delete failed" });
  }
});

export default router;