const express = require("express");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const router = require("express").Router();
const User = require("../model/User");
const sendEmail = require("../utils/email");
const { registerValidation, loginValidation } = require("../validation");

router.use(express.static("views"));

router.get("/register", (req, res) => {
  res.render("register.ejs");
});

router.get("/login", (req, res) => {
  res.render("login.ejs");
});

router.get("/forgotPassword", async (req, res) => {
  res.render("forgotPassword.ejs", {});
});

router.get("/resetPassword/:token", async (req, res) => {
  res.render("resetPassword.ejs", {});
});

router.post("/resetPassword/:token", async (req, res) => {
  {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
    });
    console.log(user);
    user.password = req.body.password;
    user.passwordResetToken = undefined;
    await user.save();

    try {
      const savedUser = await user.save();

      const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, {
        expiresIn: 7200,
      });
      res.cookie("jwt", token);
      res.redirect("/");
    } catch (error) {
      console.log(error);
    }
  }
});

router.post("/register", async (req, res) => {
  const { error } = registerValidation(req.body);
  if (error) return res.render("registerError.ejs");

  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.render("registerError.ejs");

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });

  try {
    const savedUser = await user.save();
    res.redirect("/");
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, {
      expiresIn: 7200,
    });
    res.cookie("jwt", token);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/login", async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) return res.render("loginError.ejs");

  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.render("loginError.ejs");

  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.render("loginError.ejs");

  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, {
    expiresIn: 3600,
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  });
  if (user.email === "lorenzo@mail.com") {
    res.cookie("admin", true, {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });
  }
  res.cookie("username", user.name, {
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  });
  res.cookie("userID", user._id, {
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  });
  /* res.header('user', ({user: user})) */
  res.redirect("/");
});

router.post("/forgotPassword", async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    console.log("error");
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/user/resetPassword/${resetToken}`;
  console.log(resetToken);
  const message = `Password token: ${resetURL}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password Reset Token",
      message,
    });
  } catch (err) {
    console.log(err);
  }
  res.render("forgotPassword");
});

router.patch("/resetPassword/:token", async (req, res, next) => {});

module.exports = router;
