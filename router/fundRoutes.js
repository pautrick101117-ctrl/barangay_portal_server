const express = require("express");
const router = express.Router();
const fundController = require("../controller/fundController");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage });

// GET all
router.get("/", fundController.getFunds);

// CREATE
router.post("/create", upload.single("image"), fundController.createFund);

// UPDATE
router.put("/:id", upload.single("image"), fundController.updateFund);

// DELETE
router.delete("/:id", fundController.deleteFund);

module.exports = router;
