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
// 1. REAL-TIME PRICE FETCH (CoinPaprika - Top 200)
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
        const response = await fetch('https://api.coinpaprika.com/v1/tickers?quotes=USD', {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
        });
        
        if (!response.ok) throw new Error(`CoinPaprika Error: ${response.status}`);
        
        const data = await response.json();

        // Filter: Remove wrapped tokens, staked tokens, meme coins, and weird symbols
        const blacklist = ['USELESS', 'TRUMP', 'MEMECORE', 'CAP', 'PYUSD', 'FDUSD', 'TUSD', 'USDD', 'USDS', 'WBTC', 'WETH', 'STETH', 'CBETH', 'SUSDE', 'SUSDS', 'WSTETH', 'RETH', 'USDE', 'BFUSD', 'USDF'];
        const badNames = ['wrapped', 'staked', 'bridged', 'liquid staked', 'useless', 'meme'];

        const cleanCoins = data.filter(item => {
            const sym = item.symbol.toUpperCase();
            const name = (item.name || '').toLowerCase();
            const price = item.quotes.USD.price;
            
            if (!price || price === 0) return false;
            if (blacklist.includes(sym)) return false;
            if (badNames.some(bad => name.includes(bad))) return false;
            
            // Legacy checks
            if (sym.startsWith('W') && sym.length > 3) return false; // WBTC, WETH
            if (sym.startsWith('ST') && sym.length > 3) return false; // STETH
            if (sym.includes('-') || sym.includes('.')) return false; // USDT-ERC20
            
            return true;
        });

        // Map to our frontend format and limit to top 200
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
        
        // If API fails, use cache or a safe 26-coin fallback
        if (cachedPrices) {
            return res.json(cachedPrices);
        } else {
            const safeFallback = [
                { name: 'Bitcoin', symbol: 'BTC', current_price: 65400.50, price_change_percentage_24h: 1.5 },
                { name: 'Ethereum', symbol: 'ETH', current_price: 3450.20, price_change_percentage_24h: 2.1 },
                { name: 'Tether', symbol: 'USDT', current_price: 1.00, price_change_percentage_24h: 0.01 },
                { name: 'BNB', symbol: 'BNB', current_price: 590.30, price_change_percentage_24h: -0.5 },
                { name: 'Solana', symbol: 'SOL', current_price: 145.80, price_change_percentage_24h: 5.2 },
                { name: 'XRP', symbol: 'XRP', current_price: 0.52, price_change_percentage_24h: -1.2 },
                { name: 'Dogecoin', symbol: 'DOGE', current_price: 0.15, price_change_percentage_24h: 3.4 },
                { name: 'Cardano', symbol: 'ADA', current_price: 0.45, price_change_percentage_24h: 1.1 },
                { name: 'Avalanche', symbol: 'AVAX', current_price: 35.20, price_change_percentage_24h: -2.1 },
                { name: 'Shiba Inu', symbol: 'SHIB', current_price: 0.000024, price_change_percentage_24h: 4.5 },
                { name: 'Polkadot', symbol: 'DOT', current_price: 6.80, price_change_percentage_24h: 0.5 },
                { name: 'Chainlink', symbol: 'LINK', current_price: 14.20, price_change_percentage_24h: 2.2 },
                { name: 'Polygon', symbol: 'MATIC', current_price: 0.68, price_change_percentage_24h: -1.5 },
                { name: 'Litecoin', symbol: 'LTC', current_price: 80.10, price_change_percentage_24h: 1.0 },
                { name: 'TRON', symbol: 'TRX', current_price: 0.12, price_change_percentage_24h: 0.8 },
                { name: 'Uniswap', symbol: 'UNI', current_price: 7.50, price_change_percentage_24h: -0.9 },
                { name: 'Cosmos', symbol: 'ATOM', current_price: 8.20, price_change_percentage_24h: 2.1 },
                { name: 'Stellar', symbol: 'XLM', current_price: 0.11, price_change_percentage_24h: -1.5 },
                { name: 'NEAR Protocol', symbol: 'NEAR', current_price: 5.50, price_change_percentage_24h: 3.4 },
                { name: 'Aptos', symbol: 'APT', current_price: 8.80, price_change_percentage_24h: -2.3 },
                { name: 'Arbitrum', symbol: 'ARB', current_price: 1.10, price_change_percentage_24h: 1.8 },
                { name: 'Optimism', symbol: 'OP', current_price: 2.40, price_change_percentage_24h: 0.4 },
                { name: 'Filecoin', symbol: 'FIL', current_price: 5.20, price_change_percentage_24h: -1.1 },
                { name: 'Injective', symbol: 'INJ', current_price: 25.10, price_change_percentage_24h: 7.2 },
                { name: 'Sui', symbol: 'SUI', current_price: 1.20, price_change_percentage_24h: 4.5 },
                { name: 'Pepe', symbol: 'PEPE', current_price: 0.000008, price_change_percentage_24h: 12.4 }
            ];
            res.json(safeFallback);
        }
    }
});

// ==========================================
// 2. APP ROUTES
// ==========================================
app.use('/api/auth', require('./routes/auth'));
app.use('/api/orders', require('./routes/order'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/wallet', require('./routes/auth')); 

// ==========================================
// 3. SERVE STATIC FRONTEND
// ==========================================
app.use(express.static(path.join(__dirname, 'public')));

// Catch-all route for Express 5 (Fixes the PathError)
app.get('/*splat', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ==========================================
// 4. DATABASE & SERVER START
// ==========================================
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || process.env.DATABASE_URL;

if (MONGO_URI) {
    mongoose.connect(MONGO_URI)
        .then(() => console.log('✅ MongoDB Connected'))
        .catch(err => console.error('❌ MongoDB Connection Error:', err));
} else {
    console.log('⚠️ No MongoDB URI found in environment variables.');
}

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
