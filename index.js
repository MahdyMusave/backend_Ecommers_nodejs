const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const authRouter = require("./router/authRoute");
const PORT = process.env.PORT || 4000;
const db = require("./config/db_connection");
const bodyParser = require("body-parser");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const cookieParser = require("cookie-parser");
const product = require("./router/productRoute");
const blog = require("./router/blogRoute");
const category = require("./router/categoryRoute");
const brand = require("./router/brandRoute");
const blogCategory = require("./router/blogCatRoute");
const coupon = require("./router/couponRoute");
const morgan = require("morgan");

db();

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/user", authRouter);
app.use("/api/product", product);
app.use("/api/blog", blog);
app.use("/api/category", category);
app.use("/api/brand", brand);
app.use("/api/blogCategory", blogCategory);
app.use("/api/coupon", coupon);

// app.use("/", (req, res) => {
//   res.send("hello from server");
// });
app.use(notFound);
app.use(errorHandler);
app.listen(6000, () => {
  console.log(`server is running on port ${PORT}`);
});
