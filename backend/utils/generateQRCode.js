const QRCode = require('qrcode');

async function generateQRCode(data) {
    try {
        return await QRCode.toDataURL(data);
    } catch (err) {
        console.error('Error generating QR code:', err);
        throw err;
    }
}

module.exports = generateQRCode;
