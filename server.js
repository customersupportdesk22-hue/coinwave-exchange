require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

// ==========================================
// REAL-TIME PRICE FETCH (CoinPaprika API)
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
        // Fetch from CoinPaprika
        const response = await fetch('https://api.coinpaprika.com/v1/tickers?quotes=USD', {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        
        if (!response.ok) throw new Error(`CoinPaprika Error: ${response.status}`);
        
        const data = await response.json();

        // Map CoinPaprika data to our frontend format
        const formattedData = data.map(item => {
            return {
                symbol: item.symbol.toUpperCase(),
                current_price: item.quotes.USD.price,
                price_change_percentage_24h: item.quotes.USD.percent_change_24h || 0
            };
        });

        cachedPrices = formattedData; 
        lastFetched = now;   
        res.json(formattedData);

    } catch (error) {
        console.error("Price fetch error:", error.message);
        
        if (cachedPrices) {
            return res.json(cachedPrices); 
        } else {
            // Fallback
            const fallback = [
                { symbol: 'BTC', current_price: 65000, price_change_percentage_24h: 1.5 },
                { symbol: 'ETH', current_price: 3400, price_change_percentage_24h: 1.2 }
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
