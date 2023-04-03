import express from "express";
import User from "../../models/Users/index.js";
import config from "config";
import bcrypt from "bcrypt";
import Task from "../../models/Tasks/index.js";
import sendMail from "../../utils/mailer.js";

import {
  registerValidations,
  errorMiddleware,
  loginValidation,
} from "../../middleware/validations/index.js";

import { randomString } from "../../utils/index.js";
import { generateToken, isAuthenticated } from "../../middleware/auth/index.js";
import sendSMS from "../../utils/sendSMS.js";
const router = express.Router();

let URL = config.get("URL");
/*
User Signup 
API: /api/user/register
PUBLIC
validations: 
firstname cannot be empty and max length 30
email cannot be empty ...
...

Result: User is Signed up successfully and stored in our db


*/

router.post(
  "/register",
  registerValidations(),
  errorMiddleware,
  async (req, res) => {
    try {
      let { email, firstname, lastname, phone, password, address } = req.body;
      let findEmail = await User.findOne({ email: email });
      if (findEmail) {
        return res.status(409).json({ error: "User already exists" });
      }
      let hashedPassword = await bcrypt.hash(password, 12);

      let userverifyToken = {
        email: randomString(20),
        phone: randomString(20),
      };

      let user = new User({
        email,
        firstname,
        lastname,
        phone,
        password: hashedPassword,
        address,
        userverifyToken,
      });

      await user.save();
      await sendMail({
        text: `Use this link to verify your email: \n
        ${URL}/api/user/verify/email/${userverifyToken.email}`,
        subject: "Email verification",
        receiver: email,
      });
      await sendSMS({
        message: `Here is your verification link: \n
        ${URL}/api/user/verify/phone/${userverifyToken.phone}`,
        phone: phone,
      }).catch((err) => {
        return res.status(400).json({ error: "Invalid phone number" });
      });
      return res.status(200).json({ message: "User registered successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.post("/login", loginValidation(), errorMiddleware, async (req, res) => {
  try {
    let { email, password } = req.body;
    let findEmail = await User.findOne({ email: email });
    if (!findEmail) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!findEmail.isVerified.email) {
      return res.status(403).json({ error: "Please verify your email first" });
    }

    let match = await bcrypt.compare(password, findEmail.password);
    if (!match) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    let payload = {
      id: findEmail._id,
      role: findEmail.role,
    };

    let token = generateToken(payload);
    return res.status(200).json({
      message: "Logged in Successfully",
      token,
      role: findEmail.role,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/auth", isAuthenticated, (req,res)=>{
  try {
    return res.status(200).json(req.payload)
  } catch (error) {
    console.log(error);
    return res.status(500).json({error: "Internal server error"})
  }
})

router.get("/verify/email/:emailtoken", async (req, res) => {
  try {
    let token = req.params.emailtoken;
    let findUser = await User.findOne({ "userverifyToken.email": token });
    if (!findUser) {
      return res.status(400).json({ error: "User does not exist" });
    }
    await User.updateOne(
      { "userverifyToken.email": token },
      { $set: { "isVerified.email": true } }
    );
    return res.status(200).json({ success: "Email verification Successfuly" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/verify/phone/:phonetoken", async (req, res) => {
  try {
    let token = req.params.phonetoken;
    let findUser = await User.findOne({ "userverifyToken.phone": token });
    if (!findUser) {
      return res.status(400).json({ error: "User does not exist" });
    }
    await User.updateOne(
      { "userverifyToken.phone": token },
      { $set: { "isVerified.phone": true } }
    );
    return res.status(200).json({ success: "Phone verification Successfuly" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/resend/email", async (req, res) => {
  try {
    let email = req.body.email;
    let findUser = await User.findOne({ email: email });
    if (!findUser) {
      return res.status(401).json({ error: "User does not exist" });
    }
    let token = findUser.userverifyToken.email;
    await sendMail({
      text: `Use this link to verify your email: \n
        ${URL}/api/user/verify/email/${token}`,
      subject: "Email verification",
      receiver: email,
    });

    return res.status(200).json({ message: "Email verification mail resent" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/resend/phone", async (req, res) => {
  try {
    let phone = req.body.phone;
    let findUser = await User.findOne({ phone: phone });
    if (!findUser) {
      return res.status(401).json({ error: "User does not exist" });
    }
    let token = findUser.userverifyToken.phone;
    await sendSMS({
      message: `Here is your verification link: \n
        ${URL}/api/user/verify/phone/${token}`,
      phone: phone,
    });

    return res.status(200).json({ message: "Verification SMS resent" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/tasks", isAuthenticated, async (req, res) => {
  try {
    let user = await User.findOne({ _id: req.payload.id });
    if (!user) {
      return res.status(400).json({ error: "User does not exist" });
    }
    let tasks = await Task.find({ user: user._id });
    return res.status(200).json(tasks);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
