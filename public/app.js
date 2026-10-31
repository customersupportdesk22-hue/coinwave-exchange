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

const countries = [
    { name: "United States", flag: "🇺🇸" }, { name: "United Kingdom", flag: "🇬🇧" },
    { name: "Canada", flag: "🇨🇦" }, { name: "Australia", flag: "🇦🇺" },
    { name: "Nigeria", flag: "🇳🇬" }, { name: "Kenya", flag: "🇰🇪" },
    { name: "South Africa", flag: "🇿🇦" }, { name: "Ghana", flag: "🇬🇭" },
    { name: "India", flag: "🇮🇳" }, { name: "Germany", flag: "🇩🇪" },
    { name: "France", flag: "🇫🇷" }, { name: "Japan", flag: "🇯🇵" },
    { name: "UAE", flag: "🇦🇪" }, { name: "Brazil", flag: "🇧🇷" }
];

let currentTradeMode = 'buy';

// --- UI & VIEW MANAGEMENT ---
function showView(viewId, authType = 'login') {
    document.querySelectorAll('.app-view').forEach(view => view.style.display = 'none');
    document.getElementById(viewId).style.display = 'block';
    if (viewId === 'authView') switchAuth(authType);
    window.scrollTo(0, 0);
}

function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

function switchAuth(type) {
    document.getElementById('loginForm').style.display = type === 'login' ? 'block' : 'none';
    document.getElementById('registerForm').style.display = type === 'register' ? 'block' : 'none';
}

function populateCountries() {
    const select = document.getElementById('regCountry');
    if(!select) return;
    countries.forEach(country => {
        const option = document.createElement('option');
        option.value = `${country.flag} ${country.name}`;
        option.textContent = `${country.flag} ${country.name}`;
        select.appendChild(option);
    });
}

function populateTradeCoins() {
    const select = document.getElementById('tradeCoin');
    if(!select) return;
    select.innerHTML = ''; 
    markets.forEach(coin => {
        const option = document.createElement('option');
        option.value = coin.symbol;
        option.textContent = `${coin.name} (${coin.symbol})`;
        select.appendChild(option);
    });
}

// --- AUTHENTICATION GUARD ---
function requireAuth(targetView, mode = null) {
    const token = localStorage.getItem('token');
    if (!token) {
        showView('authView', 'login');
        showToast("Please log in to continue");
    } else {
        showView(targetView);
        if (targetView === 'tradeView') setTradeMode(mode || 'buy');
    }
}

// --- TRADING LOGIC ---
function setTradeMode(mode) {
    currentTradeMode = mode;
    const tabBuy = document.getElementById('tabBuy');
    const tabSell = document.getElementById('tabSell');
    const label = document.getElementById('amountLabel');
    const btn = document.getElementById('submitTradeBtn');

    if (mode === 'buy') {
        tabBuy.classList.add('active'); tabSell.classList.remove('active');
        label.textContent = 'Amount to Spend (USD)';
        btn.textContent = 'Confirm Purchase';
        btn.style.background = 'var(--success)';
    } else {
        tabSell.classList.add('active'); tabBuy.classList.remove('active');
        label.textContent = 'Amount to Sell (USD)';
        btn.textContent = 'Confirm Sale';
        btn.style.background = 'var(--danger)';
    }
    document.getElementById('tradeAmount').value = '';
    document.getElementById('tradeReceive').value = '';
}

function calcTrade() {
    const amount = parseFloat(document.getElementById('tradeAmount').value) || 0;
    const coinSymbol = document.getElementById('tradeCoin').value;
    const coin = markets.find(c => c.symbol === coinSymbol);
    
    if (coin && amount > 0) {
        const cryptoAmount = amount / coin.price;
        document.getElementById('tradeReceive').value = cryptoAmount.toFixed(6) + " " + coin.symbol;
    } else {
        document.getElementById('tradeReceive').value = '';
    }
}

