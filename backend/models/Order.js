const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    tableId: { type: Number, required: true },
    items: [
        {
            name: String,
            price: Number,
            quantity: Number,
        },
    ],
    totalPrice: { type: Number, required: true },
    status: { type: String, required: true },
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);
