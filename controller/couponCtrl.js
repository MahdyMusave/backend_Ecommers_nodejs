const Coupon = require("../moduls/couponModel");
// const User = require("../moduls/userModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbid");
// const { model } = require("mongoose");

const createCoupon = asyncHandler(async (req, res) => {
  try {
    const newCoupon = await Coupon.create(req.body);
    res.json(newCoupon);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllCoupon = asyncHandler(async (req, res) => {
  const allCoupon = await Coupon.find({});
  res.json(allCoupon);
});

const getaCoupon = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongoDbId(id);
    // return console.log(id);
    const getresult = await Coupon.findById({ _id: id });
    res.json(getresult);
  } catch (error) {
    throw new Error(error);
  }
});

const updateCoupon = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongoDbId(id);
    // return console.log(id);
    const upt_Coupon = await Coupon.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(upt_Coupon);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteCoupon = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongoDbId(id);
    const deleteCoupon = await Coupon.findByIdAndDelete({ _id: id });
    res.json(deleteCoupon);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createCoupon,
  getAllCoupon,
  getaCoupon,
  updateCoupon,
  deleteCoupon,
};
