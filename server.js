require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

// ==========================================
// REAL-TIME PRICE FETCH (CoinCap API - No limits, No blocks)
// ==========================================
let cachedPrices = null;
let lastFetched = 0;
const CACHE_DURATION = 60000; // 1 minute

app.get('/api/market/prices', async (req, res) => {
    const now = Date.now();

    if (cachedPrices && (now - lastFetched < CACHE_DURATION)) {
        return res.json(cachedPrices);
    }

    try {
        // Fetch top 30 assets from CoinCap
        const response = await fetch('https://api.coincap.io/v2/assets?limit=30', {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        
        if (!response.ok) throw new Error(`CoinCap Error: ${response.status}`);
        
        const json = await response.json();
        const data = json.data;

        // Map CoinCap data to the format our frontend expects
        const formattedData = data.map(item => {
            return {
                symbol: item.symbol.toUpperCase(),
                current_price: parseFloat(item.priceUsd),
                price_change_percentage_24h: parseFloat(item.changePercent24Hr) || 0
            };
        });

        // Ensure USDT is in the list (CoinCap sometimes doesn't return stablecoins in top 30)
        if (!formattedData.find(d => d.symbol === 'USDT')) {
            formattedData.push({ symbol: "USDT", current_price: 1.00, price_change_percentage_24h: 0.01 });
        }

        cachedPrices = formattedData; 
        lastFetched = now;   
        res.json(formattedData);

    } catch (error) {
        console.error("Price fetch error:", error.message);
        if (cachedPrices) {
            return res.json(cachedPrices); 
        } else {
            // Fallback if completely down
            const fallback = [
                { symbol: 'BTC', current_price: 65000, price_change_percentage_24h: 1.5 },
                { symbol: 'ETH', current_price: 3400, price_change_percentage_24h: 1.2 },
                { symbol: 'SOL', current_price: 150, price_change_percentage_24h: 5.0 },
                { symbol: 'USDT', current_price: 1.0, price_change_percentage_24h: 0.0 }
            ];
            res.json(fallback);
        }
    }
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/orders', require('./routes/order'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/wallet', require('./routes/auth')); 

app.use(express.static(path.join(__dirname, 'public')));

app.get('/*splat', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || process.env.DATABASE_URL;

if (MONGO_URI) {
    mongoose.connect(MONGO_URI)
        .then(() => console.log('✅ MongoDB Connected'))
        .catch(err => console.error('❌ MongoDB Connection Error:', err));
}

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
