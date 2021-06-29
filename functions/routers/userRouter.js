const express = require('express');
const User = require('../models/userModel.js');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/utils.js');

const userRouter = express.Router();

userRouter.post('/register', async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const user = new User({
            name: name,
            email: email,
            password: await bcrypt.hash(password, 8),
        });

        const createdUser = await user.save();

        res.status(200).send({
            _id: createdUser._id,
            name: createdUser.name,
            email: createdUser.email,
            isAdmin: createdUser.isAdmin,
            token: generateToken(createdUser),
        });
    } catch (error) {
        next(error);
    }
});

module.exports = userRouter;
