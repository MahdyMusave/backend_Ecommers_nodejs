const { generateToken } = require("../config/jwtToken");
const User = require("../moduls/userModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbid");
const { generateRefreshToken } = require("../config/refreshtoken");
const JWT = require("jsonwebtoken");
const sendEmail = require("./emailCtrl");

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
    const refreshToken = generateRefreshToken(findUser?._id);
    const userupdate = await User.findByIdAndUpdate(
      findUser._id,
      {
        refreshToken: refreshToken,
      },
      {
        new: true,
      }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
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

const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  // console.log(cookie);
  if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookie");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken: refreshToken });
  // console.log(user);
  if (!user) throw new Error("No Refresh token present in db or not matched");
  JWT.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    // console.log(err);
    // console.log(decoded);
    if (err || user.id !== decoded.id) {
      throw new Error("there is something wrong with refresh token");
    }
    const accessToken = generateToken(user?._id);
    res.json({ accessToken });
  });
});
const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookie");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({
    refreshToken: refreshToken,
  });
  // console.log(user);
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204);
  }
  // await User.findOneAndUpdate(refreshToken, {
  //   refreshToken: "",
  // });
  // console.log(refreshToken);
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  res.sendStatus(204);
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
    const { id } = req.params;
    validateMongoDbId(id);
    const findUser = await User.findOne({ _id: id });
    // console.log(findUsers);
    res.json(findUser);
  } catch (error) {
    throw new Error(error);
  }
});
const deleteUser = asyncHandler(async (req, res) => {
  // console.log(req.params);
  try {
    const { id } = req.params;
    validateMongoDbId(id);
    const deleteUser = await User.deleteOne({ _id: id });
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
    // const { id } = req.params;
    const { _id } = req.user;
    // console.log(req.user);//when you create token
    validateMongoDbId(_id);
    const updateUser = await User.findByIdAndUpdate(
      _id,
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
const blockedUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const blocked = await User.findByIdAndUpdate(
      id,
      { isBlocked: true },
      {
        new: true,
      }
    );
    res.json({
      message: "User blocked",
    });
  } catch (error) {
    throw new Error(error);
  }
});
const unblockUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const unblocked = await User.findByIdAndUpdate(
      id,
      { isBlocked: true },
      {
        new: true,
      }
    );
    res.json({
      message: "User unblocked",
    });
  } catch (error) {
    throw new Error(error);
  }
});

const updatePassword = asyncHandler(async (req, res) => {
  // console.log(req.user);
  const { _id } = req.user;
  const { password } = req.body;
  validateMongoDbId(_id);
  // console.log(req.body);
  const user = await User.findById(_id);
  // console.log(user);
  // console.log(password, "password");
  if (password) {
    user.password = password;

    const updatePassword = await user.save();
    // console.log(updatePassword);
    res.json(updatePassword);
  } else {
    res.json(user);
  }
});

const forgotPasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email });
  // console.log(user);
  if (!user) throw new Error("user not found with this email");

  try {
    // console.log(user);
    const token = await user.createPasswordResetToken();
    console.log(token);
    await user.save();

    res.json(token);
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = {
  createUser,
  createlogin,
  handleRefreshToken,
  logout,
  getAllUser,
  getSingleUser,
  deleteUser,
  updateUser,
  blockedUser,
  unblockUser,
  updatePassword,
  forgotPasswordToken,
};