async function submitTrade() {
    const user = JSON.parse(localStorage.getItem('user'));
    const amount = document.getElementById('tradeAmount').value;
    const coinSymbol = document.getElementById('tradeCoin').value;
    const receive = document.getElementById('tradeReceive').value;
    const method = document.getElementById('tradeMethod').value;

    if (!amount || amount <= 0) return showToast("Please enter a valid amount.");

    const coin = markets.find(c => c.symbol === coinSymbol);

    const orderData = {
        userEmail: user.email, userName: user.name, mode: currentTradeMode,
        sendAmount: amount, sendCurrency: currentTradeMode === 'buy' ? 'USD' : coinSymbol,
        getAmount: receive, getCurrency: currentTradeMode === 'buy' ? coinSymbol : 'USD',
        method: method, paymentDetails: "Pending", receivingWallet: "Pending"
    };

    try {
        const res = await fetch('/api/orders/create', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });
        const data = await res.json();
        
        if (res.ok) {
            showToast(`Order Placed! ID: ${data.orderId}`);
            setTimeout(() => showView('dashboardView'), 2000);
        } else {
            showToast(data.message || "Failed to place order.");
        }
    } catch (error) { showToast("Error connecting to server."); }
}

// --- AUTHENTICATION ---
async function handleRegister() {
    const name = document.getElementById('regName').value;
    const country = document.getElementById('regCountry').value;
    const phone = document.getElementById('regPhone').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;

    if (!name || !country || !phone || !email || !password) return showToast("Please fill in all fields.");

    try {
        const res = await fetch('/api/auth/register', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, country, phone, email, password })
        });
        const data = await res.json();
        if (res.ok) { showToast("Registration successful!"); switchAuth('login'); } 
        else { showToast(data.message || "Registration failed."); }
    } catch (error) { showToast("Error connecting to server."); }
}

async function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) return showToast("Please fill in all fields.");

    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (res.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            checkAuthState(); 
        } else { showToast(data.message || "Login failed."); }
    } catch (error) { showToast("Error connecting to server."); }
}

// --- STATE MANAGEMENT ---
function checkAuthState() {
    const user = JSON.parse(localStorage.getItem('user'));
    const navLinks = document.getElementById('navLinks');

    if (user) {
        navLinks.innerHTML = `
            <a href="#" onclick="showView('guestView')">Markets</a>
            <a href="#" class="profile-avatar-nav" onclick="showView('dashboardView')">${user.name.charAt(0).toUpperCase()}</a>
            <a href="#" class="btn-logout" onclick="handleLogout()">Logout</a>
        `;
        showView('dashboardView');
    } else {
        navLinks.innerHTML = `
            <a href="#" onclick="showView('guestView')">Markets</a>
            <a href="#" onclick="showView('authView', 'login')">Login</a>
            <a href="#" class="btn-primary" onclick="showView('authView', 'register')">Get Started</a>
        `;
        showView('guestView');
    }
}

function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    checkAuthState();
}

// --- LIVE MARKET SIMULATION ---
function simulateLiveMarket() {
    markets.forEach(coin => {
        const fluctuation = (Math.random() - 0.5) * (coin.price * 0.002);
        coin.price += fluctuation;
        const changeFluctuation = (Math.random() - 0.5) * 0.2;
        coin.change = parseFloat((coin.change + changeFluctuation).toFixed(2));
    });
}

function loadMarkets() {
    const marketList = document.getElementById('market-list');
    const ticker = document.getElementById('ticker');
    if(!marketList) return;
    
    let marketHTML = '';
    let tickerHTML = '';

    markets.forEach((coin, index) => {
        const isUp = coin.change >= 0;
        const changeClass = isUp ? 'up' : 'down';
        const changeSymbol = isUp ? '↑' : '↓';
        let formattedPrice = coin.price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 6});
        if (coin.price < 0.01) formattedPrice = coin.price.toFixed(7);

        marketHTML += `
            <div class="market-row" onclick="quickTrade('${coin.symbol}')">
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

function quickTrade(symbol) {
    requireAuth('tradeView', 'buy');
    setTimeout(() => {
        document.getElementById('tradeCoin').value = symbol;
        calcTrade();
    }, 100);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    populateCountries();
    populateTradeCoins();
    loadMarkets();
    checkAuthState();
    setInterval(() => { simulateLiveMarket(); loadMarkets(); }, 2000);
});
