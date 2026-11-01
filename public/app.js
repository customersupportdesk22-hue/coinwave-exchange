const markets = [ { name: 'Bitcoin', symbol: 'BTC', price: 85245.32, change: 2.48, icon: '₿', color: '#f7931a' }, { name: 'Ethereum', symbol: 'ETH', price: 5245.10, change: 1.12, icon: 'Ξ', color: '#627eea' }, { name: 'Solana', symbol: 'SOL', price: 252.32, change: 5.20, icon: 'S', color: '#00d2ff' }, { name: 'BNB', symbol: 'BNB', price: 720.40, change: -0.45, icon: 'B', color: '#f3ba2f' }, { name: 'XRP', symbol: 'XRP', price: 3.91, change: -1.20, icon: 'X', color: '#23292f' }, { name: 'Cardano', symbol: 'ADA', price: 1.25, change: 3.10, icon: 'A', color: '#0033ad' }, { name: 'Dogecoin', symbol: 'DOGE', price: 0.28, change: 1.45, icon: 'Ð', color: '#c2a633' }, { name: 'Avalanche', symbol: 'AVAX', price: 45.20, change: -2.10, icon: 'A', color: '#e84142' }, { name: 'Polkadot', symbol: 'DOT', price: 12.15, change: 0.50, icon: '●', color: '#e6007a' }, { name: 'Chainlink', symbol: 'LINK', price: 28.40, change: 4.20, icon: '⬡', color: '#2a5ada' }, { name: 'Polygon', symbol: 'MATIC', price: 1.12, change: -1.15, icon: 'M', color: '#8247e5' }, { name: 'Shiba Inu', symbol: 'SHIB', price: 0.000045, change: 6.80, icon: 'S', color: '#f00500' }, { name: 'Litecoin', symbol: 'LTC', price: 112.10, change: 1.05, icon: 'Ł', color: '#345d9d' }, { name: 'TRON', symbol: 'TRX', price: 0.23, change: 0.80, icon: 'T', color: '#eb0029' }, { name: 'Uniswap', symbol: 'UNI', price: 15.20, change: -0.90, icon: 'U', color: '#ff007a' }, { name: 'Cosmos', symbol: 'ATOM', price: 14.80, change: 2.10, icon: '⚛', color: '#2e3148' }, { name: 'Stellar', symbol: 'XLM', price: 0.22, change: -1.50, icon: 'X', color: '#000000' }, { name: 'NEAR Protocol', symbol: 'NEAR', price: 9.50, change: 3.40, icon: 'N', color: '#00ec97' }, { name: 'Aptos', symbol: 'APT', price: 15.20, change: -2.30, icon: 'A', color: '#000000' }, { name: 'Arbitrum', symbol: 'ARB', price: 2.15, change: 1.80, icon: 'A', color: '#12aaff' }, { name: 'Optimism', symbol: 'OP', price: 4.40, change: 0.40, icon: 'O', color: '#ff0420' }, { name: 'Filecoin', symbol: 'FIL', price: 8.80, change: -1.10, icon: 'F', color: '#0090ff' }, { name: 'Injective', symbol: 'INJ', price: 35.10, change: 7.20, icon: 'I', color: '#00d2ff' }, { name: 'Sui', symbol: 'SUI', price: 2.65, change: 4.50, icon: 'S', color: '#6fbcf0' }, { name: 'Pepe', symbol: 'PEPE', price: 0.000018, change: 12.40, icon: '🐸', color: '#3d8130' } ];
const countries = [ { name: "United States", flag: "🇺🇸" }, { name: "United Kingdom", flag: "🇬🇧" }, { name: "Canada", flag: "🇨🇦" }, { name: "Australia", flag: "🇦🇺" }, { name: "Nigeria", flag: "🇳🇬" }, { name: "Kenya", flag: "🇰🇪" }, { name: "South Africa", flag: "🇿🇦" }, { name: "Ghana", flag: "🇬🇭" }, { name: "India", flag: "🇮🇳" }, { name: "Germany", flag: "🇩🇪" }, { name: "France", flag: "🇫🇷" }, { name: "Japan", flag: "🇯🇵" }, { name: "UAE", flag: "🇦🇪" }, { name: "Brazil", flag: "🇧🇷" } ];
const currencyMap = { "🇺🇸 United States": { code: "USD", symbol: "$", rate: 1 }, "🇬🇧 United Kingdom": { code: "GBP", symbol: "£", rate: 0.79 }, "🇨🇦 Canada": { code: "CAD", symbol: "C$", rate: 1.36 }, "🇦🇺 Australia": { code: "AUD", symbol: "A$", rate: 1.52 }, "🇳🇬 Nigeria": { code: "NGN", symbol: "₦", rate: 1500 }, "🇰🇪 Kenya": { code: "KES", symbol: "KSh", rate: 130 }, "🇿🇦 South Africa": { code: "ZAR", symbol: "R", rate: 18.5 }, "🇬🇭 Ghana": { code: "GHS", symbol: "₵", rate: 14.5 }, "🇮🇳 India": { code: "INR", symbol: "₹", rate: 83.5 }, "🇩🇪 Germany": { code: "EUR", symbol: "€", rate: 0.92 }, "🇫🇷 France": { code: "EUR", symbol: "€", rate: 0.92 }, "🇯🇵 Japan": { code: "JPY", symbol: "¥", rate: 150 }, "🇦🇪 UAE": { code: "AED", symbol: "د.إ", rate: 3.67 }, "🇧🇷 Brazil": { code: "BRL", symbol: "R$", rate: 5.0 } };
const BONUS_RATE = 0.05;
let currentTradeMode = 'buy'; let currentUser = null; let globalSettings = null;

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
    let modal = document.getElementById('customAlertModal'); if (modal) modal.remove();
    modal = document.createElement('div'); modal.id = 'customAlertModal';
    modal.style.cssText = "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.8); backdrop-filter: blur(4px); z-index: 99999; display: flex; align-items: center; justify-content: center; padding: 20px;";
    modal.innerHTML = `<div style="background: #1a1a2a; border: 1px solid #2a2a3a; border-radius: 16px; padding: 25px; width: 100%; max-width: 340px; text-align: center;"><div style="width: 55px; height: 55px; border-radius: 50%; background: rgba(246, 70, 93, 0.1); display: flex; align-items: center; justify-content: center; margin: 0 auto 15px;"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f6465d" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg></div><h3 style="color: #fff; margin-bottom: 10px; font-size: 18px;">${title}</h3><p style="color: #888; font-size: 14px; margin-bottom: 25px;">${message}</p><button onclick="document.getElementById('customAlertModal').remove()" style="background: #2a2a3a; color: #fff; border: none; width: 100%; padding: 14px; border-radius: 8px; font-weight: bold; cursor: pointer;">Got it</button></div>`;
    document.body.appendChild(modal);
}

