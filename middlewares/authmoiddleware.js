const User = require("../moduls/userModel");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    // console.log(req.headers.authorization);
    token = req.headers.authorization.split(" ")[1];

    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log(decoded);
        const user = await User.findById(decoded?.id);
        req.user = user;
        next();
      }
    } catch (err) {
      throw new Error("Not Authorized token expired, Please login agin");
    }
  } else {
    throw new Error("there is no token attached to header");
  }
});
isAdmin = asyncHandler(async (req, res, next) => {
  // console.log(req.user);
  const { email } = await req.user;
  const aminUser = await User.findOne({ email });
  if (aminUser.role !== "admin") {
    throw new Error("you are not an admin");
  } else {
    next();
  }
});

module.exports = { authMiddleware, isAdmin };
