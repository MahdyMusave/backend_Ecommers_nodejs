const mongoose = require("mongoose");
const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
      trim: true,
    },
    slug: {
      type: String,
      require: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      require: true,
    },
    price: {
      type: Number,
      require: Number,
    },
    category: {
      type: String,
      require: true,
    },
    brand: {
      type: String,
      // enum: ["Apple", "Samsung", "Lenovo"],
      require: true,
    },
    quantity: {
      type: Number,
      require: true,
    },
    sold: {
      type: Number,
      default: 0,
      // select:false,
    },
    images: {
      type: Array,
    },
    color: {
      type: String,
      // enum: ["Black", "Brown", "Red"],
      require: true,
    },
    ratings: {
      star: Number,
      postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Product", ProductSchema);
