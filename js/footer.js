/*
  Monta o rodapé (redes sociais + direitos reservados) e o botão
  flutuante de WhatsApp a partir de js/store-data.js — assim as
  informações ficam iguais em todas as páginas automaticamente.
*/

function socialIconsMarkup() {
  const icons = {
    instagram:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/></svg>',
    facebook:
      '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 21v-8h2.7l.4-3.1h-3.1V8c0-.9.25-1.5 1.55-1.5H16.7V3.6C16.4 3.55 15.4 3.5 14.25 3.5c-2.4 0-4.05 1.47-4.05 4.15V10H7.5v3.1h2.7V21h3.3z"/></svg>',
    tiktok:
      '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14.5 3h2.6a5.2 5.2 0 0 0 3.6 4v2.7a7.9 7.9 0 0 1-3.6-1v6.6a5.9 5.9 0 1 1-5.9-5.9c.3 0 .6 0 .9.06v2.7a3.2 3.2 0 1 0 2.4 3.1V3z"/></svg>',
  };

  return Object.entries(STORE.social)
    .filter(([, url]) => url)
    .map(
      ([key, url]) =>
        `<a href="${url}" target="_blank" rel="noopener" aria-label="${key}">${icons[key] || ""}</a>`
    )
    .join("");
}

function renderFooter() {
  const footer = document.getElementById("footer");
  if (!footer) return;

  footer.innerHTML = `
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <img src="assets/logo-badge.png" alt="${STORE.name}" class="footer-brand__mark">
          <div>
            <strong>${STORE.name}</strong>
            <p>${STORE.tagline}</p>
          </div>
        </div>
        <div>
          <p class="footer-heading">Navegue</p>
          <ul class="footer-links">
            <li><a href="index.html">Catálogo</a></li>
            <li><a href="sobre.html">Fale Conosco</a></li>
            <li><a href="carrinho.html">Carrinho</a></li>
          </ul>
        </div>
        <div>
          <p class="footer-heading">Redes Sociais</p>
          <div class="footer-social">${socialIconsMarkup()}</div>
        </div>
      </div>
      <div class="footer-bottom">
        &copy; <span data-year></span> ${STORE.name}. Todos os direitos reservados.
      </div>
    </div>
  `;

  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
}

function wireWhatsappFloat() {
  const btn = document.getElementById("whatsappFloat");
  if (!btn) return;
  const text = encodeURIComponent(STORE.whatsappDefaultMessage);
  btn.href = `https://wa.me/${STORE.whatsappNumber}?text=${text}`;
}

document.addEventListener("DOMContentLoaded", () => {
  renderFooter();
  wireWhatsappFloat();
});
