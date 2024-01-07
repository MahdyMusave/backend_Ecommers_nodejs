const Blog = require("../moduls/blogModel");
// const User = require("../moduls/userModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbid");
// const { model } = require("mongoose");

const createBlog = asyncHandler(async (req, res) => {
  try {
    const newBlog = await Blog.create(req.body);
    res.json(newBlog);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllBlog = asyncHandler(async (req, res) => {
  const allBlog = await Blog.find({});
  res.json(allBlog);
});
const getBlog = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    // return console.log(id);
    const blog = await Blog.findById({ _id: id });
    res.json(blog);
  } catch (error) {
    throw new Error(error);
  }
});

const updateBlog = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    // return console.log(id);
    const updateBlog = await Blog.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updateBlog);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteBlog = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const deleteBlog = await Blog.findByIdAndDelete({ _id: id });
    res.json(deleteBlog);
  } catch (error) {
    throw new Error(error);
  }
});

const likeTheBlog = asyncHandler(async (req, res) => {
  try {
    // return console.log(req.body);

    const { blogId } = req.body;
    return console.log(blogId);

    //Find the blog which you want to be liked
    const blog = await Blog.findById(blogId);
    //Find the login user
    const loginUserId = req?.user?._id;
    //find if the user has liked the blog
    const isLiked = blog?.isLiked;
    //find if the user has disliked the blog
    const alreadyDisliked = blog?.dislikes?.find(
      (userId = userId?.toString() === loginUserId?.toString())
    );

    if (alreadyDisliked) {
      const blog = await Blog.findByIdAndDelete(
        blogId,
        {
          $pull: { dislikes: loginUserId },
          isDisLiked: false,
        },
        { new: true }
      );
      res.json(blog);
    }
    if (isLiked) {
      const blog = await Blog.findByIdAndDelete(
        blogId,
        {
          $pull: { likes: loginUserId },
          isLiked: false,
        },
        { new: true }
      );
      res.json(blog);
    } else {
      const blog = await Blog.findByIdAndDelete(
        blogId,
        {
          $push: { likes: loginUserId },
          isLiked: true,
        },
        { new: true }
      );
      res.json(blog);
    }
  } catch (err) {
    throw new Error(err);
  }
});

module.exports = {
  createBlog,
  getAllBlog,
  getBlog,
  updateBlog,
  deleteBlog,
  likeTheBlog,
};
