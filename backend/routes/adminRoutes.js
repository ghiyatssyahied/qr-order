const express = require('express');
const router = express.Router();
const Menu = require('../models/Menu');
const generateQRCode = require('../utils/generateQRCode');
const Order = require('../models/Order');




// Generate QR Code untuk meja
router.post('/generate-qrcode', async (req, res) => {
    const { tableId } = req.body;
    const qrCode = await generateQRCode(`http://localhost:3000/menu?table=${tableId}`);
    res.json({ qrCode });
});

// Tambah menu baru
router.post('/menu', async (req, res) => {
    const { name, price } = req.body;
    try {
        const newMenu = new Menu({ name, price });
        await newMenu.save();
        res.json({ message: "Menu added successfully", menu: newMenu });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error adding menu" });
    }
});


// Ambil semua menu
router.get('/menu', async (req, res) => {
    const menuList = await Menu.find();
    res.json(menuList);
});

// Hapus menu berdasarkan ID
router.delete('/menu/:id', async (req, res) => {
    const { id } = req.params;
    await Menu.findByIdAndDelete(id);
    res.json({ message: "Menu berhasil dihapus" });
});

router.post('/order', async (req, res) => {
    const { items, totalPrice, paymentMethod } = req.body;

    const newOrder = new Order({ items, totalPrice, paymentMethod });
    await newOrder.save();

    res.json({ message: 'Pesanan Anda berhasil disimpan!' });
});


module.exports = router;
