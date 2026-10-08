/*
  Lógica da página individual de cada peça (produto.html?id=...).
  Galeria de fotos, seletor de cor (com troca suave da imagem),
  seletor de tamanho, adicionar ao carrinho e botão de WhatsApp
  "Consulte disponibilidade".
*/

let currentProduct = null;
let currentColor = null;
let currentSize = null;

function getProductIdFromUrl() {
  return new URLSearchParams(window.location.search).get("id");
}

function crossfadeMainImage(src) {
  const img = document.getElementById("mainImage");
  const placeholder = document.getElementById("mainImagePlaceholder");
  if (!img) return;

  // Arrasto lateral: a foto atual desliza pra fora à esquerda, a nova entra
  // deslizando da direita — como um "swipe" de carrossel.
  img.classList.remove("is-entering");
  img.classList.add("is-exiting");

  window.setTimeout(() => {
    placeholder.style.display = "none";
    img.style.display = "block";
    img.src = src;
    img.classList.remove("is-exiting");
    img.classList.add("is-entering");

    // Força o navegador a aplicar a posição inicial (fora à direita) antes
    // de tirar a classe — sem isso o navegador otimiza e pula a animação.
    // Usamos setTimeout (em vez de requestAnimationFrame) porque rAF pode
    // nunca disparar em abas fora de foco/sem compositor ativo.
    void img.offsetWidth;
    window.setTimeout(() => {
      img.classList.remove("is-entering");
    }, 20);
  }, 260);
}

function renderGallery() {
  const track = document.getElementById("thumbs");
  const images = currentColor.images;

  crossfadeMainImage(images[0]);

  track.innerHTML = images
    .map(
      (src, i) => `
        <button class="product-thumb ${i === 0 ? "product-thumb--active" : ""}" data-thumb="${i}" aria-label="Foto ${i + 1}">
          <img src="${src}" alt="" loading="lazy" onerror="this.style.display='none'">
        </button>
      `
    )
    .join("");

  track.querySelectorAll("[data-thumb]").forEach((btn) => {
    btn.addEventListener("click", () => {
      track.querySelectorAll(".product-thumb").forEach((t) => t.classList.remove("product-thumb--active"));
      btn.classList.add("product-thumb--active");
      crossfadeMainImage(images[Number(btn.dataset.thumb)]);
    });
  });
}

function updateProductCode() {
  const el = document.getElementById("pCode");
  if (!el) return;
  if (currentColor.code) {
    el.textContent = `Cód. ${currentColor.code}`;
    el.style.display = "block";
  } else {
    el.style.display = "none";
  }
}

function renderNotes() {
  const list = document.getElementById("pNotes");
  if (!list) return;

  if (!currentProduct.notes || !currentProduct.notes.length) {
    list.style.display = "none";
    return;
  }

  list.style.display = "grid";
  list.innerHTML = currentProduct.notes.map((note) => `<li>${note}</li>`).join("");
}

function updateStockWarning() {
  const el = document.getElementById("pStock");
  if (!el) return;

  const stock = currentColor.stock;
  if (typeof stock === "number" && stock <= 5) {
    el.textContent = stock === 1 ? "Apenas 1 peça!" : `Apenas ${stock} peças!`;
    el.style.display = "block";
  } else {
    el.style.display = "none";
  }
}

function renderColorSwatches() {
  const block = document.getElementById("colorBlock");
  const swatches = document.getElementById("colorSwatches");
  const nameEl = document.getElementById("selectedColorName");

  if (currentProduct.colors.length <= 1) {
    block.style.display = "none";
    return;
  }

  block.style.display = "block";
  nameEl.textContent = currentColor.name;

  swatches.innerHTML = currentProduct.colors
    .map(
      (color) => `
        <button
          class="color-swatch ${color.name === currentColor.name ? "color-swatch--active" : ""}"
          data-color="${color.name}"
          style="background:${color.hex || "#ccc"}"
          aria-label="Cor ${color.name}"
          title="${color.name}"
        ></button>
      `
    )
    .join("");

  swatches.querySelectorAll("[data-color]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.dataset.color === currentColor.name) return;
      currentColor = currentProduct.colors.find((c) => c.name === btn.dataset.color);
      swatches.querySelectorAll(".color-swatch").forEach((s) => s.classList.remove("color-swatch--active"));
      btn.classList.add("color-swatch--active");
      nameEl.textContent = currentColor.name;
      renderGallery();
      renderSizes();
      updateProductCode();
      updateStockWarning();
      updateWhatsappLink();
    });
  });
}

