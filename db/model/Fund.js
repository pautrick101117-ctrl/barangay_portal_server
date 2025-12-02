const mongoose = require("mongoose");

const FundSchema = new mongoose.Schema(
  {
    source: { type: String, required: true },
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },

    // NEW FIELD — Image URL
    imageUrl: { type: String, required: false } // change to true if you want it mandatory
  },
  { timestamps: true }
);

module.exports = mongoose.model("Fund", FundSchema);
