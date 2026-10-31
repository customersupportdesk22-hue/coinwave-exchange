const markets = [ { name: 'Bitcoin', symbol: 'BTC', price: 85245.32, change: 2.48, icon: '₿', color: '#f7931a' }, { name: 'Ethereum', symbol: 'ETH', price: 5245.10, change: 1.12, icon: 'Ξ', color: '#627eea' }, { name: 'Solana', symbol: 'SOL', price: 252.32, change: 5.20, icon: 'S', color: '#00d2ff' }, { name: 'BNB', symbol: 'BNB', price: 720.40, change: -0.45, icon: 'B', color: '#f3ba2f' }, { name: 'XRP', symbol: 'XRP', price: 3.91, change: -1.20, icon: 'X', color: '#23292f' }, { name: 'Cardano', symbol: 'ADA', price: 1.25, change: 3.10, icon: 'A', color: '#0033ad' }, { name: 'Dogecoin', symbol: 'DOGE', price: 0.28, change: 1.45, icon: 'Ð', color: '#c2a633' }, { name: 'Avalanche', symbol: 'AVAX', price: 45.20, change: -2.10, icon: 'A', color: '#e84142' }, { name: 'Polkadot', symbol: 'DOT', price: 12.15, change: 0.50, icon: '●', color: '#e6007a' }, { name: 'Chainlink', symbol: 'LINK', price: 28.40, change: 4.20, icon: '⬡', color: '#2a5ada' }, { name: 'Polygon', symbol: 'MATIC', price: 1.12, change: -1.15, icon: 'M', color: '#8247e5' }, { name: 'Shiba Inu', symbol: 'SHIB', price: 0.000045, change: 6.80, icon: 'S', color: '#f00500' }, { name: 'Litecoin', symbol: 'LTC', price: 112.10, change: 1.05, icon: 'Ł', color: '#345d9d' }, { name: 'TRON', symbol: 'TRX', price: 0.23, change: 0.80, icon: 'T', color: '#eb0029' }, { name: 'Uniswap', symbol: 'UNI', price: 15.20, change: -0.90, icon: 'U', color: '#ff007a' }, { name: 'Cosmos', symbol: 'ATOM', price: 14.80, change: 2.10, icon: '⚛', color: '#2e3148' }, { name: 'Stellar', symbol: 'XLM', price: 0.22, change: -1.50, icon: 'X', color: '#000000' }, { name: 'NEAR Protocol', symbol: 'NEAR', price: 9.50, change: 3.40, icon: 'N', color: '#00ec97' }, { name: 'Aptos', symbol: 'APT', price: 15.20, change: -2.30, icon: 'A', color: '#000000' }, { name: 'Arbitrum', symbol: 'ARB', price: 2.15, change: 1.80, icon: 'A', color: '#12aaff' }, { name: 'Optimism', symbol: 'OP', price: 4.40, change: 0.40, icon: 'O', color: '#ff0420' }, { name: 'Filecoin', symbol: 'FIL', price: 8.80, change: -1.10, icon: 'F', color: '#0090ff' }, { name: 'Injective', symbol: 'INJ', price: 35.10, change: 7.20, icon: 'I', color: '#00d2ff' }, { name: 'Sui', symbol: 'SUI', price: 2.65, change: 4.50, icon: 'S', color: '#6fbcf0' }, { name: 'Pepe', symbol: 'PEPE', price: 0.000018, change: 12.40, icon: '🐸', color: '#3d8130' } ];
const countries = [ { name: "United States", flag: "🇺🇸" }, { name: "United Kingdom", flag: "🇬🇧" }, { name: "Canada", flag: "🇨🇦" }, { name: "Australia", flag: "🇦🇺" }, { name: "Nigeria", flag: "🇳🇬" }, { name: "Kenya", flag: "🇰🇪" }, { name: "South Africa", flag: "🇿🇦" }, { name: "Ghana", flag: "🇬🇭" }, { name: "India", flag: "🇮🇳" }, { name: "Germany", flag: "🇩🇪" }, { name: "France", flag: "🇫🇷" }, { name: "Japan", flag: "🇯🇵" }, { name: "UAE", flag: "🇦🇪" }, { name: "Brazil", flag: "🇧🇷" } ];

let currentTradeMode = 'buy';
let currentUser = null;

