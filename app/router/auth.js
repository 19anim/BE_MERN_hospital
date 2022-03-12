const express = require("express");
const jwtConfig = require("../config/jwt.config");
const MW_register = require("../middleware/register.middleware");
const MW_login = require("../middleware/login.middleware");
const User = require("../model/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

//@desc register new account
router.post(
  "/register",
  [MW_register.checkEmpty, MW_register.checkDuplicated],
  async (req, res) => {
    //@desc Get the payload infomation
    const { username, email, password, isAdmin } = req.body;

    //Everything is ok
    try {
      const hash_password = bcrypt.hashSync(password, 8);
      const newUser = new User({
        username,
        email,
        password: hash_password,
        isAdmin,
      });
      await newUser.save();

      var access_token = jwt.sign(
        { userID: newUser._id },
        jwtConfig.SECRECTKEY
      );

      return res.status(200).json({
        isSuccess: true,
        message: "User is created successfully",
        access_token,
      });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ message: "INTERNAL SERVICE ERROR" });
    }
  }
);

//@desc login and send access token
router.post("/login", MW_login.checkEmpty, async (req, res) => {
  const { username, password } = req.body;

  //Everything is ok
  try {
    User.findOne({ username }, (err, user) => {
      if (err) throw err;

      if (user) {
        var validPassword = bcrypt.compareSync(password, user.password);

        //@desc check if password is right
        if (validPassword) {
          var access_token = jwt.sign(
            { userID: user._id },
            jwtConfig.SECRECTKEY
          );
          return res.status(200).json({
            loginSuccess: true,
            message: "Login successfully",
            access_token: access_token,
          });
        }

        //@desc password is wrong
        else {
          return res.status(401).json({
            loginSuccess: false,
            message: "Username or password is incorrect",
          });
        }
      }
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "INTERNAL SERVICE ERROR" });
  }
});

module.exports = router;
