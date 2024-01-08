const Brand = require("../moduls/brandModel");
// const User = require("../moduls/userModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbid");
// const { model } = require("mongoose");

const createBrand = asyncHandler(async (req, res) => {
  try {
    const newBrand = await Brand.create(req.body);
    res.json(newBrand);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllBrand = asyncHandler(async (req, res) => {
  const allBrand = await Brand.find({});
  res.json(allBrand);
});
const getBrand = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    // return console.log(id);
    const brand = await Brand.findById({ _id: id });
    res.json(brand);
  } catch (error) {
    throw new Error(error);
  }
});

const updateBrand = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    // return console.log(id);
    const upt_brand = await Brand.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(upt_brand);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteBrand = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const deleteBrand = await Brand.findByIdAndDelete({ _id: id });
    res.json(deleteBrand);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createBrand,
  getAllBrand,
  getBrand,
  updateBrand,
  deleteBrand,
};
