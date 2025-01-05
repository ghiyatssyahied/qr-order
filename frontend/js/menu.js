const checkoutButton = document.getElementById('checkout-button');
const checkoutModal = document.getElementById('checkout-modal');
const closeModalButton = document.getElementById('close-modal');
const paymentForm = document.getElementById('payment-form');
let cart = [];


document.addEventListener('DOMContentLoaded', () => {
    const menuContainer = document.getElementById('menu-list');
    let totalPrice = 0;

    // Fetch menu dari backend
    fetch('http://localhost:3000/menu')
        .then(res => res.json())
        .then(menuList => {
            menuList.forEach(item => {
                const menuItem = document.createElement('div');
                menuItem.innerHTML = `${item.name} - <strong>Rp${item.price}</strong>`;
                menuItem.classList.add('menu-item');
                menuItem.addEventListener('click', () => addToOrder(item));
                menuContainer.appendChild(menuItem);
            });
        });

    function addToOrder(item) {
        const orderContainer = document.querySelector('.order-items');
        const orderItem = document.createElement('div');
        orderItem.innerHTML = `${item.name} - Rp${item.price}`;
        orderContainer.appendChild(orderItem);
        totalPrice += item.price;
        document.getElementById('total-price').textContent = `Rp${totalPrice}`;
    }

    document.getElementById('checkout-button').addEventListener('click', () => {
        alert('Pesanan berhasil!');
    });

});
checkoutButton.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Keranjang Anda kosong!');
    } else {
        checkoutModal.style.display = 'block';
    }
});

// Tutup modal
closeModalButton.addEventListener('click', () => {
    checkoutModal.style.display = 'none';
});

function updateOrderSummary() {
    const orderContainer = document.querySelector('.order-items');
    orderContainer.innerHTML = '';

    cart.forEach(item => {
        const orderItem = document.createElement('div');
        orderItem.innerHTML = `${item.name} - Rp${item.price}`;
        orderContainer.appendChild(orderItem);
    });

    document.getElementById('total-price').textContent = `Rp${totalPrice}`;
}


// Proses pembayaran
paymentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const selectedPayment = document.querySelector('input[name="payment"]:checked').value;

    fetch('http://localhost:3000/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            items: cart,
            totalPrice: totalPrice,
            paymentMethod: selectedPayment
        })
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message);
        cart = [];
        updateOrderSummary();
        checkoutModal.style.display = 'none';
    });
});
