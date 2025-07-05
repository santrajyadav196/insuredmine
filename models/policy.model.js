const mongoose = require("mongoose");

const policySchema = new mongoose.Schema(
  {
    policyNumber: { type: String, required: true },
    policyStartDate: { type: Date, required: true },
    policyEndDate: { type: Date, required: true },
    //extra fields start
    premiumAmount: { type: Number, required: true },
    policyType: { type: String },
    policyMode: { type: Number },
    producer: { type: String },
    csr: { type: String },
    // extra fields end

    // Reference fields (ObjectId)
    policyCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    policyCarrier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Carrier",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Policy", policySchema);
