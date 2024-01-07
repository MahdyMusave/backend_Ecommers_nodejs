const Category = require("../moduls/categoryModel");
// const User = require("../moduls/userModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbid");
// const { model } = require("mongoose");

const createCategory = asyncHandler(async (req, res) => {
  try {
    const newCategory = await Category.create(req.body);
    res.json(newCategory);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllCategory = asyncHandler(async (req, res) => {
  const allCategory = await Category.find({});
  res.json(allCategory);
});
const getCategory = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    // return console.log(id);
    const category = await Category.findById({ _id: id });
    res.json(category);
  } catch (error) {
    throw new Error(error);
  }
});

const updateCategory = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    // return console.log(id);
    const updateCategory = await Category.findByIdAndUpdate(id, req.body, {
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
    const deleteCategory = await Category.findByIdAndDelete({ _id: id });
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
