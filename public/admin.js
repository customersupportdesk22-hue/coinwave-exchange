
/* =====================================================
   ADMIN UI: CALL BUTTON TOGGLE & SCRIPT
   ===================================================== */
setTimeout(() => {
    const settingsTab = document.getElementById('tab-settings');
    if (settingsTab && !document.getElementById('setCallScript')) {
        const card = settingsTab.querySelector('.card');
        if (card) {
            const callHtml = `
                <div style="margin-top: 30px; border-top: 1px solid #333; padding-top: 20px;">
                    <h4 style="margin-bottom: 15px; color: #00d4aa;">Live Call Support Widget</h4>
                    <div class="form-group" style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
                        <input type="checkbox" id="setCallEnabled" style="width: 20px; height: 20px; cursor: pointer;">
                        <label style="margin: 0; cursor: pointer;" for="setCallEnabled">Enable Call Button on Website</label>
                    </div>
                    <div class="form-group">
                        <label>Paste Call Widget Script Here (e.g. WebCallHub)</label>
                        <textarea id="setCallScript" placeholder="<script src='...'></script>" style="width: 100%; height: 100px; background: #0f0f15; color: #fff; border: 1px solid #333; padding: 10px; border-radius: 6px; font-family: monospace;"></textarea>
                    </div>
                </div>
            `;
            card.insertAdjacentHTML('beforeend', callHtml);
        }
    }

    // Override loadSettings
    const originalLoad = window.loadSettings;
    window.loadSettings = async function() {
        await originalLoad();
        try {
            const res = await fetch('/api/admin/settings', { headers: { 'Authorization': 'Bearer ' + token } });
            const data = await res.json();
            if(document.getElementById('setCallEnabled')) document.getElementById('setCallEnabled').checked = data.callEnabled || false;
            if(document.getElementById('setCallScript')) document.getElementById('setCallScript').value = data.callScript || '';
        } catch(e) {}
    };

    // Override saveSettings
    const originalSave = window.saveSettings;
    window.saveSettings = async function(btn) {
        btn.disabled = true; btn.textContent = 'Saving...';
        const walletsObj = {};
        coinList.forEach(coin => {
            const el = document.getElementById('wallet_' + coin);
            if (el && el.value.trim()) walletsObj[coin] = el.value.trim();
        });

        const data = {
            supportEmail: document.getElementById('setSupportEmail').value,
            wallets: walletsObj,
            adminBankDetails: document.getElementById('setAdminBank').value,
            adminPaypalEmail: document.getElementById('setAdminPaypal').value,
            cardPaymentLink: document.getElementById('setCardLink').value,
            socialTwitter: document.getElementById('setSocialTwitter').value,
            socialTelegram: document.getElementById('setSocialTelegram').value,
            socialDiscord: document.getElementById('setSocialDiscord').value,
            legalDisclaimer: document.getElementById('setLegalDisclaimer').value,
            callEnabled: document.getElementById('setCallEnabled').checked,
            callScript: document.getElementById('setCallScript').value
        };
        
        try {
            const res = await fetch('/api/admin/settings', {
                method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                body: JSON.stringify(data)
            });
            if (!res.ok) throw new Error('Server rejected settings');
            document.getElementById('settingsMsg').textContent = 'Settings saved successfully!';
            setTimeout(() => document.getElementById('settingsMsg').textContent = '', 3000);
        } catch (e) { alert('Failed to save settings.'); }
        btn.disabled = false; btn.textContent = 'Save Settings';
    };
}, 1000);
