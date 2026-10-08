/*
  Lógica do carrinho — compartilhada por todas as páginas.
  Usa localStorage para o carrinho persistir entre páginas e visitas.
*/

const CART_KEY = "one_cart_v1";

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(productId, size, colorName) {
  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product) return;

  const color = product.colors.find((c) => c.name === colorName) || product.colors[0];

  const cart = getCart();
  const existing = cart.find(
    (item) => item.id === productId && item.size === (size || "") && item.color === color.name
  );

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.promoPrice || product.price,
      size: size || "",
      color: color.name,
      image: color.images[0],
      qty: 1,
    });
  }

  saveCart(cart);
  showCartToast(`${product.name} adicionado ao carrinho`);
}

function removeFromCart(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
}

function updateQty(index, qty) {
  const cart = getCart();
  if (!cart[index]) return;
  cart[index].qty = Math.max(1, qty);
  saveCart(cart);
}

function cartTotal() {
  return getCart().reduce((sum, item) => sum + item.price * item.qty, 0);
}

function cartCount() {
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}

// Preço com o desconto do Pix (STORE.pixDiscountPercent), em centavos inteiros
// — mesma conta do servidor (api/create-preference.js), pra os valores baterem.
function pixUnitPrice(price) {
  const pct = (typeof STORE !== "undefined" && Number(STORE.pixDiscountPercent)) || 0;
  return Math.round((Math.round(price * 100) * (100 - pct)) / 100) / 100;
}

function cartPixTotal() {
  return getCart().reduce((sum, item) => sum + Math.round(pixUnitPrice(item.price) * 100) * item.qty, 0) / 100;
}

// Linha "R$ X no Pix · 10% OFF" usada nos cards e na página da peça.
function pixPriceMarkup(price) {
  const pct = (typeof STORE !== "undefined" && Number(STORE.pixDiscountPercent)) || 0;
  if (!pct) return "";
  return `<span class="product-card__pix"><strong>${formatPrice(pixUnitPrice(price))}</strong> no Pix · ${pct}% OFF</span>`;
}

function formatPrice(value) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function updateCartBadge() {
  document.querySelectorAll("[data-cart-badge]").forEach((el) => {
    const count = cartCount();
    el.textContent = count;
    el.style.display = count > 0 ? "flex" : "none";
  });
}

function showCartToast(message) {
  let toast = document.querySelector(".cart-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "cart-toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("cart-toast--visible");
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.remove("cart-toast--visible");
  }, 2200);
}

document.addEventListener("DOMContentLoaded", updateCartBadge);
