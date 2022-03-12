const User = require("../model/user.model");

function checkEmpty(req, res, next) {
  //@desc if payload contains valid value for username || password || email
  const { username, email, password } = req.body;
  if (!username || !password || !email)
    return res
      .status(401)
      .json({ isSuccess: false, message: "Fields are not completely filled" });
  next();
}

function checkDuplicated(req, res, next) {
  //@desc if username || email is existed
  const { username, email } = req.body;
  User.findOne({ username }, (err, user) => {
    if (err) throw err;
    if (user)
      return res
        .status(401)
        .json({ isSuccess: false, message: "username is existed" });

    User.findOne({ email }, (err, user) => {
      if (err) throw err;
      if (user)
        return res
          .status(401)
          .json({ isSuccess: false, message: "email is existed" });
      next();
    });
  });
}

const MW_register = {
  checkDuplicated,
  checkEmpty,
};

module.exports = MW_register;
