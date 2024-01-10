const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/authmoiddleware");
const {
  createCoupon,
  getAllCoupon,
  getaCoupon,
  updateCoupon,
  deleteCoupon,
} = require("../controller/couponCtrl");

router.get("/", getAllCoupon);
router.get("/:id", authMiddleware, isAdmin, getaCoupon);

router.post("/", authMiddleware, isAdmin, createCoupon);
// //route for likes

router.put("/:id", authMiddleware, isAdmin, updateCoupon);
router.delete("/:id", deleteCoupon);

module.exports = router;
