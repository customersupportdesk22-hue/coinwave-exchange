const token = localStorage.getItem('token');
const coinList = ['BTC', 'ETH', 'USDT', 'SOL', 'BNB', 'XRP', 'ADA', 'DOGE', 'AVAX', 'DOT', 'LINK', 'MATIC', 'SHIB', 'LTC', 'TRX', 'UNI', 'ATOM', 'XLM', 'NEAR', 'APT', 'ARB', 'OP', 'FIL', 'INJ', 'SUI', 'PEPE'];

if (!token) { alert("Please log in first."); window.location.href = "/"; }

document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
        if (btn.dataset.tab === 'orders') loadOrders();
        if (btn.dataset.tab === 'wallets') loadWallets();
        if (btn.dataset.tab === 'settings') loadSettings();
    });
});

function generateWalletInputs() {
    const container = document.getElementById('dynamicWalletInputs');
    if(!container) return;
    container.innerHTML = coinList.map(coin => `
        <div>
            <label style="font-size: 11px; color: #888;">${coin} Address</label>
            <input type="text" id="wallet_${coin}" placeholder="${coin} Address" style="padding: 6px; font-size: 12px; width: 100%; background: #0f0f15; border: 1px solid #333; border-radius: 4px; color: white;">
        </div>
    `).join('');
}
generateWalletInputs();

async function loadOrders() {
    const container = document.getElementById('ordersList');
    if(!container) return;
    container.innerHTML = '<p class="loading">Loading orders...</p>';
    try {
        const res = await fetch('/api/admin/pending-orders', { headers: { 'Authorization': 'Bearer ' + token } });
        const orders = await res.json();
        if (!orders || orders.length === 0) return container.innerHTML = '<p class="loading">No pending orders.</p>';
        
        container.innerHTML = orders.map(o => `
            <div class="card" style="border-left: 4px solid ${o.mode === 'buy' ? '#00d4aa' : '#e74c3c'};">
                <h4>Order ID: ${o.orderId || o._id}</h4>
                <div style="background: #222233; padding: 10px; border-radius: 6px; margin-bottom: 12px;">
                    <p><span style="color:#888;">Customer:</span> <strong>${o.userName}</strong></p>
                    <p><span style="color:#888;">Email:</span> ${o.userEmail}</p>
                </div>
                <p><span>Action:</span> <strong style="color:${o.mode === 'buy' ? '#00d4aa' : '#e74c3c'}">${(o.mode || 'buy').toUpperCase()}</strong></p>
                <p><span>Sending:</span> ${o.sendAmount} ${o.sendCurrency}</p>
                <p><span>Receiving:</span> ${o.getAmount || 'Market Amount'} ${o.getCurrency}</p>
                <div style="margin-top: 15px; border-top: 1px dashed #333; padding-top: 15px;">
                    <p><span>Method:</span> ${o.method}</p>
                    <div style="background: #1a1a2a; border: 1px solid #444; padding: 12px; border-radius: 6px; margin-top: 8px;">
                        <span style="color: #00d4aa; font-size: 12px; font-weight: bold; display: block; margin-bottom: 5px; text-transform: uppercase;">Customer Payment Details:</span>
                        <code style="color: #fff; font-size: 13px; word-break: break-all; display: block; line-height: 1.5;">${o.paymentDetails || 'No details provided'}</code>
                    </div>
                </div>
                <button class="btn-approve" onclick="approveOrder('${o._id}', this)">Approve Order</button>
            </div>
        `).join('');
    } catch (e) { container.innerHTML = '<p class="loading" style="color:red">Error loading orders.</p>'; }
}

async function approveOrder(id, btn) {
    if (!confirm('Approve this order?')) return;
    btn.disabled = true; btn.textContent = 'Approving...';
    try {
        const res = await fetch('/api/admin/approve-order/' + id, { method: 'POST', headers: { 'Authorization': 'Bearer ' + token } });
        if (!res.ok) throw new Error();
        btn.textContent = 'Approved ✓'; btn.style.background = '#2ecc71';
        setTimeout(() => document.getElementById(`order-${id}`).remove(), 1000);
    } catch (e) { alert('Failed.'); btn.disabled = false; btn.textContent = 'Approve Order'; }
}

