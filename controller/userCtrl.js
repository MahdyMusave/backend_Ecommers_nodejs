const { generateToken } = require("../config/jwtToken");
const User = require("../moduls/userModel");
const asyncHandler = require("express-async-handler");
const createUser = asyncHandler(async (req, res) => {
  // console.log(req.body);
  const email = req.body.email;
  // console.log(email);
  const findUser = await User.findOne({ email: email });

  // console.log(findUser);
  if (!findUser) {
    //   //create a new user
    const newUser = await User.create(req.body);
    res.json(newUser);
  } else {
    //user Already Exists
    throw new Error("User Already Exists");
  }
});
const createlogin = asyncHandler(async (req, res) => {
  // console.log(req.body);
  const { email, password } = req.body;
  const findUser = await User.findOne({ email: email });
  // console.log(findUser);
  if (findUser && (await findUser.isPasswordMatched(password))) {
    // res.json(findUser);
    res.json({
      _id: findUser?._id,
      firstname: findUser?.firstname,
      lastname: findUser?.lastname,
      email: findUser?.email,
      token: generateToken(findUser?._id),
    });
  } else {
    throw new Error("user invalid");
  }
});

//get all users
const getAllUser = asyncHandler(async (req, res) => {
  const findUsers = await User.find({});
  // console.log(findUsers);
  res.json(findUsers);
});
//get a single users
const getSingleUser = asyncHandler(async (req, res) => {
  // console.log(req.params);
  try {
    const findUser = await User.findOne({ _id: req.params.id });
    // console.log(findUsers);
    res.json(findUser);
  } catch (error) {
    throw new Error(error);
  }
});
const deleteUser = asyncHandler(async (req, res) => {
  // console.log(req.params);
  try {
    const deleteUser = await User.deleteOne({ _id: req.params.id });
    // console.log(findUsers);
    res.json(deleteUser);
  } catch (error) {
    throw new Error(error);
  }
});
const updateUser = asyncHandler(async (req, res) => {
  // console.log(req.params);
  try {
    //using in mongoDb---// const updateUser = await User.updateOne({ _id: req.params.id },{set:{firstname:'nima'}});
    //using in mongoose
    const {id}=req.params
    const updateUser = await User.findByIdAndUpdate(
      id,
      {
        firstname: req?.body?.firstname,
        lastname: req?.body?.lastname,
        email: req?.body?.eamil,
      },
      {
        new: true,
      }
    );
    // console.log(updateUser);
    res.json(updateUser);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createUser,
  createlogin,
  getAllUser,
  getSingleUser,
  deleteUser,
  updateUser,
};
