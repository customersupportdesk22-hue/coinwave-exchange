const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

router.post('/create', async (req, res) => {
    try {
        const newOrder = new Order({
            orderId: "ORD-" + Math.floor(Math.random() * 1000000),
            ...req.body, status: 'pending', date: new Date().toLocaleString()
        });
        await newOrder.save();
        res.status(201).json({ message: "Success", orderId: newOrder.orderId });
    } catch (e) { res.status(500).json({ message: "Error" }); }
});
module.exports = router;
