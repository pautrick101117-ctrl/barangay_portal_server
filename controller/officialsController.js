const Official = require("../db/model/Official");
const cloudinary = require("cloudinary").v2;

// ✅ Configure cloudinary (only cloud_name needed for uploads via frontend unsigned preset)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
});

// Get all officials
const getOfficials = async (req, res) => {
  try {
    const officials = await Official.find().sort({ createdAt: -1 });
    res.json(officials);
  } catch (err) {
    console.error("Error in getOfficials:", err.message);
    res.status(500).json({ error: "Failed to fetch officials" });
  }
};

// Add new official
const addOfficial = async (req, res) => {
  try {
    const { name, position, term, imageUrl, imagePublicId } = req.body;

    if (!name || !position || !term || !imageUrl || !imagePublicId) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const official = new Official({ name, position, term, imageUrl, imagePublicId });
    await official.save();

    res.status(201).json(official);
  } catch (err) {
    console.error("Error in addOfficial:", err.message);
    res.status(500).json({ error: "Failed to add official" });
  }
};

// Update official
const updateOfficial = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, position, term, imageUrl, imagePublicId } = req.body;

    const official = await Official.findById(id);
    if (!official) return res.status(404).json({ error: "Official not found" });

    official.name = name || official.name;
    official.position = position || official.position;
    official.term = term || official.term;

    if (imageUrl && imagePublicId) {
      official.imageUrl = imageUrl;
      official.imagePublicId = imagePublicId;
    }

    await official.save();

    res.json({ message: "Official updated successfully", updated: official });
  } catch (err) {
    console.error("Error in updateOfficial:", err.message);
    res.status(500).json({ error: "Failed to update official" });
  }
};

// Delete official
const deleteOfficial = async (req, res) => {
  try {
    const { id } = req.params;
    const official = await Official.findById(id);

    if (!official) return res.status(404).json({ error: "Official not found" });

    // ❌ No Cloudinary deletion here, you will handle manually
    await official.deleteOne();

    res.json({ message: "Official deleted successfully" });
  } catch (err) {
    console.error("Error in deleteOfficial:", err.message);
    res.status(500).json({ error: "Failed to delete official" });
  }
};

module.exports = {
  getOfficials,
  addOfficial,
  updateOfficial,
  deleteOfficial,
};
