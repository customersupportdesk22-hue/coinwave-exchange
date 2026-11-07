// ==========================================
// COINWAVE ADMIN PANEL - FRESH REWRITE
// ==========================================

const token = localStorage.getItem('token');
const userStr = localStorage.getItem('user');

// 1. Immediate Security Check
// Redirect removed for debugging
let currentUser = {};
try { currentUser = JSON.parse(userStr); } catch(e) { console.log("Parse error"); }

// Admin check removed

const headers = { 
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
};

// 2. Tab Switching Logic
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        btn.classList.add('active');
        const tabId = btn.dataset.tab;
        document.getElementById('tab-' + tabId).classList.add('active');
        
        if (tabId === 'orders') loadOrders();
        if (tabId === 'wallets') loadWallets();
        if (tabId === 'settings') loadSettings();
    });
});

// 3. Load Orders
async function loadOrders() {
    const container = document.getElementById('ordersList');
    container.innerHTML = '<p class="loading">Loading orders...</p>';
    
    try {
        const res = await fetch('/api/admin/pending-orders', { headers });
        if (!res.ok) throw new Error('Network response was not ok');
        const orders = await res.json();
        
        if (!orders || orders.length === 0) {
            container.innerHTML = '<p style="color: #888;">No pending orders right now.</p>';
            return;
        }

        container.innerHTML = orders.map(o => `
            <div style="background: #1a1a2a; border: 1px solid #333; padding: 15px; border-radius: 8px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <p style="margin: 0 0 5px 0; color: #fff;"><strong>${o.userEmail}</strong></p>
                    <p style="margin: 0; font-size: 13px; color: #aaa;">ID: ${o.orderId || o._id} | ${o.mode.toUpperCase()} ${o.getAmount} ${o.getCurrency}</p>
                </div>
                <div style="display: flex; gap: 10px;">
                    <button onclick="approveOrder('${o._id}')" style="background: #0ecb51; color: #000; border: none; padding: 8px 12px; border-radius: 4px; font-weight: bold; cursor: pointer;">Approve</button>
                    <button onclick="deleteOrder('${o._id}')" style="background: #f6465d; color: #fff; border: none; padding: 8px 12px; border-radius: 4px; font-weight: bold; cursor: pointer;">Delete</button>
                </div>
            </div>
        `).join('');
    } catch (err) {
        container.innerHTML = '<p style="color: #f6465d;">Error loading orders. Please refresh.</p>';
    }
}

// 4. Load Wallets
async function loadWallets() {
    const container = document.getElementById('walletsList');
    container.innerHTML = '<p class="loading">Loading wallets...</p>';
    
    try {
        const res = await fetch('/api/admin/pending-wallets', { headers });
        const wallets = await res.json();
        
        if (!wallets || wallets.length === 0) {
            container.innerHTML = '<p style="color: #888;">No pending wallets right now.</p>';
            return;
        }

        container.innerHTML = wallets.map(w => `
            <div style="background: #1a1a2a; border: 1px solid #333; padding: 15px; border-radius: 8px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <p style="margin: 0 0 5px 0; color: #fff;"><strong>${w.email}</strong></p>
                    <p style="margin: 0; font-size: 13px; color: #aaa; font-family: monospace;">${w.walletAddress}</p>
                </div>
                <button onclick="approveWallet('${w.email}')" style="background: #0ecb51; color: #000; border: none; padding: 8px 12px; border-radius: 4px; font-weight: bold; cursor: pointer;">Approve Wallet</button>
            </div>
        `).join('');
    } catch (err) {
        container.innerHTML = '<p style="color: #f6465d;">Error loading wallets.</p>';
    }
}

// 5. Action Functions
window.approveOrder = async function(id) {
    if (!confirm('Are you sure you want to approve this order?')) return;
    try {
        await fetch('/api/admin/approve-order/' + id, { method: 'POST', headers });
        loadOrders();
    } catch (e) { alert('Failed to approve order'); }
};

window.deleteOrder = async function(id) {
    if (!confirm('Delete this order?')) return;
    try {
        await fetch('/api/admin/delete-order/' + id, { method: 'DELETE', headers });
        loadOrders();
    } catch (e) { alert('Failed to delete order'); }
};

window.approveWallet = async function(email) {
    if (!confirm('Approve this wallet?')) return;
    try {
        await fetch('/api/admin/approve-wallet/' + encodeURIComponent(email), { method: 'POST', headers });
        loadWallets();
    } catch (e) { alert('Failed to approve wallet'); }
};

// 6. Load Settings
async function loadSettings() {
    try {
        const res = await fetch('/api/admin/settings', { headers });
        const s = await res.json();
        
        const inputs = ['supportEmail', 'cardLink', 'adminBank', 'adminPaypal', 'socialTwitter', 'socialTelegram', 'socialDiscord', 'legalDisclaimer', 'callScript'];
        inputs.forEach(key => {
            const el = document.getElementById('set' + key.charAt(0).toUpperCase() + key.slice(1));
            if (el) el.value = s[key] || '';
        });
        
        const callEnabled = document.getElementById('setCallEnabled');
        if (callEnabled) callEnabled.checked = s.callEnabled || false;
    } catch (e) {
        console.error('Failed to load settings', e);
    }
}

// 7. Save Settings
const saveSettingsBtn = document.getElementById('saveSettingsBtn');
if (saveSettingsBtn) {
    saveSettingsBtn.addEventListener('click', async () => {
        const payload = {};
        const inputs = ['supportEmail', 'cardLink', 'adminBank', 'adminPaypal', 'socialTwitter', 'socialTelegram', 'socialDiscord', 'legalDisclaimer', 'callScript'];
        inputs.forEach(key => {
            const el = document.getElementById('set' + key.charAt(0).toUpperCase() + key.slice(1));
            if (el) payload[key] = el.value;
        });
        const callEnabled = document.getElementById('setCallEnabled');
        if (callEnabled) payload.callEnabled = callEnabled.checked;

        try {
            await fetch('/api/admin/settings', {
                method: 'POST',
                headers,
                body: JSON.stringify(payload)
            });
            document.getElementById('settingsMsg').innerText = 'Settings saved successfully!';
            setTimeout(() => document.getElementById('settingsMsg').innerText = '', 3000);
        } catch (e) {
            document.getElementById('settingsMsg').innerText = 'Error saving settings.';
        }
    });
}

// Initialize
loadOrders();
