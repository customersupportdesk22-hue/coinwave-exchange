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

// ==========================================
// GET USER ORDERS (For Transaction History)
// ==========================================
router.get("/user/:email", async (req, res) => {
    try {
        const orders = await Order.find({ userEmail: req.params.email }).sort({ _id: -1 });
        res.json(orders);
    } catch (e) {
        res.status(500).json({ message: "Error fetching user orders" });
    }
});
