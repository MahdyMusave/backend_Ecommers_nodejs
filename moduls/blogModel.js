const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    category: {
      type: String,
      require: true,
    },
    numViews: {
      type: Number,
      default: 0,
    },
    isLiked: {
      type: Boolean,
      default: false,
    },
    isDisLike: {
      type: Boolean,
      default: false,
    },
    likes: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    dislike: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    image: {
      type: String,
      default: "www.imageGoole.com/2334371",
    },
    author: {
      type: String,
      default: "mahdyMusave",
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: false,
    },
    timestamps: true,
  }
);

module.exports = mongoose.model("Blog", blogSchema);
