const orderItemsContainer = document.getElementById("orderItems");
const orderTotal = document.getElementById("orderTotal");
const placeOrderBtn = document.getElementById("placeOrderBtn");

const fullName = document.getElementById("fullName");
const street = document.getElementById("street");
const zipCode = document.getElementById("zipCode");
const city = document.getElementById("city");

const SHIPPING_COST = 99;

init();

// Functions / Duplicates

function init() {
  renderOrderSummary();
  setupEventListeners();
}

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveOrder(order) {
  localStorage.setItem("lastOrder", JSON.stringify(order));
}

function clearCart() {
  localStorage.removeItem("cart");
}

function formatPrice(price) {
  return `${price.toFixed(2)},-`;
}

function calculateSubtotal(cart) {
  return cart.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
}

// Rendering

function renderOrderSummary() {
  const cart = getCart();
  orderItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    renderEmptyState();
    return;
  }

  cart.forEach(item => {
    const element = createOrderItemElement(item);
    orderItemsContainer.appendChild(element);
  });

  updateOrderTotal(cart);
}

function renderEmptyState() {
  orderItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
  orderTotal.textContent = formatPrice(0);
}

function createOrderItemElement(item) {
  const itemTotal = item.price * item.quantity;

  const container = document.createElement("div");
  container.classList.add("product-overview");

  container.innerHTML = `
    <img src="${item.image}" alt="${item.title}">
    <div class="product-information">
      <h2>${item.title}</h2>

      <div class="details">
        <p>SIZE:</p>
        <span>${item.size}</span>
      </div>

      <div class="details">
        <p>QUANTITY:</p>
        <span>${item.quantity}</span>
      </div>

      <h2 class="price">${formatPrice(itemTotal)}</h2>
    </div>
  `;

  return container;
}

function updateOrderTotal(cart) {
  const subtotal = calculateSubtotal(cart);
  const finalTotal = subtotal + SHIPPING_COST;
  orderTotal.textContent = formatPrice(finalTotal);
}

// Validate customer information

function isFormValid() {
  return (
    fullName.value.trim() &&
    street.value.trim() &&
    zipCode.value.trim() &&
    city.value.trim()
  );
}

// Create order

function createOrderObject(cart) {
  return {
    customer: {
      fullName: fullName.value.trim(),
      street: street.value.trim(),
      zipCode: zipCode.value.trim(),
      city: city.value.trim()
    },
    items: cart,
    orderDate: new Date().toISOString()
  };
}

// Event listeners

function setupEventListeners() {
  placeOrderBtn.addEventListener("click", handlePlaceOrder);
}

function handlePlaceOrder() {
  const cart = getCart();

  if (!isFormValid()) {
    alert("Please fill in all required fields.");
    return;
  }

  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  const order = createOrderObject(cart);

  saveOrder(order);
  clearCart();

  window.location.href = "confirmation.html";
}

