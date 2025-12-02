const Fund = require("../db/model/Fund");
const axios = require("axios");
const FormData = require("form-data");

const getFunds = async (req, res) => {
  try {
    const funds = await Fund.find().sort({ date: -1 });
    res.json(funds);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Helper to upload image to Cloudinary
const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file.buffer, file.originalname);
  formData.append("upload_preset", process.env.CLOUDINARY_UPLOAD_PRESET);

  const cloudinaryRes = await axios.post(
    `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
    formData,
    { headers: formData.getHeaders() }
  );

  return cloudinaryRes.data.secure_url;
};

const createFund = async (req, res) => {
  try {
    let imageUrl = req.body.imageUrl || "";

    // If a file is uploaded
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file);
    }

    const fund = await Fund.create({
      source: req.body.source,
      description: req.body.description,
      amount: req.body.amount,
      date: req.body.date,
      imageUrl,
    });

    res.status(201).json(fund);
  } catch (err) {
    console.error("Create Fund Error:", err);
    res.status(500).json({ message: err.message });
  }
};

const updateFund = async (req, res) => {
  try {
    const { id } = req.params;

    let imageUrl = req.body.imageUrl || "";

    // If user uploaded a new image
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file);
    }

    const updated = await Fund.findByIdAndUpdate(
      id,
      {
        source: req.body.source,
        description: req.body.description,
        amount: req.body.amount,
        date: req.body.date,
        imageUrl,
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    console.error("Update Fund Error:", err);
    res.status(500).json({ message: err.message });
  }
};

const deleteFund = async (req, res) => {
  try {
    const { id } = req.params;
    await Fund.findByIdAndDelete(id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getFunds,
  createFund,
  updateFund,
  deleteFund,
};
