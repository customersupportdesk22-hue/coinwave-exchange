
/* =====================================================
   FIX LIVE PRICE TICKING (2-Second Updates)
   ===================================================== */
setInterval(() => {
    // Check if the functions exist in app.js before running them
    if (typeof simulateLiveMarket === 'function') {
        simulateLiveMarket();
    }
    if (typeof loadMarkets === 'function') {
        loadMarkets();
    }
}, 2000);

/* =====================================================
   STANDALONE LIVE PRICE TICKER (Updates DOM directly)
   ===================================================== */
setInterval(() => {
    // 1. Update the underlying data array
    if (typeof markets !== 'undefined') {
        markets.forEach(coin => {
            const fluctuation = (Math.random() - 0.5) * (coin.price * 0.002);
            coin.price += fluctuation;
            const changeFluctuation = (Math.random() - 0.5) * 0.2;
            coin.change = parseFloat((coin.change + changeFluctuation).toFixed(2));
        });
    }

    // 2. Update the Homepage Live Markets list
    const marketRows = document.querySelectorAll('.market-row');
    marketRows.forEach(row => {
        const symbolEl = row.querySelector('.market-symbol-text');
        if (!symbolEl) return;
        
        const symbol = symbolEl.innerText.trim();
        const coin = markets.find(c => c.symbol === symbol);
        if (!coin) return;

        const priceEl = row.querySelector('.market-price');
        const changeEl = row.querySelector('.market-change');

        if (priceEl && changeEl) {
            // Update Price
            let formattedPrice = coin.price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 6});
            priceEl.innerText = `$${formattedPrice}`;
            
            // Update 24h Change
            const isUp = coin.change >= 0;
            changeEl.className = `market-change ${isUp ? 'up' : 'down'}`;
            changeEl.innerText = `${isUp ? '↑' : '↓'} ${Math.abs(coin.change)}%`;
        }
    });

    // 3. Update the Ticker at the very top of the screen
    const tickerWrap = document.getElementById('ticker');
    if (tickerWrap && tickerWrap.children.length > 0) {
        // We just rebuild the ticker content quickly
        let tickerHTML = '';
        markets.forEach(coin => {
            const isUp = coin.change >= 0;
            const changeClass = isUp ? 'up' : 'down';
            const changeSymbol = isUp ? '↑' : '↓';
            let formattedPrice = coin.price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 6});
            tickerHTML += `<div class="ticker-item"><b>${coin.symbol}</b> $${formattedPrice} <span class="${changeClass}">${changeSymbol}${Math.abs(coin.change)}%</span></div>`;
        });
        tickerWrap.innerHTML = tickerHTML + tickerHTML;
    }
}, 2000);
