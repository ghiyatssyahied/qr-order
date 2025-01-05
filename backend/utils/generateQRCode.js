const QRCode = require('qrcode');

const generateQRCode = async (text) => {
    try {
        const qrCode = await QRCode.toDataURL(text);
        return qrCode; // Return QR Code in Base64
    } catch (err) {
        console.error(err);
    }
};

module.exports = generateQRCode;
