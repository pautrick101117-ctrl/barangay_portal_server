// controllers/complaintController.js
const Complaint = require("../db/model/ComplaintModel");

// Submit a complaint
const createComplaint = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const complaint = new Complaint({ name, email, message });
    await complaint.save();
    res.status(201).json(complaint);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get all complaints (admin)
const getComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete complaint (admin)
const deleteComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    await Complaint.findByIdAndDelete(id);
    res.json({ message: "Complaint deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};


module.exports = { createComplaint,
getComplaints,
deleteComplaint }