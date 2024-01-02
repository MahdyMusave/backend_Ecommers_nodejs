const nodemailer = require("nodemailer");
const asyncHandler = require("express-async-handler");

const sendEmail = asyncHandler(async (data, req, res) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAIL_ID,
      pass: process.env.PM,
    },
  });

  async function main() {
    const info = await transporter.sendMail({
      from: '"your email address" <musavemahdy@gmail.com>',
      to: data.to, // list of receivers
      subject: data.subject, //subject line
      text: data.text, //plain text body
      html: data.htm,//html body
    });
  }
});

module.exports = sendEmail;
