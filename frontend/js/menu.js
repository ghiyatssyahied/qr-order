document.addEventListener('DOMContentLoaded', () => {
    // Cek apakah user sudah login, jika tidak redirect ke login.html
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        window.location.href = 'login.html';
    }

    const addMenuForm = document.getElementById('add-menu-form');
    const menuListContainer = document.getElementById('menu-list');
    const generateQRForm = document.getElementById('generate-qrcode-form');
    const qrResultContainer = document.getElementById('qrcode-result');
    const urlParams = new URLSearchParams(window.location.search);
    const tableId = urlParams.get('tableId'); // Ambil tableId dari URL


    // Tambah Menu Baru
    addMenuForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('menu-name').value.trim();
        const price = parseFloat(document.getElementById('menu-price').value);
        const image = document.getElementById('menu-image').files[0];

        if (!name || !price || !image) {
            alert('Semua field harus diisi!');
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);
        formData.append('image', image);

        fetch('http://localhost:3000/menu', {
            method: 'POST',
            body: formData,
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                alert(data.message);
                loadMenu();
            })
            .catch(error => {
                console.error('Error adding menu:', error);
                alert('Terjadi kesalahan: ' + error.message);
            });

        addMenuForm.reset();
    });

    // Load Daftar Menu
    function loadMenu() {
        fetch('http://localhost:3000/menu')
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }
                return res.json();
            })
            .then(menuList => {
                menuListContainer.innerHTML = '';
                menuList.forEach(item => {
                    const menuItem = document.createElement('div');
                    menuItem.classList.add('menu-card');

                    menuItem.innerHTML = `
                        <img src="/uploads/${item.image}" alt="${item.name}">
                        <div class="menu-details">
                            <p>${item.name} - Rp${item.price}</p>
                        </div>
                        <div class="menu-actions">
                            <button onclick="deleteMenu('${item._id}')">Hapus</button>
                        </div>
                    `;

                    menuItem.style.opacity = 0;
                    menuListContainer.appendChild(menuItem);
                    setTimeout(() => {
                        menuItem.style.opacity = 1;
                    }, 100);
                });
            })
            .catch(error => {
                console.error('Error loading menu:', error);
                alert('Gagal memuat menu: ' + error.message);
            });
    }

    // Generate QR Code untuk Nomor Meja
    generateQRForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const tableId = document.getElementById('table-id').value.trim();

        if (!tableId) {
            alert('Nomor meja harus diisi!');
            return;
        }

        fetch('http://localhost:3000/generate-qrcode', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tableId }),
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                qrResultContainer.innerHTML = `
                    <img src="${data.qrCode}" alt="QR Code">
                    <button onclick="printQRCode()">Print QR</button>
                `;
            })
            .catch(error => {
                console.error('Error generating QR code:', error);
                alert('Gagal generate QR code: ' + error.message);
            });

        generateQRForm.reset();
    });

    // Fungsi Hapus Menu
    window.deleteMenu = (menuId) => {
        if (confirm('Apakah Anda yakin ingin menghapus menu ini?')) {
            fetch(`http://localhost:3000/menu/${menuId}`, {
                method: 'DELETE',
            })
                .then(res => {
                    if (!res.ok) {
                        throw new Error(`HTTP error! Status: ${res.status}`);
                    }
                    return res.json();
                })
                .then(data => {
                    alert(data.message);
                    loadMenu();
                })
                .catch(error => {
                    console.error('Error deleting menu:', error);
                    alert('Terjadi kesalahan: ' + error.message);
                });
        }
    };

    // Fungsi Logout
    window.logout = () => {
        localStorage.removeItem('isLoggedIn');
        window.location.href = 'login.html';
    };

    // Fungsi untuk print QR Code
    window.printQRCode = () => {
        const qrCode = document.querySelector('#qrcode-result img').src;
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <img src="${qrCode}" onload="window.print();window.close()">
        `);
        printWindow.document.close();
    };

    // Load menu saat halaman dimuat
    loadMenu();
});
