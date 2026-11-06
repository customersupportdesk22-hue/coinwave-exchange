// ==========================================
// 1. CSS LOCK (Hide floating buttons permanently)
// ==========================================
const style = document.createElement('style');
style.innerHTML = `
    #tawk-bubble-container, iframe[title="chat widget"], iframe[src*="tawk.to"] { 
        display: none !important; 
        visibility: hidden !important;
        opacity: 0 !important;
    }
    [class*="webcallhub"], div[id*="webcallhub"], iframe[src*="webcallhub"] { 
        display: none !important; 
    }
    #gainersLosersList { display: none !important; height: 0 !important; margin: 0 !important; padding: 0 !important; }
    
    /* Support Page Overlay */
    #support-page-overlay {
        display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: #0B0E11; z-index: 9999999; overflow-y: auto; padding: 20px;
        box-sizing: border-box; font-family: -apple-system, sans-serif;
    }
    #homepage-support-banner { 
        margin: 15px !important; background: #181A20; border-radius: 12px; 
        padding: 25px 20px; border: 1px solid #2B3139; text-align: center; 
    }
`;
document.head.appendChild(style);

// ==========================================
// 2. SUPPORT CENTER FUNCTIONS
// ==========================================
window.openSupportPage = function(e) { if(e) { e.preventDefault(); e.stopPropagation(); } document.getElementById('support-page-overlay').style.display = 'block'; }
window.closeSupportPage = function(e) { if(e) { e.preventDefault(); e.stopPropagation(); } document.getElementById('support-page-overlay').style.display = 'none'; }

window.loadTawkAndChat = function(e) {
    if(e) { e.preventDefault(); e.stopPropagation(); }
    closeSupportPage();
    
    if(!document.getElementById('tawk-script')) {
        var s1 = document.createElement("script");
        s1.id = 'tawk-script';
        s1.async = true;
        s1.src = 'https://embed.tawk.to/6acacd23a18e8334c37e911e/default';
        s1.charset = 'UTF-8';
        s1.setAttribute('crossorigin', '*');
        document.head.appendChild(s1);
        
        setTimeout(() => {
            if(window.Tawk_API && window.Tawk_API.maximize) window.Tawk_API.maximize();
            if(window.Tawk_API && window.Tawk_API.hideWidget) window.Tawk_API.hideWidget();
        }, 2000);
    } else {
        if(window.Tawk_API && window.Tawk_API.maximize) window.Tawk_API.maximize();
        if(window.Tawk_API && window.Tawk_API.hideWidget) window.Tawk_API.hideWidget();
    }
}