function getAvailableSizes() {
  // Uma cor pode ter tamanhos próprios (ex: só vem em M nessa cor) —
  // quando presente, isso sobrescreve o `sizes` geral do produto.
  return (currentColor && currentColor.sizes) || currentProduct.sizes;
}

function renderSizes() {
  const block = document.getElementById("sizeBlock");
  const options = document.getElementById("sizeOptions");
  const sizes = getAvailableSizes();

  if (!sizes || !sizes.length) {
    block.style.display = "none";
    return;
  }

  block.style.display = "block";
  // Ao trocar de cor, mantém o tamanho já escolhido se ele existir na cor nova.
  if (!sizes.includes(currentSize)) currentSize = sizes[0];

  options.innerHTML = sizes
    .map(
      (size) => `
        <button class="size-pill ${size === currentSize ? "size-pill--active" : ""}" data-size="${size}">${size}</button>
      `
    )
    .join("");

  options.querySelectorAll("[data-size]").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentSize = btn.dataset.size;
      options.querySelectorAll(".size-pill").forEach((s) => s.classList.remove("size-pill--active"));
      btn.classList.add("size-pill--active");
      updateWhatsappLink();
    });
  });
}

function updateWhatsappLink() {
  const btn = document.getElementById("whatsappAvailabilityBtn");
  if (!btn) return;

  const details = [currentColor ? `Cor: ${currentColor.name}` : "", currentSize ? `Tamanho: ${currentSize}` : ""]
    .filter(Boolean)
    .join(", ");

  const text = `Olá! Gostaria de consultar a disponibilidade da peça: ${currentProduct.name}${details ? " (" + details + ")" : ""}`;
  btn.href = `https://wa.me/${STORE.whatsappNumber}?text=${encodeURIComponent(text)}`;
}

function renderProduct() {
  const id = getProductIdFromUrl();
  currentProduct = id ? getProductById(id) : null;

  if (!currentProduct) {
    document.getElementById("productDetail").style.display = "none";
    document.getElementById("notFound").style.display = "block";
    return;
  }

  currentColor = currentProduct.colors[0];

  // O tema e os links de "catálogo" seguem a seção da peça (feminino/masculino).
  if (window.NE_GENDER) window.NE_GENDER.apply(getProductGender(currentProduct));

  document.title = `${currentProduct.name} — ${STORE.name}`;
  document.getElementById("pCategory").textContent = currentProduct.category;
  document.getElementById("pName").textContent = currentProduct.name;
  document.getElementById("pDesc").textContent = currentProduct.description;

  const hasPromo = currentProduct.promoPrice && currentProduct.promoPrice < currentProduct.price;
  document.getElementById("pPrices").innerHTML = hasPromo
    ? `<span class="product-card__price product-card__price--old">${formatPrice(currentProduct.price)}</span>
       <span class="product-card__price product-card__price--now">${formatPrice(currentProduct.promoPrice)}</span>`
    : `<span class="product-card__price product-card__price--now">${formatPrice(currentProduct.price)}</span>`;

  renderGallery();
  renderColorSwatches();
  renderSizes();
  renderNotes();
  updateProductCode();
  updateStockWarning();
  updateWhatsappLink();

  document.getElementById("addToCartBtn").addEventListener("click", () => {
    addToCart(currentProduct.id, currentSize, currentColor.name);
  });
}

document.addEventListener("DOMContentLoaded", renderProduct);
