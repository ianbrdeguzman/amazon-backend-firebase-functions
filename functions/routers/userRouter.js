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
userRouter.post('/signin', async (req, res, next) => {
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

// update user profile route
userRouter.put('/profile', async (req, res, next) => {
    try {
        // deconstruct id, name, email, password from req.body;
        const { userId, name, email, password } = req.body;

        // get user by id from db
        const user = await User.findById(userId);

        // if user is found
        if (user) {
            // change user name or current user name
            user.name = name || user.name;
            // change user email or current user email
            user.email = email || user.email;

            // if password is provided
            if (password) {
                // hash password
                user.password = await bcrypt.hash(password, 8);
            }

            // save updated user
            const updatedUser = await user.save();

            // send back updatedUser with token
            res.status(200).send({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin,
                token: generateToken(updatedUser),
            });
        } else {
            // if user is not found send error
            res.status(404).send({
                message: 'User not found.',
            });
        }
    } catch (error) {
        next(error);
    }
});

// get user route
userRouter.get('/:id', async (req, res, next) => {
    try {
        // get user by id from db
        const user = await User.findById(req.params.id);

        // if user is found return user
        if (user) {
            res.status(200).send(user);
            // if user is not found return error
        } else {
            res.status(404).send({
                message: 'User not found.',
            });
        }
    } catch (error) {
        // catch error
        next(error);
    }
});

module.exports = userRouter;
