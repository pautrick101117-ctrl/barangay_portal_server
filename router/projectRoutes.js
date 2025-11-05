const express = require("express");
const router = express.Router();
const { getProjects, addProject, deleteProject } = require("../controller/projectsController");

// Projects CRUD
router.get("/", getProjects);
router.post("/", addProject);
router.delete("/:id", deleteProject);

module.exports = router;
