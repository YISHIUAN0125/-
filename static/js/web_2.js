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

function loadCartItems() { 
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
                        <th><input type="checkbox" id="select-all"></th>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Total</th>
                    </tr>
                `;
                const itemsMap = {};
                data.items.forEach(item => {
                    if (itemsMap[item.car_id]) {
                        itemsMap[item.car_id].quantity++;
                    } else {
                        itemsMap[item.car_id] = {
                            price: Math.round(item.price),
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
                        <td class="price">${item.price}</td>
                        <td>
                            <button class="decrease">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="increase">+</button>
                        </td>
                        <td class="total">${item.price * item.quantity}</td>
                    `;

                    table.appendChild(row);
                });

                cartContainer.appendChild(table);
                
                // 顯示總價
                const totalPriceRow = document.createElement('tr');
                totalPriceRow.innerHTML = `
                    <td colspan="4" class="total-price-label">Total Price:</td>
                    <td id="total-price" class="total-price-value"></td>
                `;
                table.appendChild(totalPriceRow);

                // totalprice
                updateTotalPrice();

                // 全選
                document.getElementById('select-all').addEventListener('change', (event) => {
                    const isChecked = event.target.checked;
                    document.querySelectorAll('input[name="select-item"]').forEach(checkbox => {
                        checkbox.checked = isChecked;
                    });
                });

                // checkout button
                const checkoutButton = document.createElement('button');
                checkoutButton.textContent = 'Checkout';
                checkoutButton.addEventListener('click', () => {
                    // 結帳處理邏輯
                    //取得模態框
                    const modal = document.getElementById('checkout-modal');
                    const closeButton = modal.querySelector('.close');

                    // 關閉模態框
                    window.onclick = function(event) {
                        if (event.target == modal) {
                            modal.style.display = "none";
                        }
                    }

                    closeButton.onclick = function() {
                        modal.style.display = "none";
                    }

                    // 結帳時顯示模態框
                    checkoutButton.addEventListener('click', () => {
                        modal.style.display = "block";
                    });
                    // 提交表單
                    document.getElementById('checkout-form').addEventListener('submit', function(event) {
                        event.preventDefault();
                        // 表單數據
                        const formData = new FormData(this);
                        const paymentInfo = {};
                        for (const [key, value] of formData.entries()) {
                            paymentInfo[key] = value;
                        }

                        // 收集商品訊息
                        paymentInfo.selectedItems = [];
                        document.querySelectorAll('input[name="select-item"]:checked').forEach(checkbox => {
                            const row = checkbox.closest('tr');
                            const quantity = row.querySelector('.quantity').textContent;
                            paymentInfo.selectedItems.push({
                                car_id: checkbox.value,
                                quantity: quantity
                            });
                        });

                        // 對後端發送post請求
                        fetch('/process-payment', {
                        method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(paymentInfo)
                        })
                        .then(response => response.json())
                        .then(data => {
                            // 顯示付款成功
                            alert('付款成功！');
                            // 清空購物車
                            loadCartItems();
                            // 隱藏模態框
                            modal.style.display = "none";
                            //清空購物車
                            fetch('/clear-cart', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({})  
                            })
                            .then(response => response.json())
                            .then(data => {
                                console.log('Cart cleared successfully:', data);
                                loadCartItems();
                                
                            })
                            .catch(error => console.error('Error clearing cart:', error));
                            
                        })
                        .catch(error => console.error('Error processing payment:', error));
                    });
  
                });

                cartContainer.appendChild(checkoutButton);

                // 清除按鈕
                const clearButton = document.createElement('button');
                clearButton.textContent = 'Clear';
                clearButton.addEventListener('click', () => {
                    const selectedItems = [];
                    document.querySelectorAll('input[name="select-item"]:checked').forEach(checkbox => {
                        selectedItems.push(checkbox.value);
                    });

                    fetch('/clear-cart-item', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ items: selectedItems })
                    })
                    .then(response => response.json())
                    .then(data => {
                        console.log('Items cleared:', data);
                        // Reload cart items after clearing
                        loadCartItems();
                    })
                    .catch(error => console.error('Error clearing cart items:', error));
                });

                cartContainer.appendChild(clearButton);

                // 事件委派，處理增加和減少按鈕
                cartContainer.addEventListener('click', (event) => {
                    if (event.target.classList.contains('increase') || event.target.classList.contains('decrease')) {
                        const row = event.target.closest('tr');
                        const quantityElement = row.querySelector('.quantity');
                        const priceElement = row.querySelector('.price');
                        const totalElement = row.querySelector('.total');
                        const pricePerUnit = parseInt(priceElement.textContent);
                        let quantity = parseInt(quantityElement.textContent);

                        if (event.target.classList.contains('increase')) {
                            quantity++;
                        } else if (event.target.classList.contains('decrease') && quantity > 1) {
                            quantity--;
                        }

                        quantityElement.textContent = quantity;
                        totalElement.textContent = Math.round(pricePerUnit * quantity);

                        // 更新總價
                        updateTotalPrice();
                    }
                });

            } else {
                cartContainer.innerHTML = 'Your cart is empty.';
            }
        })
        .catch(error => console.error('Error fetching cart items:', error));
}

function updateTotalPrice() {
    let totalPrice = 0;
    document.querySelectorAll('.cart-table .total').forEach(totalElement => {
        totalPrice += parseInt(totalElement.textContent);
    });
    document.getElementById('total-price').textContent = totalPrice;
}

// 显示订单信息函数
function displayOrderInfo(orderInfo) {
    // 取得當前時間
    let now = new Date();
    // 取得本地時間
    let localTime = now.toLocaleTimeString();;
    const orderInfoContainer = document.createElement('div');
    orderInfoContainer.className = 'order-info';
    orderInfoContainer.innerHTML = `
        <h3>Order Information</h3>
        <p>Order Date: ${localTime}</p>
    `;
    document.getElementById('cart-container').appendChild(orderInfoContainer);
}






window.onload = function() {
    loadCartItems();  // 頁面加載時加載購物車內容
};