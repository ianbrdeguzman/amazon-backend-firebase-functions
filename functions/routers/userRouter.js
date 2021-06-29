const express = require('express');
const User = require('../models/userModel.js');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/utils.js');

const userRouter = express.Router();

// register route
userRouter.post('/register', async (req, res, next) => {
    try {
        // deconstruct name, email and password
        const { name, email, password } = req.body;

        // create new User and hash password
        const user = new User({
            name: name,
            email: email,
            password: await bcrypt.hash(password, 8),
        });

        // save created user
        const createdUser = await user.save();

        // send back user with token
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

// login route
userRouter.post('/signin', async (req, res) => {
    try {
        // deconstruct email and password from req.body
        const { email, password } = req.body;

        // fetch user from db using email
        const user = await User.findOne({ email });

        // if user is found
        if (user) {
            // compare user password
            if (await bcrypt.compare(password, user.password)) {
                // send user with token
                res.status(200).send({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    isAdmin: user.isAdmin,
                    token: generateToken(user),
                });
                return;
            }
            // if user is not found
        } else if (!user) {
            res.status(401).send({
                message: 'We cannot find an account with that e-mail address.',
            });
        }

        // if user is found but invalid password
        res.status(401).send({
            message: 'You might have entered a wrong password.',
        });
    } catch (error) {
        next(error);
    }
});

module.exports = userRouter;
