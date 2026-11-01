
/* =====================================================
   FIX: Buy/Sell Payment Method Logic
   ===================================================== */
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
            adminBox.innerHTML = `<div style="background: #1a1a2a; border: 1px solid #333; padding: 15px; border-radius: 8px; margin-top: 10px;"><p style="color: #00d4aa; font-size: 12px; font-weight: bold; margin-bottom: 5px;">Send Fiat to this Bank Account:</p><p style="color: #fff; font-size: 14px; white-space: pre-wrap; font-family: monospace;">${bankDetails}</p></div>`;
            if(container) container.appendChild(adminBox);
        } else if (method === 'PayPal') {
            const paypalEmail = (globalSettings && globalSettings.adminPaypalEmail) ? globalSettings.adminPaypalEmail : "PayPal not set. Please contact support.";
            const adminBox = document.createElement('div');
            adminBox.id = 'adminFiatDetails';
            adminBox.innerHTML = `<div style="background: #1a1a2a; border: 1px solid #333; padding: 15px; border-radius: 8px; margin-top: 10px;"><p style="color: #00d4aa; font-size: 12px; font-weight: bold; margin-bottom: 5px;">Send Fiat to this PayPal Email:</p><p style="color: #fff; font-size: 14px; font-family: monospace;">${paypalEmail}</p></div>`;
            if(container) container.appendChild(adminBox);
        } else if (method === 'Credit Card') {
            if(cardInputs) cardInputs.style.display = 'block';
        }
    } else {
        // SELL MODE: Customer provides their details
        if (method === 'Credit Card') {
            if(cardInputs) cardInputs.style.display = 'block';
        } else if (method === 'PayPal') {
            if(paypalInputs) paypalInputs.style.display = 'block';
        } else if (method === 'Bank Transfer') {
            if(bankInputs) bankInputs.style.display = 'block';
        }
    }
};
