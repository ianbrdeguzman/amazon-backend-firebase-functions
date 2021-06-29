const express = require('express');
const Product = require('../models/productModel.js');

const productRouter = express.Router();

productRouter.get('/', async (req, res, next) => {
    try {
        // fetch products from db
        const products = await Product.find({});

        // send back products
        res.status(200).send(products);
    } catch (error) {
        // catch error
        next(error);
    }
});

productRouter.get('/:id', async (req, res, next) => {
    try {
        // get product by id from db
        const product = await Product.findById(req.params.id);

        // if product exist return product
        if (product) {
            res.json(product);
        } else {
            // else return error
            res.status(404).send({ message: 'Product not found.' });
        }
    } catch (error) {
        // catch error
        next(error);
    }
});

module.exports = productRouter;
