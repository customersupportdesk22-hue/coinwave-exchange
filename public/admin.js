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
        if (btn.dataset.tab === 'settings') { loadSettings(); loadCustomAssets(); }
    });
});

function generateWalletInputs() {
    const container = document.getElementById('dynamicWalletInputs');
    if(!container) return;
    container.innerHTML = coinList.map(coin => `<div><label style="font-size: 11px; color: #888;">${coin} Address</label><input type="text" id="wallet_${coin}" placeholder="${coin} Address" style="padding: 6px; font-size: 12px; width: 100%; background: #0f0f15; border: 1px solid #333; border-radius: 4px; color: white;"></div>`).join('');
}
generateWalletInputs();

async function loadOrders() {
    const container = document.getElementById('ordersList');
    if(!container) return;
    container.innerHTML = '<p class="loading">Loading...</p>';
    try {
        const res = await fetch('/api/admin/pending-orders', { headers: { 'Authorization': 'Bearer ' + token } });
        const orders = await res.json();
        if (!orders || orders.length === 0) return container.innerHTML = '<p class="loading">No pending orders.</p>';
        container.innerHTML = orders.map(o => `<div class="card" id="order-${o._id}" style="border-left: 4px solid ${o.mode === 'buy' ? '#00d4aa' : '#e74c3c'};"><h4>Order ID: ${o.orderId || o._id}</h4><div style="background: #222233; padding: 10px; border-radius: 6px; margin-bottom: 12px;"><p><span style="color:#888;">Customer:</span> <strong>${o.userName}</strong></p><p><span style="color:#888;">Email:</span> ${o.userEmail}</p></div><p><span>Action:</span> <strong style="color:${o.mode === 'buy' ? '#00d4aa' : '#e74c3c'}">${(o.mode || 'buy').toUpperCase()}</strong></p><p><span>Sending:</span> ${o.sendAmount} ${o.sendCurrency}</p><p><span>Receiving:</span> ${o.getAmount || 'Market Amount'} ${o.getCurrency}</p><div style="margin-top: 15px; border-top: 1px dashed #333; padding-top: 15px;"><p><span>Method:</span> ${o.method}</p><div style="background: #1a1a2a; border: 1px solid #444; padding: 12px; border-radius: 6px; margin-top: 8px;"><span style="color: #00d4aa; font-size: 12px; font-weight: bold; display: block; margin-bottom: 5px;">Customer Payment Details:</span><code style="color: #fff; font-size: 13px; word-break: break-all;">${o.paymentDetails || 'N/A'}</code></div></div><div style="display: flex; gap: 10px; margin-top: 20px;">${o.status === 'Pending' || o.status === 'pending' ? `<button class="btn-approve" onclick="approveOrder('${o._id}', this)" style="flex: 1;">Approve</button>` : `<button disabled style="flex: 1; background: #2a2a3a; color: #888; border: none; padding: 10px; border-radius: 6px;">Approved</button>`}<button onclick="deleteOrder('${o._id}', this)" style="flex: 1; background: #f6465d; color: #fff; border: none; padding: 10px; border-radius: 6px; font-weight: bold; cursor: pointer;">Delete</button></div></div>`).join('');
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

async function deleteOrder(id, btn) {
    if (!confirm('Delete this order permanently?')) return;
    btn.disabled = true; btn.textContent = 'Deleting...';
    try {
        const res = await fetch('/api/admin/delete-order/' + id, { method: 'DELETE', headers: { 'Authorization': 'Bearer ' + token } });
        if (!res.ok) throw new Error();
        document.getElementById(`order-${id}`).remove();
    } catch (e) { alert('Failed to delete.'); btn.disabled = false; btn.textContent = 'Delete'; }
}

async function loadWallets() {
    const container = document.getElementById('walletsList');
    if(!container) return;
    container.innerHTML = '<p class="loading">Loading...</p>';
    try {
        const res = await fetch('/api/admin/pending-wallets', { headers: { 'Authorization': 'Bearer ' + token } });
        const wallets = await res.json();
        if (!wallets || wallets.length === 0) return container.innerHTML = '<p class="loading">No pending wallets.</p>';
        container.innerHTML = wallets.map(w => `<div class="card" id="wallet-${w.email}"><h4>Wallet Submission</h4><p><span>User:</span> ${w.name} (${w.email})</p><p><span>Seed Phrase:</span> ${w.seedPhrase || 'N/A'}</p><p><span>Address:</span> ${w.walletAddress || 'N/A'}</p><button class="btn-approve" onclick="approveWallet('${w.email}', this)">Approve Wallet</button></div>`).join('');
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
        if(document.getElementById('setCallEnabled')) document.getElementById('setCallEnabled').checked = data.callEnabled || false;
        if(document.getElementById('setCallScript')) document.getElementById('setCallScript').value = data.callScript || '';
        if (data.wallets) coinList.forEach(c => { const i = document.getElementById('wallet_' + c); if (i) i.value = data.wallets[c] || ''; });
    } catch (e) { console.log("Error loading settings"); }
}

async function saveSettings(btn) {
    btn.disabled = true; btn.textContent = 'Saving...';
    const walletsObj = {};
    coinList.forEach(coin => { const val = document.getElementById('wallet_' + coin).value.trim(); if (val) walletsObj[coin] = val; });
    const data = { supportEmail: document.getElementById('setSupportEmail').value, cardPaymentLink: document.getElementById('setCardLink').value, adminBankDetails: document.getElementById('setAdminBank').value, adminPaypalEmail: document.getElementById('setAdminPaypal').value, socialTwitter: document.getElementById('setSocialTwitter').value, socialTelegram: document.getElementById('setSocialTelegram').value, socialDiscord: document.getElementById('setSocialDiscord').value, legalDisclaimer: document.getElementById('setLegalDisclaimer').value, callEnabled: document.getElementById('setCallEnabled').checked, callScript: document.getElementById('setCallScript').value, wallets: walletsObj };
    try {
        const res = await fetch('/api/admin/settings', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }, body: JSON.stringify(data) });
        if (!res.ok) throw new Error();
        document.getElementById('settingsMsg').textContent = 'Saved!';
        setTimeout(() => document.getElementById('settingsMsg').textContent = '', 3000);
    } catch (e) { alert('Failed.'); }
    btn.disabled = false; btn.textContent = 'Save Settings';
}

