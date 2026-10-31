const markets = [
    { name: 'Bitcoin', symbol: 'BTC', price: 68245.32, change: 2.48, icon: '₿', color: '#f7931a' },
    { name: 'Ethereum', symbol: 'ETH', price: 3845.10, change: 1.12, icon: 'Ξ', color: '#627eea' },
    { name: 'Solana', symbol: 'SOL', price: 187.32, change: 5.20, icon: 'S', color: '#00d2ff' },
    { name: 'BNB', symbol: 'BNB', price: 590.40, change: -0.45, icon: 'B', color: '#f3ba2f' },
    { name: 'XRP', symbol: 'XRP', price: 2.91, change: -1.20, icon: 'X', color: '#23292f' }
];

function loadMarkets() {
    const marketList = document.getElementById('market-list');
    const ticker = document.getElementById('ticker');
    let marketHTML = '';
    let tickerHTML = '';

    markets.forEach(coin => {
        const isUp = coin.change >= 0;
        const changeClass = isUp ? 'up' : 'down';
        const changeSymbol = isUp ? '↑' : '↓';

        marketHTML += `
            <div class="market-item">
                <div class="market-left">
                    <div class="market-icon" style="background: ${coin.color};">${coin.icon}</div>
                    <div>
                        <div class="market-name">${coin.name}</div>
                        <div class="market-symbol">${coin.symbol}/USDT</div>
                    </div>
                </div>
                <div class="market-right">
                    <div class="market-price">$${coin.price.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
                    <div class="market-change ${changeClass}">${changeSymbol} ${Math.abs(coin.change)}%</div>
                </div>
            </div>
        `;

        tickerHTML += `
            <div class="ticker-item">
                <b>${coin.symbol}</b> $${coin.price.toLocaleString()} 
                <span class="${changeClass}">${changeSymbol}${Math.abs(coin.change)}%</span>
            </div>
        `;
    });

    marketList.innerHTML = marketHTML;
    ticker.innerHTML = tickerHTML + tickerHTML; 
}

document.addEventListener('DOMContentLoaded', loadMarkets);
