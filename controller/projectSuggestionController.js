const ProjectSuggestion = require("../db/model/ProjectSuggestion");
const User = require("../db/model/User");

// ========================================
// 🧪 TESTING MODE - Set to true to bypass time restrictions
// ========================================
const TESTING_MODE = false; // Set to false for production

// Testing configuration (only used when TESTING_MODE = true)
const TEST_CONFIG = {
  dayOfMonth: 1,      // Simulate this day of month (1-31)
  hour: 10,           // Simulate this hour (0-23)
  allowAllTimes: true // Set to true to allow submissions at any time
};
// ========================================

// Helper function to check if current time is within submission window
const isWithinSubmissionWindow = () => {
  // 🧪 TESTING MODE: Bypass restrictions or use test config
  if (TESTING_MODE) {
    if (TEST_CONFIG.allowAllTimes) {
      console.log("🧪 TESTING MODE: All times allowed");
      return { allowed: true };
    }
    
    // Use test configuration
    const currentDay = TEST_CONFIG.dayOfMonth;
    const currentHour = TEST_CONFIG.hour;
    
    console.log(`🧪 TESTING MODE: Simulating Day ${currentDay}, Hour ${currentHour}`);
    
    if (currentDay !== 1) {
      return {
        allowed: false,
        message: "Suggestions can only be submitted on the 1st day of each month."
      };
    }
    
    if (currentHour < 9 || currentHour >= 17) {
      return {
        allowed: false,
        message: "Suggestions can only be submitted between 9:00 AM and 5:00 PM."
      };
    }
    
    return { allowed: true };
  }
  
  // 🚀 PRODUCTION MODE: Use actual date/time
  const now = new Date();
  const currentDay = now.getDate();
  const currentHour = now.getHours();
  
  console.log(`🚀 PRODUCTION MODE: Current Day ${currentDay}, Hour ${currentHour}`);
  
  // Check if it's the first day of the month
  if (currentDay !== 1) {
    return {
      allowed: false,
      message: "Suggestions can only be submitted on the 1st day of each month."
    };
  }
  
  // Check if time is between 9 AM (09:00) and 5 PM (17:00)
  if (currentHour < 9 || currentHour >= 17) {
    return {
      allowed: false,
      message: "Suggestions can only be submitted between 9:00 AM and 5:00 PM."
    };
  }
  
  return { allowed: true };
};

// Helper function to check if user has already submitted this month
const hasSubmittedThisMonth = (user) => {
  if (!user.lastSuggestionDate) return false;
  
  const lastSubmission = new Date(user.lastSuggestionDate);
  const now = new Date();
  
  return (
    lastSubmission.getMonth() === now.getMonth() &&
    lastSubmission.getFullYear() === now.getFullYear()
  );
};

// Submit a new suggestion
const createSuggestion = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!title || !description)
      return res.status(400).json({ message: "Title and description are required" });

    // Check time window
    const timeCheck = isWithinSubmissionWindow();
    if (!timeCheck.allowed) {
      return res.status(403).json({ message: timeCheck.message });
    }

    // Check if user exists and has already suggested this month
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    
    if (hasSubmittedThisMonth(user)) {
      return res.status(400).json({ 
        message: "You have already submitted a suggestion this month. You can update it instead." 
      });
    }

    // Create suggestion with userId reference
    const suggestion = new ProjectSuggestion({ 
      title, 
      description,
      userId
    });
    await suggestion.save();

    // Update user's submission status
    user.hasSuggested = true;
    user.lastSuggestionDate = new Date();
    user.currentSuggestionId = suggestion._id;
    await user.save();

    res.status(201).json(suggestion);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update user's suggestion
const updateSuggestion = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!title || !description)
      return res.status(400).json({ message: "Title and description are required" });

    // Check time window
    const timeCheck = isWithinSubmissionWindow();
    if (!timeCheck.allowed) {
      return res.status(403).json({ message: timeCheck.message });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    
    if (!user.currentSuggestionId) {
      return res.status(400).json({ message: "You don't have a suggestion to update" });
    }

    // Update the suggestion
    const suggestion = await ProjectSuggestion.findByIdAndUpdate(
      user.currentSuggestionId,
      { title, description, updatedAt: new Date() },
      { new: true }
    );

    if (!suggestion) {
      return res.status(404).json({ message: "Suggestion not found" });
    }

    res.json(suggestion);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get user's current suggestion
const getUserSuggestion = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(userId);
    if (!user || !user.currentSuggestionId) {
      return res.json({ suggestion: null });
    }

    const suggestion = await ProjectSuggestion.findById(user.currentSuggestionId);
    res.json({ suggestion });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all suggestions
const getSuggestions = async (req, res) => {
  try {
    const suggestions = await ProjectSuggestion.find().sort({ createdAt: -1 });
    res.json(suggestions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin: Delete a suggestion
const deleteSuggestion = async (req, res) => {
  try {
    const { id } = req.params;
    await ProjectSuggestion.findByIdAndDelete(id);
    res.json({ message: "Suggestion deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get submission window status
const getSubmissionStatus = async (req, res) => {
  try {
    const userId = req.user?.id;
    const timeCheck = isWithinSubmissionWindow();
    
    let userStatus = {
      hasSubmitted: false,
      canSubmit: timeCheck.allowed,
      canUpdate: false
    };

    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        userStatus.hasSubmitted = hasSubmittedThisMonth(user);
        userStatus.canUpdate = userStatus.hasSubmitted && timeCheck.allowed;
      }
    }

    res.json({
      ...timeCheck,
      ...userStatus,
      currentDate: new Date(),
      nextSubmissionWindow: "1st day of next month, 9:00 AM - 5:00 PM",
      testingMode: TESTING_MODE // Include testing mode status
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { 
  createSuggestion, 
  updateSuggestion,
  getUserSuggestion,
  getSuggestions, 
  deleteSuggestion,
  getSubmissionStatus
};