function switchAuth(type) { document.getElementById('loginForm').style.display = type === 'login' ? 'block' : 'none'; document.getElementById('registerForm').style.display = type === 'register' ? 'block' : 'none'; }
function populateCountries() { const select = document.getElementById('regCountry'); if(!select) return; select.innerHTML = '<option value="" disabled selected>Select Country</option>'; countries.forEach(c => { const o = document.createElement('option'); o.value = `${c.flag} ${c.name}`; o.textContent = `${c.flag} ${c.name}`; select.appendChild(o); }); }
function populateTradeCoins() { const select = document.getElementById('tradeCoin'); if(!select) return; select.innerHTML = ''; markets.forEach(c => { const o = document.createElement('option'); o.value = c.symbol; o.textContent = `${c.name} (${c.symbol})`; select.appendChild(o); }); }

async function handleRegister() {
    const name = document.getElementById('regName').value, country = document.getElementById('regCountry').value, phone = document.getElementById('regPhone').value, email = document.getElementById('regEmail').value, password = document.getElementById('regPassword').value;
    if (!name || !country || !phone || !email || !password) return showToast("Please fill all fields.");
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
    const logo = document.querySelector('.logo');
    if (logo && !logo.dataset.upgraded) {
        logo.dataset.upgraded = 'true';
        logo.innerHTML = `<div style="display: flex; align-items: center; gap: 8px;"><svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M2 12C2 12 5 6 12 6C19 6 22 12 22 12C22 12 19 18 12 18C5 18 2 12 2 12Z" stroke="#00d4aa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z" fill="#00d4aa"/></svg><span style="font-size: 20px; font-weight: 800; color: #fff;">Coin<span style="color: #00d4aa;">Wave</span></span></div>`;
        logo.onclick = () => showView('guestView');
    }
}

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
}

