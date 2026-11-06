// ==========================================
// 1. TAWK.TO LIVE CHAT INJECTION
// ==========================================
window.Tawk_API = window.Tawk_API || {};
window.Tawk_API.customStyle = {
    visibility: {
        desktop: { position: 'br', xOffset: 20, yOffset: 90 }, // Pushes Tawk.to UP by 90px
        mobile: { position: 'br', xOffset: 20, yOffset: 90 }
    }
};

if (!document.getElementById('tawk-script')) {
    var s1 = document.createElement("script");
    s1.id = 'tawk-script';
    s1.async = true;
    s1.src = 'https://embed.tawk.to/6acacd23a18e8334c37e911e/default';
    s1.charset = 'UTF-8';
    s1.setAttribute('crossorigin', '*');
    document.head.appendChild(s1);
}

// ==========================================
// 2. GHOST BOX CSS (FROM PREVIOUS FIX)
// ==========================================
if (!document.getElementById('kill-ghost-box')) {
    const style = document.createElement('style');
    style.id = 'kill-ghost-box';
    style.innerHTML = '#gainersLosersList { display: none !important; height: 0 !important; margin: 0 !important; padding: 0 !important; }';
    document.head.appendChild(style);
}

// ==========================================
// 3. INITIALIZE SPARKLINE DATA
// ==========================================
if (!window.sparklinePoints) {
    window.sparklinePoints = [];
    for (let i = 0; i < 20; i++) {
        window.sparklinePoints.push({ x: i * 10, y: 40 + (Math.random() * 20 - 10) });
    }
}

// ==========================================
// 4. MASTER SYNC LOOP (Ticker, Chart, Cards)
// ==========================================
setInterval(() => {
    if (typeof markets === 'undefined' || markets.length === 0) return;

    // --- A. TICKER SYNC ---
    const ticker = document.getElementById('ticker');
    if (ticker) {
        let tickerHTML = '';
        markets.slice(0, 15).forEach(coin => {
            const isUp = coin.change >= 0;
            const color = isUp ? '#0ecb51' : '#f6465d';
            const arrow = isUp ? '↑' : '↓';
            const fPrice = coin.price >= 1 ? coin.price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) : (coin.price >= 0.001 ? coin.price.toFixed(4) : coin.price.toFixed(8));
            
            tickerHTML += '<div class="ticker-item" style="display: inline-flex; align-items: center; gap: 5px; margin-right: 25px; font-size: 12px; white-space: nowrap;">' +
                '<b style="color: #fff;">' + coin.symbol + '</b>' +
                '<span style="color: #fff;">$' + fPrice + '</span>' +
                '<span style="color: ' + color + ';">' + arrow + Math.abs(coin.change).toFixed(2) + '%</span>' +
                '</div>';
        });
        ticker.innerHTML = tickerHTML + tickerHTML;
    }

    // --- B. HERO CARD & LIVE SPARKLINE ---
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

        if (svgContainer) {
            window.sparklinePoints.shift();
            const lastY = window.sparklinePoints[window.sparklinePoints.length - 1].y;
            const bias = isUp ? -2 : 2;
            let newY = lastY + (Math.random() * 24 - 12) + bias;
            newY = Math.max(5, Math.min(75, newY)); 
            window.sparklinePoints.push({ x: 200, y: newY });
            window.sparklinePoints.forEach((p, i) => p.x = i * 10);

            let pathStr = "M " + window.sparklinePoints[0].x + " " + window.sparklinePoints[0].y;
            for (let i = 1; i < window.sparklinePoints.length; i++) {
                pathStr += " L " + window.sparklinePoints[i].x + " " + window.sparklinePoints[i].y;
            }

            svgContainer.innerHTML = '<svg width="100%" height="100%" viewBox="0 0 200 80" preserveAspectRatio="none">' +
                '<defs><linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">' +
                '<stop offset="0%" stop-color="' + color + '" stop-opacity="0.3"/>' +
                '<stop offset="100%" stop-color="' + color + '" stop-opacity="0"/>' +
                '</linearGradient></defs>' +
                '<path d="' + pathStr + '" fill="none" stroke="' + color + '" stroke-width="2"/>' +
                '<path d="' + pathStr + ' L 200 80 L 0 80 Z" fill="url(#gradient)" stroke="none"/>' +
                '</svg>';
        }
    }

    // --- C. GAINERS/LOSERS UI ---
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
        if (losers.length === 0) losers = sortedDesc.slice(-5).reverse();

        const buildCard = (c) => {
            const cardIsUp = c.change >= 0;
            const cardColor = cardIsUp ? '#0ecb51' : '#f6465d';
            const arrow = cardIsUp ? '↑' : '↓';
            const fPrice = c.price >= 1 ? c.price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) : (c.price >= 0.001 ? c.price.toFixed(4) : c.price.toFixed(8));
            
            return '<div onclick="if(typeof quickTrade === \'function\') quickTrade(\'' + c.symbol + '\')" style="cursor: pointer; flex: 0 0 115px; background: #181A20; border-radius: 8px; padding: 12px; border-left: 3px solid ' + cardColor + '; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; height: 75px; margin-right: 10px;">' +
                '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">' +
                    '<span style="font-size: 12px; color: #fff; font-weight: bold;">' + c.symbol + '</span>' +
                    '<span style="font-size: 11px; color: ' + cardColor + '; font-weight: bold;">' + arrow + ' ' + Math.abs(c.change).toFixed(2) + '%</span>' +
                '</div>' +
                '<div style="font-weight: bold; font-size: 13px; color: #848E9C;">$' + fPrice + '</div>' +
            '</div>';
        };

        newBox.innerHTML = '<div style="display: flex; flex-direction: column; gap: 15px; width: 100%;">' +
            '<div>' +
                '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">' +
                    '<h3 style="font-size: 14px; color: #fff; margin: 0; font-weight: 600;">Top Gainers</h3>' +
                    '<span style="font-size: 11px; color: #0ecb51;">● Live</span>' +
                '</div>' +
                '<div style="display: flex; flex-direction: row; overflow-x: auto; padding-bottom: 5px; scrollbar-width: none;">' +
                    gainers.map(c => buildCard(c)).join('') +
                '</div>' +
            '</div>' +
            '<div>' +
                '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">' +
                    '<h3 style="font-size: 14px; color: #fff; margin: 0; font-weight: 600;">Top Losers</h3>' +
                    '<span style="font-size: 11px; color: #f6465d;">● Live</span>' +
                '</div>' +
                '<div style="display: flex; flex-direction: row; overflow-x: auto; padding-bottom: 5px; scrollbar-width: none;">' +
                    losers.map(c => buildCard(c)).join('') +
                '</div>' +
            '</div>' +
        '</div>';
    }
}, 1000);

