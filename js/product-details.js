const API_BASE = "https://v2.api.noroff.dev/rainy-days";
const productImage = document.getElementById("productImage");
const productTitle = document.getElementById("productTitle");
const productPrice = document.getElementById("productPrice");
const productDescription = document.getElementById("productDescription");
const productSizes = document.getElementById("productSizes");
const addToCartBtn = document.getElementById("addToCartBtn");
const quantityInput = document.querySelector(".quantity input");


let currentProduct = null;
let selectedSize = null;

init();

// Functions / Duplicates
function init() {
  const productId = getProductIdFromURL();

  if (!productId) {
    renderError("Product not found.");
    return;
  }

  fetchProduct(productId);
  setupEventListeners();
}


function getProductIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

async function fetchProduct(id) {
  try {
    const response = await fetch(`${API_BASE}/${id}`);
    const result = await response.json();

    currentProduct = result.data;

    renderProduct(currentProduct);

  } catch (error) {
    console.error(error);
    renderError("Failed to load product.");
  }
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

function getProductPrice(product) {
  return product.onSale ? product.discountedPrice : product.price;
}

// Rendering

function renderProduct(product) {
  renderImage(product.image);
  renderTitle(product.title);
  renderPrice(product);
  renderDescription(product.description);
  renderSizes(product.sizes);
}

function renderImage(image) {
  productImage.src = image.url;
  productImage.alt = image.alt;
}

function renderTitle(title) {
  productTitle.textContent = title;
}

function renderPrice(product) {
  if (product.onSale) {
    productPrice.innerHTML = `
      <span class="old-price">${formatPrice(product.price)}</span>
      ${formatPrice(product.discountedPrice)}
    `;
  } else {
    productPrice.textContent = formatPrice(product.price);
  }
}

function renderDescription(description) {
  productDescription.textContent = description;
}

function renderSizes(sizes) {
  productSizes.innerHTML = "";

  sizes.forEach(size => {
    const sizeElement = createSizeElement(size);
    productSizes.appendChild(sizeElement);
  });
}

function createSizeElement(size) {
  const span = document.createElement("span");
  span.textContent = size;

  span.addEventListener("click", () => selectSize(span, size));

  return span;
}

function selectSize(element, size) {
  document
    .querySelectorAll("#productSizes span")
    .forEach(s => s.classList.remove("active"));

  element.classList.add("active");
  selectedSize = size;
}

function renderError(message) {
  productTitle.textContent = message;
}

// Cart

function addToCart() {
  if (!selectedSize) {
    alert("Please select a size.");
    return;
  }

  const quantity = parseInt(quantityInput.value);
  const cart = getCart();

  const cartItem = createCartItem(quantity);

  mergeCartItem(cart, cartItem);

  saveCart(cart);

  alert("Product added to cart!");
}

function createCartItem(quantity) {
  return {
    id: currentProduct.id,
    title: currentProduct.title,
    price: getProductPrice(currentProduct),
    image: currentProduct.image.url,
    size: selectedSize,
    quantity: quantity
  };
}

function mergeCartItem(cart, newItem) {
  const existingItem = cart.find(item =>
    item.id === newItem.id && item.size === newItem.size
  );

  if (existingItem) {
    existingItem.quantity += newItem.quantity;
  } else {
    cart.push(newItem);
  }
}

// Event listeners

function setupEventListeners() {
  addToCartBtn.addEventListener("click", addToCart);
}

