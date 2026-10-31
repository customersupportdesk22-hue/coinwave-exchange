const mongoose = require('mongoose');
const SettingsSchema = new mongoose.Schema({
    _id: { type: String, default: 'global' }, // Force ID to be a string
    supportEmail: { type: String, default: 'support@coinwave.com' },
    wallets: { type: Object, default: {} } 
}, { strict: false });
module.exports = mongoose.model('Settings', SettingsSchema);
