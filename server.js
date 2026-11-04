require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// ==========================================
// REAL-TIME PRICE FETCH (Advanced Filtering)
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

        // Sort by Market Cap (Highest first) to ensure we get the most legitimate coins
        data.sort((a, b) => (b.quotes.USD.market_cap || 0) - (a.quotes.USD.market_cap || 0));

        const seenSymbols = new Set();
        
        // EXPANDED BLACKLIST: Blocking specific coins and wrapped/staked tokens
        const blacklistedSymbols = [
            'WBTC', 'WETH', 'STETH', 'METH', 'TBTC', 'SOLVBTC', 'SYRUPUSDC', 'BINANCELIFE', 'PUMP', 'PUDGY',
            'PYUSD', 'USDD', 'TUSD', 'MEMECORE', 'MEME', 'WBT', 'USDS', 'USDE', 'BFUSD', 'M'
        ];
        
        const blacklistedKeywords = [
            'wrapped', 'staked', 'pudgy', 'pump.fun', 'binancelife', 
            'paypal usd', 'trueusd', 'memecore', 'ethena'
        ];

        const cleanCoins = [];

        for (const item of data) {
            if (!item.quotes || !item.quotes.USD) continue;
            
            const sym = item.symbol.toUpperCase();
            const name = item.name || '';
            const price = item.quotes.USD.price;

            // 1. Must have a valid price
            if (!price || price <= 0) continue;

            // 2. Must be English characters only
            if (!/^[\x00-\x7F]*$/.test(sym) || !/^[\x00-\x7F]*$/.test(name)) continue;

            // 3. Remove explicitly blacklisted symbols and keywords
            if (blacklistedSymbols.includes(sym)) continue;
            if (blacklistedKeywords.some(kw => name.toLowerCase().includes(kw))) continue;

            // 4. SMART RULE: Block any other stablecoins or wrapped tokens
            // (If it ends in USD but isn't USDT or USDC, block it)
            if (sym.endsWith('USD') && sym !== 'USDT' && sym !== 'USDC') continue;
            // Block Bitcoin wrappers
            if (sym.endsWith('BTC') && sym !== 'BTC') continue;

            // 5. Remove Duplicates
            if (seenSymbols.has(sym)) continue;
            seenSymbols.add(sym);

            cleanCoins.push({
                name: item.name,
                symbol: sym,
                current_price: price,
                price_change_percentage_24h: item.quotes.USD.percent_change_24h || 0
            });

            // 6. Stop exactly at 100 clean coins
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
