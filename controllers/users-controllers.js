require("dotenv").config();
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");

const User = require("../models/user");

//get user by Id

const getUserById = async (req, res, next) => {
  const userId = req.userData.userId;
  let user;
  try {
    user = await User.findById(userId, "-password");
  } catch (err) {
    return res
      .status(500)
      .json({ msg: "Fetching user failed, please try again later." });
  }

  if (!user) {
    return res.status(500).json({ msg: "User does'nt exist" });
  }
  res.status(200).json({ user: user.toObject({ getters: true }) });
};

//

const getPdf = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ msg: "Invalid inputs, please check your data." });
  }
  const userId = req.userData.userId;
  let user;
  try {
    user = await User.findById(userId, "-password");
  } catch (err) {
    return res
      .status(500)
      .json({ msg: "Fetching user failed, please try again later." });
  }

  if (!user) {
    return res.status(500).json({ msg: "User does'nt exist" });
  }

  const pdfPath = user.resume;
  fs.readFile(pdfPath, (err, data) => {
    if (err) {
      return res.status(500).send("Error loading PDF file");
    }
    res.contentType("application/pdf");
    res.send(data);
  });
};

// signup
const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ msg: "Invalid inputs, please check your data." });
  }

  const { name, email, password, resume } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return res.status(500).json({ msg: "Sign up failed, please try again." });
  }

  if (existingUser) {
    return res
      .status(422)
      .json({ msg: "User exists already, please login instead." });
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    return res.status(500).json({ msg: "Sign up failed, please try again." });
  }

  const createdUser = new User({
    name,
    email,
    resume: req.file.path,
    password: hashedPassword,
  });

  try {
    await createdUser.save();
  } catch (err) {
    return res.status(500).json({ msg: "Sign up failed, please try again." });
  }

  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      process.env.SECRET,
      { expiresIn: "1h" }
    );
  } catch (err) {
    return res.status(500).json({ msg: "Sign up failed, please try again." });
  }
  res
    .status(201)
    .json({ userId: createdUser.id, email: createdUser.email, token: token });
};

// login

const login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ msg: "Invalid inputs, please check your data." });
  }

  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return res.status(500).json({ msg: "Log in failed, please try again." });
  }

  if (!existingUser) {
    return res
      .status(403)
      .json({ msg: "Invalid credentials, could not log you in." });
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    return res
      .status(500)
      .json({ msg: "Invalid credentials, could not log you in." });
  }

  if (!isValidPassword) {
    return res
      .status(403)
      .json({ msg: "Invalid credentials, could not log you in." });
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      process.env.SECRET,
      { expiresIn: "1h" }
    );
  } catch (err) {
    return res
      .status(500)
      .json({ msg: "Log in failed, please try again later." });
  }
  res.json({
    userId: existingUser.id,
    email: existingUser.email,
    token: token,
  });
};

exports.getPdf = getPdf;
exports.signup = signup;
exports.getUserById = getUserById;
exports.login = login;
