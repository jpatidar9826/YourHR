const express = require("express");
const { check } = require("express-validator");

const checkAuth = require("../middleware/check-auth");
const fileUpload = require("../middleware/file-upload");

const router = express.Router();
const usersController = require("../controllers/users-controllers");

router.post(
  "/signup",
  fileUpload.single("resume"),
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  usersController.signup
); // signup

router.post(
  "/login",
  [
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  usersController.login
); // login

router.use(checkAuth);

router.get("/pdf/:uid", usersController.getPdf);

router.get("/:uid", usersController.getUserById); //get a user by id

module.exports = router;
