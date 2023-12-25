const express = require("express");
const router = express.Router();
const { createUser } = require("../controller/userCtrl");
const { createlogin } = require("../controller/userCtrl");
const { findUser } = require("../controller/userCtrl");
router.get("/", findUser);
router.post("/register", createUser);
router.post("/login", createlogin);
module.exports = router;
