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
const findUser = async (req, res) => {
  res.send("hello world");
};
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

module.exports = { createUser, createlogin, findUser };
