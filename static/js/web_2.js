function applyFilter() {
    var selectedBrand = document.getElementById('brand').value;
    var priceRange = document.getElementById('priceRange').value.split('-');
    var minPrice = priceRange[0] === "All" ? 0 : parseInt(priceRange[0]);
    var maxPrice = priceRange[1] === "All" ? Infinity : parseInt(priceRange[1]);

    var tables = document.querySelectorAll('table');
    tables.forEach(function(table) {
        var display = false;
        if (table.classList.contains(selectedBrand) || selectedBrand === "All") {
            var rows = table.querySelectorAll('tr');
            rows.forEach(function(row, index) {
                if (index === 1) { // Assuming price is always on the second row
                    var priceText = row.textContent.match(/\d+/g).join(''); // Remove non-numeric chars and join
                    var price = parseInt(priceText); // Parse the integer
                    if ((price >= minPrice && price <= maxPrice) || priceRange[0] === "All") {
                        display = true;
                    }
                }
            });
        }
        table.style.display = display ? '' : 'none';
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
