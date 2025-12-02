const express = require("express");
const router = express.Router();
const {
  createSuggestion,
  updateSuggestion,
  getUserSuggestion,
  getSuggestions,
  deleteSuggestion,
  getSubmissionStatus
} = require("../controller/projectSuggestionController");
const User = require("../db/model/User");

const requireAuth = (req, res, next) => {
  req.user = { id: req.headers["x-user-id"] };
  if (!req.user.id) return res.status(401).json({ message: "Unauthorized" });
  next();
};

// Get submission window status
router.get("/status", getSubmissionStatus);

// Get user's current suggestion
router.get("/my-suggestion", requireAuth, getUserSuggestion);

// Public: submit a suggestion (requires user)
router.post("/", requireAuth, createSuggestion);

// Update user's suggestion
router.put("/", requireAuth, updateSuggestion);

// Admin: get all suggestions
router.get("/", getSuggestions);

// Admin: delete a suggestion
router.delete("/:id", deleteSuggestion);

// Check if the user has already submitted a suggestion
router.get("/check-user", async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    
    if (!userId) {
      return res.json({ hasSubmitted: false });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.json({ hasSubmitted: false });
    }
    
    // Check if submitted this month
    const hasSubmittedThisMonth = user.lastSuggestionDate && 
      new Date(user.lastSuggestionDate).getMonth() === new Date().getMonth() &&
      new Date(user.lastSuggestionDate).getFullYear() === new Date().getFullYear();
    
    res.json({ hasSubmitted: hasSubmittedThisMonth });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;