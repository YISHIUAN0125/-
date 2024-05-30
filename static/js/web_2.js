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


function web1_() {
    window.location.href = "/";
}

function login() {
    window.location.href = "/login";
}

function signup() {
    window.location.href = "/signup";
}
