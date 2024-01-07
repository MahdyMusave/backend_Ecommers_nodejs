const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      require: true,
    },
    lastname: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    role: {
      type: String,
      default: "user",
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    cart: {
      type: Array,
      default: [],
    },
    address: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
      },
    ],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    refreshToken: {
      token: String,
    },
    passwordChangeAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSaltSync(10);
  this.password = await bcrypt.hash(this.password, salt);
});
userSchema.methods.isPasswordMatched = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

 userSchema.methods.createPasswordResetToken = async function () {
   const resetToken = crypto.randomBytes(32).toString("hex");
   this.passwordResetToken = crypto
     .createHmac("sha256", process.env.JWT_SECRET)
     .update(resetToken)
     .digest("hex");
   this.passwordResetExpires = Date.now() + 30 * 60 * 1000; // 10 minutes
   return resetToken;
 };
module.exports = mongoose.model("User", userSchema);
