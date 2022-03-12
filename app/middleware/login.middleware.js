const User = require("../model/user.model");

function checkEmpty(req, res, next) {
  const { username } = req.body;
  if (!username)
    return res
      .status(401)
      .json({ loginSuccess: false, message: "Please input login information" });
  next();
}

const MW_login = {
  checkEmpty,
};

module.exports = MW_login;