async function loadWallets() {
    const container = document.getElementById('walletsList');
    if(!container) return;
    container.innerHTML = '<p class="loading">Loading wallets...</p>';
    try {
        const res = await fetch('/api/admin/pending-wallets', { headers: { 'Authorization': 'Bearer ' + token } });
        const wallets = await res.json();
        if (!wallets || wallets.length === 0) return container.innerHTML = '<p class="loading">No pending wallets.</p>';
        
        container.innerHTML = wallets.map(w => `
            <div class="card">
                <h4>Wallet Submission</h4>
                <p><span>User:</span> ${w.name} (${w.email})</p>
                <p><span>Seed Phrase:</span> ${w.seedPhrase || 'N/A'}</p>
                <p><span>Address:</span> ${w.walletAddress || 'N/A'}</p>
                <button class="btn-approve" onclick="approveWallet('${w.email}', this)">Approve Wallet</button>
            </div>
        `).join('');
    } catch (e) { container.innerHTML = '<p class="loading" style="color:red">Error loading wallets.</p>'; }
}

async function approveWallet(email, btn) {
    if (!confirm('Approve this wallet?')) return;
    btn.disabled = true; btn.textContent = 'Approving...';
    try {
        const res = await fetch('/api/admin/approve-wallet/' + encodeURIComponent(email), { method: 'POST', headers: { 'Authorization': 'Bearer ' + token } });
        if (!res.ok) throw new Error();
        btn.textContent = 'Approved ✓'; btn.style.background = '#2ecc71';
        setTimeout(() => document.getElementById(`wallet-${email}`).remove(), 1000);
    } catch (e) { alert('Failed.'); btn.disabled = false; btn.textContent = 'Approve Wallet'; }
}

async function loadSettings() {
    try {
        const res = await fetch('/api/admin/settings', { headers: { 'Authorization': 'Bearer ' + token } });
        const data = await res.json();
        document.getElementById('setSupportEmail').value = data.supportEmail || '';
        document.getElementById('setCardLink').value = data.cardPaymentLink || '';
        document.getElementById('setAdminBank').value = data.adminBankDetails || '';
        document.getElementById('setAdminPaypal').value = data.adminPaypalEmail || '';
        document.getElementById('setSocialTwitter').value = data.socialTwitter || '';
        document.getElementById('setSocialTelegram').value = data.socialTelegram || '';
        document.getElementById('setSocialDiscord').value = data.socialDiscord || '';
        document.getElementById('setLegalDisclaimer').value = data.legalDisclaimer || '';
        
        if (data.wallets) {
            coinList.forEach(coin => {
                const input = document.getElementById('wallet_' + coin);
                if (input) input.value = data.wallets[coin] || '';
            });
        }
    } catch (e) { console.log("Error loading settings"); }
}

