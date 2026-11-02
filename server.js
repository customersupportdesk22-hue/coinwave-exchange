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
// REAL-TIME PRICE CACHE (Bypasses API Limits & Cloud Blocks)
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

    // Otherwise, fetch fresh data from CoinGecko
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=26&page=1&sparkline=false', {
            headers: {
                'Accept': 'application/json',
                // This header tricks CoinGecko into thinking it's a real browser, not a bot
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        
        if (!response.ok) {
            throw new Error(`CoinGecko Error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        cachedPrices = data; 
        lastFetched = now;   
        res.json(data);
    } catch (error) {
        console.error("Price fetch error:", error.message);
        
        // If the API fails but we have old data, serve the old data so the site doesn't break
        if (cachedPrices) {
            return res.json(cachedPrices);
        }
        
        // If there is no old data, send the exact error to the frontend for debugging
        res.status(500).json({ error: error.message });
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
    console.log('⚠️ No MongoDB URI found in environment variables.');
}

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
