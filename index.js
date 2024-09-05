document.addEventListener('DOMContentLoaded', () => {
    // Fetch and initialize data
    fetch('index.JSON')
        .then(response => response.json())
        .then(data => {
            initializeCart();
            initializeFavourites();
        })
        .catch(error => console.error('Error fetching data:', error));

    // Add event listeners for all "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const item = button.closest('.medicine-item');
            const id = item.querySelector('input').id;
            const price = parseFloat(item.querySelector('input').dataset.price);
            const quantity = parseInt(item.querySelector('input').value, 10);

            if (quantity > 0) {
                addToCart(id, price, quantity);
            }
        });
    });

    // Add event listener for "Buy Now" button
    const buyNowButton = document.getElementById('buyNowButton');
    if (buyNowButton) {
        buyNowButton.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default action like form submission
            window.location.href = 'orderform.html'; // Navigate to the order form
        });
    } else {
        console.error('Buy Now button not found');
    }

    // Add event listener for "Add to Favourites" button
    const addToFavouritesButton = document.getElementById('addToFavourites');
    if (addToFavouritesButton) {
        addToFavouritesButton.addEventListener('click', () => {
            saveToFavourites();
        });
    } else {
        console.error('Add to Favourites button not found');
    }

    // Add event listener for "Apply Favourites" button
    const applyFavouritesButton = document.getElementById('applyFavourites');
    if (applyFavouritesButton) {
        applyFavouritesButton.addEventListener('click', () => {
            applyFavourites();
        });
    } else {
        console.error('Apply Favourites button not found');
    }

    // Add event listener for "Cancel" button
    const cancelButton = document.getElementById('cancelButton');
    if (cancelButton) {
        cancelButton.addEventListener('click', () => {
            clearCart();
        });
    } else {
        console.error('Cancel button not found');
    }
});

// Function to initialize the cart from localStorage
function initializeCart() {
    updateCartTable();
}

// Function to initialize the favourites from localStorage
function initializeFavourites() {
    const favourites = JSON.parse(localStorage.getItem('favourites')) || [];
    // If you want to display favourites or otherwise use this data, you can do it here
}

// Function to add an item to the cart and update the cart table
function addToCart(id, price, quantity) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemIndex = cart.findIndex(item => item.id === id);

    if (itemIndex > -1) {
        cart[itemIndex].quantity += quantity;
    } else {
        cart.push({ id, price, quantity });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartTable();
}

// Function to update the cart table
function updateCartTable() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartTableBody = document.getElementById('cartItems');
    const totalPriceElement = document.getElementById('totalPrice');

    cartTableBody.innerHTML = '';
    let totalPrice = 0;

    fetch('index.JSON')
        .then(response => response.json())
        .then(data => {
            const allItems = [
                ...data.medicines.analgesics,
                ...data.medicines.antibiotics,
                ...data.medicines.antidepressants,
                ...data.medicines.antihistamines,
                ...data.medicines.antihypertensives
            ];

            cart.forEach(item => {
                const itemDetails = allItems.find(i => i.id === item.id);
                const itemName = itemDetails ? itemDetails.name : '';
                const totalItemPrice = item.price * item.quantity;

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${itemName}</td>
                    <td>${item.quantity}</td>
                    <td>${item.price.toFixed(2)} LKR</td>
                    <td>${totalItemPrice.toFixed(2)} LKR</td>
                `;
                cartTableBody.appendChild(row);
                totalPrice += totalItemPrice;
            });

            totalPriceElement.textContent = `${totalPrice.toFixed(2)} LKR`;
        })
        .catch(error => console.error('Error updating cart table:', error));
}

// Function to save current cart items to localStorage as favourites
function saveToFavourites() {
    const cart = localStorage.getItem('cart');
    if (cart) {
        localStorage.setItem('favourites', cart);
        alert('Items added to favourites.');
    } else {
        alert('No items in the cart to add to favourites.');
    }
}

// Function to apply saved favourites to the cart
function applyFavourites() {
    const favourites = JSON.parse(localStorage.getItem('favourites')) || [];
    if (favourites.length > 0) {
        localStorage.setItem('cart', JSON.stringify(favourites));
        updateCartTable();
        alert('Favourites applied to cart.');
    } else {
        alert('No favourites to apply.');
    }
}

// Function to clear the cart
function clearCart() {
    localStorage.removeItem('cart');
    updateCartTable();
}
