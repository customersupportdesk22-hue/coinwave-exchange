const mongoose = require('mongoose');
const SettingsSchema = new mongoose.Schema({
    _id: { type: String, default: 'global' },
    supportEmail: { type: String, default: 'support@coinwave.com' },
    wallets: { type: Object, default: {} },
    adminBankDetails: { type: String, default: 'Bank details not set yet.' },
    adminPaypalEmail: { type: String, default: 'PayPal not set yet.' },
    cardPaymentLink: { type: String, default: '' },
    // NEW SOCIAL & LEGAL FIELDS
    socialTwitter: { type: String, default: '' },
    socialTelegram: { type: String, default: '' },
    socialDiscord: { type: String, default: '' },
    legalDisclaimer: { type: String, default: 'Trading cryptocurrencies involves significant risk. CoinWave is a manual settlement platform and does not provide financial advice.' }
}, { strict: false });
module.exports = mongoose.model('Settings', SettingsSchema);
