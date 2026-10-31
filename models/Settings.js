const mongoose = require('mongoose');
const SettingsSchema = new mongoose.Schema({
    _id: { type: String, default: 'global' },
    supportEmail: { type: String, default: 'support@coinwave.com' },
    wallets: { type: Object, default: {} },
    adminBankDetails: { type: String, default: 'Bank details not set yet.' },
    adminPaypalEmail: { type: String, default: 'PayPal not set yet.' }
}, { strict: false });
module.exports = mongoose.model('Settings', SettingsSchema);