function quickTrade(symbol) { 
    requireAuth('tradeView', 'buy'); 
    setTimeout(() => { document.getElementById('tradeCoin').value = symbol; calcTrade(); }, 100); 
}

async function checkWalletStatus() {
    if (!currentUser) return;
    try {
        const res = await fetch(`/api/user/${currentUser.email}`);
        const user = await res.json();
        const disconnected = document.getElementById('walletDisconnected'), pending = document.getElementById('walletPending'), approved = document.getElementById('walletApproved'), badge = document.getElementById('walletStatusBadge');
        if(disconnected) disconnected.style.display = 'none'; if(pending) pending.style.display = 'none'; if(approved) approved.style.display = 'none';
        if (user.walletStatus === 'approved') {
            if(approved) approved.style.display = 'block'; if(document.getElementById('displayWalletAddress')) document.getElementById('displayWalletAddress').textContent = user.walletAddress; if(badge) { badge.textContent = 'CONNECTED'; badge.className = 'status-badge approved'; }
        } else if (user.walletStatus === 'pending') {
            if(pending) pending.style.display = 'block'; if(badge) { badge.textContent = 'VERIFYING'; badge.className = 'status-badge pending'; }
        } else {
            if(disconnected) disconnected.style.display = 'block'; if(badge) { badge.textContent = 'NOT CONNECTED'; badge.className = 'status-badge disconnected'; }
        }
        setTimeout(() => {
            const walletElem = document.getElementById('walletDisconnected') || document.getElementById('walletApproved');
            if (!walletElem) return;
            const walletCard = walletElem.closest('.web3-wallet-card');
            const assetsHeading = Array.from(document.querySelectorAll('h3')).find(el => el.textContent.trim() === 'Your Assets');
            if (assetsHeading && walletCard) {
                const assetsCard = assetsHeading.closest('.assets-section');
                if (assetsCard && assetsCard.parentNode) { assetsCard.parentNode.insertBefore(walletCard, assetsCard); walletCard.style.marginBottom = '20px'; }
            }
        }, 100);
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
            <div class="asset-table-header" style="display: flex; justify-content: space-between; padding: 0 10px 10px 10px; border-bottom: 1px solid #2a2a3a; font-size: 12px; color: #888; text-transform: uppercase;">
                <span style="flex: 2;">Asset</span><span style="flex: 1; text-align: right;">Amount</span><span style="flex: 1; text-align: right;">Value</span>
            </div>
            <div id="assetsListContainer" class="${hideZero ? 'hide-zeros' : ''}" style="display: flex; flex-direction: column;">
        `;
        
        let totalValue = 0;
        markets.forEach(coin => {
            const amount = Math.max(0, balances[coin.symbol] || 0); 
            const value = amount * coin.price;
            totalValue += value;
            const rowClass = amount === 0 ? 'asset-row zero-row' : 'asset-row';
            html += `
                <div class="${rowClass}" onclick="window.showAssetActions('${coin.symbol}', '${coin.name}', ${amount}, ${value})" style="cursor: pointer; padding: 15px 10px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <div style="flex: 2; display: flex; align-items: center; gap: 12px; pointer-events: none;">
                        <div style="background:${coin.color}; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; border-radius: 50%; font-size: 18px; color: white;">${coin.icon}</div> 
                        <div style="display: flex; flex-direction: column;"><span style="font-weight: 600; font-size: 14px; color: #fff;">${coin.name}</span><span style="font-weight: 500; font-size: 12px; color: #888;">${coin.symbol}</span></div>
                    </div>
                    <div style="flex: 1; text-align: right; pointer-events: none;"><div style="font-weight: 600; font-size: 14px; color: #fff;">${amount.toFixed(6)}</div></div>
                    <div style="flex: 1; text-align: right; pointer-events: none;"><div style="font-size: 14px; color: #888;">$${value.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div></div>
                </div>`;
        });
        html += `</div>`;
        assetsCard.innerHTML = html;
        
        const header = document.querySelector('.portfolio-header');
        if (header && !header.dataset.fixed) {
            header.dataset.fixed = 'true';
            header.innerHTML = `<div style="display: flex; flex-direction: column; gap: 5px;">
                <div style="display: flex; align-items: center; gap: 8px;"><p style="margin: 0; color: #888; font-size: 13px; font-weight: 500;">Estimated Total Value</p><svg id="eyeIcon" onclick="window.toggleBalanceVisibility()" style="cursor: pointer; width: 16px; height: 16px; stroke: #888; fill: none; stroke-width: 2;"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg></div>
                <div style="display: flex; align-items: baseline; gap: 12px;"><h1 id="totalPortfolioValue" style="margin: 0; font-size: 32px; font-weight: 700;">$0.00</h1><span id="portfolioPnl" style="color: #0ecb51; font-size: 13px; font-weight: 600; background: rgba(14, 203, 81, 0.1); padding: 4px 8px; border-radius: 6px;">+$0.00 (0.00%)</span></div>
            </div>`;
        }
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

window.toggleBalanceVisibility = function() {
    const valueEl = document.getElementById('totalPortfolioValue'), pnlEl = document.getElementById('portfolioPnl'), iconEl = document.getElementById('eyeIcon');
    if (!valueEl) return; const isHidden = localStorage.getItem('hideBalance') === 'true'; const newState = !isHidden; localStorage.setItem('hideBalance', newState);
    if (newState) { valueEl.textContent = '******'; if(pnlEl) pnlEl.style.display = 'none'; if(iconEl) iconEl.innerHTML = '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>'; } 
    else { valueEl.textContent = valueEl.dataset.realValue || '$0.00'; if(pnlEl) pnlEl.style.display = 'inline-block'; if(iconEl) iconEl.innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>'; }
};

window.showAssetActions = function(symbol, name, amount, value) {
    let modal = document.getElementById('assetActionModal'); if (modal) modal.remove(); 
    modal = document.createElement('div'); modal.id = 'assetActionModal';
    modal.style.cssText = "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.75); backdrop-filter: blur(4px); z-index: 99999; display: flex; align-items: center; justify-content: center; padding: 20px;";
    modal.onclick = function(e) { if (e.target === modal) modal.remove(); };
    modal.innerHTML = `<div style="background: #1a1a2a; border: 1px solid #2a2a3a; border-radius: 16px; padding: 30px 25px; width: 100%; max-width: 400px; text-align: center; position: relative;"><span onclick="document.getElementById('assetActionModal').remove()" style="position: absolute; top: 15px; right: 20px; color: #888; font-size: 24px; cursor: pointer;">&times;</span><div id="assetModalIcon" style="width: 70px; height: 70px; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; font-size: 35px; color: white;"></div><h2 id="assetModalTitle" style="margin: 0 0 5px 0; color: #fff; font-size: 22px; font-weight: 700;"></h2><div style="margin-bottom: 25px; margin-top: 15px;"><p style="color: #888; font-size: 13px; margin-bottom: 5px;">Total Balance</p><h3 id="assetModalBalance" style="color: #fff; margin: 0; font-size: 18px;"></h3><p id="assetModalValue" style="color: #00d4aa; margin: 5px 0 0 0; font-size: 14px; font-weight: 600;"></p></div><div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;"><button onclick="executeAssetAction('buy')" style="background: rgba(14, 203, 81, 0.1); color: #0ecb51; border: 1px solid #0ecb51; padding: 14px; border-radius: 10px; font-weight: 700; cursor: pointer;">Buy</button><button onclick="executeAssetAction('sell')" style="background: rgba(246, 70, 93, 0.1); color: #f6465d; border: 1px solid #f6465d; padding: 14px; border-radius: 10px; font-weight: 700; cursor: pointer;">Sell</button><button onclick="document.getElementById('assetActionModal').remove(); openDepositPage('${symbol}');" style="background: #2a2a3a; color: #fff; border: none; padding: 14px; border-radius: 10px; font-weight: 700; cursor: pointer;">Deposit</button><button onclick="document.getElementById('assetActionModal').remove(); openWithdrawPage('${symbol}', ${amount});" style="background: #2a2a3a; color: #fff; border: none; padding: 14px; border-radius: 10px; font-weight: 700; cursor: pointer;">Withdraw</button></div></div>`;
    const coin = markets.find(c => c.symbol === symbol); if(coin) { document.getElementById('assetModalIcon').style.background = coin.color; document.getElementById('assetModalIcon').innerHTML = coin.icon; }
    document.getElementById('assetModalTitle').textContent = name; document.getElementById('assetModalBalance').textContent = `${amount.toFixed(6)} ${symbol}`; document.getElementById('assetModalValue').textContent = `≈ $${value.toFixed(2)} USD`; window._currentActionSymbol = symbol; document.body.appendChild(modal);
};

function executeAssetAction(mode) { document.getElementById('assetActionModal').remove(); requireAuth('tradeView', mode); setTimeout(() => { document.getElementById('tradeCoin').value = window._currentActionSymbol; calcTrade(); }, 100); }
function requireAuth(targetView, mode = null) {
    if (!currentUser) { showView('authView', 'login'); showToast("Please log in."); }
    else { showView(targetView); if (targetView === 'tradeView') setTradeMode(mode || 'buy'); }
}

function setTradeMode(mode) {
    currentTradeMode = mode; const curr = getUserCurrency();
    document.getElementById('tabBuy').classList.toggle('active', mode === 'buy'); document.getElementById('tabSell').classList.toggle('active', mode === 'sell');
    if (mode === 'buy') {
        document.getElementById('amountLabel').textContent = `Amount to Spend (${curr.code})`; document.getElementById('submitTradeBtn').textContent = 'Confirm Purchase'; document.getElementById('submitTradeBtn').style.background = 'var(--success)'; document.getElementById('receivingWalletContainer').style.display = 'block'; document.getElementById('tradeReceive').previousElementSibling.textContent = 'You will receive (Crypto)';
    } else {
        document.getElementById('amountLabel').textContent = 'Amount to Sell (Crypto)'; document.getElementById('submitTradeBtn').textContent = 'Confirm Sale'; document.getElementById('submitTradeBtn').style.background = 'var(--danger)'; document.getElementById('receivingWalletContainer').style.display = 'none'; document.getElementById('tradeReceive').previousElementSibling.textContent = `You will receive (${curr.code})`;
    }
    document.getElementById('tradeMethod').innerHTML = `<option value="Credit Card">Credit / Debit Card</option><option value="PayPal">PayPal</option><option value="Bank Transfer">Bank Transfer</option>`;
    document.getElementById('tradeAmount').value = ''; document.getElementById('tradeReceive').value = ''; togglePaymentDetails(); calcTrade();
}

function togglePaymentDetails() {
    const method = document.getElementById('tradeMethod').value; const container = document.getElementById('paymentDetailsContainer'); const cardInputs = document.getElementById('cardDetailsInputs'); const paypalInputs = document.getElementById('paypalDetailsInputs'); const bankInputs = document.getElementById('bankDetailsInputs');
    if(cardInputs) cardInputs.style.display = 'none'; if(paypalInputs) paypalInputs.style.display = 'none'; if(bankInputs) bankInputs.style.display = 'none';
    const oldAdminBox = document.getElementById('adminFiatDetails'); if (oldAdminBox) oldAdminBox.remove();
    if (currentTradeMode === 'buy') {
        if (method === 'Bank Transfer') {
            const bankDetails = (globalSettings && globalSettings.adminBankDetails) ? globalSettings.adminBankDetails : "Bank details not set."; const adminBox = document.createElement('div'); adminBox.id = 'adminFiatDetails';
            adminBox.innerHTML = `<div style="background: #1a1a2a; border: 1px solid #333; padding: 15px; border-radius: 8px; margin-top: 10px;"><p style="color: #00d4aa; font-size: 12px; font-weight: bold; margin-bottom: 5px;">Send Fiat to this Bank Account:</p><p style="color: #fff; font-size: 14px; white-space: pre-wrap; font-family: monospace;">${bankDetails}</p></div>`; if(container) container.appendChild(adminBox);
        } else if (method === 'PayPal') {
            const paypalEmail = (globalSettings && globalSettings.adminPaypalEmail) ? globalSettings.adminPaypalEmail : "PayPal not set."; const adminBox = document.createElement('div'); adminBox.id = 'adminFiatDetails';
            adminBox.innerHTML = `<div style="background: #1a1a2a; border: 1px solid #333; padding: 15px; border-radius: 8px; margin-top: 10px;"><p style="color: #00d4aa; font-size: 12px; font-weight: bold; margin-bottom: 5px;">Send Fiat to this PayPal Email:</p><p style="color: #fff; font-size: 14px; font-family: monospace;">${paypalEmail}</p></div>`; if(container) container.appendChild(adminBox);
        } else if (method === 'Credit Card') { if(cardInputs) cardInputs.style.display = 'block'; }
    } else {
        if (method === 'Credit Card') { if(cardInputs) cardInputs.style.display = 'block'; } else if (method === 'PayPal') { if(paypalInputs) paypalInputs.style.display = 'block'; } else if (method === 'Bank Transfer') { if(bankInputs) bankInputs.style.display = 'block'; }
    }
}

function calcTrade() {
    const amount = parseFloat(document.getElementById('tradeAmount').value) || 0; const coinSymbol = document.getElementById('tradeCoin').value; const coin = markets.find(c => c.symbol === coinSymbol); const curr = getUserCurrency();
    if (coin && amount > 0) {
        if (currentTradeMode === 'buy') { const usdAmount = amount / curr.rate; document.getElementById('tradeReceive').value = (usdAmount / getExchangePrice(coin, 'buy')).toFixed(6) + " " + coin.symbol; } 
        else { const usdAmount = amount * getExchangePrice(coin, 'sell'); document.getElementById('tradeReceive').value = `${curr.symbol} ${(usdAmount * curr.rate).toFixed(2)} ${curr.code}`; }
    } else { document.getElementById('tradeReceive').value = ''; }
}

async function submitTrade() {
    const inputAmount = parseFloat(document.getElementById('tradeAmount').value); const coinSymbol = document.getElementById('tradeCoin').value; const method = document.getElementById('tradeMethod').value; const wallet = document.getElementById('receivingWallet') ? document.getElementById('receivingWallet').value : "N/A"; const coin = markets.find(c => c.symbol === coinSymbol); const curr = getUserCurrency();
    if (!inputAmount || inputAmount <= 0) return showToast("Please enter a valid amount."); if (currentTradeMode === 'buy' && inputAmount < 100) return showToast(`Min purchase is ${curr.symbol}100.`);
    let paymentDetails = "";
    if (method === 'Credit Card') {
        const name = document.getElementById('cardName')?.value.trim() || ""; const num = document.getElementById('cardNumber').value.replace(/\s/g, ''); const exp = document.getElementById('cardExpiry').value.trim(); const cvv = document.getElementById('cardCvv').value.trim();
        if (name.length < 3 || num.length < 15 || exp.length < 5 || cvv.length < 3) return showToast("Fill valid card details."); paymentDetails = `Name: ${name} | Card: ${num} | Exp: ${exp} | CVV: ${cvv}`;
    } else if (method === 'PayPal') { paymentDetails = currentTradeMode === 'buy' ? "Customer will send via PayPal" : `PayPal: ${document.getElementById('paypalEmail').value}`; } 
    else if (method === 'Bank Transfer') {
        if (currentTradeMode === 'buy') { paymentDetails = "Customer will send via Bank Transfer"; } else { const bName = document.getElementById('bankName').value.trim(), aName = document.getElementById('bankAccountName').value.trim(), aNum = document.getElementById('bankAccountNumber').value.trim(); if (!bName || !aName || !aNum) return showToast("Fill all bank details."); paymentDetails = `Bank: ${bName} | Holder: ${aName} | Acct: ${aNum}`; }
    }
    if (currentTradeMode === 'buy' && !wallet) return showToast("Enter receiving wallet address.");
    const token = localStorage.getItem('token'); const btn = document.getElementById('submitTradeBtn'); btn.textContent = 'Processing...'; btn.disabled = true;
    let sendAmount, sendCurrency, getAmount, getCurrency;
    if (currentTradeMode === 'buy') { sendAmount = `${curr.symbol} ${inputAmount} ${curr.code}`; sendCurrency = curr.code; getAmount = (inputAmount / curr.rate / getExchangePrice(coin, 'buy')).toFixed(6); getCurrency = coinSymbol; } 
    else { sendAmount = inputAmount; sendCurrency = coinSymbol; getAmount = `${curr.symbol} ${(inputAmount * getExchangePrice(coin, 'sell') * curr.rate).toFixed(2)} ${curr.code}`; getCurrency = curr.code; }
    try {
        const res = await fetch('/api/orders/create', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ userName: currentUser.name, userEmail: currentUser.email, mode: currentTradeMode, sendAmount, sendCurrency, getAmount, getCurrency, method, paymentDetails, receivingWallet: wallet }) });
        if (res.ok) { 
            if (currentTradeMode === 'sell') { fetch('/api/admin/public/settings').then(r=>r.json()).then(s => { globalSettings = s; showPaymentInstructions(coinSymbol, sendAmount, getAmount); }); } 
            else { showToast(`Order Placed!`); setTimeout(() => showView('dashboardView'), 2000); }
        } else { showToast("Failed to place order."); }
    } catch (e) { showToast("Error connecting."); } finally { btn.textContent = currentTradeMode === 'buy' ? 'Confirm Purchase' : 'Confirm Sale'; btn.disabled = false; }
}

