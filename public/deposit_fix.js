
/* =====================================================
   PROFESSIONAL DEPOSIT PAGE (QR Code & Warning)
   ===================================================== */
window.openDepositPage = function(symbol) {
    let address = (globalSettings && globalSettings.wallets && globalSettings.wallets[symbol]) ? globalSettings.wallets[symbol] : "Contact Support (Address Not Set in Admin)";
    
    // Generate a free QR code for the address
    let qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${address}`;
    if(address.includes("Contact Support")) qrCodeUrl = ""; // Don't generate QR if address is missing

    const content = `
        <div style="text-align: center;">
            <h3 style="color: #fff; margin-bottom: 5px;">Deposit ${symbol}</h3>
            <p style="color: #888; font-size: 13px; margin-bottom: 20px;">Send only ${symbol} to this deposit address.</p>

            <div style="background: #1a1a2a; border: 1px solid #333; border-radius: 8px; padding: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
                <span style="color: #888; font-size: 13px;">Network</span>
                <span style="color: #fff; font-weight: bold; font-size: 13px;">${symbol} Network</span>
            </div>

            <div style="background: #0f0f15; border: 1px solid #333; border-radius: 12px; padding: 20px; margin-bottom: 20px; text-align: center;">
                ${qrCodeUrl ? `<img src="${qrCodeUrl}" style="background: #fff; padding: 8px; border-radius: 8px; margin-bottom: 15px; width: 150px; height: 150px; display: inline-block;">` : ''}
                <div style="font-family: monospace; font-size: 13px; color: ${address.includes('Contact') ? '#e74c3c' : '#00d4aa'}; word-break: break-all; margin-bottom: 15px; line-height: 1.4;">${address}</div>
                <button onclick="navigator.clipboard.writeText('${address}'); this.textContent='Copied!'; setTimeout(()=>this.textContent='Copy Address', 2000);" style="background: #00d4aa; color: #000; border: none; padding: 14px; border-radius: 8px; font-weight: bold; cursor: pointer; width: 100%; font-size: 14px;">Copy Address</button>
            </div>

            <div style="background: rgba(246, 70, 93, 0.1); border: 1px solid rgba(246, 70, 93, 0.3); border-radius: 8px; padding: 12px; text-align: left; display: flex; gap: 10px;">
                <span style="color: #f6465d; font-size: 16px;">⚠️</span>
                <p style="color: #f6465d; font-size: 12px; margin: 0; line-height: 1.4;">Sending any other coin or using the wrong network to this address will result in permanent loss of funds.</p>
            </div>
        </div>
    `;
    
    createPageView('depositPageView', 'Deposit', content);
    showView('depositPageView');
};
