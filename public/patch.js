// ==========================================
// 1. INJECT CSS TO KILL THE GHOST BOX
// ==========================================
if (!document.getElementById('kill-ghost-box')) {
    const style = document.createElement('style');
    style.id = 'kill-ghost-box';
    style.innerHTML = `
        #gainersLosersList {
            display: none !important;
            height: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
        }
    `;
    document.head.appendChild(style);
}

// ==========================================
// 2. RENDER THE NEW PERFECT UI
// ==========================================
setInterval(() => {
    const oldBox = document.getElementById('gainersLosersList');
    if (!oldBox) return;

    // Create our new container if it doesn't exist yet
    let newBox = document.getElementById('pro-gainers-losers');
    if (!newBox) {
        newBox = document.createElement('div');
        newBox.id = 'pro-gainers-losers';
        newBox.style.marginBottom = '20px';
        oldBox.parentNode.insertBefore(newBox, oldBox.nextSibling);
    }

    if (typeof markets === 'undefined' || markets.length === 0) return;

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
        const fPrice = c.price >= 1 ? c.price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) : (c.price >= 0.001 ? c.price.toFixed(4) : c.price.toFixed(8));
        
        return `
            <div onclick="if(typeof quickTrade === 'function') quickTrade('${c.symbol}')" style="cursor: pointer; flex: 0 0 115px; background: #181A20; border-radius: 8px; padding: 12px; border-left: 3px solid ${color}; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; height: 75px; margin-right: 10px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                    <span style="font-size: 12px; color: #fff; font-weight: bold;">${c.symbol}</span>
                    <span style="font-size: 11px; color: ${color}; font-weight: bold;">${arrow} ${Math.abs(c.change).toFixed(2)}%</span>
                </div>
                <div style="font-weight: bold; font-size: 13px; color: #848E9C;">$${fPrice}</div>
            </div>`;
    };

    newBox.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 15px; width: 100%;">
            <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <h3 style="font-size: 14px; color: #fff; margin: 0; font-weight: 600;">Top Gainers</h3>
                    <span style="font-size: 11px; color: #0ecb51;">● Live</span>
                </div>
                <div style="display: flex; flex-direction: row; overflow-x: auto; padding-bottom: 5px; scrollbar-width: none;">
                    ${gainers.map(c => buildCard(c)).join('')}
                </div>
            </div>
            <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <h3 style="font-size: 14px; color: #fff; margin: 0; font-weight: 600;">Top Losers</h3>
                    <span style="font-size: 11px; color: #f6465d;">● Live</span>
                </div>
                <div style="display: flex; flex-direction: row; overflow-x: auto; padding-bottom: 5px; scrollbar-width: none;">
                    ${losers.map(c => buildCard(c)).join('')}
                </div>
            </div>
        </div>`;
}, 1000);

// ==========================================
// SYNC HERO CARD BTC PRICE
// ==========================================
setInterval(() => {
    if (typeof markets === 'undefined' || markets.length === 0) return;
    
    const btcCoin = markets.find(c => c.symbol === 'BTC');
    if (!btcCoin) return;

    // Format the live price
    const livePrice = btcCoin.price >= 1 ? btcCoin.price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) : btcCoin.price.toFixed(2);
    const liveChange = btcCoin.change >= 0 ? `+${btcCoin.change.toFixed(2)}%` : `${btcCoin.change.toFixed(2)}%`;
    
    // Find the hero card text and update it
    // We look for the container that has "BTC / USDT" inside it
    const allElements = document.querySelectorAll('div, span, h1, h2, h3');
    allElements.forEach(el => {
        if (el.innerText && el.innerText.includes('BTC / USDT') && el.children.length === 0) {
            // Found the "BTC / USDT" text. Now let's find the price and change elements next to it.
            const parent = el.parentElement;
            if (parent) {
                const priceEl = parent.querySelector('h1, h2, .hero-price');
                const changeEl = parent.querySelector('.hero-change, span');
                
                if (priceEl) priceEl.innerText = `$${livePrice}`;
                if (changeEl && changeEl !== el) {
                    changeEl.innerText = liveChange;
                    changeEl.style.color = btcCoin.change >= 0 ? '#0ecb51' : '#f6465d';
                }
            }
        }
    });
}, 2000); // Updates every 2 seconds

// ==========================================
// PRECISE HERO CARD SYNC (Using HTML IDs)
// ==========================================
setInterval(() => {
    // Check if markets data is loaded
    if (typeof markets === 'undefined' || markets.length === 0) return;

    // Find Bitcoin in the live data
    const btc = markets.find(c => c.symbol === 'BTC');
    if (!btc) return;

    // Target the exact IDs from your index.html
    const priceEl = document.getElementById('heroChartPrice');
    const changeEl = document.getElementById('heroChartChange');

    // Update the Price
    if (priceEl) {
        priceEl.innerText = '$' + btc.price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
    }

    // Update the Percentage and Color
    if (changeEl) {
        const isUp = btc.change >= 0;
        changeEl.innerText = (isUp ? '+' : '') + btc.change.toFixed(2) + '%';
        changeEl.style.color = isUp ? '#0ecb51' : '#f6465d'; // Green if up, Red if down
    }
}, 1000); // Run every 1 second