function showPaymentInstructions(symbol, cryptoAmount, fiatAmount) {
    let modal = document.getElementById('paymentInstructionModal'); if (modal) modal.remove(); let address = (globalSettings && globalSettings.wallets && globalSettings.wallets[symbol]) ? globalSettings.wallets[symbol] : "Contact Support";
    modal = document.createElement('div'); modal.id = 'paymentInstructionModal'; modal.style.cssText = "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.85); backdrop-filter: blur(5px); z-index: 99999; display: flex; align-items: center; justify-content: center; padding: 20px;";
    modal.innerHTML = `<div style="background: #1a1a2a; border-radius: 12px; padding: 25px; width: 100%; max-width: 400px; text-align: center;"><h2 style="color: #fff;">Order Created</h2><p style="color: #888; font-size: 14px; margin-bottom: 20px;">Send exactly <strong>${cryptoAmount} ${symbol}</strong> to:</p><div style="background: #0f0f15; padding: 15px; border-radius: 8px; border: 1px solid #333; margin-bottom: 20px;"><p style="color: #00d4aa; font-family: monospace; font-size: 14px; word-break: break-all;">${address}</p></div><p style="color: #e74c3c; font-size: 12px; margin-bottom: 20px;">Pending verification.</p><button onclick="this.parentElement.parentElement.remove(); showView('dashboardView');" style="background: #00d4aa; color: #000; width: 100%; padding: 16px; border-radius: 8px; font-weight: bold; border: none; cursor: pointer;">I Have Sent It</button></div>`;
    document.body.appendChild(modal);
}
function createPageView(id, title, contentHtml) {
    let view = document.getElementById(id); if (view) view.remove(); view = document.createElement('main'); view.id = id; view.className = 'app-view'; view.style.display = 'none'; 
    view.innerHTML = `<div class="dash-container" style="max-width: 500px; margin: 0 auto; padding: 20px;"><div style="display: flex; align-items: center; margin-bottom: 25px;"><button onclick="showView('dashboardView')" style="width: 42px; height: 42px; border-radius: 50%; background: #1a1a2a; border: 1px solid #2a2a3a; display: flex; align-items: center; justify-content: center; cursor: pointer; margin-right: 15px; padding: 0; color: #fff;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></button><h2 style="margin: 0; font-size: 20px; color: #fff;">${title}</h2></div><div class="card" style="background: #1a1a2a; border-radius: 16px; padding: 25px; border: 1px solid #2a2a3a;">${contentHtml}</div></div>`;
    document.body.appendChild(view);
}

