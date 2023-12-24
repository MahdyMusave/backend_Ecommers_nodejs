const express = require("express");
const { createUser } = require("../controller/userCtrl");
const router = express.Router();
const { findUser } = require("../controller/userCtrl");
router.get("/", findUser);
router.post("/register", createUser);
module.exports = router;
