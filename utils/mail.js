const { transportorConfig } = require("../config/mailService");

async function sendMail(senderEmail, content) {
  try {
    await transportorConfig.sendMail({
      from: process.env.APP_EMAIL,
      to: senderEmail,
      subject: "Important: Your account got reset",
      html: content,
    });
    return true;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

module.exports = { sendMail };
