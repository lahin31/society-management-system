const jwt = require("jsonwebtoken");

// generating access token
exports.generateAccessToken = (user = {}) => {
  return jwt.sign({}, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "168h",
  });
};
