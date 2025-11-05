const express = require("express");
const router = express.Router();
const { createSuggestion, getSuggestions, deleteSuggestion } = require("../controller/projectSuggestionController");

// Public: submit a suggestion
router.post("/", createSuggestion);

// Admin: get all suggestions
router.get("/", getSuggestions);

// Admin: delete a suggestion
router.delete("/:id", deleteSuggestion);

module.exports = router;
