const mongoose = require('mongoose');
const SettingsSchema = new mongoose.Schema({
    btcAddress: { type: String, default: '' },
    ethAddress: { type: String, default: '' },
    usdtAddress: { type: String, default: '' },
    supportEmail: { type: String, default: 'support@coinwave.com' }
});
module.exports = mongoose.model('Settings', SettingsSchema);
