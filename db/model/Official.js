const mongoose = require("mongoose");

const OfficialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  position: { type: String, required: true },
  term: { type: String, required: true },
  imageUrl: { type: String, default: null }, // 🔹 CHANGED FROM 'image' TO 'imageUrl'
  imagePublicId: { type: String, default: null } // OPTIONAL: FOR CLOUDINARY ID
}, { timestamps: true });

module.exports = mongoose.model("Official", OfficialSchema);
