const nodemailer = require("nodemailer");
const asyncHandler = require("express-async-handler");

const sendEmail = asyncHandler(async (req, res) => {
  var smtpConfig = {
    host: "smtp.gmail.com",
    port: 587,
    secure: true, // use SSL
    auth: {
      user: "mahdymusave@gmail.com",
      pass: "maHDE2582754",
    },
  };
  var transporter = nodemailer.createTransport(smtpConfig);

  const mailOptions = {
    from: "musavemahdy13725@gmail.com",
    to: "musavemahdy@gamil.com",
    subject: "Sending Email using Node.js",
    text: "That was easy!",
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
});

module.exports = sendEmail;