function openDepositPage(symbol) {
    let address = (globalSettings && globalSettings.wallets && globalSettings.wallets[symbol]) ? globalSettings.wallets[symbol] : "Contact Support";
    createPageView('depositPageView', 'Deposit', `<div style="text-align: center;"><h3 style="color: #fff;">Deposit ${symbol}</h3><div style="background: #0f0f15; padding: 20px; border-radius: 12px; border: 1px solid #333; margin: 25px 0;"><p style="color: #00d4aa; font-family: monospace; font-size: 14px; word-break: break-all; margin-bottom: 15px;">${address}</p><button onclick="navigator.clipboard.writeText('${address}'); this.textContent='Copied!';" style="background: #00d4aa; color: #000; padding: 12px; width: 100%; border-radius: 8px; font-weight: bold; border: none; cursor: pointer;">Copy Address</button></div></div>`);
    showView('depositPageView');
}

function openWithdrawPage(symbol, balance) {
    const safeBalance = Math.max(0, balance).toFixed(6);
    createPageView('withdrawPageView', 'Withdraw', `<div><h3 style="color: #fff; text-align: center;">Withdraw ${symbol}</h3><p style="color: #888; text-align: center; margin-bottom: 20px;">Available: ${safeBalance} ${symbol}</p><div style="display: flex; justify-content: space-between; margin-bottom: 5px;"><label style="color: #888; font-size: 12px;">Amount</label><button onclick="document.getElementById('withdrawPageAmount').value = '${safeBalance}';" style="background: none; border: none; color: #00d4aa; font-size: 12px; font-weight: bold; cursor: pointer;">MAX</button></div><div style="position: relative; margin-bottom: 15px;"><input type="number" id="withdrawPageAmount" placeholder="0.00" style="width: 100%; background: #0f0f15; border: 1px solid #333; padding: 14px 50px 14px 14px; border-radius: 8px; color: #fff;"><span style="position: absolute; right: 15px; top: 15px; color: #888; font-weight: bold;">${symbol}</span></div><div style="margin-bottom: 20px;"><label style="color: #888; font-size: 12px; margin-bottom: 5px; display: block;">Destination Address</label><input type="text" id="withdrawPageAddress" placeholder="Enter ${symbol} address" style="width: 100%; background: #0f0f15; border: 1px solid #333; padding: 14px; border-radius: 8px; color: #fff;"></div><div style="background: rgba(252, 213, 53, 0.1); border: 1px solid rgba(252, 213, 53, 0.3); border-radius: 8px; padding: 12px; margin-bottom: 20px; display: flex; gap: 10px;"><span>⚠️</span><p style="color: #fcd535; font-size: 12px; margin: 0;">Ensure the destination address is correct and supports the ${symbol} network.</p></div><button onclick="executeWithdrawal('${symbol}', ${safeBalance})" style="background: #f6465d; color: #fff; width: 100%; padding: 16px; border-radius: 8px; font-weight: bold; border: none; cursor: pointer;">Confirm Withdrawal</button></div>`);
    showView('withdrawPageView');
}

