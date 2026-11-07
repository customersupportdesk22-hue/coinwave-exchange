const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

router.post('/create', async (req, res) => {
    try {
        const { mode, sendAmount, sendCurrency, userEmail, sellType } = req.body;

        if (mode === 'sell' && sellType !== 'external') {
            const amtToSell = parseFloat(String(sendAmount).replace(/[^0-9.]/g, "")) || 0;
            const symbol = sendCurrency.toUpperCase();

            const orders = await Order.find({ userEmail });
            let availableBalance = 0;
            
            orders.forEach(o => {
                const sym = o.getCurrency ? o.getCurrency.toUpperCase() : '';
                if (sym === symbol) {
                    const amt = parseFloat(String(o.getAmount).replace(/[^0-9.]/g, "")) || 0;
                    if (o.status === 'approved' && o.mode === 'buy') availableBalance += amt;
                    if (o.status === 'approved' && o.mode === 'sell') availableBalance -= amt;
                    if (o.status === 'pending' && o.mode === 'sell') availableBalance -= amt;
                }
            });

            if (availableBalance < amtToSell) {
                return res.status(400).json({ message: `Insufficient balance. You only have ${availableBalance.toFixed(6)} ${symbol} available.` });
            }
        }

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
