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
} = require("../controller/userCtrl");

const { authMiddleware, isAdmin } = require("../middlewares/authmoiddleware");
//route for post
router.post("/register", createUser);
router.post("/login", createlogin);
//change and update password
router.put("/password", authMiddleware, updatePassword);
//router for get
router.get("/refresh", handleRefreshToken);
router.get("/logout", logout);
router.get("/all-users", getAllUser);
router.get("/:id", authMiddleware, isAdmin, getSingleUser);

// router for delete
router.delete("/:id", deleteUser);
// router for delete
router.put("/edit-user", authMiddleware, updateUser);
router.put("/block-user/:id", authMiddleware, isAdmin, blockedUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser);
module.exports = router;
