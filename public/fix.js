
// Wait for the page to completely load
setTimeout(() => {
    // 1. FORCE DASHBOARD BUTTONS TO WORK
    const buttons = document.querySelectorAll('.action-btn');
    buttons.forEach(btn => {
        if (btn.innerText.includes('Deposit')) {
            btn.onclick = () => window.openAssetSelector('deposit');
        }
        if (btn.innerText.includes('Withdraw')) {
            btn.onclick = () => window.openAssetSelector('withdraw');
        }
    });

    // 2. FORCE NEW WITHDRAW PAGE DESIGN
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
                        <button onclick="document.getElementById('withdrawPageAmount').value = '${safeBalance}';" style="background: none; border: none; color: #00d4aa; font-size: 12px; font-weight: bold; cursor: pointer;">MAX</button>
                    </div>
                    <div style="position: relative;">
                        <input type="number" id="withdrawPageAmount" placeholder="0.00" style="width: 100%; background: #0f0f15; border: 1px solid #333; padding: 14px 50px 14px 14px; border-radius: 8px; color: #fff; outline: none; font-size: 16px;">
                        <span style="position: absolute; right: 15px; top: 15px; color: #888; font-weight: bold;">${symbol}</span>
                    </div>
                </div>
                <div style="margin-bottom: 20px;">
                    <label style="color: #888; font-size: 12px; margin-bottom: 8px; display: block;">Destination Address</label>
                    <input type="text" id="withdrawPageAddress" placeholder="Enter ${symbol} address" style="width: 100%; background: #0f0f15; border: 1px solid #333; padding: 14px; border-radius: 8px; color: #fff; outline: none; font-size: 16px;">
                </div>
                <div style="background: rgba(252, 213, 53, 0.1); border: 1px solid rgba(252, 213, 53, 0.3); border-radius: 8px; padding: 12px; margin-bottom: 25px; display: flex; gap: 10px;">
                    <span>⚠️</span>
                    <p style="color: #fcd535; font-size: 12px; margin: 0; line-height: 1.4;">Ensure the destination address is correct and supports the ${symbol} network.</p>
                </div>
                <button onclick="executeWithdrawal('${symbol}', ${safeBalance})" style="background: #f6465d; color: #fff; border: none; width: 100%; padding: 16px; border-radius: 8px; font-weight: bold; font-size: 16px; cursor: pointer;">Request Withdrawal</button>
            </div>
        `;
        createPageView('withdrawPageView', 'Withdraw', content);
        showView('withdrawPageView');
    };
}, 1000);