// ==========================================
// 3. INJECT SUPPORT CENTER UI
// ==========================================
function runInstant1() {
    if (!document.getElementById('support-page-overlay')) {
        let overlay = document.createElement('div');
        overlay.id = 'support-page-overlay';
        overlay.innerHTML = `
            <div style="max-width: 600px; margin: 0 auto; padding-bottom: 50px;">
                <div style="display: flex; align-items: center; margin-bottom: 30px; padding-bottom: 15px; border-bottom: 1px solid #2B3139;">
                    <div onclick="closeSupportPage(event)" style="width: 40px; height: 40px; border-radius: 50%; background: #181A20; display: flex; align-items: center; justify-content: center; cursor: pointer; border: 1px solid #2B3139;">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                    </div>
                    <h2 style="color: #fff; margin: 0 0 0 15px; font-size: 20px; font-weight: 600;">Support Center</h2>
                </div>
                <div style="background: #181A20; border-radius: 12px; padding: 20px; margin-bottom: 25px; border: 1px solid #2B3139;">
                    <h3 style="color: #fff; margin-top: 0; font-size: 16px; margin-bottom: 15px;">Important Notes</h3>
                    <ul style="color: #848E9C; font-size: 14px; padding-left: 20px; line-height: 1.8; margin: 0;">
                        <li>Our support team is available <b>24/7</b>.</li>
                        <li><b>Never</b> share your password or 12/24-word seed phrase.</li>
                    </ul>
                </div>
                <div onclick="loadTawkAndChat(event)" style="cursor: pointer; background: #181A20; padding: 20px; border-radius: 12px; border: 1px solid #2B3139; display: flex; align-items: center;">
                    <div style="font-size: 28px; margin-right: 15px;">💬</div>
                    <div style="flex: 1;">
                        <h4 style="color: #fff; margin: 0 0 5px 0; font-size: 16px;">Live Chat</h4>
                        <p style="color: #848E9C; margin: 0; font-size: 13px;">Chat with an agent instantly.</p>
                    </div>
                    <div style="color: #0ecb51; font-size: 20px;">&rarr;</div>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        const footer = document.querySelector('footer, .footer, div[style*="text-align: center"]');
        if (footer && !document.getElementById('homepage-support-banner')) {
            let banner = document.createElement('div');
            banner.id = 'homepage-support-banner';
            banner.innerHTML = `
                <h3 style="color: #fff; margin-top: 0; font-size: 18px; margin-bottom: 8px;">Need Assistance?</h3>
                <p style="color: #848E9C; font-size: 14px; margin-bottom: 20px;">Our professional support team is available 24/7.</p>
                <button onclick="openSupportPage(event)" style="width: 100%; padding: 15px; background: #0ecb51; color: #fff; border: none; border-radius: 8px; font-weight: bold; font-size: 16px; cursor: pointer;">Open Support Center</button>
            `;
            footer.parentNode.insertBefore(banner, footer);
        }
    }
}
runInstant1();
setInterval(runInstant1, 1000);

// ==========================================
// RESTORE HERO CARD, TICKER & GAINERS/LOSERS
// ==========================================
if (!window.sparklinePoints) {
    window.sparklinePoints = [];
    for (let i = 0; i < 20; i++) window.sparklinePoints.push({ x: i * 10, y: 40 + (Math.random() * 20 - 10) });
}

function runInstant2() {
    if (typeof markets === 'undefined' || !markets.length) return;

    // --- A. UPDATE TICKER ---
    const ticker = document.getElementById('ticker');
    if (ticker) {
        let tickerHTML = '';
        markets.slice(0, 15).forEach(coin => {
            const isUp = coin.change >= 0;
            const color = isUp ? '#0ecb51' : '#f6465d';
            const arrow = isUp ? '↑' : '↓';
            const fPrice = coin.price >= 1 ? coin.price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) : (coin.price >= 0.001 ? coin.price.toFixed(4) : coin.price.toFixed(8));
            tickerHTML += `<div class="ticker-item" style="display: inline-flex; gap: 5px; margin-right: 20px; font-size: 12px; white-space: nowrap;"><b style="color: #fff;">${coin.symbol}</b><span style="color: #fff;">$${fPrice}</span><span style="color: ${color};">${arrow}${Math.abs(coin.change).toFixed(2)}%</span></div>`;
        });
        ticker.innerHTML = tickerHTML + tickerHTML;
    }

    // --- B. UPDATE HERO CARD ---
    const btc = markets.find(c => c.symbol === 'BTC');
    if (btc) {
        const priceEl = document.getElementById('heroChartPrice');
        const changeEl = document.getElementById('heroChartChange');
        const svgContainer = document.getElementById('heroSvgContainer');
        
        const isUp = btc.change >= 0;
        const color = isUp ? '#0ecb51' : '#f6465d';

        if (priceEl) priceEl.innerText = '$' + btc.price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
        if (changeEl) {
            changeEl.innerText = (isUp ? '+' : '') + btc.change.toFixed(2) + '%';
            changeEl.style.color = color;
        }

        // Draw Chart
        if (svgContainer) {
            window.sparklinePoints.shift();
            const lastY = window.sparklinePoints[window.sparklinePoints.length - 1].y;
            const bias = isUp ? -2 : 2;
            let newY = lastY + (Math.random() * 24 - 12) + bias;
            newY = Math.max(5, Math.min(75, newY)); 
            window.sparklinePoints.push({ x: 200, y: newY });
            window.sparklinePoints.forEach((p, i) => p.x = i * 10);

            let pathStr = "M " + window.sparklinePoints[0].x + " " + window.sparklinePoints[0].y;
            for (let i = 1; i < window.sparklinePoints.length; i++) pathStr += " L " + window.sparklinePoints[i].x + " " + window.sparklinePoints[i].y;

            svgContainer.innerHTML = `<svg width="100%" height="100%" viewBox="0 0 200 80" preserveAspectRatio="none"><defs><linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="${color}" stop-opacity="0.3"/><stop offset="100%" stop-color="${color}" stop-opacity="0"/></linearGradient></defs><path d="${pathStr}" fill="none" stroke="${color}" stroke-width="2"/><path d="${pathStr} L 200 80 L 0 80 Z" fill="url(#gradient)" stroke="none"/></svg>`;
        }
    }

    // --- C. UPDATE GAINERS & LOSERS ---
    const oldBox = document.getElementById('gainersLosersList');
    if (oldBox) {
        let newBox = document.getElementById('pro-gainers-losers');
        if (!newBox) { 
            newBox = document.createElement('div'); 
            newBox.id = 'pro-gainers-losers'; 
            newBox.style.marginBottom = '20px'; 
            oldBox.parentNode.insertBefore(newBox, oldBox.nextSibling); 
        }
        
        const validCoins = markets.filter(c => c && c.price > 0 && typeof c.change === 'number');
        const sortedDesc = [...validCoins].sort((a, b) => b.change - a.change);
        
        let gainers = sortedDesc.filter(c => c.change > 0).slice(0, 3); 
        if (gainers.length === 0) gainers = sortedDesc.slice(0, 3);
        
        let losers = [...validCoins].filter(c => c.change < 0).sort((a, b) => a.change - b.change).slice(0, 3); 
        if (losers.length === 0) losers = sortedDesc.slice(-3).reverse();

        const buildCard = (c) => {
            const cardIsUp = c.change >= 0; 
            const cardColor = cardIsUp ? '#0ecb51' : '#f6465d'; 
            const arrow = cardIsUp ? '↑' : '↓';
            const fPrice = c.price >= 1 ? c.price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) : (c.price >= 0.001 ? c.price.toFixed(4) : c.price.toFixed(8));
            
            return `<div onclick="if(typeof quickTrade === 'function') quickTrade('${c.symbol}')" style="cursor: pointer; flex: 0 0 31%; background: #181A20; border-radius: 8px; padding: 10px; border-left: 3px solid ${cardColor}; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; height: 75px; overflow: hidden;"><div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; width: 100%;"><span style="font-size: 12px; color: #fff; font-weight: bold; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 50px;">${c.symbol}</span><span style="font-size: 11px; color: ${cardColor}; font-weight: bold; margin-left: 2px;">${arrow} ${Math.abs(c.change).toFixed(2)}%</span></div><div style="font-weight: bold; font-size: 13px; color: #848E9C;">$${fPrice}</div></div>`;
        };

        newBox.innerHTML = `<div style="display: flex; flex-direction: column; gap: 15px; width: 100%;"><div><div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;"><h3 style="font-size: 14px; color: #fff; margin: 0; font-weight: 600;">Top Gainers</h3><span style="font-size: 11px; color: #0ecb51;">● Live</span></div><div style="display: flex; flex-direction: row; justify-content: space-between; padding-bottom: 5px;">${gainers.map(c => buildCard(c)).join('')}</div></div><div><div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;"><h3 style="font-size: 14px; color: #fff; margin: 0; font-weight: 600;">Top Losers</h3><span style="font-size: 11px; color: #f6465d;">● Live</span></div><div style="display: flex; flex-direction: row; justify-content: space-between; padding-bottom: 5px;">${losers.map(c => buildCard(c)).join('')}</div></div></div>`;
    }
}
runInstant2();
setInterval(runInstant2, 1000);



