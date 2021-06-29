const express = require('express');
const Order = require('../models/orderModel.js');
const { isAuthenticated } = require('../utils/utils.js');

const orderRouter = express.Router();

// post a new order route
orderRouter.post('/', isAuthenticated, async (req, res, next) => {
    try {
        // deconstruct data from req.body
        const {
            orderItems,
            shippingDetails,
            paymentMethod,
            itemPrice,
            shippingPrice,
            taxPrice,
            totalPrice,
        } = req.body;

        // check if cart is empty
        if (orderItems.length === 0) {
            // return error
            res.status(400).send({
                message: 'Cart is empty.',
            });
        } else {
            // if cart not empty create new order
            const order = new Order({
                orderItems,
                shippingDetails,
                paymentMethod,
                itemPrice,
                shippingPrice,
                taxPrice,
                totalPrice,
                user: req.user._id, // from isAuthenticated middleware
            });

            // save order to db
            const createdOrder = await order.save();

            // send back order
            res.status(200).send({
                message: 'New order created',
                order: createdOrder,
            });
        }
    } catch (error) {
        // catch error
        next(error);
    }
});

// get users orders route
orderRouter.get('/mine', isAuthenticated, async (req, res, next) => {
    try {
        // get orders from db by user id
        const orders = await Order.find({
            user: req.user._id, // from isAuthenticated middleware
        });

        console.log(orders);

        // if order is found
        if (orders) {
            // send order back
            res.status(200).send(orders);
        } else {
            // if not send error
            res.status(404).send({
                message: 'No orders found.',
            });
        }
    } catch (error) {
        // catch error
        next(error);
    }
});

// get order by id route
orderRouter.get('/:id', isAuthenticated, async (req, res, next) => {
    try {
        // get order from db by id
        const order = await Order.findById(req.params.id);

        // if order is found
        if (order) {
            res.status(200).send(order);
        } else {
            // if not return error
            res.status(404).send({
                message: 'Order not found.',
            });
        }
    } catch (error) {
        // catch error
        next(error);
    }
});

// pay for order by id route
orderRouter.put('/:id/pay', isAuthenticated, async (req, res, next) => {
    try {
        // deconstruct req.body
        const { id, status, update_time, email_address } = req.body;

        // get order by id from db
        const order = await Order.findById(req.params.id);

        // if order is found
        if (order) {
            order.isPaid = true;
            order.paidAt = new Date();
            order.paymentResult = {
                id,
                status,
                update_time,
                email_address,
            };

            // save updated order to db
            const updatedOrder = await order.save();

            // send back updated order
            res.status(200).send({
                message: 'Order paid.',
                order: updatedOrder,
            });
        } else {
            // if not found send back error
            res.status(404).send({
                message: 'Order not found.',
            });
        }
    } catch (error) {
        // catch error
        next(error);
    }
});

module.exports = orderRouter;
