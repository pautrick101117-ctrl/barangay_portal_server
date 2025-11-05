const News = require("../db/model/news");
const cloudinary = require("cloudinary").v2;

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
});

// ✅ GET ALL NEWS
const getNews = async (req, res) => {
  try {
    const newsList = await News.find().sort({ date: -1 });
    res.json(newsList);
  } catch (err) {
    res.status(500).json({ message: "Error fetching news", error: err.message });
  }
};

// ✅ CREATE NEWS
const createNews = async (req, res) => {
  try {
    const { title, description, date, imageUrl, imagePublicId } = req.body;

    if (!title || !description || !date || !imageUrl) {
      return res.status(400).json({ error: "Title, description, date, and imageUrl are required" });
    }

    const news = new News({ title, description, date, imageUrl, imagePublicId: imagePublicId || "" });
    await news.save();

    res.status(201).json(news);
  } catch (err) {
    res.status(500).json({ message: "Error creating news", error: err.message });
  }
};

// ✅ UPDATE NEWS
const updateNews = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date, imageUrl, imagePublicId } = req.body;

    const news = await News.findById(id);
    if (!news) return res.status(404).json({ error: "News not found" });

    news.title = title || news.title;
    news.description = description || news.description;
    news.date = date || news.date;

    // Update image only if new URL is provided
    if (imageUrl) {
      news.imageUrl = imageUrl;
      news.imagePublicId = imagePublicId || news.imagePublicId;
    }

    await news.save();
    res.json({ message: "News updated successfully", updated: news });
  } catch (err) {
    res.status(500).json({ message: "Error updating news", error: err.message });
  }
};

// ✅ DELETE NEWS
const deleteNews = async (req, res) => {
  try {
    const { id } = req.params;
    const news = await News.findById(id);

    if (!news) return res.status(404).json({ error: "News not found" });

    // Not deleting Cloudinary image → manual handling
    await news.deleteOne();

    res.json({ message: "News deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting news", error: err.message });
  }
};

module.exports = {
  getNews,
  createNews,
  updateNews,
  deleteNews,
};
