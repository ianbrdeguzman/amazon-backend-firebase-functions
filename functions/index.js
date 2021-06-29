const functions = require('firebase-functions');
const express = require('express');
const mongoose = require('mongoose');

const productRouter = require('./routers/productRouter.js');
const userRouter = require('./routers/userRouter.js');

const dotenv = require('dotenv');

dotenv.config();

// connect to MongoDB
mongoose
    .connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
    })
    .then(() => console.log('MongoDB connected.'))
    .catch((error) => console.log(error));

// initialize express app
const app = express();
app.use(express.json());

// product router
app.use('/api/product', productRouter);

// user router
app.use('/api/user', userRouter);

app.get('/', (req, res) => {
    res.status(200).send('Server is ready.');
});

// catch 404 url
app.use((req, res, next) => {
    const error = new Error('Not found.');
    error.status = 404;
    next(error);
});

// catch error
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message,
        },
    });
});

exports.app = functions.https.onRequest(app);
