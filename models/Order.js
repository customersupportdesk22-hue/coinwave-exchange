const mongoose = require('mongoose');
const OrderSchema = new mongoose.Schema({
    orderId: { type: String, required: true, unique: true },
    userEmail: { type: String, required: true },
    userName: { type: String, required: true },
    mode: { type: String, required: true },
    sendAmount: { type: String, required: true },
    sendCurrency: { type: String, required: true },
    getAmount: { type: String, required: true },
    getCurrency: { type: String, required: true },
    method: { type: String, required: true },
    paymentDetails: { type: String, required: true },
    receivingWallet: { type: String, default: 'N/A' },
    status: { type: String, default: 'pending' },
    date: { type: String, required: true }
});
module.exports = mongoose.model('Order', OrderSchema);
