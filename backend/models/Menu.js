const mongoose = require('mongoose');

const MenuSchema = new mongoose.Schema({
    name: String,
    price: Number,
    image: String,
    available: { type: Boolean, default: true }
});

module.exports = mongoose.model('Menu', MenuSchema);
