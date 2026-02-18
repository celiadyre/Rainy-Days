const API_URL = "https://v2.api.noroff.dev/rainy-days";
const productsGrid = document.getElementById("productsGrid");
const genderFilter = document.getElementById("genderFilter");
const colorFilter = document.getElementById("colorFilter");

let allProducts = [];

init();

// Functions / Duplicates

function init() {
  fetchProducts();
  setupEventListeners();
}

async function fetchProducts() {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const result = await response.json();

    allProducts = result.data;

    generateColorOptions(allProducts);
    renderProducts(allProducts);

  } catch (error) {
    console.error(error);
    renderError("Sorry, something went wrong loading products.");
  }
}

function formatPrice(price) {
  return `${price.toFixed(2)},-`;
}

function getDisplayPrice(product) {
  return product.onSale
    ? `
      <p>
        <span class="old-price">${formatPrice(product.price)}</span>
        ${formatPrice(product.discountedPrice)}
      </p>
    `
    : `<p>${formatPrice(product.price)}</p>`;
}

function getUniqueSortedValues(products, key) {
  return [...new Set(products.map(product => product[key]))].sort();
}

// Rendering

function renderProducts(products) {
  productsGrid.innerHTML = "";

  if (products.length === 0) {
    renderError("No products found.");
    return;
  }

  products.forEach(product => {
    const card = createProductCard(product);
    productsGrid.appendChild(card);
  });
}

function createProductCard(product) {
  const card = document.createElement("a");
  card.classList.add("product-card");
  card.href = `product-details.html?id=${product.id}`;

  card.innerHTML = `
    <img src="${product.image.url}" alt="${product.image.alt}">
    <button class="view-btn">VIEW PRODUCT</button>
    <h3>${product.title}</h3>
    ${getDisplayPrice(product)}
  `;

  return card;
}

function renderError(message) {
  productsGrid.innerHTML = `<p>${message}</p>`;
}

// Filtering products

function applyFilters() {
  const filtered = allProducts.filter(product => {
    return matchesGender(product) && matchesColor(product);
  });

  renderProducts(filtered);
}

function matchesGender(product) {
  return (
    genderFilter.value === "all" ||
    product.gender === genderFilter.value
  );
}

function matchesColor(product) {
  return (
    colorFilter.value === "all" ||
    product.baseColor === colorFilter.value
  );
}

function generateColorOptions(products) {
  const colors = getUniqueSortedValues(products, "baseColor");

  colors.forEach(color => {
    const option = document.createElement("option");
    option.value = color;
    option.textContent = color;
    colorFilter.appendChild(option);
  });
}

// Event listeners

function setupEventListeners() {
  genderFilter.addEventListener("change", applyFilters);
  colorFilter.addEventListener("change", applyFilters);
}