// ==========================================
// FORCE LIVE MARKETS TABLE TO UPDATE
// ==========================================
// Duplicate loadMarkets timer removed to stop flashing.

// ==========================================
// PROFESSIONAL COMPACT TYPOGRAPHY (SAFE CSS)
// ==========================================
const compactTextStyle = document.createElement('style');
compactTextStyle.innerHTML = `
    /* 1. Shrink the Hero Title and Subtitle */
    .hero-title { font-size: 24px !important; line-height: 1.2 !important; }
    .hero-subtitle { font-size: 13px !important; margin-bottom: 15px !important; }

    /* 2. Shrink the big buttons */
    .btn-primary-large, .btn-outline-large { 
        font-size: 14px !important; 
        padding: 12px 20px !important; 
    }

    /* 3. Shrink the Live Markets Table */
    .market-header h2 { font-size: 16px !important; }
    .market-table-header { font-size: 10px !important; padding: 8px 10px !important; }
    .market-row { padding: 10px 15px !important; }
    
    .market-name-text { font-size: 12px !important; }
    .market-symbol-text { font-size: 9px !important; }
    .market-price { font-size: 12px !important; }
    .market-change { font-size: 11px !important; }
    
    .market-icon { 
        width: 24px !important; 
        height: 24px !important; 
        font-size: 12px !important; 
    }

    /* 4. Shrink the Top Ticker */
    .ticker-item { font-size: 10px !important; }
    
    /* 5. Support Center Text */
    #homepage-support-banner h3 { font-size: 16px !important; }
    #homepage-support-banner p { font-size: 12px !important; }
    #homepage-support-banner button { font-size: 14px !important; padding: 12px !important; }
`;
document.head.appendChild(compactTextStyle);
