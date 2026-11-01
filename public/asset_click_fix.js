
/* =====================================================
   FIX LIVE PRICE TICKING (2-Second Updates)
   ===================================================== */
setInterval(() => {
    // Check if the functions exist in app.js before running them
    if (typeof simulateLiveMarket === 'function') {
        simulateLiveMarket();
    }
    if (typeof loadMarkets === 'function') {
        loadMarkets();
    }
}, 2000);
