function applyFilter() {
    var brand = document.getElementById("brand").value;
    var priceRange = document.getElementById("priceRange").value.split("-");
    var minPrice = parseInt(priceRange[0]);
    var maxPrice = parseInt(priceRange[1]);

    var tables = document.querySelectorAll("table");
    tables.forEach(function(table) {
        var price = parseInt(table.rows[0].cells[1].innerText.split("$")[1].replace(/,/g, ""));
        var tableBrand = table.className;
        console.log(tableBrand);
        if ((brand === "All" || brand === tableBrand) && (price >= minPrice && price <= maxPrice)) {
            table.style.display="";
        } else {
            table.style.display="none";
        }
    });
}

function goToCart(){
    window.location.href = "/cart";
}

function web1_() {
    window.location.href = "/";
}

function login() {
    window.location.href = "/login";
}

function signup() {
    window.location.href = "/signup";
}

// 加入購物車
function addToCart(product_name, price) {
    // 發送 GET 請求到 '/get-username' 獲取使用者名稱
    fetch('/get-username')
    .then(response => response.json())
    .then(data => {
        const username = data.username;
        
        // 發送 POST 請求到 '/add-to-cart'
        fetch('/add-to-cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username, product_name, price})
        })
        .then(response => response.json())
        .then(data => {
            if (data.id) {
                alert('Item added to cart with ID: ' + data.id);
            } else {
                alert('Error: ' + data.message);
            }
        });
    });
}

function loadCartItems() { //TODO加入checkbox以及數量還有結帳按鈕
    fetch('/get-cart-items')
        .then(response => response.json())
        .then(data => {
            const cartContainer = document.getElementById('cart-container');
            cartContainer.innerHTML = '';  // 清空現有的購物車內容

            if (data.items.length > 0) {
                data.items.forEach(item => {
                    const itemElement = document.createElement('div');
                    itemElement.innerHTML = `Product: ${item.car_id}`;
                    cartContainer.appendChild(itemElement);
                });
            } else {
                cartContainer.innerHTML = 'Your cart is empty.';
            }
        })
        .catch(error => console.error('Error fetching cart items:', error));
}

window.onload = function() {
    loadCartItems();  // 頁面加載時加載購物車內容
};