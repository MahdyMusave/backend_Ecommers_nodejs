const mongoose = require("mongoose");
const dbConnect = () => {
  try {
    const conn = mongoose.connect(process.env.MONGODB_url);
    console.log("Database Connected");
  } catch (err) {
    // throw new Error(err);
    console.log("Database error");
  }
};

module.exports = dbConnect;
