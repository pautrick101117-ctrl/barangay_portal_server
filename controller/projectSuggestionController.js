const ProjectSuggestion = require("../db/model/ProjectSuggestion");

// Submit a new suggestion
const createSuggestion = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) return res.status(400).json({ message: "Title and description are required" });

    const suggestion = new ProjectSuggestion({ title, description });
    await suggestion.save();
    res.status(201).json(suggestion);
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

// Delete a suggestion
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

module.exports = { createSuggestion, getSuggestions, deleteSuggestion };
