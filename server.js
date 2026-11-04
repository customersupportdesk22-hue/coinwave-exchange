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
// 3-TIER MARKET PRICE FETCHER
// ==========================================
app.get('/api/market/prices', async (req, res) => {
    const now = Date.now();
    if (cachedPrices && (now - lastFetched < CACHE_DURATION)) {
        return res.json(cachedPrices);
    }

    // --- TIER 1: COINPAPRIKA ---
    try {
        const response = await fetch('https://api.coinpaprika.com/v1/tickers?quotes=USD', {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        if (!response.ok) throw new Error('CoinPaprika failed');
        const data = await response.json();

        const blacklist = ['USELESS', 'TRUMP', 'MEMECORE', 'CAP', 'PYUSD', 'FDUSD', 'TUSD', 'USDD', 'USDS', 'USDE', 'BFUSD', 'USD1', 'USD0', 'OUSD', 'GHO', 'WBT', 'TBTC', 'METH', 'M', 'WBTC', 'WETH', 'STETH', 'CBETH', 'SUSDE', 'SUSDS', 'WSTETH', 'RETH', 'USDF', 'PUMP', 'PENGU', 'SOLVBTC', 'SYRUPUSDC', 'USDG', 'BTT', 'USDTB', 'NFT', 'ICX'];
        const badNames = ['wrapped', 'staked', 'bridged', 'liquid staked', 'useless', 'meme', 'binance', 'coinbase'];
        const seenSymbols = new Set();

        const cleanCoins = data.filter(item => {
            const sym = item.symbol.toUpperCase();
            const name = (item.name || '');
            const price = item.quotes.USD.price;
            if (!price || price === 0) return false;
            if (blacklist.includes(sym)) return false;
            const lowerName = name.toLowerCase();
            if (badNames.some(bad => lowerName.includes(bad))) return false;
            if (!/^[a-zA-Z0-9\s\(\)\-\.]+$/.test(name)) return false;
            if (seenSymbols.has(sym)) return false;
            seenSymbols.add(sym);
            return true;
        });

        const topCoins = cleanCoins.slice(0, 100).map(item => ({
            name: item.name || item.symbol,
            symbol: item.symbol.toUpperCase(),
            current_price: item.quotes.USD.price,
            price_change_percentage_24h: item.quotes.USD.percent_change_24h || 0
        }));

        cachedPrices = topCoins;
        lastFetched = now;
        console.log('✅ Fetched from CoinPaprika (Primary)');
        return res.json(topCoins);

    } catch (error) {
        console.warn('⚠️ CoinPaprika failed. Switching to Binance...', error.message);

        // --- TIER 2: BINANCE ---
        try {
            const binanceRes = await fetch('https://api.binance.com/api/v3/ticker/24hr');
            if (!binanceRes.ok) throw new Error('Binance failed');
            const binanceData = await binanceRes.json();

            // Filter for USDT pairs only and map to our format
            const binanceCoins = binanceData
                .filter(item => item.symbol.endsWith('USDT') && parseFloat(item.lastPrice) > 0)
                .slice(0, 100)
                .map(item => {
                    const cleanSym = item.symbol.replace('USDT', '');
                    return {
                        name: cleanSym, // Binance ticker API doesn't provide full name, so we use symbol
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
            if (cachedPrices) return res.json(cachedPrices); // Serve old cache if we have it

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
            return res.json(safeFallback);
        }
    }
});

// ==========================================
// APP ROUTES
// ==========================================
app.use('/api/auth', require('./routes/auth'));
app.use('/api/orders', require('./routes/order'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/wallet', require('./routes/auth')); 

// ==========================================
// SERVE STATIC FRONTEND
// ==========================================
app.use(express.static(path.join(__dirname, 'public')));

// Catch-all route for Express 5
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
