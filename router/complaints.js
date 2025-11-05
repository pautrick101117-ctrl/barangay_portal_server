// routes/complaints.js
const express = require("express");
const router = express.Router();
const { createComplaint,
getComplaints,
deleteComplaint } = require("../controller/complaintController");

// Public: submit complaint
router.post("/", createComplaint);

// Admin: get all complaints
router.get("/", getComplaints);

// Admin: delete a complaint
router.delete("/:id", deleteComplaint);

module.exports = router;
