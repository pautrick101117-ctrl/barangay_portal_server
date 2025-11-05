// routes/officials.js
const express = require("express")
const {
  getOfficials,
  addOfficial,
  updateOfficial,
  deleteOfficial,
} = require("../controller/officialsController")

const router = express.Router()

// === Routes ===
router.get("/", getOfficials)
router.post("/", addOfficial)       // 👈 no multer, Cloudinary will handle upload in controller
router.put("/:id", updateOfficial)  // 👈 same here
router.delete("/:id", deleteOfficial)

module.exports = router
