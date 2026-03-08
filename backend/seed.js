const mongoose = require("mongoose");
const Club = require("./models/Club");
const Event = require("./models/Event");
const Complaint = require("./models/Complaint");
const Budget = require("./models/Budget");
const User = require("./models/User");
require("dotenv").config();

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected. Seeding...");

  // Clear existing data
  await Promise.all([Club.deleteMany(), Event.deleteMany(), Complaint.deleteMany(), Budget.deleteMany()]);

  // Seed admin user
  const existing = await User.findOne({ email: "admin@college.edu" });
  if (!existing) {
    await User.create({ name: "Admin", email: "admin@college.edu", password: "admin123", role: "admin" });
    console.log("Admin user created: admin@college.edu / admin123");
  }

  // Seed clubs
  await Club.insertMany([
    { name: "Coding Club", status: "healthy", membersCount: 180, rating: 4.5 },
    { name: "Robotics Club", status: "critical", membersCount: 120, rating: 3.2 },
    { name: "Dance Club", status: "warning", membersCount: 150, rating: 4.6 },
  ]);

  // Seed events
  await Event.insertMany([
    { name: "Hackathon 2026", club: "Coding Club", status: "approved", rating: "4.5", date: "2026-03-08", time: "09:00 AM" },
    { name: "Dance Night", club: "Dance Club", status: "pending", rating: "--", date: "2026-03-08", time: "02:00 PM" },
    { name: "Demo Party", club: "Robotics Club", status: "warning", rating: "--", date: "2026-03-09", time: "10:00 AM" },
    { name: "Coding Workshop", club: "Coding Club", status: "approved", rating: "--", date: "2026-03-08", time: "11:00 AM" },
    { name: "Club Heads Meeting", club: "All Clubs", status: "approved", rating: "--", date: "2026-03-08", time: "09:00 AM" },
    { name: "Budget Review", club: "Admin", status: "approved", rating: "--", date: "2026-03-08", time: "04:30 PM" },
    { name: "Cultural Fest Planning", club: "All Clubs", status: "pending", rating: "--", date: "2026-03-09", time: "01:00 PM" },
    { name: "Hackathon Kickoff", club: "Coding Club", status: "approved", rating: "--", date: "2026-03-10", time: "09:30 AM" },
  ]);

  // Seed complaints
  await Complaint.insertMany([
    { text: "Issue at Cultural Fest", type: "alert" },
    { text: "Low Rating: Robotics Club Alert", type: "rating" },
  ]);

  // Seed budget
  await Budget.create({ budgetUsed: 85000, budgetTotal: 100000, photosUploaded: 320, reportsPending: 3 });

  console.log("Seed complete!");
  process.exit(0);
};

seed().catch((err) => { console.error(err); process.exit(1); });
