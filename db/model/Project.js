const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    },
    votes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", ProjectSchema);
