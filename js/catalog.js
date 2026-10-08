/*
  Renderiza a vitrine de produtos (destaques + catálogo completo) na
  página inicial a partir de js/products-data.js e cuida do filtro por
  categoria. Cada card mostra só a foto de capa — ao clicar, abre a
  página da peça (produto.html) com galeria, cores e carrinho.
*/

function productImageMarkup(product) {
  return `
    <div class="product-card__image">
      <img src="${getProductCoverImage(product)}" alt="${product.name}" loading="lazy"
        onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
      <div class="product-card__placeholder" style="display:none">
        <span>Foto do produto</span>
      </div>
    </div>
  `;
}

function productCardMarkup(product) {
  const hasPromo = product.promoPrice && product.promoPrice < product.price;
  const priceMarkup = hasPromo
    ? `<span class="product-card__price product-card__price--old">${formatPrice(product.price)}</span>
       <span class="product-card__price product-card__price--now">${formatPrice(product.promoPrice)}</span>`
    : `<span class="product-card__price product-card__price--now">${formatPrice(product.price)}</span>`;

  return `
    <a class="product-card" href="produto.html?id=${encodeURIComponent(product.id)}" data-category="${product.category}">
      ${productImageMarkup(product)}
      <div class="product-card__body">
        <p class="product-card__category">${product.category}</p>
        <h3 class="product-card__name">${product.name}</h3>
        <p class="product-card__desc" data-desc>${product.description}</p>
        <button type="button" class="product-card__more" data-toggle-desc>
          Ler mais <span class="product-card__more-arrow">⌄</span>
        </button>
        <div class="product-card__prices">${priceMarkup}</div>
        <span class="product-card__cta">Ver peça</span>
      </div>
    </a>
  `;
}

// Trunca a descrição de cada card em 2 linhas e só mostra o botão
// "Ler mais" quando o texto realmente não coube — clicar nele expande
// o texto sem abrir a página da peça (o card inteiro é um link).
function setupDescToggles(grid) {
  grid.querySelectorAll("[data-desc]").forEach((desc) => {
    const btn = desc.nextElementSibling;
    if (!btn || !btn.hasAttribute("data-toggle-desc")) return;

    if (desc.scrollHeight <= desc.clientHeight + 1) {
      btn.style.display = "none";
      return;
    }

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const expanded = desc.classList.toggle("product-card__desc--expanded");
      btn.classList.toggle("product-card__more--active", expanded);
      btn.firstChild.textContent = expanded ? "Ler menos " : "Ler mais ";
    });
  });
}

// Cada página de catálogo declara sua seção em <html data-gender="masc">;
// sem o atributo é a seção feminina (index.html).
function pageProducts() {
  return getProductsByGender(document.documentElement.dataset.gender === "masc" ? "masc" : "fem");
}

function renderCatalog() {
  const grid = document.querySelector("[data-product-grid]");
  const filters = document.querySelector("[data-category-filters]");
  if (!grid) return;

  const products = pageProducts();
  const categories = ["Todos", ...new Set(products.map((p) => p.category))];

  if (filters) {
    filters.innerHTML = categories
      .map(
        (cat, i) =>
          `<button class="filter-pill ${i === 0 ? "filter-pill--active" : ""}" data-filter="${cat}">${cat}</button>`
      )
      .join("");
  }

  function paint(filter) {
    const items = filter && filter !== "Todos" ? products.filter((p) => p.category === filter) : products;
    grid.innerHTML = items.map(productCardMarkup).join("") || `<p class="empty-state">Nenhum produto nesta categoria ainda.</p>`;
    setupDescToggles(grid);
  }

  if (filters) {
    filters.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-filter]");
      if (!btn) return;
      filters.querySelectorAll(".filter-pill").forEach((p) => p.classList.remove("filter-pill--active"));
      btn.classList.add("filter-pill--active");
      paint(btn.dataset.filter);
    });
  }

  paint("Todos");
}

function renderFeatured() {
  const grid = document.querySelector("[data-featured-grid]");
  if (!grid) return;
  const items = pageProducts().filter((p) => p.featured);
  grid.innerHTML = items.map(productCardMarkup).join("");
  setupDescToggles(grid);
}

// Script no fim do <body>: as grades acima já existem. Renderiza já, antes
// da primeira pintura, em vez de esperar o DOMContentLoaded.
renderFeatured();
renderCatalog();
