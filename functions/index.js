const functions = require("firebase-functions");
const express = require("express");
const mongoose = require("mongoose");
const productRouter = require("./routers/productRouter.js");
const dotenv = require("dotenv");

dotenv.config();

mongoose.connect(process.env.MONGODB_URI,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
})
    .then(()=>console.log("MongoDB connected."))
    .catch(error => console.log(error))

const app = express();
app.use(express.json());

app.use("/api/products", productRouter);

app.get("/", (req, res)=>{
  res.status(200).send("Server is ready.");
});

app.use((req, res, next) => {
    const error = new Error('Not found.');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message,
        },
    })
});

exports.app = functions.https.onRequest(app);
