const { generateToken } = require("../config/jwtToken");
const User = require("../moduls/userModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbid");
const { generateRefreshToken } = require("../config/refreshtoken");
const JWT = require("jsonwebtoken");
const sendEmail = require("./emailCtrl");
const Cart = require("../moduls/cartModel");
const Product = require("../moduls/productModel");
const Coupon = require("../moduls/couponModel");
const Order = require("../moduls/orderModel");
const uniqid = require("uniqid");
// login a user
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
//admin login
const createAdmin = asyncHandler(async (req, res) => {
  // console.log(req.body);
  const { email, password } = req.body;
  const findAdmin = await User.findOne({ email: email });
  // console.log(findAdmin);
  if (findAdmin.role !== "admin") throw new Error("Not Authorised");
  if (findAdmin && (await findAdmin.isPasswordMatched(password))) {
    const refreshToken = generateRefreshToken(findAdmin?._id);
    const userupdate = await User.findByIdAndUpdate(
      findAdmin._id,
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
      _id: findAdmin?._id,
      firstname: findAdmin?.firstname,
      lastname: findAdmin?.lastname,
      email: findAdmin?.email,
      token: generateToken(findAdmin?._id),
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

//save user Address
const saveAddress = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  try {
    validateMongoDbId(_id);
    const updateUser = await User.findByIdAndUpdate(
      _id,
      {
        address: req?.body?.address,
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

getwishList = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  try {
    const findUser = await User.findById(_id).populate("wishlist");
    res.json(findUser);
  } catch (error) {
    throw new Error(error);
  }
});

const userCart = asyncHandler(async (req, res) => {
  const { cart } = req.body;
  const { _id } = req.user;
  // console.log(_id);
  // console.log(cart);
  validateMongoDbId(_id);
  try {
    let products = [];
    // check if user already have product in cart
    const user = await User.findById(_id);
    const alreadyExistCart = await Cart.findOne({ orderby: user._id });
    // console.log(user);

    // if (alreadyExistCart) {
    //   // console.log(alreadyExistCart);
    //   alreadyExistCart.remove();
    // }
    if (alreadyExistCart && typeof alreadyExistCart === "object") {
      await Cart.deleteOne({ _id: alreadyExistCart._id });
    }
    // return res.json(alreadyExistCart);
    // return console.log(cart);
    for (let i = 0; i < cart.length; i++) {
      let object = {};
      object.product = cart[i]._id;
      object.count = cart[i].count;
      object.color = cart[i].color;
      let getPrice = await Product.findById(cart[i]._id).select("price").exec();
      // return console.log(object);
      // return console.log(getPrice);
      object.price = getPrice.price;
      products.push(object);
    }

    // console.log(products);
    let cartTotal = 0;
    // return console.log(products.length);
    for (let i = 0; i < products.length; i++) {
      // console.log(products[i]);
      cartTotal = cartTotal + products[i].price * products[i].count;
    }
    // return console.log(products, cartTotal);
    let newCart = await new Cart({
      products,
      cartTotal,
      orderby: user?._id,
    }).save();
    res.json(newCart);
  } catch (error) {
    throw new Error(error);
  }
});

const getUserCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const cart = await Cart.findOne({ orderby: _id }).populate(
      "products.product"
    );
    res.json(cart);
  } catch (error) {
    throw new Error(error);
  }
});
const emptyCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  // return console.log(req.user);
  validateMongoDbId(_id);
  try {
    const user = await User.findOne({ _id });
    // const cart = await Cart.findOneAndRemove();
    const cart = await Cart.findOneAndDelete({ orderby: user._id });
    res.json(cart);
  } catch (error) {
    throw new Error(error);
  }
});

const applyCoupon = asyncHandler(async (req, res) => {
  const { coupon } = req.body;

  // return console.log(coupon);
  const { _id } = req.user;
  validateMongoDbId(_id);
  const validCoupon = await Coupon.findOne({ name: coupon });
  // return console.log(validCoupon);
  if (validCoupon == null) {
    throw new Error("Invalid Coupon");
  }

  const user = await User.findOne({ _id });
  // console.log(user);
  let { cartTotal } = await Cart.findOne({
    orderby: user._id,
  }).populate("products.product");
  // return console.log(cartTotal);
  // return console.log(cartTotal * validCoupon.discount);
  let totalAfterDiscount =
    cartTotal - ((cartTotal * validCoupon.discount) / 100).toFixed(2);
  // return console.log(user._id);
  await Cart.findByIdAndUpdate(user._id, { totalAfterDiscount }, { new: true });
  res.json(totalAfterDiscount);
});

const createOrder = asyncHandler(async (req, res) => {
  const { COD, couponApplied } = req.body;
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    if (!COD) throw new Error("create cash order failed");
    const user = await User.findById(_id);
    let userCart = await Cart.findOne({ orderby: user._id });
    let finalAmout = 0;
    if (couponApplied && userCart.totalAfterDiscount) {
      finalAmout = userCart.totalAfterDiscount * 100;
    } else {
      finalAmout = userCart.cartTotal * 100;
    }
    let newOrder = await new Order({
      products: userCart.product,
      paymentIntent: {
        id: uniqid(),
        method: "COD",
        amount: finalAmout,
        status: "Cash on Delivery",
        created: Date.now(),
        currency: "usd",
      },
      orderby: user._id,
      orderStatus: "Cash on Delivery",
    }).save();
    let update = userCart.products.map((item) => {
      return {
        updateOne: {
          filter: { _id: item.product._id },
          update: { $inc: { quantity: item.count, $old: +item.count } },
        },
      };
    });
    const updated = await Product.bulkWrite(update, {});
    res.json({ message: "success" });
    // res.json(newOrder);
  } catch (error) {
    throw new Error(error);
  }
});

const getOrder = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  // return console.log(_id);
  try {
    const userOrders = await Order.find({ orderby: _id })
      .populate("products.product")
      .exec();
    res.json(userOrders);
  } catch (error) {
    throw new Error(error);
  }
});
const updatedOrderStatus = asyncHandler(async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;
    // return console.log(id);
    const updateOrder = await Order.findByIdAndUpdate(
      id,
      {
        orderStatus: status,
        paymentIntent: {
          status: status,
        },
      },
      {
        new: true,
      }
    );
    res.json(updateOrder);
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
  createAdmin,
  getwishList,
  saveAddress,
  userCart,
  getUserCart,
  emptyCart,
  applyCoupon,
  createOrder,
  getOrder,
  updatedOrderStatus,
};
