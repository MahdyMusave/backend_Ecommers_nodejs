const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/authmoiddleware");
const {
  createBrand,
  getAllBrand,
  getBrand,
  updateBrand,
  deleteBrand,
} = require("../controller/brandCtrl");

router.get("/", getAllBrand);

router.get("/:id", authMiddleware, isAdmin, getBrand);

router.post("/", authMiddleware, isAdmin, createBrand);
// //route for likes

router.put("/:id", authMiddleware, isAdmin, updateBrand);
router.delete("/:id", deleteBrand);

module.exports = router;
