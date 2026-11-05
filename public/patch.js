// ==========================================
// THE PATCH: OVERRIDES BROKEN UI FUNCTIONS
// ==========================================
setTimeout(() => {
    // 1. Force kill any rogue functions
    window.renderGainersLosers = function() { return; };
    
    // 2. Override the broken loadMarkets function
    window.loadMarkets = function() {
        const marketList = document.getElementById('market-list'); 
        const glList = document.getElementById('gainersLosersList');
        if(!marketList || typeof markets === 'undefined') return;

        // Render Markets
        let marketHTML = '';
        markets.forEach((coin, index) => {
            const isUp = coin.change >= 0;
            const changeClass = isUp ? 'up' : 'down';
            const changeSymbol = isUp ? '↑' : '↓';
            const fPrice = coin.price >= 1 ? coin.price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) : (coin.price >= 0.001 ? coin.price.toFixed(4) : coin.price.toFixed(8));

            marketHTML += `
                <div class="market-row" onclick="if(typeof quickTrade === 'function') quickTrade('${coin.symbol}')">
                    <div class="market-rank">${index + 1}</div>
                    <div class="market-name-col">
                        <div class="market-icon" style="background: ${coin.color || '#333'};">${coin.icon || coin.symbol.charAt(0)}</div>
                        <div>
                            <div class="market-name-text">${coin.name}</div>
                            <div class="market-symbol-text">${coin.symbol}</div>
                        </div>
                    </div>
                    <div class="market-price">$${fPrice}</div>
                    <div class="market-change ${changeClass}">${changeSymbol} ${Math.abs(coin.change).toFixed(2)}%</div>
                </div>`;
        });
        marketList.innerHTML = marketHTML;

        // Render Gainers & Losers with Bulletproof Fallback
        if (glList && markets.length > 0) {
            const validCoins = markets.filter(c => c && c.price > 0 && typeof c.change === 'number');
            const sortedDesc = [...validCoins].sort((a, b) => b.change - a.change);
            
            let gainers = sortedDesc.filter(c => c.change > 0).slice(0, 3);
            if (gainers.length === 0) gainers = sortedDesc.slice(0, 3);

            let losers = [...validCoins].filter(c => c.change < 0).sort((a, b) => a.change - b.change).slice(0, 3);
            if (losers.length === 0) losers = sortedDesc.slice(-3).reverse();

            const buildCard = (c) => {
                const isUp = c.change >= 0;
                const color = isUp ? '#0ecb51' : '#f6465d';
                const arrow = isUp ? '↑' : '↓';
                const cPrice = c.price >= 1 ? c.price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) : (c.price >= 0.001 ? c.price.toFixed(4) : c.price.toFixed(8));
                
                return `
                    <div onclick="if(typeof quickTrade === 'function') quickTrade('${c.symbol}')" style="cursor: pointer; flex: 0 0 115px; background: #181A20; border-radius: 8px; padding: 12px; border-left: 3px solid ${color}; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; height: 75px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                            <span style="font-size: 12px; color: #fff; font-weight: bold;">${c.symbol}</span>
                            <span style="font-size: 11px; color: ${color}; font-weight: bold;">${arrow} ${Math.abs(c.change).toFixed(2)}%</span>
                        </div>
                        <div style="font-weight: bold; font-size: 13px; color: #848E9C;">$${cPrice}</div>
                    </div>`;
            };

            glList.innerHTML = `
                <div style="display: flex; flex-direction: column; gap: 15px; width: 100%; margin-bottom: 20px;">
                    <div>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                            <h3 style="font-size: 14px; color: #fff; margin: 0; font-weight: 600;">Top Gainers</h3>
                            <span style="font-size: 11px; color: #0ecb51;">● Live</span>
                        </div>
                        <div style="display: flex; flex-direction: row; gap: 10px; overflow-x: auto; padding-bottom: 5px; scrollbar-width: none;">
                            ${gainers.map(c => buildCard(c)).join('')}
                        </div>
                    </div>
                    <div>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                            <h3 style="font-size: 14px; color: #fff; margin: 0; font-weight: 600;">Top Losers</h3>
                            <span style="font-size: 11px; color: #f6465d;">● Live</span>
                        </div>
                        <div style="display: flex; flex-direction: row; gap: 10px; overflow-x: auto; padding-bottom: 5px; scrollbar-width: none;">
                            ${losers.map(c => buildCard(c)).join('')}
                        </div>
                    </div>
                </div>`;
        }
    };

    // 3. Start exactly ONE clean timer that uses this new function
    setInterval(() => {
        if (typeof simulateLiveMarket === 'function') simulateLiveMarket();
        window.loadMarkets();
    }, 2000);
    
    window.loadMarkets();
}, 1000); // Wait 1 second for the old app.js to finish loading
