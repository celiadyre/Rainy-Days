const cartItemsContainer = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");

init();

// Functions / Duplicates

function init() {
  renderCart();
  setupEventListeners();
}

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function formatPrice(price) {
  return `${price.toFixed(2)},-`;
}

function calculateTotal(cart) {
  return cart.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
}

// Cart rendering

function renderCart() {
  const cart = getCart();
  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
    cartTotal.textContent = "TOTAL: 0.00,-";
    return;
  }

  cart.forEach((item, index) => {
    const cartItemElement = createCartItemElement(item, index);
    cartItemsContainer.appendChild(cartItemElement);
  });

  updateCartTotal(cart);
}

function createCartItemElement(item, index) {
  const cartItem = document.createElement("div");
  cartItem.classList.add("cart-item");

  cartItem.innerHTML = `
    <img src="${item.image}" alt="${item.title}">
    
    <div class="cart-details">
      <h3>${item.title}</h3>
      <p>${formatPrice(item.price)}</p>

      <div class="size">
        <p>SIZE:</p>
        <span>${item.size}</span>
      </div>

      <div class="quantity">
        <p>QUANTITY:</p>
        <div class="quantity-controls">
          <input type="number" value="${item.quantity}" min="1" data-index="${index}">
          <i class="fa-solid fa-trash" data-index="${index}"></i>
        </div>
      </div>
    </div>
  `;

  return cartItem;
}

function updateCartTotal(cart) {
  const total = calculateTotal(cart);
  cartTotal.textContent = `TOTAL: ${formatPrice(total)}`;
}

// Cart actions

function updateQuantity(index, newQuantity) {
  const cart = getCart();
  cart[index].quantity = parseInt(newQuantity);
  saveCart(cart);
  renderCart();
}

function removeItem(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  renderCart();
}

// Event listeners

function setupEventListeners() {
  cartItemsContainer.addEventListener("input", (e) => {
    if (e.target.type === "number") {
      updateQuantity(e.target.dataset.index, e.target.value);
    }
  });

  cartItemsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("fa-trash")) {
      removeItem(e.target.dataset.index);
    }
  });
}

