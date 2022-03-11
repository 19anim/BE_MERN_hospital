const express = require('express');
const jwtConfig = require('../config/jwt.config')
const MW_register = require('../middleware/register.middleware')
const User = require('../model/user.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const router = express.Router();

router.post('/register', [MW_register.checkEmpty, MW_register.checkDuplicated], async (req, res) => {
    //@desc Get the payload infomation
    const { username, email, password, isAdmin } = req.body;

    //Everything is ok
    try {
        const hash_password = bcrypt.hashSync(password, 8)
        const newUser = new User({ username, email, password: hash_password, isAdmin })
        await newUser.save();

        const access_token = await jwt.sign({ userID: newUser._id }, jwtConfig.SECRECTKEY)

        return res.status(200).json({ isSuccess: true, message: "User is created successfully", access_token })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ message: "INTERNAL SERVICE ERROR" })
    }

})

module.exports = router;