const express = require("express");
const router = express.Router();
const { createUser } = require("../controller/userCtrl");
const { createlogin } = require("../controller/userCtrl");
const { getAllUser } = require("../controller/userCtrl");
const { getSingleUser } = require("../controller/userCtrl");
const { deleteUser } = require("../controller/userCtrl");
const { updateUser } = require("../controller/userCtrl");

//route for post
router.post("/register", createUser);
router.post("/login", createlogin);

//router for get
router.get("/all-users", getAllUser);
router.get("/:id", getSingleUser);

// router for delete
router.delete("/:id", deleteUser);
// router for delete
router.put("/:id", updateUser);
module.exports = router;
