require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

let cachedPrices = null;
let lastFetched = 0;
const CACHE_DURATION = 60000; // 1 minute

// ==========================================
// 3-TIER MARKET PRICE FETCHER WITH ULTIMATE PATTERN FILTER
// ==========================================
app.get('/api/market/prices', async (req, res) => {
    const now = Date.now();
    if (cachedPrices && (now - lastFetched < CACHE_DURATION)) {
        return res.json(cachedPrices);
    }

    // --- TIER 1: COINPAPRIKA ---
    try {
        const response = await fetch('https://api.coinpaprika.com/v1/tickers?quotes=USD', {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
        });
        if (!response.ok) throw new Error('CoinPaprika failed');
        
        const data = await response.json();

        // Sort by Market Cap (Highest first) so we keep the top 100 coins
        data.sort((a, b) => (b.quotes.USD.market_cap || 0) - (a.quotes.USD.market_cap || 0));

        const seenSymbols = new Set();
        
        const hardBlacklist = [
            'OHMV2', 'UB', 'DRV', 'GAL', 'VVV', 'TRUMP', 'SPX', 'RAIN', 'STABLE', 'LIT', 'NIGHT', 
            'BTW', 'PUMP', 'PUDGY', 'MEMECORE', 'VIRTUAL', 'JLP', 'EURC', 'BINANCELIFE', 'WBT', 'USELESS', 'CAP'
        ];
        
        const badKeywords = [
            'wrapped', 'staked', 'bridged', 'falcon', 'usual', 'bitway', 'venice', 'lighter', 
            'midnight', 'stable', 'virtuals', 'official trump', 'world liberty', 'meme', 'pudgy', 
            'binance life', 'pump', 'gold', 'ether.fi', 'stader', 'olympus', 'frax', 'ethena', 'susds'
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

            // 2. Hard Blacklist
            if (hardBlacklist.includes(sym)) continue;
            if (badKeywords.some(kw => name.toLowerCase().includes(kw))) continue;

            // 3. ULTIMATE PATTERN RULES
            // Block all stablecoins except USDT and USDC
            if ((sym.includes('USD') || sym.includes('DAI') || sym.includes('EUR')) && sym !== 'USDT' && sym !== 'USDC') continue;
            
            // Block all Bitcoin derivatives (e.g. WBTC, TBTC, BTC.B)
            if (sym.includes('BTC') && sym !== 'BTC') continue;
            
            // Block all Ethereum derivatives (e.g. METH, RETH, BETH, ETHX, FRXETH)
            if (sym.includes('ETH') && sym !== 'ETH') continue;

            // Block any token with a dot or dash (usually bridged)
            if (sym.includes('.') || sym.includes('-')) continue;

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
        console.log('✅ Fetched from CoinPaprika (Primary)');
        return res.json(cleanCoins);

    } catch (error) {
        console.warn('⚠️ CoinPaprika failed. Switching to Binance...', error.message);

        // --- TIER 2: BINANCE ---
        try {
            const binanceRes = await fetch('https://api.binance.com/api/v3/ticker/24hr');
            if (!binanceRes.ok) throw new Error('Binance failed');
            
            const binanceData = await binanceRes.json();

            // Sort by quote volume to get the most liquid coins
            binanceData.sort((a, b) => parseFloat(b.quoteVolume) - parseFloat(a.quoteVolume));

            const binanceCoins = binanceData
                .filter(item => item.symbol.endsWith('USDT') && parseFloat(item.lastPrice) > 0)
                .slice(0, 100)
                .map(item => {
                    const cleanSym = item.symbol.replace('USDT', '');
                    return {
                        name: cleanSym, // Binance ticker API doesn't provide full name
                        symbol: cleanSym,
                        current_price: parseFloat(item.lastPrice),
                        price_change_percentage_24h: parseFloat(item.priceChangePercent) || 0
                    };
                });

            cachedPrices = binanceCoins;
            lastFetched = now;
            console.log('✅ Fetched from Binance (Fallback)');
            return res.json(binanceCoins);

        } catch (binanceError) {
            console.error('❌ Binance failed too. Using emergency static list.', binanceError.message);

            // --- TIER 3: EMERGENCY STATIC LIST ---
            if (cachedPrices) return res.json(cachedPrices);

            return res.json([]);
        }
    }
});

// ==========================================
// APP ROUTES
// ==========================================

// ==========================================
// TEMPORARY ROUTE TO FIX OLD ORDERS
// ==========================================
app.get('/api/fix-old-orders', async (req, res) => {
    try {
        const Order = require('./models/Order');
        const result = await Order.updateMany(
            { status: "Approved" },
            { $set: { status: "approved" } }
        );
        res.json({ message: `Successfully fixed ${result.modifiedCount} old orders!` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/auth'));
app.use('/api/orders', require('./routes/order'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/wallet', require('./routes/auth')); 

// ==========================================
// SERVE STATIC FRONTEND
// ==========================================
app.use(express.static(path.join(__dirname, 'public')));

// Catch-all route for Express 5 (Fixes the PathError)
app.get('/*splat', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ==========================================
// DATABASE & SERVER START
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
