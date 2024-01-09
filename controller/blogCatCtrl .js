const BlogCategory = require("../moduls/blogCatModel");
// const User = require("../moduls/userModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbid");
// const { model } = require("mongoose");

const createCategory = asyncHandler(async (req, res) => {
  try {
    const newCategory = await BlogCategory.create(req.body);
    res.json(newCategory);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllCategory = asyncHandler(async (req, res) => {
  const allCategory = await BlogCategory.find({});
  res.json(allCategory);
});
const getCategory = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    // return console.log(id);
    const category = await BlogCategory.findById({ _id: id });
    res.json(category);
  } catch (error) {
    throw new Error(error);
  }
});

const updateCategory = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    // return console.log(id);
    const updateCategory = await BlogCategory.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updateCategory);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteCategory = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const deleteCategory = await BlogCategory.findByIdAndDelete({ _id: id });
    res.json(deleteCategory);
  } catch (error) {
    throw new Error(error);
  }
});

disLikeTheCategory = asyncHandler(async (req, res) => {});
module.exports = {
  createCategory,
  getAllCategory,
  getCategory,
  updateCategory,
  deleteCategory,
};
