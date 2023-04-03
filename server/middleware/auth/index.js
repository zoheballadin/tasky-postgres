import jwt from "jsonwebtoken";
import config from "config"

const generateToken = (payload) =>{
  try {
    const token = jwt.sign(payload, config.get("JWT_SECRET"), {expiresIn: "24h"})
    return token
  } catch (error) {
    console.error(error)
    return
  }
}


const isAuthenticated = (req, res, next) => {
  try {
    let token = req.headers["auth-token"];
    let payload = jwt.verify(token, config.get("JWT_SECRET"));
    req.payload = payload;
    return next()
  } catch (err) {
    console.log(err);
    return res.status(401).json({ error: "Invalid Token / Token Expired" });
  }
};

export {isAuthenticated, generateToken}