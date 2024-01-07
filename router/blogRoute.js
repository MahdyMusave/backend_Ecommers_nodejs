const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/authmoiddleware");
const {
  createBlog,
  getBlog,
  getAllBlog,
  updateBlog,
  deleteBlog,
  likeTheBlog,
} = require("../controller/blogCtrl");

router.get("/", getAllBlog);

router.get("/:id", authMiddleware, isAdmin, getBlog);

router.post("/", authMiddleware, isAdmin, createBlog);
//route for likes
router.put("/Likes", authMiddleware, likeTheBlog);
router.put("/:id", authMiddleware, isAdmin, updateBlog);
router.delete("/:id", deleteBlog);

module.exports = router;
