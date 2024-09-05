document.addEventListener('DOMContentLoaded', () => {
    // Load cart items and populate the order summary table
    populateOrderSummary();

    // Add event listener for "Place Order" button
    document.getElementById('placeOrderButton').addEventListener('click', (event) => {
        event.preventDefault(); // Prevent form from submitting the default way
        placeOrder();
    });
});

// Function to fetch item details from index.json
async function fetchItemDetails() {
    const response = await fetch('index.json');
    const data = await response.json();
    return data.medicines;
}

// Function to populate the order summary table with cart items
async function populateOrderSummary() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const orderSummaryBody = document.querySelector('#orderSummary tbody');
    const totalPriceElement = document.getElementById('totalPrice');

    // Fetch item details
    const itemDetails = await fetchItemDetails();
    const allItems = [
        ...itemDetails.analgesics,
        ...itemDetails.antibiotics,
        ...itemDetails.antidepressants,
        ...itemDetails.antihistamines,
        ...itemDetails.antihypertensives
    ];

    orderSummaryBody.innerHTML = ''; // Clear existing rows
    let totalPrice = 0;

    cart.forEach(item => {
        const row = document.createElement('tr');
        const itemDetail = allItems.find(i => i.id === item.id);
        const itemName = itemDetail ? itemDetail.name : 'Unknown Item';
        const itemTotalPrice = item.price * item.quantity;
        totalPrice += itemTotalPrice;

        row.innerHTML = `
            <td>${itemName}</td>
            <td>${item.quantity}</td>
            <td>${itemTotalPrice.toFixed(2)} LKR</td>
        `;

        orderSummaryBody.appendChild(row);
    });

    totalPriceElement.textContent = `${totalPrice.toFixed(2)} LKR`;
}

// Function to handle order placement
function placeOrder() {
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const paymentMethod = document.getElementById('paymentMethod').value;

    // Calculate the delivery date (4 to 5 days from today)
    const today = new Date();
    const deliveryDays = Math.floor(Math.random() * (5 - 4 + 1)) + 4; // Randomly choose between 4 and 5 days
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + deliveryDays);

    // Format the delivery date as a readable string
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = deliveryDate.toLocaleDateString('en-US', options);

    // Perform further processing such as sending order details to a server

    // Clear the cart after placing the order
    localStorage.removeItem('cart');

    // Display confirmation message
    document.getElementById('confirmation-message').textContent = `Thank you, ${fullName}! Your order has been placed successfully. Your delivery is expected to arrive between ${today.toLocaleDateString('en-US', options)} and ${formattedDate}.`;
}
