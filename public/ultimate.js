
/* =====================================================
   ULTIMATE FIX - PART 1
   ===================================================== */

// 1. FIX BUY PAYMENT METHOD (Show Admin Details)
window.togglePaymentDetails = function() {
    const method = document.getElementById('tradeMethod').value;
    const container = document.getElementById('paymentDetailsContainer');
    const cardInputs = document.getElementById('cardDetailsInputs');
    const paypalInputs = document.getElementById('paypalDetailsInputs');
    const bankInputs = document.getElementById('bankDetailsInputs');

    if(cardInputs) cardInputs.style.display = 'none';
    if(paypalInputs) paypalInputs.style.display = 'none';
    if(bankInputs) bankInputs.style.display = 'none';

    const oldAdminBox = document.getElementById('adminFiatDetails');
    if (oldAdminBox) oldAdminBox.remove();

    if (currentTradeMode === 'buy') {
        if (method === 'Bank Transfer') {
            const bankDetails = (globalSettings && globalSettings.adminBankDetails) ? globalSettings.adminBankDetails : "Bank details not set. Please contact support.";
            const adminBox = document.createElement('div');
            adminBox.id = 'adminFiatDetails';
            adminBox.innerHTML = `
                <div style="background: #1a1a2a; border: 1px solid #333; padding: 15px; border-radius: 8px; margin-top: 10px;">
                    <p style="color: #00d4aa; font-size: 12px; font-weight: bold; margin-bottom: 5px;">Send Fiat to this Bank Account:</p>
                    <p style="color: #fff; font-size: 14px; white-space: pre-wrap; font-family: monospace;">${bankDetails}</p>
                </div>
            `;
            if(container) container.appendChild(adminBox);
        } else if (method === 'PayPal') {
            const paypalEmail = (globalSettings && globalSettings.adminPaypalEmail) ? globalSettings.adminPaypalEmail : "PayPal not set. Please contact support.";
            const adminBox = document.createElement('div');
            adminBox.id = 'adminFiatDetails';
            adminBox.innerHTML = `
                <div style="background: #1a1a2a; border: 1px solid #333; padding: 15px; border-radius: 8px; margin-top: 10px;">
                    <p style="color: #00d4aa; font-size: 12px; font-weight: bold; margin-bottom: 5px;">Send Fiat to this PayPal Email:</p>
                    <p style="color: #fff; font-size: 14px; font-family: monospace;">${paypalEmail}</p>
                </div>
            `;
            if(container) container.appendChild(adminBox);
        } else if (method === 'Credit Card') {
            if(cardInputs) cardInputs.style.display = 'block';
        }
    } else {
        if (method === 'Credit Card') {
            if(cardInputs) cardInputs.style.display = 'block';
        } else if (method === 'PayPal') {
            if(paypalInputs) paypalInputs.style.display = 'block';
        } else if (method === 'Bank Transfer') {
            if(bankInputs) bankInputs.style.display = 'block';
        }
    }
};

// 2. PROFESSIONAL WITHDRAW PAGE (MAX Button & Warning)
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
            
            <button onclick="window.executeWithdrawal('${symbol}', ${safeBalance})" style="background: #f6465d; color: #fff; border: none; width: 100%; padding: 16px; border-radius: 8px; font-weight: bold; font-size: 16px; cursor: pointer;">Request Withdrawal</button>
        </div>
    `;
    
    createPageView('withdrawPageView', 'Withdraw', content);
    showView('withdrawPageView');
};

window.executeWithdrawal = function(symbol, balance) {
    const amount = parseFloat(document.getElementById('withdrawPageAmount').value);
    const address = document.getElementById('withdrawPageAddress').value.trim();
    if (!amount || amount <= 0) return showCustomAlert('Invalid Amount', 'Please enter a valid amount to withdraw.');
    if (amount > balance) return showCustomAlert('Insufficient Balance', `You only have ${balance} ${symbol} available to withdraw.`);
    if (!address || address.length < 20) return showCustomAlert('Invalid Address', `Please enter a valid ${symbol} destination address.`);
    showToast(`Withdrawal request of ${amount} ${symbol} submitted for approval.`);
    showView('dashboardView');
};

// 3. DEPOSIT PAGE
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
            <p style="color: #e74c3c; font-size: 12px; line-height: 1.4;">⚠️ Do not send any other coin to this address.</p>
        </div>
    `;
    createPageView('depositPageView', 'Deposit', content);
    showView('depositPageView');
};

// 4. ASSET SELECTOR (For Top Dashboard Buttons)
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
        const clickAction = action === 'deposit' ? `openDepositPage('${coin.symbol}')` : `openWithdrawPage('${coin.symbol}', ${amount})`;
        assetHtml += `
            <div onclick="document.getElementById('assetSelectorModal').remove(); ${clickAction};" 
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
                <input type="text" id="assetSearch" placeholder="Search coin name or symbol..." oninput="window.filterAssetSelector(this.value)" style="width: 100%; background: #0f0f15; border: 1px solid #333; padding: 12px 15px; border-radius: 8px; color: #fff; outline: none; font-size: 14px;">
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

// 5. FORCE DASHBOARD BUTTONS TO WORK
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

// 6. FORCE ASSET MODAL TO USE NEW WITHDRAW PAGE
window.showAssetActions = function(symbol, name, amount, value) {
    let modal = document.getElementById('assetActionModal');
    if (modal) modal.remove(); 
    modal = document.createElement('div');
    modal.id = 'assetActionModal';
    modal.style.cssText = "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.75); backdrop-filter: blur(4px); z-index: 99999; display: flex; align-items: center; justify-content: center; padding: 20px;";
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
                <button onclick="document.getElementById('assetActionModal').remove(); openDepositPage('${symbol}');" style="background: #2a2a3a; color: #fff; border: none; padding: 14px; border-radius: 10px; font-weight: 700; font-size: 15px; cursor: pointer;">Deposit</button>
                <button onclick="document.getElementById('assetActionModal').remove(); openWithdrawPage('${symbol}', ${amount});" style="background: #2a2a3a; color: #fff; border: none; padding: 14px; border-radius: 10px; font-weight: 700; font-size: 15px; cursor: pointer;">Withdraw</button>
            </div>
        </div>
    `;
    const coin = markets.find(c => c.symbol === symbol);
    if(coin) {
        document.getElementById('assetModalIcon').style.background = coin.color;
        document.getElementById('assetModalIcon').innerHTML = coin.icon;
    }
    document.getElementById('assetModalTitle').textContent = name;
    document.getElementById('assetModalBalance').textContent = `${amount.toFixed(6)} ${symbol}`;
    document.getElementById('assetModalValue').textContent = `≈ $${value.toFixed(2)} USD`;
    window._currentActionSymbol = symbol;
    document.body.appendChild(modal);
};
