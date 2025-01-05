document.addEventListener('DOMContentLoaded', () => {
    const addMenuForm = document.getElementById('add-menu-form');
    const generateQRForm = document.getElementById('generate-qrcode-form');
    const menuListContainer = document.getElementById('menu-list');
    const qrResultContainer = document.getElementById('qrcode-result');

    // Tambah Menu
    addMenuForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('menu-name').value;
        const price = document.getElementById('menu-price').value;

        fetch('http://localhost:3000/menu', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, price })
        })
        .then(res => res.json())
        .then(data => {
            alert(data.message);
            loadMenu();
        });
        
        addMenuForm.reset();
    });

    // Generate QR Code
    generateQRForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const tableId = document.getElementById('table-id').value;

        fetch('http://localhost:3000/api/admin/generate-qrcode', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tableId })
        })
        .then(res => res.json())
        .then(data => {
            qrResultContainer.innerHTML = `<img src="${data.qrCode}" alt="QR Code">`;
        });
        
        generateQRForm.reset();
    });
    

    // Load Menu List
    function loadMenu() {
        fetch('http://localhost:3000/menu')
            .then(res => res.json())
            .then(menuList => {
                const menuListContainer = document.getElementById('menu-list');
                menuListContainer.innerHTML = '';  // Bersihkan daftar lama
                menuList.forEach(item => {
                    const menuItem = document.createElement('div');
                    menuItem.innerHTML = `${item.name} - Rp${item.price}`;
                    menuListContainer.appendChild(menuItem);
                });
            });
    }
    
    // Panggil loadMenu setelah menambah menu
    addMenuForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('menu-name').value;
        const price = document.getElementById('menu-price').value;
    
        fetch('http://localhost:3000/menu', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, price })
        })
        .then(res => res.json())
        .then(data => {
            alert(data.message);
            loadMenu();  // Reload daftar menu
        });
        
        addMenuForm.reset();
    });
    

    menuList.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.innerHTML = `${item.name} - Rp${item.price}`;
        
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Hapus';
        deleteButton.addEventListener('click', () => {
            fetch(`http://localhost:3000/menu/${item._id}`, {
                method: 'DELETE'
            })
            .then(res => res.json())
            .then(data => {
                alert(data.message);
                loadMenu();
            });
        });
    
        menuItem.appendChild(deleteButton);
        menuListContainer.appendChild(menuItem);
    });
   
        // Tampilkan Daftar Menu
        function loadMenu() {
            fetch('http://localhost:3000/menu')
                .then(res => res.json())
                .then(menuList => {
                    menuListContainer.innerHTML = '';
                    menuList``.forEach(item => {
                        const menuItem = document.createElement('div');
                        menuItem.innerHTML = `${item.name} - Rp${item.price}`;
                        menuListContainer.appendChild(menuItem);
                    });
                });
        }
    
        loadMenu();
    });
    
   

