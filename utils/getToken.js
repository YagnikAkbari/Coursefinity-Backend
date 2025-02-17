const jwt = require("jsonwebtoken");

function generateJwtToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION_TIME,
  });
}
module.exports = { generateJwtToken };
