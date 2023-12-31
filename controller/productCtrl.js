const { query } = require("express");
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

/* const getAllProduct = asyncHandler(async (req, res) => {
//   try {
//     const products = await Product.find({});
//     res.json(products);
//   } catch (error) {
//     throw new Error(error);
//   }
// });
*/
const getAllProduct = asyncHandler(async (req, res) => {
  // console.log(req.query);
  try {
    // const products = await Product.find({});
    // you can search in api postman som this exmple =>urls?brand=
    //localhost:3001/api/product?brand=Dell
    //localhost:3001/api/product?brand=Dell&color=pink
    /************************************ 
    //   const products = await Product.find(req.query);
    */
    //and other way
    /************************************ 
      const products = await Product.find({
        brand: req.query.brand,
        category: req.query.category,
      });
     */
    // and other way
    const queryObj = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields"];
    // console.log(excludeFields);
    // console.log(queryObj);

    excludeFields.forEach((el) => {
      delete queryObj[el];
    });

    //console.log(queryObj, req.query);
    // your result is this====>
    // { brand: 'Dell', color: 'pink' } { brand: 'Dell', color: 'pink', sort: 'price' }
    // const getallProduct = await Product.where("category").equals(
    //   req.query.category
    // );
    // one other way for fix error

    let queryStr = JSON.stringify(queryObj);
    // console.log(queryStr);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    console.log(JSON.parse(queryStr));
    //send http requist
    //http://localhost:3001/api/product?price[gte]=100
    // get result
    // { price: { '$gte': '100' } }
    const getallProduct = await Product.find(queryObj);
    res.json(getallProduct);
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
    const updateproduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
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
