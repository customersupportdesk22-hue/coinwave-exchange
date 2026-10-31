const mongoose = require('mongoose');
const SettingsSchema = new mongoose.Schema({
    supportEmail: { type: String, default: 'support@coinwave.com' },
    wallets: { type: Object, default: {} } // Stores { BTC: "addr", ETH: "addr", etc. }
});
module.exports = mongoose.model('Settings', SettingsSchema);
