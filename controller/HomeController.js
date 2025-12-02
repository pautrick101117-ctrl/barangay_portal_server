const HomeModel = require("../db/model/HomeModel");
const axios = require("axios");
const FormData = require("form-data");

// Helper: upload buffer directly to Cloudinary unsigned
const uploadToCloudinary = async (fileBuffer, filename = "upload.jpg") => {
  const formData = new FormData();
  formData.append("file", fileBuffer, filename); // use buffer instead of path
  formData.append("upload_preset", process.env.CLOUDINARY_UPLOAD_PRESET);

  const response = await axios.post(
    `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/upload`,
    formData,
    { headers: formData.getHeaders() }
  );

  return response.data.secure_url;
};

// Get latest home entry
const getHome = async (req, res) => {
  try {
    const home = await HomeModel.find().sort({ createdAt: -1 }).limit(1);
    if (!home || home.length === 0) {
      return res.status(404).json({ message: "No home data found" });
    }
    res.status(200).json(home[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create new home entry
const createHome = async (req, res) => {
  try {
    const { title, subTitle, content } = req.body;
    let backgroundUrl = "";

    if (req.file && req.file.buffer) {
      backgroundUrl = await uploadToCloudinary(req.file.buffer, req.file.originalname);
    }

    if (!title || !subTitle || !content || !backgroundUrl) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newHome = new HomeModel({ title, subTitle, content, backgroundUrl });
    await newHome.save();

    res.status(201).json(newHome);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update home entry
const updateHome = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subTitle, content } = req.body;

    // Get existing home entry
    const existingHome = await HomeModel.findById(id);
    if (!existingHome) return res.status(404).json({ message: "Home entry not found" });

    let backgroundUrl = existingHome.backgroundUrl; // default to existing image

    // Upload new image if file provided
    if (req.file && req.file.buffer) {
      backgroundUrl = await uploadToCloudinary(req.file.buffer, req.file.originalname);
    }

    const updatedHome = await HomeModel.findByIdAndUpdate(
      id,
      { title, subTitle, content, backgroundUrl },
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedHome);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


// Delete home entry
const deleteHome = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedHome = await HomeModel.findByIdAndDelete(id);
    if (!deletedHome) return res.status(404).json({ message: "Home entry not found" });

    res.status(200).json({ message: "Home entry deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getHome,
  createHome,
  updateHome,
  deleteHome,
};
