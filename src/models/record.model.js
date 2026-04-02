const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  amount: Number,
  type: { type: String, enum: ["income", "expense"] },
  category: String,
  date: Date,
  notes: String
});

module.exports = mongoose.model("Record", recordSchema);
