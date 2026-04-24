import express from "express";
import Message from "../models/Message.js";
import User from "../models/User.js";
import auth from "../middleware/auth.js";
import { emitToUser } from "../socket.js";

const router = express.Router();

function canMessage(senderRole, receiverRole) {
  if (senderRole === "admin") {
    return receiverRole === "faculty";
  }

  if (senderRole === "faculty") {
    return receiverRole === "admin" || receiverRole === "student";
  }

  if (senderRole === "student") {
    return receiverRole === "faculty";
  }

  return false;
}

// SEND MESSAGE
router.post("/", auth, async (req, res) => {
  try {
    const { receiverId, text } = req.body;

    if (!receiverId || !text) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const receiver = await User.findById(receiverId).select("_id name role");

    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    if (!canMessage(req.user.role, receiver.role)) {
      return res.status(403).json({
        message: "You are not allowed to message this user",
      });
    }

    let message = await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      text,
    });

    message = await Message.findById(message._id)
      .populate("sender", "name email role")
      .populate("receiver", "name email role");

    emitToUser(receiverId, "new_message", message);

    emitToUser(receiverId, "new_message_notification", {
      _id: String(message._id),
      title: "New message",
      description: `New message from ${req.user.name}`,
      type: "info",
      read: false,
      createdAt: new Date().toISOString(),
    });

    res.status(201).json(message);
  } catch (err) {
    console.error("SEND MESSAGE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

// GET MESSAGES BETWEEN TWO USERS
router.get("/:userId", auth, async (req, res) => {
  try {
    const otherUser = await User.findById(req.params.userId).select("_id role");

    if (!otherUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!canMessage(req.user.role, otherUser.role)) {
      return res.status(403).json({
        message: "You are not allowed to view this chat",
      });
    }

    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.user._id },
      ],
    })
      .populate("sender", "name email role")
      .populate("receiver", "name email role")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.error("GET MESSAGE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;