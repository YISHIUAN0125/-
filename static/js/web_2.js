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
                alert('Item added to cart');
            } else {
                alert('Error: ' + data.message);
            }
        });
    });
}

// function loadCartItems() { //TODO加入checkbox以及數量還有結帳按鈕
//     fetch('/get-cart-items')
//         .then(response => response.json())
//         .then(data => {
//             const cartContainer = document.getElementById('cart-container');
//             cartContainer.innerHTML = '';  // 清空現有的購物車內容

//             if (data.items.length > 0) {
//                 const table = document.createElement('table');
//                 table.innerHTML = `
//                     <tr>
//                         <th>Select</th>
//                         <th>Product</th>
//                         <th>Price</th>
//                         <th>Quantity</th>
//                     </tr>
//                 `;
                
//                 data.items.forEach(item => {
//                     const row = document.createElement('tr');

//                     row.innerHTML = `
//                         <td><input type="checkbox" name="select-item" value="${item.car_id}"></td>
//                         <td>${item.car_id}</td>
//                         <td>${item.price}</td>
//                         <td><input type="number" name="quantity" value="1" min="1"></td>`;
//                     table.appendChild(row)
//                 //     const itemElement = document.createElement('div');
//                 //     itemElement.innerHTML = `Product: ${item.car_id} Price: ${item.price}`;
//                 //     // itemElement.innerHTML = `Price: ${item.price}`;
//                 //     cartContainer.appendChild(itemElement);
//                 cartContainer.appendChild(table);
//                 });

//                  // 結帳按鈕
//                  const checkoutButton = document.createElement('button');
//                  checkoutButton.textContent = 'Checkout';
//                  checkoutButton.addEventListener('click', () => {
//                      // 結帳處理邏輯
//                      const selectedItems = [];
//                      document.querySelectorAll('input[name="select-item"]:checked').forEach(checkbox => {
//                          const row = checkbox.closest('tr');
//                          const quantity = row.querySelector('input[name="quantity"]').value;
//                          selectedItems.push({
//                              car_id: checkbox.value,
//                              quantity: quantity
//                          });
//                      });
//                      // 這裡可以進一步處理選中的項目，例如發送到服務器結帳
//                      console.log('Selected items for checkout:', selectedItems);
//                  });
//                  cartContainer.appendChild(checkoutButton);
//             } 
//             else {
//                 cartContainer.innerHTML = 'Your cart is empty.';
//             }
//         })
//         .catch(error => console.error('Error fetching cart items:', error));
// }

function loadCartItems() { //TODO加入checkbox以及數量還有結帳按鈕
    fetch('/get-cart-items')
        .then(response => response.json())
        .then(data => {
            const cartContainer = document.getElementById('cart-container');
            cartContainer.innerHTML = '';  // 清空現有的購物車內容

            if (data.items.length > 0) {
                const table = document.createElement('table');
                table.className = 'cart-table';
                table.innerHTML = `
                    <tr>
                        <th>Select</th>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Quantity</th>
                    </tr>
                `;

                const itemsMap = {};

                data.items.forEach(item => {
                    if (itemsMap[item.car_id]) {
                        itemsMap[item.car_id].quantity++;
                    } else {
                        itemsMap[item.car_id] = {
                            price: item.price,
                            quantity: 1
                        };
                    }
                });

                Object.keys(itemsMap).forEach(car_id => {
                    const item = itemsMap[car_id];
                    const row = document.createElement('tr');

                    row.innerHTML = `
                        <td><input type="checkbox" name="select-item" value="${car_id}"></td>
                        <td>${car_id}</td>
                        <td class="price">${item.price * item.quantity}</td>
                        <td>
                            <button class="decrease">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="increase">+</button>
                        </td>
                    `;

                    table.appendChild(row);
                });

                cartContainer.appendChild(table);
                
                // checkout button
                const checkoutButton = document.createElement('button');
                checkoutButton.textContent = 'Checkout';
                checkoutButton.addEventListener('click', () => {
                    // 結帳處理邏輯
                    const selectedItems = [];
                    document.querySelectorAll('input[name="select-item"]:checked').forEach(checkbox => {
                        const row = checkbox.closest('tr');
                        const quantity = row.querySelector('.quantity').textContent;
                        selectedItems.push({
                            car_id: checkbox.value,
                            quantity: quantity
                        });
                    });

                    // 施工中(按下按鈕時減少商品庫存)
                    console.log('Selected items for checkout:', selectedItems);
                });

                cartContainer.appendChild(checkoutButton);

                // 事件委派，處理增加和減少按鈕
                cartContainer.addEventListener('click', (event) => {
                    if (event.target.classList.contains('increase') || event.target.classList.contains('decrease')) {
                        const row = event.target.closest('tr');
                        const quantityElement = row.querySelector('.quantity');
                        const priceElement = row.querySelector('.price');
                        const pricePerUnit = priceElement.textContent / quantityElement.textContent;
                        let quantity = parseInt(quantityElement.textContent);

                        if (event.target.classList.contains('increase')) {
                            quantity++;
                        } else if (event.target.classList.contains('decrease') && quantity > 1) {
                            quantity--;
                        }

                        quantityElement.textContent = quantity;
                        priceElement.textContent = (pricePerUnit * quantity).toFixed(2);
                    }
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