// ==========================================
// HIDE 26 ASSETS & FORCE COLORS ON LIVE DATA
// ==========================================
const hideTableStyle = document.createElement('style');
document.head.appendChild(hideTableStyle);

const brandColors = {
    'BTC': '#F7931A', 'ETH': '#627EEA', 'USDT': '#26A17B', 'BNB': '#F3BA2F',
    'SOL': '#14F195', 'USDC': '#2775CA', 'XRP': '#23292F', 'DOGE': '#C2A633',
    'ADA': '#0033AD', 'TRX': '#FF060A', 'AVAX': '#E84142', 'LINK': '#2A5ADA',
    'DOT': '#E6007A', 'MATIC': '#8247E5', 'POL': '#8247E5', 'SHIB': '#FFA409',
    'LTC': '#345D9D', 'BCH': '#8DC351', 'UNI': '#FF007A', 'XLM': '#7D00FF',
    'ATOM': '#2E3148', 'NEAR': '#00EC97', 'APT': '#000000', 'ARB': '#12AAFF',
    'OP': '#FF0420', 'FIL': '#0090FF', 'INJ': '#00D2FF', 'SUI': '#6FBCF0',
    'PEPE': '#D3AF30', 'RUNE': '#33FF99', 'WLD': '#000000', 'ETC': '#328332',
    'HBAR': '#222222', 'VET': '#15BDFF', 'ICP': '#29ABE2', 'RENDER': '#000000'
};

