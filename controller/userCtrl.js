const User = require("../moduls/userModel");

const createUser = async (req, res) => {
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
    res.json({
      msg: "User Already Exits",
      success: false,
    });
  }
};
const findUser = async (req, res) => {
  res.send("hello world");
};

module.exports = { createUser, findUser };
