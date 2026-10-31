const mongoose = require('mongoose');
const OrderSchema = new mongoose.Schema({
    orderId: String, userEmail: String, userName: String, mode: String,
    sendAmount: String, sendCurrency: String, getAmount: String, getCurrency: String,
    method: String, paymentDetails: String, receivingWallet: String,
    status: String, date: String
});
module.exports = mongoose.model('Order', OrderSchema);
