const express = require("express");
const multer = require("multer");
const { getHome, createHome, updateHome, deleteHome } = require("../controller/HomeController");

const router = express.Router();

// Multer memory storage (store file in memory, not disk)
const storage = multer.memoryStorage();
const parser = multer({ storage });

// Routes
router.get("/", getHome);
router.post("/", parser.single("background"), createHome);
router.put("/:id", parser.single("background"), updateHome);
router.delete("/:id", deleteHome);

module.exports = router;
