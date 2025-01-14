document.addEventListener('DOMContentLoaded', () => {
    const orderItemsContainer = document.querySelector('.order-items');
    const totalPayment = document.getElementById('total-payment');
    const submitOrderContainer = document.getElementById('submit-order-container');
    const submitOrderButton = document.getElementById('submit-order-btn');
    const payButton = document.querySelector('.pay-button');
    const popup = document.getElementById('payment-popup');
    const closePopupButton = document.getElementById('close-popup');
    const urlParams = new URLSearchParams(window.location.search);
    const tableId = parseInt(urlParams.get('tableId'), 10); // Ambil tableId dari URL

    if (!tableId) {
        alert('Nomor meja tidak ditemukan. Silakan scan ulang QR Code.');
        window.location.href = 'index.html'; // Redirect ke menu utama jika tidak ada tableId
        return;
    }

    // Gunakan tableId untuk menampilkan data pesanan
    document.querySelector('.table-number').textContent = `Table: ${tableId}`;

    // Ambil data dari localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalPrice = parseInt(localStorage.getItem('totalPrice')) || 0;

    // Render pesanan di order list
    if (cart.length > 0) {
        cart.forEach(item => {
            const orderItem = document.createElement('div');
            orderItem.classList.add('order-item');
            orderItem.innerHTML = `
                <p>${item.quantity}x ${item.name} - Rp${item.price * item.quantity}</p>
            `;
            orderItemsContainer.appendChild(orderItem);
        });

        // Tampilkan tombol "Kirim Pesanan" di dalam card Order List
        submitOrderContainer.classList.remove('hidden');
    } else {
        const emptyMessage = document.createElement('p');
        emptyMessage.textContent = 'No items in the order list.';
        orderItemsContainer.appendChild(emptyMessage);
        submitOrderContainer.classList.add('hidden'); // Sembunyikan tombol jika tidak ada pesanan
    }

    // Tampilkan total pembayaran
    totalPayment.textContent = `Rp${totalPrice}`;

    // Fungsi untuk tombol "Kirim Pesanan"
    submitOrderButton.addEventListener('click', () => {
    const orderData = {
        tableId: parseInt(localStorage.getItem('tableId'), 10),
        items: cart,
        totalPrice: totalPrice,
        status: 'process',
    };

    console.log("Data yang dikirim ke backend:", orderData); // Debugging

    fetch('http://localhost:3000/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(() => {
            alert('Pesanan berhasil dikirim!');
            localStorage.removeItem('cart');
            localStorage.removeItem('totalPrice');
            window.location.reload();
        })
        .catch(error => console.error('Error:', error));
});


    // Periksa status pesanan untuk menampilkan tombol "Pay"
    fetch(`http://localhost:3000/order/status?tableId=${tableId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(orderStatus => {
            if (orderStatus.status === 'finish') {
                payButton.classList.remove('hidden');
            } else {
                payButton.classList.add('hidden');
            }
        })
        .catch(error => console.error('Error fetching order status:', error));

    // Event listener untuk tombol "Pay"
    payButton.addEventListener('click', (event) => {
        event.preventDefault();
        popup.classList.remove('hidden'); // Tampilkan pop-up
    });

    // Event listener untuk tombol "OK" di pop-up
    closePopupButton.addEventListener('click', () => {
        popup.classList.add('hidden'); // Tutup pop-up
        localStorage.removeItem('cart');
        localStorage.removeItem('totalPrice');
        window.location.href = 'index.html'; // Navigasi kembali ke halaman menu
    });

    // Load daftar pesanan berdasarkan nomor meja
    loadOrderList(tableId);
});

// Fungsi untuk memuat daftar pesanan berdasarkan nomor meja
function loadOrderList(tableId) {
    fetch(`http://localhost:3000/order?tableId=${tableId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(orderList => {
            const orderItemsContainer = document.querySelector('.order-items');
            orderItemsContainer.innerHTML = '';

            if (orderList.length === 0) {
                orderItemsContainer.innerHTML = '<p>No items in the order list.</p>';
                return;
            }

            orderList.forEach(order => {
                const orderItem = document.createElement('div');
                orderItem.classList.add('order-item');
                orderItem.innerHTML = `
                    <p>${order.quantity}x ${order.name} - Rp${order.price * order.quantity}</p>
                `;
                orderItemsContainer.appendChild(orderItem);
            });
        })
        .catch(error => console.error('Error loading orders:', error));
}

