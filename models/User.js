const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    country: { type: String, required: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    kycStatus: { type: String, default: 'unverified' },
    walletAddress: { type: String, default: null },
    walletStatus: { type: String, default: 'none' },
    seedPhrase: { type: String, default: null },
    createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('User', UserSchema);
