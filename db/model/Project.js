const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["upcoming", "active", "past"],
      default: "upcoming"
    },
    votes: { type: Number, default: 0 },
    votedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Track who voted
    monthPosted: { type: String }, // Format: "YYYY-MM" (e.g., "2025-01")
    postedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", ProjectSchema);