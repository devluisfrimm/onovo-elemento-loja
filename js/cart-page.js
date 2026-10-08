/*
  Renderiza a página do carrinho e monta o link de finalização via WhatsApp.
*/

function cartRowMarkup(item, index) {
  return `
    <div class="cart-row">
      <div class="cart-row__image">
        <img src="${item.image}" alt="${item.name}" loading="lazy"
          onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
        <div class="product-card__placeholder" style="display:none"><span>Foto</span></div>
      </div>
      <div class="cart-row__info">
        <h3>${item.name}</h3>
        ${item.color ? `<p class="cart-row__meta">Cor: ${item.color}</p>` : ""}
        ${item.size ? `<p class="cart-row__meta">Tamanho: ${item.size}</p>` : ""}
        <p class="cart-row__price">${formatPrice(item.price)}</p>
      </div>
      <div class="cart-row__qty">
        <button data-qty-minus="${index}" aria-label="Diminuir quantidade">−</button>
        <span>${item.qty}</span>
        <button data-qty-plus="${index}" aria-label="Aumentar quantidade">+</button>
      </div>
      <div class="cart-row__subtotal">${formatPrice(item.price * item.qty)}</div>
      <button class="cart-row__remove" data-remove="${index}" aria-label="Remover item">✕</button>
    </div>
  `;
}

function renderCartPage() {
  const container = document.querySelector("[data-cart-list]");
  const summary = document.querySelector("[data-cart-summary]");
  const emptyState = document.querySelector("[data-cart-empty]");
  if (!container) return;

  const cart = getCart();

  if (!cart.length) {
    container.innerHTML = "";
    if (summary) summary.style.display = "none";
    if (emptyState) emptyState.style.display = "block";
    return;
  }

  if (emptyState) emptyState.style.display = "none";
  if (summary) summary.style.display = "grid";

  container.innerHTML = cart.map(cartRowMarkup).join("");

  container.querySelectorAll("[data-qty-minus]").forEach((btn) =>
    btn.addEventListener("click", () => {
      const i = Number(btn.dataset.qtyMinus);
      const cart = getCart();
      updateQty(i, cart[i].qty - 1);
      renderCartPage();
    })
  );
  container.querySelectorAll("[data-qty-plus]").forEach((btn) =>
    btn.addEventListener("click", () => {
      const i = Number(btn.dataset.qtyPlus);
      const cart = getCart();
      updateQty(i, cart[i].qty + 1);
      renderCartPage();
    })
  );
  container.querySelectorAll("[data-remove]").forEach((btn) =>
    btn.addEventListener("click", () => {
      removeFromCart(Number(btn.dataset.remove));
      renderCartPage();
    })
  );

  const totalEl = document.querySelector("[data-cart-total]");
  if (totalEl) totalEl.textContent = formatPrice(cartTotal());

  const pct = Number(STORE.pixDiscountPercent) || 0;
  const pixBlock = document.querySelector(".cart-summary__pix");
  const pixBtn = document.querySelector("[data-checkout-pix]");
  if (pixBlock) pixBlock.style.display = pct ? "flex" : "none";
  if (pixBtn) {
    pixBtn.style.display = pct ? "" : "none";
    pixBtn.textContent = pct ? `Pagar com Pix — ${pct}% OFF` : "Pagar com Pix";
  }
  if (pct) {
    const label = document.querySelector("[data-pix-label]");
    if (label) label.textContent = `No Pix · ${pct}% OFF`;
    const pixTotalEl = document.querySelector("[data-cart-pix-total]");
    if (pixTotalEl) pixTotalEl.textContent = formatPrice(cartPixTotal());
    const saveEl = document.querySelector("[data-pix-save]");
    if (saveEl) saveEl.textContent = `Você economiza ${formatPrice(cartTotal() - cartPixTotal())}`;
  }

  const checkoutBtn = document.querySelector("[data-checkout-whatsapp]");
  if (checkoutBtn) {
    checkoutBtn.href = buildWhatsappOrderLink();
  }
}

