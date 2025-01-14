document.addEventListener('DOMContentLoaded', () => {
    const menuListContainer = document.getElementById('menu-list');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let totalPrice = parseInt(localStorage.getItem('totalPrice')) || 0;

    // Ambil `tableId` dari URL
    const urlParams = new URLSearchParams(window.location.search);
    const tableId = urlParams.get('tableId');

    if (tableId) {
        localStorage.setItem('tableId', tableId); // Simpan `tableId` ke localStorage
        console.log(`Table ID: ${tableId}`);
    } else {
        alert('Nomor meja tidak ditemukan. Silakan scan ulang QR Code.');
        window.location.href = 'index.html'; // Redirect jika tidak valid
    }

    // Fetch menu data from the backend
    fetch('http://localhost:3000/menu')
        .then((res) => res.json())
        .then((menuList) => {
            menuList.forEach((item) => {
                const menuItem = document.createElement('div');
                menuItem.classList.add('menu-card');

                menuItem.innerHTML = `
                    <img src="/uploads/${item.image}" alt="${item.name}">
                    <div class="menu-details">
                        <h3>${item.name}</h3>
                        <p>Rp${item.price}</p>
                    </div>
                    <div class="menu-actions">
                        <button onclick="addToCart('${item._id}', '${item.name}', ${item.price})">Tambah</button>
                    </div>
                `;
                menuListContainer.appendChild(menuItem);
            });

            // Update order summary if there are items in the cart
            if (cart.length > 0) {
                updateOrderSummary();
            }
        });

    // Add item to cart
    window.addToCart = (id, name, price) => {
        const existingItem = cart.find((item) => item.id === id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ id, name, price, quantity: 1 });
        }
        totalPrice += price;
        localStorage.setItem('cart', JSON.stringify(cart));
        localStorage.setItem('totalPrice', totalPrice);
        updateOrderSummary();
    };

    // Update order summary
    function updateOrderSummary() {
        const cartCount = document.getElementById('cart-count');
        const summaryTotalPrice = document.getElementById('summary-total-price');
        const orderSummary = document.getElementById('order-summary');

        cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
        summaryTotalPrice.textContent = `Rp${totalPrice}`;
        orderSummary.classList.remove('hidden');
    }

    function updateFloatingCard() {
        const cartCountElement = document.getElementById('cart-count');
        const totalPriceElement = document.getElementById('total-price');

        cartCountElement.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
        totalPriceElement.textContent = `Rp${totalPrice.toLocaleString()}`;
    }

    // Checkout functionality
    const checkoutButton = document.getElementById('summary-checkout-button');
    checkoutButton.addEventListener('click', () => {
        const tableId = localStorage.getItem('tableId') || 'Unknown';
        window.location.href = `orderlist.html?tableId=${tableId}`;
    });
    
    // Navigation
    const currentPage = window.location.pathname.split('/').pop();
    const navMenu = document.getElementById('nav-menu');
    const navOrderList = document.getElementById('nav-orderlist');

    if (currentPage === 'index.html') {
        navMenu.classList.add('active');
    } else if (currentPage === 'orderlist.html') {
        navOrderList.classList.add('active');
    }

    window.navigate = (page) => {
        window.location.href = page;
    };
});