const iconMap = {
    'BTC': '₿', 'ETH': 'Ξ', 'USDT': '₮', 'BNB': 'B', 'SOL': 'S', 'USDC': 'U',
    'XRP': 'X', 'DOGE': 'Ð', 'ADA': '₳', 'TRX': 'T', 'AVAX': 'A', 'LINK': '⬡',
    'DOT': '•', 'MATIC': 'M', 'POL': 'P', 'SHIB': 'S', 'LTC': 'Ł', 'BCH': 'B',
    'UNI': 'U', 'XLM': 'X', 'ATOM': '⚛', 'NEAR': 'N', 'APT': 'A', 'ARB': 'A',
    'OP': 'O', 'FIL': 'F', 'INJ': 'I', 'SUI': 'S', 'PEPE': '🐸'
};

// FETCH INTERCEPTOR (STOPS COLOR FLASHING)
// ==========================================
const originalFetch = window.fetch;
window.fetch = async (...args) => {
    const response = await originalFetch(...args);
    const url = args[0];
    
    // Intercept only the market prices API call
    if (typeof url === 'string' && url.includes('/api/market/prices')) {
        try {
            const clone = response.clone();
            const data = await clone.json();
            
            const colorMap = {
                'BTC': '#F7931A', 'ETH': '#627EEA', 'USDT': '#26A17B', 'BNB': '#F3BA2F',
                'SOL': '#14F195', 'USDC': '#2775CA', 'XRP': '#23292F', 'DOGE': '#C2A633',
                'ADA': '#0033AD', 'TRX': '#FF060A', 'AVAX': '#E84142', 'LINK': '#2A5ADA',
                'DOT': '#E6007A', 'MATIC': '#8247E5', 'POL': '#8247E5', 'SHIB': '#FFA409',
                'LTC': '#345D9D', 'BCH': '#8DC351', 'UNI': '#FF007A', 'XLM': '#7D00FF',
                'ATOM': '#2E3148', 'NEAR': '#00EC97', 'APT': '#000000', 'ARB': '#12AAFF',
                'OP': '#FF0420', 'FIL': '#0090FF', 'INJ': '#00D2FF', 'SUI': '#6FBCF0',
                'PEPE': '#D3AF30', 'RUNE': '#33FF99', 'WLD': '#000000', 'ETC': '#328332'
            };

            const iconMap = {
                'BTC': '₿', 'ETH': 'Ξ', 'USDT': '₮', 'BNB': 'B', 'SOL': 'S',
                'USDC': 'U', 'XRP': 'X', 'DOGE': 'Ð', 'ADA': '₳', 'TRX': 'T',
                'AVAX': 'A', 'LINK': '⬡', 'DOT': '•', 'MATIC': 'M', 'POL': 'P',
                'SHIB': 'S', 'LTC': 'Ł', 'BCH': 'B', 'UNI': 'U', 'XLM': 'X',
                'ATOM': '⚛', 'NEAR': 'N', 'APT': 'A', 'ARB': 'A', 'OP': 'O',
                'FIL': 'F', 'INJ': 'I', 'SUI': 'S', 'PEPE': '🐸'
            };

            // Inject colors and icons into the data BEFORE app.js sees it
            const mappedData = data.map(coin => {
                const sym = coin.symbol.toUpperCase();
                return {
                    ...coin,
                    color: colorMap[sym] || '#2B3139',
                    icon: iconMap[sym] || sym.charAt(0).toUpperCase()
                };
            });

            // Return the modified data to app.js
            return new Response(JSON.stringify(mappedData), {
                status: response.status,
                statusText: response.statusText,
                headers: response.headers
            });
        } catch (e) {
            console.error("Fetch interceptor error:", e);
            return response; 
        }
    }
    return response;
};

// ==========================================

// ==========================================
// FIX GAINERS/LOSERS CARD OVERLAP & SCROLL
// ==========================================
const fixCardsStyle = document.createElement('style');
fixCardsStyle.innerHTML = `
    /* Target the rows inside the pro-gainers-losers container */
    #pro-gainers-losers > div > div > div {
        display: flex !important;
        flex-direction: row !important;
        flex-wrap: nowrap !important; /* Prevents wrapping */
        overflow-x: auto !important;
        -webkit-overflow-scrolling: touch !important; /* Smooth mobile scroll */
        scrollbar-width: none !important;
        padding-bottom: 5px !important;
        width: 100% !important;
    }
    
    /* Target the individual cards */
    #pro-gainers-losers > div > div > div > div {
        flex: 0 0 120px !important; /* Force a fixed width so they don't shrink */
        margin-right: 10px !important; /* Space between cards */
    }
`;
document.head.appendChild(fixCardsStyle);
