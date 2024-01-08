const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/authmoiddleware");
const {
  createCategory,
  getAllCategory,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("../controller/categoryCtrl");

router.get("/", getAllCategory);

router.get("/:id", authMiddleware, isAdmin, getCategory);

router.post("/", authMiddleware, isAdmin, createCategory);
// //route for likes

router.put("/:id", authMiddleware, isAdmin, updateCategory);
router.delete("/:id", deleteCategory);

module.exports = router;
