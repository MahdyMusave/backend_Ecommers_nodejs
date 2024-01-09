const express = require("express");
const router = express.Router();
const {
  createProduct,
  getAllProduct,
  getaProduct,
  updateProduct,
  deleteProduct,
  addToWishList,
} = require("../controller/productCtrl");

const { authMiddleware, isAdmin } = require("../middlewares/authmoiddleware");
//create new product with post;
router.post("/", authMiddleware, isAdmin, createProduct);

//get all products list
router.get("/", getAllProduct);

//get only only product by id
router.get("/:id", getaProduct);

//update product by id
router.put("/wishlist", authMiddleware, addToWishList);
router.put("/:id", authMiddleware, isAdmin, updateProduct);

//delete product by id
router.delete("/:id", authMiddleware, isAdmin, deleteProduct);

module.exports = router;
