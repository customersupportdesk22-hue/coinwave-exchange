
/* =====================================================
   ULTIMATE NUCLEAR FIX: Forces buttons to work
   ===================================================== */
setInterval(function() {
    // Find all buttons on the dashboard
    const buttons = document.querySelectorAll('.action-btn');
    
    buttons.forEach(btn => {
        if (btn.innerText.includes('Deposit') && !btn.dataset.fixed) {
            btn.dataset.fixed = 'true';
            // Forcefully override the click event
            btn.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                if (typeof window.openAssetSelector === 'function') {
                    window.openAssetSelector('deposit');
                } else {
                    alert("openAssetSelector function missing from app.js");
                }
            };
        }
        
        if (btn.innerText.includes('Withdraw') && !btn.dataset.fixed) {
            btn.dataset.fixed = 'true';
            btn.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                if (typeof window.openAssetSelector === 'function') {
                    window.openAssetSelector('withdraw');
                } else {
                    alert("openAssetSelector function missing from app.js");
                }
            };
        }
    });
}, 500); // Runs every half second to catch the buttons as soon as they load
