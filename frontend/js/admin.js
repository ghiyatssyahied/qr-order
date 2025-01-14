document.addEventListener('DOMContentLoaded', () => {
    // Redirect ke login jika belum login
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        window.location.href = 'login.html';
    }

    // Ambil data pesanan dari server
    fetchOrders();

    // Fungsi logout
    const logoutButton = document.querySelector('.logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    }
});

// Fungsi untuk mengambil data pesanan
function fetchOrders() {
    fetch('http://localhost:3000/order')
        .then((res) => {
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }
            return res.json();
        })
        .then((orders) => renderOrders(orders))
        .catch((err) => console.error('Error fetching orders:', err)); // Penanganan error untuk fetch
}


function renderOrders(orders) {
    const container = document.getElementById('order-list');
    container.innerHTML = ''; // Bersihkan kontainer sebelum render ulang

    if (orders.length === 0) {
        container.innerHTML = '<p>Tidak ada pesanan</p>';
        return;
    }

    orders.forEach(order => {
        const orderCard = document.createElement('div');
        orderCard.classList.add('order-card');
        orderCard.innerHTML = `
            <h4>Nomor Meja: ${order.tableId || 'Unknown'}</h4>
            <div class="order-items">
                ${order.items.map(item => `
                    <p>${item.quantity}x ${item.name} - Rp${item.price * item.quantity}</p>
                `).join('')}
            </div>
            <div class="order-status">
                <p>Status: <span>${order.status}</span></p>
            </div>
            <div class="order-actions">
                <button class="status-button" onclick="confirmUpdateStatus('${order._id}')">
                    ${order.status === 'process' ? 'Finish' : 'Done'}
                </button>
                <button class="delete-button" onclick="confirmDeleteOrder('${order._id}')">
                    Hapus
                </button>
            </div>
        `;
        container.appendChild(orderCard);
    });
}

function confirmDeleteOrder(orderId) {
    const isConfirmed = confirm('Apakah Anda yakin ingin menghapus pesanan ini?');
    if (isConfirmed) {
        deleteOrder(orderId);
    }
}

function deleteOrder(orderId) {
    fetch(`http://localhost:3000/order/${orderId}`, {
        method: 'DELETE',
    })
    .then(res => {
        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
    })
    .then(() => {
        alert('Pesanan berhasil dihapus');
        fetchOrders(); // Perbarui daftar pesanan setelah menghapus
    })
    .catch(err => {
        console.error('Error deleting order:', err);
        alert('Gagal menghapus pesanan');
    });
}




// Fungsi untuk konfirmasi sebelum memperbarui status
function confirmUpdateStatus(orderId) {
    const isConfirmed = confirm('Apakah Anda yakin ingin mengubah status menjadi "finish"?');
    if (isConfirmed) {
        updateStatus(orderId);
    }
}

// Fungsi untuk memperbarui status pesanan
function updateStatus(id) {
    fetch(`http://localhost:3000/order/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'finish' }),
    })
        .then((res) => {
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }
            return res.json();
        })
        .then(() => {
            alert('Status berhasil diperbarui');
            fetchOrders(); // Muat ulang pesanan
        })
        .catch((err) => console.error('Error updating status:', err)); // Penanganan error untuk fetch
}

// Fungsi logout
function logout() {
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'login.html';
}
