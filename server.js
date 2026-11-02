require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ==========================================
// REAL-TIME PRICE FETCH (Binance API - No Limits)
// ==========================================
let cachedPrices = null;
let lastFetched = 0;
const CACHE_DURATION = 60000; // 1 minute

app.get('/api/market/prices', async (req, res) => {
    const now = Date.now();

    // Serve from cache if less than 60 seconds old
    if (cachedPrices && (now - lastFetched < CACHE_DURATION)) {
        return res.json(cachedPrices);
    }

    try {
        // Define the symbols we want to track (matching our frontend)
        const symbols = [
            "BTCUSDT", "ETHUSDT", "SOLUSDT", "BNBUSDT", "XRPUSDT",
            "ADAUSDT", "DOGEUSDT", "AVAXUSDT", "DOTUSDT", "LINKUSDT",
            "MATICUSDT", "SHIBUSDT", "LTCUSDT", "TRXUSDT", "UNIUSDT",
            "ATOMUSDT", "XLMUSDT", "NEARUSDT", "APTUSDT", "ARBUSDT",
            "OPUSDT", "FILUSDT", "INJUSDT", "SUIUSDT", "PEPEUSDT"
        ];
        
        const query = encodeURIComponent(JSON.stringify(symbols));
        const response = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbols=${query}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        
        if (!response.ok) throw new Error(`Binance Error: ${response.status}`);
        
        const data = await response.json();

        // Map Binance data to the format our frontend expects
        const formattedData = data.map(item => {
            const baseSymbol = item.symbol.replace('USDT', ''); // e.g. BTCUSDT -> BTC
            return {
                symbol: baseSymbol,
                current_price: parseFloat(item.lastPrice),
                price_change_percentage_24h: parseFloat(item.priceChangePercent)
            };
        });

        // Manually add USDT (since there is no USDT/USDT pair on Binance)
        formattedData.push({
            symbol: "USDT",
            current_price: 1.00,
            price_change_percentage_24h: 0.01
        });

        cachedPrices = formattedData; 
        lastFetched = now;   
        res.json(formattedData);

    } catch (error) {
        console.error("Price fetch error:", error.message);
        
        // Fallback: If API fails, use cached data or a static safe list
        if (cachedPrices) {
            return res.json(cachedPrices); 
        } else {
            // Hardcoded fallback so the site NEVER breaks
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

// Import Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/orders', require('./routes/order'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/wallet', require('./routes/auth')); 

// Serve Static Frontend Files
app.use(express.static(path.join(__dirname, 'public')));

// Catch-all route (Express 5 syntax)
app.get('/*splat', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Database Connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || process.env.DATABASE_URL;

if (MONGO_URI) {
    mongoose.connect(MONGO_URI)
        .then(() => console.log('✅ MongoDB Connected'))
        .catch(err => console.error('❌ MongoDB Connection Error:', err));
} else {
    console.log('⚠️ No MongoDB URI found.');
}

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
