const Fund = require("../db/model/Fund");

const getFunds = async (req, res) => {
  try {
    const funds = await Fund.find().sort({ date: -1 });
    res.json(funds);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createFund = async (req, res) => {
  try {
    const { source, description, amount, date } = req.body;
    const fund = await Fund.create({ source, description, amount, date });
    res.status(201).json(fund);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateFund = async (req, res) => {
  try {
    const { id } = req.params;
    const { source, description, amount, date } = req.body;
    const updated = await Fund.findByIdAndUpdate(
      id,
      { source, description, amount, date },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
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
