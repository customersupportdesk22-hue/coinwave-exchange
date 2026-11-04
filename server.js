require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// ==========================================
// REAL-TIME PRICE FETCH (CoinPaprika - Top 200)
// ==========================================
let cachedPrices = null;
let lastFetched = 0;
const CACHE_DURATION = 60000; // 1 minute

app.get('/api/market/prices', async (req, res) => {
    const now = Date.now();
    if (cachedPrices && (now - lastFetched < CACHE_DURATION)) return res.json(cachedPrices);

    try {
        const response = await fetch('https://api.coinpaprika.com/v1/tickers?quotes=USD', {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
        });
        
        if (!response.ok) throw new Error(`CoinPaprika Error: ${response.status}`);
        
        const data = await response.json();

        // 1. Filter out bad/wrapped tokens
        const blacklist = ['USELESS', 'TRUMP', 'MEMECORE', 'CAP', 'PYUSD', 'FDUSD', 'TUSD', 'USDD', 'USDS', 'WBTC', 'WETH', 'STETH', 'CBETH', 'SUSDE', 'SUSDS', 'WSTETH', 'RETH'];
        const badNames = ['wrapped', 'staked', 'bridged', 'liquid staked', 'useless'];
        
        const cleanCoins = data.filter(item => {
            const sym = item.symbol.toUpperCase();
            const name = (item.name || '').toLowerCase();
            const price = item.quotes.USD.price;

            if (blacklist.includes(sym)) return false;
            if (badNames.some(bad => name.includes(bad))) return false;

            return true;
        });

        // 2. Take the top 200 coins
        const topCoins = cleanCoins.slice(0, 200).map(item => ({
            name: item.name || item.symbol,
            symbol: item.symbol.toUpperCase(),
            current_price: item.quotes.USD.price,
            price_change_percentage_24h: item.quotes.USD.percent_change_24h || 0
        }));

        cachedPrices = topCoins; 
        lastFetched = now;   
        res.json(topCoins);

    } catch (error) {
        console.error("API Disconnected, using Fallback:", error.message);
        if (cachedPrices) return res.json(cachedPrices);
        
        // Fallback list if API completely fails
        res.json([
            { name: 'Bitcoin', symbol: 'BTC', current_price: 65400.50, price_change_percentage_24h: 1.5 },
            { name: 'Ethereum', symbol: 'ETH', current_price: 3450.20, price_change_percentage_24h: 2.1 }
        ]);
    }
});

// Routes & Middleware
app.use('/api/auth', require('./routes/auth'));
app.use('/api/orders', require('./routes/order'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/wallet', require('./routes/auth')); 
app.use(express.static(path.join(__dirname, 'public')));
app.get('/*splat', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

// DB & Server
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || process.env.DATABASE_URL;

if (MONGO_URI) {
    mongoose.connect(MONGO_URI).then(() => console.log('✅ MongoDB Connected'));
}

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