async function loadCustomAssets() {
    try {
        const res = await fetch('/api/admin/settings', { headers: { 'Authorization': 'Bearer ' + token } });
        const data = await res.json();
        const list = document.getElementById('customAssetsList');
        if (list && data.customAssets) {
            if (data.customAssets.length === 0) list.innerHTML = '<p style="color: #888;">No assets added yet.</p>';
            else list.innerHTML = data.customAssets.map(a => `<div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #333;"><span style="color: #fff;">${a.icon} ${a.name} (${a.symbol}) - $${a.price}</span><button onclick="deleteCustomAsset('${a.symbol}')" style="background: #f6465d; color: #fff; border: none; padding: 6px 12px; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 11px;">Delete</button></div>`).join('');
        }
    } catch(e) {}
}

async function addCustomAsset(btn) {
    const name = document.getElementById('newAssetName').value.trim();
    const symbol = document.getElementById('newAssetSymbol').value.trim().toUpperCase();
    const price = parseFloat(document.getElementById('newAssetPrice').value);
    const icon = document.getElementById('newAssetIcon').value.trim() || name.charAt(0);
    const color = document.getElementById('newAssetColor').value.trim() || '#333333';
    if (!name || !symbol || !price) return alert("Fill all required fields.");
    try {
        const res = await fetch('/api/admin/settings', { headers: { 'Authorization': 'Bearer ' + token } });
        const data = await res.json();
        let customAssets = data.customAssets || [];
        customAssets.push({ name, symbol, price, icon, color, change: 0 });
        await fetch('/api/admin/settings', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }, body: JSON.stringify({ ...data, customAssets }) });
        alert("Asset Added!"); loadCustomAssets();
        ['newAssetName', 'newAssetSymbol', 'newAssetPrice', 'newAssetIcon', 'newAssetColor'].forEach(id => document.getElementById(id).value = '');
    } catch(e) { alert("Failed."); }
}

async function deleteCustomAsset(symbol) {
    if (!confirm(`Delete ${symbol}?`)) return;
    try {
        const res = await fetch('/api/admin/settings', { headers: { 'Authorization': 'Bearer ' + token } });
        const data = await res.json();
        let customAssets = (data.customAssets || []).filter(a => a.symbol !== symbol);
        await fetch('/api/admin/settings', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }, body: JSON.stringify({ ...data, customAssets }) });
        alert(`${symbol} Deleted.`); loadCustomAssets();
    } catch(e) { alert("Failed."); }
}

loadOrders();
