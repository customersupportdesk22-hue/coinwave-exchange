
/* =====================================================
   ULTIMATE FIX.JS - Professional Admin Fiat Details
   ===================================================== */
window.togglePaymentDetails = function() {
    const method = document.getElementById('tradeMethod').value;
    const container = document.getElementById('paymentDetailsContainer');
    const cardInputs = document.getElementById('cardDetailsInputs');
    const paypalInputs = document.getElementById('paypalDetailsInputs');
    const bankInputs = document.getElementById('bankDetailsInputs');

    // Hide all standard input groups
    cardInputs.style.display = 'none';
    paypalInputs.style.display = 'none';
    bankInputs.style.display = 'none';

    // Remove old admin fiat box if exists
    const oldAdminBox = document.getElementById('adminFiatDetails');
    if (oldAdminBox) oldAdminBox.remove();

    if (currentTradeMode === 'buy') {
        // BUY MODE: Show Admin's Payment Details
        const adminBox = document.createElement('div');
        adminBox.id = 'adminFiatDetails';
        
        let content = '';
        if (method === 'Bank Transfer') {
            const bankDetails = (globalSettings && globalSettings.adminBankDetails) ? globalSettings.adminBankDetails : "Bank details not set.";
            content = `
                <div style="background: #1a1a2a; border: 1px solid #333; padding: 15px; border-radius: 8px; margin-top: 10px;">
                    <p style="color: #00d4aa; font-size: 12px; font-weight: bold; margin-bottom: 5px;">Send Fiat to this Bank Account:</p>
                    <p style="color: #fff; font-size: 14px; white-space: pre-wrap; font-family: monospace;">${bankDetails}</p>
                </div>
            `;
        } else if (method === 'PayPal') {
            const paypalEmail = (globalSettings && globalSettings.adminPaypalEmail) ? globalSettings.adminPaypalEmail : "PayPal not set.";
            content = `
                <div style="background: #1a1a2a; border: 1px solid #333; padding: 15px; border-radius: 8px; margin-top: 10px;">
                    <p style="color: #00d4aa; font-size: 12px; font-weight: bold; margin-bottom: 5px;">Send Fiat to this PayPal Email:</p>
                    <p style="color: #fff; font-size: 14px; font-family: monospace;">${paypalEmail}</p>
                </div>
            `;
        } else {
            // Credit Card
            content = `
                <div style="background: #1a1a2a; border: 1px solid #333; padding: 15px; border-radius: 8px; margin-top: 10px;">
                    <p style="color: #e74c3c; font-size: 12px;">Credit Card processing is currently unavailable. Please select Bank Transfer or PayPal.</p>
                </div>
            `;
        }
        adminBox.innerHTML = content;
        container.appendChild(adminBox);

    } else {
        // SELL MODE: Customer provides their Payout details
        if (method === 'Credit Card') {
            cardInputs.style.display = 'block';
        } else if (method === 'PayPal') {
            paypalInputs.style.display = 'block';
        } else if (method === 'Bank Transfer') {
            bankInputs.style.display = 'block';
        }
    }
};

// Ensure that when the page loads, it uses the fresh globalSettings for Fiat
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (typeof fetchGlobalSettings === 'function') {
            fetchGlobalSettings().then(() => {
                if (typeof togglePaymentDetails === 'function') togglePaymentDetails();
            });
        }
    }, 1500);
});

// (Keep your existing openWithdrawPage, openAssetSelector, and action-btn interceptor code below)
