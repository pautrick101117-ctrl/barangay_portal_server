const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    middleName: {
      type: String,
      trim: true,
    },
    contactNumber: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    // Project Suggestion fields
    hasSuggested: { type: Boolean, default: false },
    lastSuggestionDate: { type: Date },
    currentSuggestionId: { type: mongoose.Schema.Types.ObjectId, ref: "ProjectSuggestion" },
    
    // Project Voting fields
    votedProjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
    lastVoteMonth: { type: String }, // Format: "YYYY-MM"
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);