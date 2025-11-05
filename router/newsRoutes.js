// routes/newsRoutes.js
const express = require("express");
const router = express.Router();
const newsController = require("../controller/newsController");

// === Routes ===
router.get("/", newsController.getNews);
router.post("/", newsController.createNews);       // 👈 Cloudinary handles upload in controller
router.put("/:id", newsController.updateNews);     // 👈 no multer here either
router.delete("/:id", newsController.deleteNews);

module.exports = router;
