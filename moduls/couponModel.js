const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
      unique: true,
      uppercase: true,
    },
    expiry: {
      type: Date,
      required: true,
    },
    discound: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("coupon", couponSchema);
