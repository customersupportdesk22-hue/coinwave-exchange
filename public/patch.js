// ==========================================
// 1. CSS LOCK (Hide floating buttons permanently)
// ==========================================
const style = document.createElement('style');
style.innerHTML = `
    #tawk-bubble-container, iframe[title="chat widget"], iframe[src*="tawk.to"] { 
        display: none !important; 
        visibility: hidden !important;
        opacity: 0 !important;
    }
    [class*="webcallhub"], div[id*="webcallhub"], iframe[src*="webcallhub"] { 
        display: none !important; 
    }
    #gainersLosersList { display: none !important; height: 0 !important; margin: 0 !important; padding: 0 !important; }
    
    /* Support Page Overlay */
    #support-page-overlay {
        display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: #0B0E11; z-index: 9999999; overflow-y: auto; padding: 20px;
        box-sizing: border-box; font-family: -apple-system, sans-serif;
    }
    #homepage-support-banner { 
        margin: 15px !important; background: #181A20; border-radius: 12px; 
        padding: 25px 20px; border: 1px solid #2B3139; text-align: center; 
    }
`;
document.head.appendChild(style);

// ==========================================
// 2. SUPPORT CENTER FUNCTIONS
// ==========================================
window.openSupportPage = function(e) { if(e) { e.preventDefault(); e.stopPropagation(); } document.getElementById('support-page-overlay').style.display = 'block'; }
window.closeSupportPage = function(e) { if(e) { e.preventDefault(); e.stopPropagation(); } document.getElementById('support-page-overlay').style.display = 'none'; }

window.loadTawkAndChat = function(e) {
    if(e) { e.preventDefault(); e.stopPropagation(); }
    closeSupportPage();
    
    if(!document.getElementById('tawk-script')) {
        var s1 = document.createElement("script");
        s1.id = 'tawk-script';
        s1.async = true;
        s1.src = 'https://embed.tawk.to/6acacd23a18e8334c37e911e/default';
        s1.charset = 'UTF-8';
        s1.setAttribute('crossorigin', '*');
        document.head.appendChild(s1);
        
        setTimeout(() => {
            if(window.Tawk_API && window.Tawk_API.maximize) window.Tawk_API.maximize();
            if(window.Tawk_API && window.Tawk_API.hideWidget) window.Tawk_API.hideWidget();
        }, 2000);
    } else {
        if(window.Tawk_API && window.Tawk_API.maximize) window.Tawk_API.maximize();
        if(window.Tawk_API && window.Tawk_API.hideWidget) window.Tawk_API.hideWidget();
    }
}

// ==========================================
// 3. INJECT SUPPORT CENTER UI
// ==========================================
setInterval(() => {
    if (!document.getElementById('support-page-overlay')) {
        let overlay = document.createElement('div');
        overlay.id = 'support-page-overlay';
        overlay.innerHTML = `
            <div style="max-width: 600px; margin: 0 auto; padding-bottom: 50px;">
                <div style="display: flex; align-items: center; margin-bottom: 30px; padding-bottom: 15px; border-bottom: 1px solid #2B3139;">
                    <div onclick="closeSupportPage(event)" style="width: 40px; height: 40px; border-radius: 50%; background: #181A20; display: flex; align-items: center; justify-content: center; cursor: pointer; border: 1px solid #2B3139;">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                    </div>
                    <h2 style="color: #fff; margin: 0 0 0 15px; font-size: 20px; font-weight: 600;">Support Center</h2>
                </div>
                <div style="background: #181A20; border-radius: 12px; padding: 20px; margin-bottom: 25px; border: 1px solid #2B3139;">
                    <h3 style="color: #fff; margin-top: 0; font-size: 16px; margin-bottom: 15px;">Important Notes</h3>
                    <ul style="color: #848E9C; font-size: 14px; padding-left: 20px; line-height: 1.8; margin: 0;">
                        <li>Our support team is available <b>24/7</b>.</li>
                        <li><b>Never</b> share your password or 12/24-word seed phrase.</li>
                    </ul>
                </div>
                <div onclick="loadTawkAndChat(event)" style="cursor: pointer; background: #181A20; padding: 20px; border-radius: 12px; border: 1px solid #2B3139; display: flex; align-items: center;">
                    <div style="font-size: 28px; margin-right: 15px;">💬</div>
                    <div style="flex: 1;">
                        <h4 style="color: #fff; margin: 0 0 5px 0; font-size: 16px;">Live Chat</h4>
                        <p style="color: #848E9C; margin: 0; font-size: 13px;">Chat with an agent instantly.</p>
                    </div>
                    <div style="color: #0ecb51; font-size: 20px;">&rarr;</div>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        const footer = document.querySelector('footer, .footer, div[style*="text-align: center"]');
        if (footer && !document.getElementById('homepage-support-banner')) {
            let banner = document.createElement('div');
            banner.id = 'homepage-support-banner';
            banner.innerHTML = `
                <h3 style="color: #fff; margin-top: 0; font-size: 18px; margin-bottom: 8px;">Need Assistance?</h3>
                <p style="color: #848E9C; font-size: 14px; margin-bottom: 20px;">Our professional support team is available 24/7.</p>
                <button onclick="openSupportPage(event)" style="width: 100%; padding: 15px; background: #0ecb51; color: #fff; border: none; border-radius: 8px; font-weight: bold; font-size: 16px; cursor: pointer;">Open Support Center</button>
            `;
            footer.parentNode.insertBefore(banner, footer);
        }
    }
}, 1000);
