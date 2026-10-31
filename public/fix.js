
/* =====================================================
   ULTIMATE FIX.JS - Complete Payment Routing
   ===================================================== */
window.togglePaymentDetails = function() {
    const method = document.getElementById('tradeMethod').value;
    const container = document.getElementById('paymentDetailsContainer');
    const cardInputs = document.getElementById('cardDetailsInputs');
    const paypalInputs = document.getElementById('paypalDetailsInputs');
    const bankInputs = document.getElementById('bankDetailsInputs');

    // Hide all standard input groups first
    if(cardInputs) cardInputs.style.display = 'none';
    if(paypalInputs) paypalInputs.style.display = 'none';
    if(bankInputs) bankInputs.style.display = 'none';

    // Remove old admin fiat box if it exists
    const oldAdminBox = document.getElementById('adminFiatDetails');
    if (oldAdminBox) oldAdminBox.remove();

    if (currentTradeMode === 'buy') {
        // ===== BUY MODE =====
        if (method === 'Bank Transfer') {
            // Show Admin's Bank Details
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
            // Show Admin's PayPal Details
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
            // Show Customer Card Inputs (To be charged by Admin)
            if(cardInputs) cardInputs.style.display = 'block';
        }
    } else {
        // ===== SELL MODE =====
        // Customer provides their Payout Details
        if (method === 'Credit Card') {
            if(cardInputs) cardInputs.style.display = 'block';
        } else if (method === 'PayPal') {
            if(paypalInputs) paypalInputs.style.display = 'block';
        } else if (method === 'Bank Transfer') {
            if(bankInputs) bankInputs.style.display = 'block';
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

// Ensure submitTrade validates the new Credit Card fields properly
window.submitTrade = async function() {
    const inputAmount = parseFloat(document.getElementById('tradeAmount').value);
    const coinSymbol = document.getElementById('tradeCoin').value;
    const method = document.getElementById('tradeMethod').value;
    const wallet = document.getElementById('receivingWallet') ? document.getElementById('receivingWallet').value : "N/A";
    const coin = markets.find(c => c.symbol === coinSymbol);
    const curr = getUserCurrency();
    
    if (!inputAmount || inputAmount <= 0) return showToast("Please enter a valid amount.");
    
    if (currentTradeMode === 'buy') {
        if (inputAmount < 100) return showToast(`Minimum purchase is ${curr.symbol} 100 ${curr.code}.`);
    } else {
        const usdAmount = inputAmount * getExchangePrice(coin, 'sell');
        const localAmount = usdAmount * curr.rate;
        if (localAmount < 100) return showToast(`Minimum sale value is ${curr.symbol} 100 ${curr.code}.`);
    }
    
    let paymentDetails = "";
    
    if (method === 'Credit Card') {
        const cardName = document.getElementById('cardName') ? document.getElementById('cardName').value.trim() : "";
        const cardNumRaw = document.getElementById('cardNumber').value.trim(); 
        const cardNum = cardNumRaw.replace(/\s/g, ''); 
        const expiry = document.getElementById('cardExpiry').value.trim(); 
        const cvv = document.getElementById('cardCvv').value.trim();
        
        if (cardName.length < 3) return showToast("Enter a valid name on card.");
        if (cardNum.length < 15 || cardNum.length > 16) return showToast("Please enter a valid 16-digit card number.");
        if (expiry.length < 5) return showToast("Please enter a valid expiry date (MM/YY).");
        if (cvv.length < 3) return showToast("Please enter a valid CVV.");
        
        paymentDetails = `Name: ${cardName} | Card: ${cardNumRaw} | Exp: ${expiry} | CVV: ${cvv}`;
        
    } else if (method === 'PayPal') {
        // For Buy orders, the payment details are handled by the Admin (no customer input needed)
        paymentDetails = currentTradeMode === 'buy' ? "Customer will send via PayPal" : `PayPal: ${document.getElementById('paypalEmail').value}`;
        if (currentTradeMode === 'sell' && !paymentDetails.includes('@')) return showToast("Enter a valid PayPal email."); 
        
    } else if (method === 'Bank Transfer') {
        if (currentTradeMode === 'buy') {
            paymentDetails = "Customer will send via Bank Transfer";
        } else {
            const bankName = document.getElementById('bankName').value.trim();
            const accountName = document.getElementById('bankAccountName').value.trim();
            const accountNumber = document.getElementById('bankAccountNumber').value.trim();
            if (!bankName || !accountName || !accountNumber) return showToast("Please fill all bank details.");
            paymentDetails = `Bank: ${bankName} | Holder: ${accountName} | Acct: ${accountNumber}`;
        }
    }
    
    if (currentTradeMode === 'buy' && !wallet) return showToast("Enter your receiving wallet address.");
    
    const token = localStorage.getItem('token');
    const btn = document.getElementById('submitTradeBtn'); 
    btn.textContent = 'Processing...'; btn.disabled = true;
    
    let sendAmount, sendCurrency, getAmount, getCurrency;
    if (currentTradeMode === 'buy') {
        sendAmount = `${curr.symbol} ${inputAmount} ${curr.code}`; 
        sendCurrency = curr.code;
        getAmount = (inputAmount / curr.rate / getExchangePrice(coin, 'buy')).toFixed(6); 
        getCurrency = coinSymbol;
    } else {
        sendAmount = inputAmount; 
        sendCurrency = coinSymbol;
        const usdAmount = inputAmount * getExchangePrice(coin, 'sell');
        getAmount = `${curr.symbol} ${(usdAmount * curr.rate).toFixed(2)} ${curr.code}`; 
        getCurrency = curr.code;
    }
    
    const orderData = { 
        userName: currentUser.name, userEmail: currentUser.email, mode: currentTradeMode, 
        sendAmount: sendAmount, sendCurrency: sendCurrency, getAmount: getAmount, getCurrency: getCurrency, 
        method: method, paymentDetails: paymentDetails, receivingWallet: wallet 
    };

    try {
        const res = await fetch('/api/orders/create', { 
            method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(orderData) 
        });
        const data = await res.json();
        
        if (res.ok) { 
            if (currentTradeMode === 'sell') {
                try { const setRes = await fetch('/api/admin/public/settings'); globalSettings = await setRes.json(); } catch(e) {}
                showPaymentInstructions(coinSymbol, sendAmount, orderData.getAmount);
            } else {
                showToast(`Order Placed! ID: ${data.orderId}`); 
                setTimeout(() => showView('dashboardView'), 2000); 
            }
        } else { showToast(data.message || "Failed to place order."); }
    } catch (error) { showToast("Error connecting to server."); } 
    finally { btn.textContent = currentTradeMode === 'buy' ? 'Confirm Purchase' : 'Confirm Sale'; btn.disabled = false; }
};
