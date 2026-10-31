
/* =====================================================
   ULTIMATE FIX: Asset Selector & Button Interceptor
   ===================================================== */
// 1. Define the Asset Selector Modal
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

// 2. INTERCEPT CLICKS BEFORE THE HTML CAN FIRE
// The 'true' at the end is the Capture Phase. It catches the click before the inline HTML onclick.
document.addEventListener('click', function(e) {
    const btn = e.target.closest('.action-btn');
    if (btn) {
        if (btn.innerText.includes('Deposit')) {
            e.preventDefault();
            e.stopPropagation(); // Stops the "coming soon" toast
            window.openAssetSelector('deposit');
        }
        if (btn.innerText.includes('Withdraw')) {
            e.preventDefault();
            e.stopPropagation(); // Stops the "coming soon" toast
            window.openAssetSelector('withdraw');
        }
    }
}, true);