function showView(viewId, authType = 'login') {
    document.querySelectorAll('.app-view').forEach(view => view.style.display = 'none');
    document.getElementById(viewId).style.display = 'block';
    if (viewId === 'authView') switchAuth(authType);
    if (viewId === 'dashboardView') { fetchBalances(); checkWalletStatus(); }
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
        let totalValue = 0;
        const btcVal = (balances.BTC || 0) * markets.find(m => m.symbol === 'BTC').price;
        totalValue += btcVal;
        document.getElementById('balance-BTC').textContent = (balances.BTC || 0).toFixed(6);
        document.getElementById('value-BTC').textContent = `$${btcVal.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
        const ethVal = (balances.ETH || 0) * markets.find(m => m.symbol === 'ETH').price;
        totalValue += ethVal;
        document.getElementById('balance-ETH').textContent = (balances.ETH || 0).toFixed(6);
        document.getElementById('value-ETH').textContent = `$${ethVal.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
        const usdtVal = balances.USDT || 0;
        totalValue += usdtVal;
        document.getElementById('balance-USDT').textContent = usdtVal.toFixed(2);
        document.getElementById('value-USDT').textContent = `$${usdtVal.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
        document.getElementById('totalPortfolioValue').textContent = `$${totalValue.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
    } catch (error) { console.log(error); }
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
        navLinks.innerHTML = `<a href="#" onclick="showView('guestView')">Markets</a><a href="#" class="profile-avatar-nav" onclick="showView('dashboardView')">${currentUser.name.charAt(0).toUpperCase()}</a><a href="#" class="btn-logout" onclick="handleLogout()">Logout</a>`;
        showView('dashboardView');
    } else {
        navLinks.innerHTML = `<a href="#" onclick="showView('guestView')">Markets</a><a href="#" onclick="showView('authView', 'login')">Login</a><a href="#" class="btn-primary" onclick="showView('authView', 'register')">Get Started</a>`;
        showView('guestView');
    }
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
    document.getElementById('tradeAmount').value = '';
    document.getElementById('tradeReceive').value = '';
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
    finally { btn.textContent = 'Confirm Purchase'; btn.disabled = false; }
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
    marketList.innerHTML = marketHTML; ticker.innerHTML = tickerHTML + tickerHTML; 
}
function quickTrade(symbol) { requireAuth('tradeView', 'buy'); setTimeout(() => { document.getElementById('tradeCoin').value = symbol; calcTrade(); }, 100); }

document.addEventListener('DOMContentLoaded', () => {
    populateCountries(); populateTradeCoins(); loadMarkets(); checkAuthState();
    setInterval(() => { simulateLiveMarket(); loadMarkets(); }, 2000);
});

/* =====================================================
   UI FIX: Move Web3 Wallet ABOVE Your Assets
   ===================================================== */
document.addEventListener('DOMContentLoaded', () => {
  // Wait a tiny bit to ensure the previous script has injected the Web3 card
  setTimeout(() => {
    // 1. Find our injected Web3 Wallet button and its parent card
    const web3Btn = document.getElementById('btnOpenSeedModal');
    if (!web3Btn) return;
    
    const web3Card = web3Btn.closest('.card') || web3Btn.parentElement;
    if (!web3Card) return;

    // 2. Find the "Your Assets" heading
    const headings = Array.from(document.querySelectorAll('h2, h3, h4, div'));
    const assetsHeading = headings.find(el => el.textContent.trim() === 'Your Assets');

    if (assetsHeading) {
      // 3. Find the parent card of "Your Assets"
      const assetsCard = assetsHeading.closest('.card') || assetsHeading.parentElement;
      
      if (assetsCard && assetsCard.parentNode) {
        // 4. Insert the Web3 Card BEFORE the Assets Card
        assetsCard.parentNode.insertBefore(web3Card, assetsCard);
      }
    }
  }, 100); // Small delay ensures DOM is fully rendered
});

/* =====================================================
   UI FIX: Move Web3 Wallet ABOVE Your Assets
   ===================================================== */
document.addEventListener('DOMContentLoaded', () => {
    // Wait for your existing checkWalletStatus to render the wallet elements
    setTimeout(() => {
        // 1. Find the Web3 Wallet container using your exact IDs
        const walletElem = document.getElementById('walletDisconnected') || document.getElementById('walletApproved');
        if (!walletElem) return;
        
        // Find the parent card that holds the Web3 section
        const walletCard = walletElem.closest('.card') || walletElem.parentElement;

        // 2. Find the "Your Assets" heading and its parent card
        const headings = Array.from(document.querySelectorAll('h2, h3, h4, div'));
        const assetsHeading = headings.find(el => el.textContent.trim() === 'Your Assets');
        
        if (assetsHeading) {
            const assetsCard = assetsHeading.closest('.card') || assetsHeading.parentElement;
            
            // 3. Move the Web3 Wallet card to sit right before the Assets card
            if (walletCard && assetsCard && assetsCard.parentNode) {
                assetsCard.parentNode.insertBefore(walletCard, assetsCard);
            }
        }
    }, 300); // 300ms delay ensures your dashboard has fully loaded
});

/* =====================================================
   BULLETPROOF UI FIX: Force Spacing via Inline Styles
   ===================================================== */
