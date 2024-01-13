const express = require("express");
const router = express.Router();
const {
  createUser,
  createlogin,
  getAllUser,
  getSingleUser,
  deleteUser,
  updateUser,
  blockedUser,
  unblockUser,
  handleRefreshToken,
  logout,
  updatePassword,
  forgotPasswordToken,
  createAdmin,
  getwishList,
} = require("../controller/userCtrl");

const { authMiddleware, isAdmin } = require("../middlewares/authmoiddleware");
//route for post
router.post("/register", createUser);
router.post("/login", createlogin);
router.post("/admin-login", createAdmin);
//change and update password
router.put("/password", authMiddleware, updatePassword);
//forgot password send email;
router.post("/forgotPassword", forgotPasswordToken);
//router for get
router.get("/refresh", handleRefreshToken);
router.get("/logout", logout);
router.get("/all-users", getAllUser);
router.get("/whishList", authMiddleware, getwishList);
router.get("/:id", authMiddleware, isAdmin, getSingleUser);
// router for delete
router.delete("/:id", deleteUser);
// router for delete
router.put("/edit-user", authMiddleware, updateUser);
router.put("/block-user/:id", authMiddleware, isAdmin, blockedUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser);
module.exports = router;
