const jwt = require("jsonwebtoken");
const SECRET_KEY = "USER";
const {db} = require("../database/config")


const auth = (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (token) {
      token = token.split(" ")[1];
      let user = jwt.verify(token, SECRET_KEY);
      req.userPhone_number = user.phone_number;
      req.userOtp = user.otp;
      next();
    } else {
      res.status(401).json({ message: "unauthorised user" });
    }
  } catch (error) {
    if (error) console.log(error);
    res.status(401).json({ message: "unauthorised user" });
  }
};

module.exports = auth;
