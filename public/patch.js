setInterval(() => {
    const oldBox = document.getElementById('gainersLosersList');
    if (!oldBox) return;

    // 1. HIDE the old broken box permanently
    oldBox.style.display = 'none';

    // 2. Create our new container if it doesn't exist yet
    let newBox = document.getElementById('pro-gainers-losers');
    if (!newBox) {
        newBox = document.createElement('div');
        newBox.id = 'pro-gainers-losers';
        newBox.style.marginBottom = '20px';
        oldBox.parentNode.insertBefore(newBox, oldBox.nextSibling);
    }

    if (typeof markets === 'undefined' || markets.length === 0) return;

    // 3. Render into OUR new box with inline CSS
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
}, 1000); // Fires every 1 second to ensure it stays on top
