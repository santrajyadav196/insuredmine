const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    scheduledAt: { type: Date, required: true }, // exact date and time
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
