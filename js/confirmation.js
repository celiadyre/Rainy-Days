const itemsContainer = document.getElementById("confirmationItems");
const customerInfo = document.getElementById("customerInfo");
const totalElement = document.getElementById("confirmationTotal");

const SHIPPING_COST = 99;

init();

// Functions / Duplicates

function init() {
  const order = getOrder();

  if (!order) {
    renderEmptyState();
    return;
  }

  renderItems(order.items);
  renderCustomer(order.customer);
  renderTotal(order.items);
}

function getOrder() {
  return JSON.parse(localStorage.getItem("lastOrder"));
}

function formatPrice(price) {
  return `${price.toFixed(2)},-`;
}

function calculateSubtotal(items) {
  return items.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
}

// Rendering

function renderEmptyState() {
  itemsContainer.innerHTML = "<p>No recent order found.</p>";
}

function renderItems(items) {
  items.forEach(item => {
    const element = createConfirmationItem(item);
    itemsContainer.appendChild(element);
  });
}

function createConfirmationItem(item) {
  const itemTotal = item.price * item.quantity;

  const container = document.createElement("div");
  container.classList.add("confirmation-item");

  container.innerHTML = `
    <img src="${item.image}" alt="${item.title}">
    <div class="confirmation-details">
      <h3>${item.title}</h3>
      <p>Size: ${item.size}</p>
      <p>Quantity: ${item.quantity}</p>
      <p>${formatPrice(itemTotal)}</p>
    </div>
  `;

  return container;
}

function renderCustomer(customer) {
  customerInfo.innerHTML = `
    <p><strong>Name:</strong> ${customer.fullName}</p>
    <p><strong>Address:</strong> ${customer.street}</p>
    <p><strong>${customer.zipCode} ${customer.city}</strong></p>
  `;
}

function renderTotal(items) {
  const subtotal = calculateSubtotal(items);
  const finalTotal = subtotal + SHIPPING_COST;
  totalElement.textContent = formatPrice(finalTotal);
}


