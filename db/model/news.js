const mongoose = require("mongoose");

const NewsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  imageUrl: { type: String, default: "" }, // 🔹 CHANGED FROM 'image' TO 'imageUrl'
  imagePublicId: { type: String, default: "" } // OPTIONAL: FOR CLOUDINARY ID
}, { timestamps: true });

module.exports = mongoose.model("News", NewsSchema);
