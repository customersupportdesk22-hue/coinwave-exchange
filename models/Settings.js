const mongoose = require('mongoose');
const SettingsSchema = new mongoose.Schema({
    supportEmail: { type: String, default: 'support@coinwave.com' },
    wallets: { type: Object, default: {} } 
}, { strict: false }); // <-- This tells MongoDB to accept new fields!
module.exports = mongoose.model('Settings', SettingsSchema);
