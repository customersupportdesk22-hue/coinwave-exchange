// Base Market Data (Premium/High Prices)
const markets = [
    { name: 'Bitcoin', symbol: 'BTC', price: 85245.32, change: 2.48, icon: '₿', color: '#f7931a' },
    { name: 'Ethereum', symbol: 'ETH', price: 5245.10, change: 1.12, icon: 'Ξ', color: '#627eea' },
    { name: 'Solana', symbol: 'SOL', price: 252.32, change: 5.20, icon: 'S', color: '#00d2ff' },
    { name: 'BNB', symbol: 'BNB', price: 720.40, change: -0.45, icon: 'B', color: '#f3ba2f' },
    { name: 'XRP', symbol: 'XRP', price: 3.91, change: -1.20, icon: 'X', color: '#23292f' },
    { name: 'Cardano', symbol: 'ADA', price: 1.25, change: 3.10, icon: 'A', color: '#0033ad' },
    { name: 'Dogecoin', symbol: 'DOGE', price: 0.28, change: 1.45, icon: 'Ð', color: '#c2a633' },
    { name: 'Avalanche', symbol: 'AVAX', price: 45.20, change: -2.10, icon: 'A', color: '#e84142' },
    { name: 'Polkadot', symbol: 'DOT', price: 12.15, change: 0.50, icon: '●', color: '#e6007a' },
    { name: 'Chainlink', symbol: 'LINK', price: 28.40, change: 4.20, icon: '⬡', color: '#2a5ada' },
    { name: 'Polygon', symbol: 'MATIC', price: 1.12, change: -1.15, icon: 'M', color: '#8247e5' },
    { name: 'Shiba Inu', symbol: 'SHIB', price: 0.000045, change: 6.80, icon: 'S', color: '#f00500' },
    { name: 'Litecoin', symbol: 'LTC', price: 112.10, change: 1.05, icon: 'Ł', color: '#345d9d' },
    { name: 'TRON', symbol: 'TRX', price: 0.23, change: 0.80, icon: 'T', color: '#eb0029' },
    { name: 'Uniswap', symbol: 'UNI', price: 15.20, change: -0.90, icon: 'U', color: '#ff007a' },
    { name: 'Cosmos', symbol: 'ATOM', price: 14.80, change: 2.10, icon: '⚛', color: '#2e3148' },
    { name: 'Stellar', symbol: 'XLM', price: 0.22, change: -1.50, icon: 'X', color: '#000000' },
    { name: 'NEAR Protocol', symbol: 'NEAR', price: 9.50, change: 3.40, icon: 'N', color: '#00ec97' },
    { name: 'Aptos', symbol: 'APT', price: 15.20, change: -2.30, icon: 'A', color: '#000000' },
    { name: 'Arbitrum', symbol: 'ARB', price: 2.15, change: 1.80, icon: 'A', color: '#12aaff' },
    { name: 'Optimism', symbol: 'OP', price: 4.40, change: 0.40, icon: 'O', color: '#ff0420' },
    { name: 'Filecoin', symbol: 'FIL', price: 8.80, change: -1.10, icon: 'F', color: '#0090ff' },
    { name: 'Injective', symbol: 'INJ', price: 35.10, change: 7.20, icon: 'I', color: '#00d2ff' },
    { name: 'Sui', symbol: 'SUI', price: 2.65, change: 4.50, icon: 'S', color: '#6fbcf0' },
    { name: 'Pepe', symbol: 'PEPE', price: 0.000018, change: 12.40, icon: '🐸', color: '#3d8130' }
];

function simulateLiveMarket() {
    markets.forEach(coin => {
        // Higher fluctuation based on the new high prices
        const fluctuation = (Math.random() - 0.5) * (coin.price * 0.002);
        coin.price += fluctuation;
        
        const changeFluctuation = (Math.random() - 0.5) * 0.2;
        coin.change = parseFloat((coin.change + changeFluctuation).toFixed(2));
    });
}

function loadMarkets() {
    const marketList = document.getElementById('market-list');
    const ticker = document.getElementById('ticker');
    
    let marketHTML = '';
    let tickerHTML = '';

    markets.forEach((coin, index) => {
        const isUp = coin.change >= 0;
        const changeClass = isUp ? 'up' : 'down';
        const changeSymbol = isUp ? '↑' : '↓';

        let formattedPrice = coin.price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 6});
        if (coin.price < 0.01) formattedPrice = coin.price.toFixed(7);

        marketHTML += `
            <div class="market-row">
                <div class="market-rank">${index + 1}</div>
                <div class="market-name-col">
                    <div class="market-icon" style="background: ${coin.color};">${coin.icon}</div>
                    <div>
                        <div class="market-name-text">${coin.name}</div>
                        <div class="market-symbol-text">${coin.symbol}</div>
                    </div>
                </div>
                <div class="market-price">$${formattedPrice}</div>
                <div class="market-change ${changeClass}">${changeSymbol} ${Math.abs(coin.change)}%</div>
            </div>
        `;

        tickerHTML += `
            <div class="ticker-item">
                <b>${coin.symbol}</b> $${formattedPrice} 
                <span class="${changeClass}">${changeSymbol}${Math.abs(coin.change)}%</span>
            </div>
        `;
    });

    marketList.innerHTML = marketHTML;
    ticker.innerHTML = tickerHTML + tickerHTML; 
}

document.addEventListener('DOMContentLoaded', () => {
    loadMarkets();
    setInterval(() => {
        simulateLiveMarket();
        loadMarkets();
    }, 2000);
});
