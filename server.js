require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// ==========================================
// REAL-TIME PRICE FETCH (Smart Professional Filter)
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

        // Sort by Market Cap (Highest first)
        data.sort((a, b) => (b.quotes.USD.market_cap || 0) - (a.quotes.USD.market_cap || 0));

        const seenSymbols = new Set();
        
        // Explicitly block the ones you pointed out
        const blacklistedSymbols = [
            'SUSDS', 'RAIN', 'USD1', 'USDG', 'USDF', 'USDC.E', 'GHO', 'USD0', 'BTC.B', 'USDTB', 
            'STABLE', 'VVV', 'TRUMP', 'SPX', 'BTW', 'LIT', 'NIGHT', 'RETH', 'ASTER', 'VIRTUAL',
            'PYUSD', 'USDD', 'TUSD', 'MEMECORE', 'MEME', 'WBT', 'USDS', 'USDE', 'BFUSD', 'M'
        ];
        
        const blacklistedKeywords = [
            'wrapped', 'staked', 'bridged', 'falcon', 'usual', 'bitway', 'rain protocol', 
            'venice', 'lighter', 'midnight', 'stable', 'virtuals', 'official trump', 
            'world liberty', 'meme', 'pudgy', 'binance life', 'pump'
        ];

        const cleanCoins = [];

        for (const item of data) {
            if (!item.quotes || !item.quotes.USD) continue;
            
            const sym = item.symbol.toUpperCase();
            const name = item.name || '';
            const price = item.quotes.USD.price;

            // 1. Must have a valid price and be English
            if (!price || price <= 0) continue;
            if (!/^[\x00-\x7F]*$/.test(sym) || !/^[\x00-\x7F]*$/.test(name)) continue;

            // 2. Explicit Blacklists
            if (blacklistedSymbols.includes(sym)) continue;
            if (blacklistedKeywords.some(kw => name.toLowerCase().includes(kw))) continue;

            // 3. SMART RULES (Automatically filter out derivatives and stablecoins)
            if (sym.includes('.') || sym.includes('-')) continue; // Bridged / Wrapped
            if (sym.includes('USD') && sym !== 'USDT' && sym !== 'USDC') continue; // Other stablecoins
            if (sym.startsWith('S') && sym.length > 3 && !['SOL', 'SUI', 'SHIB', 'STX', 'SNX', 'SAND'].includes(sym)) continue; // Staked tokens
            if (sym.startsWith('R') && sym.length > 3 && sym !== 'RNDR') continue; // Rocket Pool / Restaked
            if (sym.startsWith('W') && sym.length > 3 && sym !== 'WLD') continue; // Wrapped tokens

            // 4. Remove Duplicates
            if (seenSymbols.has(sym)) continue;
            seenSymbols.add(sym);

            cleanCoins.push({
                name: item.name,
                symbol: sym,
                current_price: price,
                price_change_percentage_24h: item.quotes.USD.percent_change_24h || 0
            });

            // 5. Stop exactly at 100 clean coins
            if (cleanCoins.length >= 100) break;
        }

        cachedPrices = cleanCoins; 
        lastFetched = now;   
        res.json(cleanCoins);

    } catch (error) {
        console.error("API Disconnected, using Fallback:", error.message);
        if (cachedPrices) return res.json(cachedPrices);
        res.status(500).json({ error: error.message });
    }
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/orders', require('./routes/order'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/wallet', require('./routes/auth')); 

app.use(express.static(path.join(__dirname, 'public')));
app.get('/*splat', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || process.env.DATABASE_URL;

if (MONGO_URI) {
    mongoose.connect(MONGO_URI).then(() => console.log('✅ MongoDB Connected'));
}

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
