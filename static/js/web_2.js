// function applyFilter() {
//     var selectedBrand = document.getElementById('brand').value;
//     var priceRange = document.getElementById('priceRange').value.split('-');
//     var minPrice = priceRange[0] === "All" ? 0 : parseInt(priceRange[0]);
//     var maxPrice = priceRange[1] === "All" ? Infinity : parseInt(priceRange[1]);

//     var tables = document.querySelectorAll('table');
//     tables.forEach(function(table) {
//         var display = false;
//         if (table.classList.contains(selectedBrand) || selectedBrand === "All") {
//             var rows = table.querySelectorAll('tr');
//             rows.forEach(function(row, index) {
//                 if (index === 1) { // Assuming price is always on the second row
//                     var priceText = row.textContent.match(/\d+/g).join(''); // Remove non-numeric chars and join
//                     var price = parseInt(priceText); // Parse the integer
//                     if ((price >= minPrice && price <= maxPrice) || priceRange[0] === "All") {
//                         display = true;
//                     }
//                 }
//             });
//         }
//         table.style.display = display ? '' : 'none';
//     });
// }

// function applyFilter() {
//     var brand = document.getElementById("brand").value;
//     var priceRange = document.getElementById("priceRange").value;
//     var tables = document.querySelectorAll("table");

//     tables.forEach(function(table) {
//         table.style.display = "none"; // 默認隱藏所有表格

//         var rows = table.rows;
//         var showTable = false;

//         if (brand === "All" || table.classList.contains(brand)) {
//             if (priceRange === "All") {
//                 showTable = true;
//             } else {
//                 var [minPrice, maxPrice] = priceRange.split("-").map(Number);
//                 for (var i = 1; i < rows[1].cells.length; i++) {
//                     var priceText = rows[1].cells[i - 1].innerText;
//                     var price = Number(priceText.match(/\d+/g).join(""));
//                     console.log(price)
//                     if (price >= minPrice && price <= maxPrice) {
//                         showTable = true;
//                         break;
//                     }

//                 }
//             }
//         }

//         if (showTable) {
//             table.style.display = "";
//         }
//     });
// }

var table_1 = document.getElementById('table_1')
var table_2 = document.getElementById('table_2')
var table_3 = document.getElementById('table_3')

function applyFilter() {
    // 獲取選中的品牌和價格範圍
    let brandFilter = document.getElementById('brand').value;
    let priceRange = document.getElementById('priceRange').value;
    let [minPrice, maxPrice] = priceRange.split("-").map(Number);

    // 定義需要篩選的表格
    let tables = [
        { id: 'table_1', brand: 'BMW' },
        { id: 'table_2', brand: 'Audi' },
        { id: 'table_3', brand: 'Mercedes-Benz' }
    ];

    tables.forEach(table => {
        // 獲取表格和所有行
        let tableElement = document.getElementById(table.id);
        let rows = tableElement.getElementsByTagName('tr');
        let showTable = false;

        // 遍歷表格的每一行，從第二行開始（忽略標題行）
        for (let i = 0; i < rows.length; i += 3) {
            // 獲取價格單元格內容，並轉換為數字
            let priceCell = rows[i + 1].getElementsByTagName('td');
            for (let j = 0; j < priceCell.length; j++) {
                let priceText = priceCell[j].textContent;
                let price = parseInt(priceText.match(/\$([0-9,]+)/)[1].replace(/,/g, ''));

                // 根據品牌和價格範圍篩選，顯示或隱藏相應的行
                let brandMatch = (brandFilter === 'All' || table.brand === brandFilter);
                let priceMatch = (price >= minPrice && price <= maxPrice);
                
                if (brandMatch && priceMatch) {
                    rows[i].style.display = '';
                    rows[i + 1].style.display = '';
                    rows[i + 2].style.display = '';
                    showTable = true;
                } else {
                    rows[i].style.display = 'none';
                    rows[i + 1].style.display = 'none';
                    rows[i + 2].style.display = 'none';
                }
            }
        }

        // 根據篩選結果顯示或隱藏整個表格
        tableElement.style.display = showTable ? '' : 'none';
    });
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
