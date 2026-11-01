/* =====================================================
   DEDICATED RENDERER FOR FOOTER & CUSTOM ASSETS
   ===================================================== */
async function loadSettingsAndRender() {
    try {
        const res = await fetch('/api/admin/public/settings');
        const settings = await res.json();
        
        // 1. RENDER FOOTER ON HOMEPAGE
        const guestView = document.getElementById('guestView');
        if (guestView) {
            let footer = document.getElementById('dynamicHomepageFooter');
            if (!footer) {
                footer = document.createElement('footer');
                footer.id = 'dynamicHomepageFooter';
                footer.style.cssText = "margin-top: 50px; border-top: 1px solid #2a2a3a; padding: 40px 20px; text-align: center; background: #09090d;";
                guestView.appendChild(footer);
            }
            
            let socialHtml = '<div style="display: flex; justify-content: center; gap: 20px; margin-bottom: 20px;">';
            if (settings.socialTwitter) socialHtml += `<a href="${settings.socialTwitter}" target="_blank" style="color: #00d4aa; text-decoration: none; font-weight: bold; font-size: 13px;">Twitter (X)</a>`;
            if (settings.socialTelegram) socialHtml += `<a href="${settings.socialTelegram}" target="_blank" style="color: #00d4aa; text-decoration: none; font-weight: bold; font-size: 13px;">Telegram</a>`;
            if (settings.socialDiscord) socialHtml += `<a href="${settings.socialDiscord}" target="_blank" style="color: #00d4aa; text-decoration: none; font-weight: bold; font-size: 13px;">Discord</a>`;
            socialHtml += '</div>';

            footer.innerHTML = `
                ${socialHtml}
                <p style="color: #666; font-size: 11px; max-width: 600px; margin: 0 auto 20px; line-height: 1.5;">${settings.legalDisclaimer || ''}</p>
                <p style="color: #444; font-size: 11px;">© 2024 CoinWave Exchange. All rights reserved.</p>
            `;
        }

        // 2. MERGE CUSTOM ASSETS INTO LIVE MARKETS
        if (settings.customAssets && settings.customAssets.length > 0) {
            if (typeof markets !== 'undefined') {
                settings.customAssets.forEach(asset => {
                    if (!markets.find(m => m.symbol === asset.symbol)) {
                        markets.push({
                            name: asset.name,
                            symbol: asset.symbol,
                            price: parseFloat(asset.price) || 0,
                            change: 0,
                            icon: asset.icon || asset.symbol.charAt(0),
                            color: asset.color || '#333333'
                        });
                    }
                });
                // Re-render the market list if the function exists
                if (typeof loadMarkets === 'function') loadMarkets();
                if (typeof populateTradeCoins === 'function') populateTradeCoins();
            }
        }
    } catch (e) { console.log("Renderer error", e); }
}

// Run when the page loads
document.addEventListener('DOMContentLoaded', loadSettingsAndRender);
// Run again after 2 seconds just in case app.js renders the homepage late
setTimeout(loadSettingsAndRender, 2000);
