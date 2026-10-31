
/* =====================================================
   ULTIMATE FIX.JS - Asset Selector & Professional Withdraw
   ===================================================== */

// 1. Professional Withdraw Page (Overrides all old versions in app.js)
window.openWithdrawPage = function(symbol, balance) {
    const safeBalance = Math.max(0, parseFloat(balance)).toFixed(6); 
    
    const content = `
        <div>
            <div style="text-align: center; margin-bottom: 25px;">
                <h3 style="color: #fff; margin-bottom: 5px;">Withdraw ${symbol}</h3>
                <p style="color: #888; font-size: 14px;">Available Balance: <strong style="color: #fff;">${safeBalance} ${symbol}</strong></p>
            </div>
            
            <div style="margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <label style="color: #888; font-size: 12px;">Amount to Withdraw</label>
                    <button onclick="document.getElementById('withdrawPageAmount').value = '${safeBalance}';" style="background: none; border: none; color: #00d4aa; font-size: 12px; font-weight: bold; cursor: pointer; padding: 0;">MAX</button>
                </div>
                <div style="position: relative;">
                    <input type="number" id="withdrawPageAmount" placeholder="0.00" style="width: 100%; background: #0f0f15; border: 1px solid #333; padding: 14px 50px 14px 14px; border-radius: 8px; color: #fff; outline: none; font-size: 16px;">
                    <span style="position: absolute; right: 15px; top: 15px; color: #888; font-weight: bold; font-size: 14px;">${symbol}</span>
                </div>
            </div>
            
            <div style="margin-bottom: 20px;">
                <label style="color: #888; font-size: 12px; margin-bottom: 8px; display: block;">Destination Address</label>
                <input type="text" id="withdrawPageAddress" placeholder="Enter ${symbol} address" style="width: 100%; background: #0f0f15; border: 1px solid #333; padding: 14px; border-radius: 8px; color: #fff; outline: none; font-size: 16px;">
            </div>

            <div style="background: rgba(252, 213, 53, 0.1); border: 1px solid rgba(252, 213, 53, 0.3); border-radius: 8px; padding: 12px; margin-bottom: 25px; display: flex; gap: 10px; align-items: flex-start;">
                <span style="font-size: 16px;">⚠️</span>
                <p style="color: #fcd535; font-size: 12px; margin: 0; line-height: 1.4;">Ensure the destination address is correct and supports the ${symbol} network. Sending to the wrong address will result in permanent loss of funds.</p>
            </div>
            
            <button onclick="executeWithdrawal('${symbol}', ${safeBalance})" style="background: #f6465d; color: #fff; border: none; width: 100%; padding: 16px; border-radius: 8px; font-weight: bold; font-size: 16px; cursor: pointer;">Request Withdrawal</button>
        </div>
    `;
    
    createPageView('withdrawPageView', 'Withdraw', content);
    showView('withdrawPageView');
};

// 2. Ensure Validation works
window.executeWithdrawal = function(symbol, balance) {
    const amount = parseFloat(document.getElementById('withdrawPageAmount').value);
    const address = document.getElementById('withdrawPageAddress').value.trim();
    
    if (!amount || amount <= 0) return showCustomAlert('Invalid Amount', 'Please enter a valid amount to withdraw.');
    if (amount > balance) return showCustomAlert('Insufficient Balance', `You only have ${balance} ${symbol} available.`);
    if (!address || address.length < 20) return showCustomAlert('Invalid Address', `Please enter a valid ${symbol} destination address.`);
    
    showToast(`Withdrawal request of ${amount} ${symbol} submitted for approval.`);
    showView('dashboardView');
};

// 3. Asset Selector Modal (Kept from previous fix)
window.openAssetSelector = function(action) {
    let modal = document.getElementById('assetSelectorModal');
    if (modal) modal.remove();

    modal = document.createElement('div');
    modal.id = 'assetSelectorModal';
    modal.style.cssText = "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.85); backdrop-filter: blur(5px); z-index: 99999; display: flex; align-items: center; justify-content: center; padding: 20px;";
    modal.onclick = function(e) { if (e.target === modal) modal.remove(); };

    let assetHtml = '';
    const coinList = typeof markets !== 'undefined' ? markets : []; 
    
    coinList.forEach(coin => {
        const row = document.querySelector(`.asset-row[data-symbol="${coin.symbol}"]`);
        const amount = row ? parseFloat(row.getAttribute('data-amount')) : 0;
        
        assetHtml += `
            <div onclick="document.getElementById('assetSelectorModal').remove(); ${action === 'deposit' ? `openDepositPage('${coin.symbol}')` : `openWithdrawPage('${coin.symbol}', ${amount})`};" 
                 style="display: flex; align-items: center; justify-content: space-between; padding: 12px 15px; border-bottom: 1px solid #2a2a3a; cursor: pointer;">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="background:${coin.color}; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 50%; font-size: 16px; color: white;">${coin.icon}</div>
                    <div style="display: flex; flex-direction: column;">
                        <span style="font-weight: 600; font-size: 14px; color: #fff;">${coin.name}</span>
                        <span style="font-weight: 500; font-size: 12px; color: #888;">${coin.symbol}</span>
                    </div>
                </div>
                <div style="font-size: 14px; color: #ccc;">${amount.toFixed(6)}</div>
            </div>
        `;
    });

    modal.innerHTML = `
        <div style="background: #1a1a2a; border: 1px solid #2a2a3a; border-radius: 16px; padding: 20px 0 0 0; width: 100%; max-width: 400px; max-height: 80vh; display: flex; flex-direction: column;">
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 0 20px 15px 20px; border-bottom: 1px solid #333;">
                <h2 style="color: #fff; margin: 0; font-size: 18px; text-transform: capitalize;">Select Asset to ${action}</h2>
                <span onclick="document.getElementById('assetSelectorModal').remove()" style="color: #888; font-size: 24px; cursor: pointer;">&times;</span>
            </div>
            <div style="padding: 15px 20px;">
                <input type="text" id="assetSearch" placeholder="Search coin name or symbol..." oninput="filterAssetSelector(this.value)" style="width: 100%; background: #0f0f15; border: 1px solid #333; padding: 12px 15px; border-radius: 8px; color: #fff; outline: none; font-size: 14px;">
            </div>
            <div id="assetSelectorList" style="overflow-y: auto; flex: 1; padding-bottom: 20px;">
                ${assetHtml}
            </div>
        </div>
    `;
    document.body.appendChild(modal);
};

window.filterAssetSelector = function(query) {
    const list = document.getElementById('assetSelectorList');
    const items = list.children;
    query = query.toLowerCase();
    for (let i = 0; i < items.length; i++) {
        const text = items[i].innerText.toLowerCase();
        items[i].style.display = text.includes(query) ? 'flex' : 'none';
    }
};

// 4. Intercept Dashboard Buttons
document.addEventListener('click', function(e) {
    const btn = e.target.closest('.action-btn');
    if (btn) {
        if (btn.innerText.includes('Deposit')) {
            e.preventDefault();
            e.stopPropagation(); 
            window.openAssetSelector('deposit');
        }
        if (btn.innerText.includes('Withdraw')) {
            e.preventDefault();
            e.stopPropagation(); 
            window.openAssetSelector('withdraw');
        }
    }
}, true);
