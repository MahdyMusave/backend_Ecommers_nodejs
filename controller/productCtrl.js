const Product = require("../moduls/productModel");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");

const createProduct = asyncHandler(async (req, res) => {
  try {
    // console.log(req.body);
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const newProduct = await Product.create(req.body);
    res.json(newProduct);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllProduct = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    throw new Error(error);
  }
});
const getaProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  // return console.log(id);
  try {
    const product = await Product.findOne({ _id: id });
    res.json(product);
  } catch (error) {
    throw new Error(error);
  }
});

const updateProduct = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
     if (req.body.title) {
       req.body.slug = slugify(req.body.title);
     }
    const updateproduct = await Product.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    res.json(updateproduct);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const deleteproduct = await Product.findByIdAndDelete(id);
    res.json(deleteproduct);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createProduct,
  getAllProduct,
  getaProduct,
  updateProduct,
  deleteProduct,
};
