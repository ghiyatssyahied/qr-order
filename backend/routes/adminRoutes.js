const express = require('express');
const router = express.Router();
const Menu = require('../models/Menu');
const generateQRCode = require('../utils/generateQRCode');
const Order = require('../models/Order');
const multer = require('multer');
const path = require('path');

// Konfigurasi Multer untuk Upload Gambar
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

// Generate QR Code untuk meja
router.post('/generate-qrcode', async (req, res) => {
    const { tableId } = req.body;
    if (!tableId) {
        return res.status(400).json({ message: 'Nomor meja diperlukan' });
    }
    const qrCodeUrl = `http://localhost:3000/index.html?tableId=${tableId}`; // URL mengandung tableId
    const qrCode = await generateQRCode(qrCodeUrl);
    res.json({ qrCode });
});


// Tambah menu baru
router.post('/menu', upload.single('image'), async (req, res) => {
    const { name, price } = req.body;
    const image = req.file ? req.file.filename : null;

    try {
        const newMenu = new Menu({ name, price, image });
        await newMenu.save();
        res.json({ message: "Menu added successfully", menu: newMenu });
    } catch (error) {
        res.status(500).json({ message: "Error adding menu" });
    }
});

// Ambil semua menu
router.get('/menu', async (req, res) => {
    const menuList = await Menu.find();
    res.json(menuList);
});

// Hapus menu
router.delete('/menu/:id', async (req, res) => {
    const { id } = req.params;
    await Menu.findByIdAndDelete(id);
    res.json({ message: "Menu berhasil dihapus" });
});

// Ambil semua order
router.get('/order', async (req, res) => {
    const { tableId } = req.query;

    if (!tableId || isNaN(tableId)) {
        return res.status(400).json({ message: 'Nomor meja harus berupa angka yang valid' });
    }

    try {
        const orders = await Order.find({ tableId: parseInt(tableId, 10) }); // Filter berdasarkan tableId
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan saat mengambil pesanan', error });
    }
});



// Tambah pesanan baru
router.post('/order', async (req, res) => {
    try {
        const { items, totalPrice, status, tableId } = req.body;

        // Pastikan tableId ada dan valid
        if (!tableId || isNaN(tableId)) {
            return res.status(400).json({ message: 'Nomor meja tidak valid' });
        }

        const newOrder = new Order({ tableId: parseInt(tableId, 10), items, totalPrice, status });
        await newOrder.save();
        res.status(201).json({ message: 'Pesanan berhasil ditambahkan', order: newOrder });
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan', error });
    }
});

// Update status pesanan
router.patch('/order/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const updatedOrder = await Order.findByIdAndUpdate(id, { status }, { new: true });
        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan', error });
    }
});

router.get('/order', async (req, res) => {
    const { tableId } = req.query;

    try {
        let orders;
        if (tableId && !isNaN(tableId)) {
            orders = await Order.find({ tableId: parseInt(tableId, 10) }); // Filter berdasarkan tableId
        } else {
            orders = await Order.find(); // Ambil semua pesanan jika tableId tidak disediakan
        }
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat mengambil pesanan', error });
    }
});


// Endpoint: Hapus Pesanan
router.delete('/order/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await Order.findByIdAndDelete(id);
        res.status(200).json({ message: 'Pesanan berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ message: 'Error menghapus pesanan', error });
    }
});



module.exports = router;
