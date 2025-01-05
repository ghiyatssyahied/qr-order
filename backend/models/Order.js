const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    items: Array,
    totalPrice: Number,
    paymentMethod: String,
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
