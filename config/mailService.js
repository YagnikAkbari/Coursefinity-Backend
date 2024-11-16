const nodemailer = require("nodemailer");

const transportorConfig = nodemailer.createTransport({
  secure: false,
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: process.env.APP_EMAIL,
    pass: process.env.APP_PASSWORD,
  },
});

module.exports = { transportorConfig };
