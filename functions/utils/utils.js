const jwt = require('jsonwebtoken');
require('dotenv').config();

// generate token
const generateToken = (user) => {
    return jwt.sign(
        {
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '1h',
        }
    );
};

// authenticate user
const isAuthenticated = (req, res, next) => {
    try {
        // check if authorization header is present
        const authorization = req.headers.authorization;

        // if authorization header is present
        if (authorization) {
            // get token from header
            const token = authorization.slice(7, authorization.length);

            // verify token
            jwt.verify(token, process.env.JWT_SECRET, (error, decode) => {
                // if error
                if (error) {
                    // send back error
                    res.status(401).send({
                        message: 'Invalid token.',
                    });
                } else {
                    // if not error
                    // append decoded user to req.user
                    req.user = decode;
                    // pass to next
                    next();
                }
            });
        } else {
            // else return error
            res.status(401).send({
                message: 'No token found.',
            });
        }
    } catch (error) {
        res.status(401).send({
            message: error,
        });
    }
};

module.exports = {
    generateToken,
    isAuthenticated,
};
