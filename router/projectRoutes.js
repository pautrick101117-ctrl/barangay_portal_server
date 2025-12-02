const express = require("express");
const router = express.Router();
const { 
  getProjects, 
  getActiveProjects,
  getUserVoteStatus,
  addProject, 
  voteProject,
  deleteProject 
} = require("../controller/projectsController");

// Middleware for user authentication
const requireAuth = (req, res, next) => {
  req.user = { id: req.headers["x-user-id"] };
  if (!req.user.id) return res.status(401).json({ message: "Unauthorized" });
  next();
};

// Admin routes
router.get("/", getProjects); // Get all projects
router.post("/", addProject); // Add project
router.delete("/:id", deleteProject); // Delete project

// User routes
router.get("/active", getActiveProjects); // Get active projects for voting
router.get("/vote-status", requireAuth, getUserVoteStatus); // Check user's vote status
router.post("/vote", requireAuth, voteProject); // Cast vote

module.exports = router;