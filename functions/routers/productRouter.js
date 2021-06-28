const express = require("express");
const Product = require("../models/productModel.js");

const productRouter = express.Router();

productRouter.get("/", async (req, res, next) => {
    try {
        const products = await Product.find({});
        res.status(200).send(products);
    } catch (error) {
        next(error)
    }
    
});

productRouter.get("/:id", async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).send({message: "Product not found."});
        }
    } catch (error) {
        next(error)
    }
    
});

module.exports = productRouter;