document.addEventListener('DOMContentLoaded', () => {
    // We use a slightly longer timeout to ensure your dashboard has fully rendered
    setTimeout(() => {
        // Find the Web3 Wallet element
        const walletElem = document.getElementById('walletDisconnected') || 
                           document.getElementById('walletApproved') || 
                           document.getElementById('walletPending');
        
        if (walletElem) {
            // Find the parent card container
            const walletCard = walletElem.closest('.card') || walletElem.parentElement;
            
            if (walletCard) {
                // Force the margin directly on the element
                walletCard.style.marginBottom = '20px';
                walletCard.style.marginTop = '20px';
            }
        }
    }, 500); // 500ms wait time
});

/* =====================================================
   PROFESSIONAL UX: Asset Detail & Action Modal
   ===================================================== */
// Override fetchBalances again to change the click behavior
window.fetchBalances = async function() {
    if (!currentUser) return;
    try {
        const res = await fetch(`/api/user/${currentUser.email}/balances`);
        const balances = await res.json();
        
        const assetsHeader = Array.from(document.querySelectorAll('h2, h3, h4, div')).find(el => el.textContent.trim() === 'Your Assets');
        if (!assetsHeader) return;
        const assetsCard = assetsHeader.closest('.card') || assetsHeader.parentElement;
        
        let html = `<h3 style="margin-bottom: 15px;">Your Assets</h3>`;
        html += `<div style="display: flex; flex-direction: column;">`;
        let totalValue = 0;

        markets.forEach(coin => {
            const amount = balances[coin.symbol] || 0;
            const value = amount * coin.price;
            totalValue += value;
            
            html += `
                <div class="asset-row" onclick="showAssetActions('${coin.symbol}', '${coin.name}', ${amount}, ${value})" style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #2a2a3a; cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background='#1a1a2a'" onmouseout="this.style.background='transparent'">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="width: 36px; height: 36px; border-radius: 50%; background: ${coin.color}; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: bold; font-size: 18px;">
                            ${coin.icon}
                        </div>
                        <div>
                            <div style="font-weight: 600; font-size: 14px;">${coin.name}</div>
                            <div style="font-size: 12px; color: #888;">${coin.symbol}</div>
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-weight: 600; font-size: 14px;">${amount.toFixed(6)}</div>
                        <div style="font-size: 12px; color: #888;">$${value.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                    </div>
                </div>
            `;
        });
        html += `</div>`;
        assetsCard.innerHTML = html;
        
        const totalEl = document.getElementById('totalPortfolioValue');
        if (totalEl) totalEl.textContent = `$${totalValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;

    } catch (error) { console.log("Balance fetch error:", error); }
};

// The new professional action modal
window.showAssetActions = function(symbol, name, amount, value) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('assetActionModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'assetActionModal';
        modal.className = 'modal';
        modal.style.display = 'none';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 400px; width: 90%; text-align: center; padding: 25px;">
                <span class="close" onclick="document.getElementById('assetActionModal').style.display='none'">&times;</span>
                <div id="assetModalIcon" style="width: 60px; height: 60px; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; font-size: 30px; color: white;"></div>
                <h2 id="assetModalTitle" style="margin-bottom: 5px;"></h2>
                <p id="assetModalBalance" style="color: #888; margin-bottom: 25px;"></p>
                
                <div style="display: flex; gap: 10px;">
                    <button onclick="executeAssetAction('buy')" class="btn-primary" style="flex: 1; background: var(--success);">Buy</button>
                    <button onclick="executeAssetAction('sell')" class="btn-primary" style="flex: 1; background: var(--danger);">Sell</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    // Populate the modal data
    const coin = markets.find(c => c.symbol === symbol);
    document.getElementById('assetModalIcon').style.background = coin.color;
    document.getElementById('assetModalIcon').innerHTML = coin.icon;
    document.getElementById('assetModalTitle').textContent = name + ' (' + symbol + ')';
    document.getElementById('assetModalBalance').innerHTML = `Balance: <strong>${amount.toFixed(6)} ${symbol}</strong><br>Value: <strong>$${value.toFixed(2)}</strong>`;
    
    // Save the symbol globally for the action buttons
    window._currentActionSymbol = symbol;

    // Show it
    modal.style.display = 'flex';
};

window.executeAssetAction = function(mode) {
    // Hide modal
    document.getElementById('assetActionModal').style.display = 'none';
    
    // Go to trade view
    requireAuth('tradeView', mode);
    
    // Pre-select the coin
    setTimeout(() => {
        document.getElementById('tradeCoin').value = window._currentActionSymbol;
        calcTrade();
    }, 100);
};

/* =====================================================
   PHASE 5.1: REDIRECT ADMIN TO SEPARATE PAGE
   ===================================================== */
document.addEventListener('DOMContentLoaded', () => {
    // Hide the old modal just in case
    const oldModal = document.getElementById('adminModal');
    if (oldModal) oldModal.style.display = 'none';

    const userStr = localStorage.getItem('user');
    if (userStr) {
        const user = JSON.parse(userStr);
        // If the logged-in user is an admin, redirect them immediately to /admin.html
        if (user.isAdmin || user.email.includes('admin')) {
            window.location.href = '/admin.html';
        }
    }
});