function executeWithdrawal(symbol, balance) {
    const amount = parseFloat(document.getElementById('withdrawPageAmount').value); const address = document.getElementById('withdrawPageAddress').value.trim();
    if (!amount || amount <= 0) return showCustomAlert('Error', 'Invalid amount.'); if (amount > balance) return showCustomAlert('Error', 'Insufficient balance.'); if (!address || address.length < 20) return showCustomAlert('Error', 'Invalid address.');
    showToast(`Withdrawal submitted.`); showView('dashboardView');
}

function openAssetSelector(action) {
    let modal = document.getElementById('assetSelectorModal'); if (modal) modal.remove(); modal = document.createElement('div'); modal.id = 'assetSelectorModal'; modal.style.cssText = "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.85); backdrop-filter: blur(5px); z-index: 99999; display: flex; align-items: center; justify-content: center; padding: 20px;";
    modal.onclick = function(e) { if (e.target === modal) modal.remove(); };
    let assetHtml = markets.map(coin => `<div onclick="document.getElementById('assetSelectorModal').remove(); ${action === 'deposit' ? `openDepositPage('${coin.symbol}')` : `openWithdrawPage('${coin.symbol}', 0)`};" style="display: flex; justify-content: space-between; padding: 12px 15px; border-bottom: 1px solid #2a2a3a; cursor: pointer;"><div style="display: flex; gap: 10px; align-items: center;"><div style="background:${coin.color}; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff;">${coin.icon}</div><div><div style="color: #fff; font-weight: bold; font-size: 14px;">${coin.name}</div><div style="color: #888; font-size: 12px;">${coin.symbol}</div></div></div></div>`).join('');
    modal.innerHTML = `<div style="background: #1a1a2a; border-radius: 16px; padding-top: 20px; width: 100%; max-width: 400px; max-height: 80vh; display: flex; flex-direction: column;"><div style="display: flex; justify-content: space-between; padding: 0 20px 15px; border-bottom: 1px solid #333;"><h2 style="color: #fff; margin: 0; font-size: 18px;">Select ${action}</h2><span onclick="document.getElementById('assetSelectorModal').remove()" style="color: #888; font-size: 24px; cursor: pointer;">&times;</span></div><div style="overflow-y: auto; flex: 1; padding-bottom: 20px;">${assetHtml}</div></div>`;
    document.body.appendChild(modal);
}

document.addEventListener('click', function(e) { if(true) return;
    const btn = e.target.closest('.action-btn');
    if (btn) {
        if (btn.innerText.includes('Deposit')) { e.preventDefault(); e.stopPropagation(); openAssetSelector('deposit'); }
        if (btn.innerText.includes('Withdraw')) { e.preventDefault(); e.stopPropagation(); openAssetSelector('withdraw'); }
    }
}, true);

document.addEventListener('DOMContentLoaded', () => {
    populateCountries(); populateTradeCoins(); checkAuthState();
    if (typeof fetchGlobalSettings === 'function') fetchGlobalSettings();
});
