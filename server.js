require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

// ==========================================
// REAL-TIME PRICE FETCH (Filtered Top 200)
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
        const response = await fetch('https://api.coincap.io/v2/assets?limit=200', {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        
        if (!response.ok) throw new Error(`CoinCap Error: ${response.status}`);
        
        const json = await response.json();
        const data = json.data;

        // FILTER: Remove wrapped tokens, staked tokens, and tokenized stocks
        const cleanCoins = data.filter(item => {
            const sym = item.symbol.toUpperCase();
            const name = item.name ? item.name.toLowerCase() : '';

            // 1. Remove symbols that are too long (usually wrapped tokens)
            if (sym.length > 5) return false;
            
            // 2. Remove known wrapped/staked/stock prefixes
            if (sym.startsWith('W') || sym.startsWith('ST') || sym.includes('V2') || sym.includes('.E') || sym.includes('-')) return false;
            
            // 3. Remove tokenized stocks/ETFs (e.g., NVDAX, AAPLX)
            if (name.includes('tokenized') || name.includes('stock') || name.includes('etf')) return false;

            // 4. Ensure the price is valid
            if (!item.priceUsd || parseFloat(item.priceUsd) === 0) return false;

            return true;
        });

        const topCoins = cleanCoins.map(item => {
            return {
                name: item.name,
                symbol: item.symbol.toUpperCase(),
                current_price: parseFloat(item.priceUsd),
                price_change_percentage_24h: parseFloat(item.changePercent24Hr) || 0
            };
        });

        cachedPrices = topCoins; 
        lastFetched = now;   
        res.json(topCoins);

    } catch (error) {
        console.error("Price fetch error:", error.message);
        if (cachedPrices) {
            return res.json(cachedPrices); 
        } else {
            res.json([
                { name: 'Bitcoin', symbol: 'BTC', current_price: 65000, price_change_percentage_24h: 1.5 }
            ]);
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