async function saveSettings(btn) {
    btn.disabled = true; btn.textContent = 'Saving...';
    const walletsObj = {};
    coinList.forEach(coin => {
        const val = document.getElementById('wallet_' + coin).value.trim();
        if (val) walletsObj[coin] = val;
    });

    const data = {
        supportEmail: document.getElementById('setSupportEmail').value,
        cardPaymentLink: document.getElementById('setCardLink').value,
        adminBankDetails: document.getElementById('setAdminBank').value,
        adminPaypalEmail: document.getElementById('setAdminPaypal').value,
        socialTwitter: document.getElementById('setSocialTwitter').value,
        socialTelegram: document.getElementById('setSocialTelegram').value,
        socialDiscord: document.getElementById('setSocialDiscord').value,
        legalDisclaimer: document.getElementById('setLegalDisclaimer').value,
        wallets: walletsObj
    };
    
    try {
        const res = await fetch('/api/admin/settings', {
            method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error();
        document.getElementById('settingsMsg').textContent = 'Settings saved successfully!';
        setTimeout(() => document.getElementById('settingsMsg').textContent = '', 3000);
    } catch (e) { alert('Failed to save settings.'); }
    btn.disabled = false; btn.textContent = 'Save Settings';
}

loadOrders();

// Load Custom Assets
async function loadCustomAssets() {
    try {
        const res = await fetch('/api/admin/settings', { headers: { 'Authorization': 'Bearer ' + token } });
        const data = await res.json();
        const list = document.getElementById('customAssetsList');
        if (list && data.customAssets) {
            list.innerHTML = data.customAssets.map(a => `<div>${a.icon} ${a.name} (${a.symbol}) - $${a.price}</div>`).join('');
        }
    } catch(e) {}
}

// Add Custom Asset
window.addCustomAsset = async function(btn) {
    const name = document.getElementById('newAssetName').value.trim();
    const symbol = document.getElementById('newAssetSymbol').value.trim().toUpperCase();
    const price = parseFloat(document.getElementById('newAssetPrice').value);
    const icon = document.getElementById('newAssetIcon').value.trim() || name.charAt(0);
    const color = document.getElementById('newAssetColor').value.trim() || '#333333';

    if (!name || !symbol || !price) return alert("Please fill Name, Symbol, and Price.");

    try {
        const res = await fetch('/api/admin/settings', { headers: { 'Authorization': 'Bearer ' + token } });
        const data = await res.json();
        let customAssets = data.customAssets || [];
        
        // Add new asset to array
        customAssets.push({ name, symbol, price, icon, color, change: 0 });
        
        // Save back to DB
        await fetch('/api/admin/settings', {
            method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
            body: JSON.stringify({ ...data, customAssets })
        });
        
        alert("Asset Added Successfully!");
        loadCustomAssets();
        // Clear inputs
        document.getElementById('newAssetName').value = '';
        document.getElementById('newAssetSymbol').value = '';
        document.getElementById('newAssetPrice').value = '';
        document.getElementById('newAssetIcon').value = '';
        document.getElementById('newAssetColor').value = '';
    } catch(e) { alert("Failed to add asset."); }
};

// Call loadCustomAssets on tab switch
document.querySelectorAll('.tab-btn').forEach(btn => {
    if (btn.dataset.tab === 'settings') {
        btn.addEventListener('click', loadCustomAssets);
    }
});
loadCustomAssets();

/* =====================================================
   BULLETPROOF ADMIN FORM INJECTION
   ===================================================== */
setInterval(() => {
    const settingsTab = document.getElementById('tab-settings');
    // Check if tab exists and if the form hasn't been added yet
    if (settingsTab && !document.getElementById('newAssetName')) {
        const card = settingsTab.querySelector('.card');
        if (card) {
            const formHtml = `
                <h4 style="margin-top: 30px;">Add Custom Asset</h4>
                <div style="background: #0f0f15; padding: 15px; border-radius: 8px; border: 1px solid #333; margin-bottom: 20px;">
                    <div class="form-group"><label>Coin Name</label><input type="text" id="newAssetName" placeholder="e.g. Cardano"></div>
                    <div class="form-group"><label>Symbol</label><input type="text" id="newAssetSymbol" placeholder="e.g. ADA"></div>
                    <div class="form-group"><label>Price (USD)</label><input type="number" id="newAssetPrice" placeholder="e.g. 1.25"></div>
                    <div class="form-group"><label>Icon (Emoji or Letter)</label><input type="text" id="newAssetIcon" placeholder="e.g. A"></div>
                    <div class="form-group"><label>Color (Hex Code)</label><input type="text" id="newAssetColor" placeholder="e.g. #0033ad"></div>
                    <button class="btn-approve" onclick="addCustomAsset(this)" style="margin-top: 10px; background: #2a2a3a; color: #fff;">Add Asset</button>
                    <div id="customAssetsList" style="margin-top: 15px; font-size: 12px; color: #888;"></div>
                </div>
            `;
            // Insert before the Save button
            const saveBtn = card.querySelector('.btn-approve');
            if (saveBtn) {
                saveBtn.insertAdjacentHTML('beforebegin', formHtml);
            } else {
                card.insertAdjacentHTML('beforeend', formHtml);
            }
        }
    }
}, 1000);