async function payWithMercadoPago() {
  const cart = getCart();
  if (!cart.length) return;

  const mpBtn = document.querySelector("[data-checkout-mercadopago]");
  const errorEl = document.querySelector("[data-mp-error]");
  if (errorEl) errorEl.textContent = "";

  const originalLabel = mpBtn ? mpBtn.textContent : "";
  if (mpBtn) {
    mpBtn.textContent = "Preparando pagamento…";
    mpBtn.setAttribute("aria-busy", "true");
  }

  try {
    const items = cart.map((item) => ({
      title: item.size ? `${item.name} (Tam. ${item.size})` : item.name,
      quantity: item.qty,
      unit_price: item.price,
    }));

    const response = await fetch("/api/create-preference", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });

    const data = await response.json();

    if (!response.ok || !data.init_point) {
      throw new Error(data.error || "Não foi possível iniciar o pagamento.");
    }

    window.location.href = data.init_point;
  } catch (err) {
    if (errorEl) errorEl.textContent = err.message || "Erro ao conectar com o Mercado Pago. Tente novamente.";
    if (mpBtn) {
      mpBtn.textContent = originalLabel;
      mpBtn.removeAttribute("aria-busy");
    }
  }
}

// Pix com desconto: manda só id/quantidade/cor/tamanho. O servidor lê o preço
// no catálogo e aplica o desconto — o navegador não decide o valor.
async function payWithPix() {
  const cart = getCart();
  if (!cart.length) return;

  const btn = document.querySelector("[data-checkout-pix]");
  const errorEl = document.querySelector("[data-pix-error]");
  if (errorEl) errorEl.textContent = "";

  const originalLabel = btn ? btn.textContent : "";
  if (btn) {
    btn.textContent = "Preparando pagamento…";
    btn.setAttribute("aria-busy", "true");
  }

  try {
    const items = cart.map((item) => ({
      id: item.id,
      quantity: item.qty,
      color: item.color,
      size: item.size,
    }));

    const response = await fetch("/api/create-preference", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ method: "pix", items }),
    });

    const data = await response.json();

    if (!response.ok || !data.init_point) {
      throw new Error(data.error || "Não foi possível iniciar o pagamento no Pix.");
    }

    window.location.href = data.init_point;
  } catch (err) {
    if (errorEl) errorEl.textContent = err.message || "Erro ao conectar com o Mercado Pago. Tente novamente.";
    if (btn) {
      btn.textContent = originalLabel;
      btn.removeAttribute("aria-busy");
    }
  }
}

function showCartStatusFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const status = params.get("status");
  const banner = document.querySelector("[data-cart-status]");
  if (!banner || !status) return;

  const messages = {
    failure: "O pagamento não foi concluído. Você pode tentar novamente quando quiser.",
    pending: "Seu pagamento está pendente de confirmação. Assim que for aprovado, entraremos em contato.",
  };

  if (messages[status]) {
    banner.textContent = messages[status];
    banner.style.display = "block";
  }
}

function buildWhatsappOrderLink() {
  const cart = getCart();
  let text = `Olá! Gostaria de finalizar meu pedido na ${STORE.name}:\n\n`;
  cart.forEach((item) => {
    const details = [item.color, item.size ? `Tam. ${item.size}` : ""].filter(Boolean).join(", ");
    text += `• ${item.qty}x ${item.name}${details ? " (" + details + ")" : ""} — ${formatPrice(item.price * item.qty)}\n`;
  });
  text += `\nTotal: ${formatPrice(cartTotal())}`;
  const pct = Number(STORE.pixDiscountPercent) || 0;
  if (pct) text += `\nTotal no Pix (${pct}% OFF): ${formatPrice(cartPixTotal())}`;
  return `https://wa.me/${STORE.whatsappNumber}?text=${encodeURIComponent(text)}`;
}

document.addEventListener("DOMContentLoaded", () => {
  renderCartPage();
  showCartStatusFromUrl();

  const mpBtn = document.querySelector("[data-checkout-mercadopago]");
  if (mpBtn) {
    mpBtn.addEventListener("click", payWithMercadoPago);
  }

  const pixPayBtn = document.querySelector("[data-checkout-pix]");
  if (pixPayBtn) {
    pixPayBtn.addEventListener("click", payWithPix);
  }
});
