/*
  Function serverless (roda só no servidor da Vercel — nunca no navegador).
  Recebe os itens do carrinho e devolve o link de pagamento do Mercado Pago.

  Dois modos:
  - padrão (cartão/boleto): itens com título, quantidade e preço cheio.
  - method "pix": o cliente manda só { id, quantity, color, size }; o preço é
    lido do catálogo (js/products-data.js) AQUI no servidor e recebe o
    desconto do Pix (STORE.pixDiscountPercent, js/store-data.js). O navegador
    nunca decide o valor com desconto, e o checkout fica restrito ao Pix.

  Requer a variável de ambiente MP_ACCESS_TOKEN configurada no projeto Vercel
  (Settings → Environment Variables). Nunca coloque o Access Token em nenhum
  arquivo .js servido ao navegador.
*/

const fs = require("fs");
const path = require("path");
const vm = require("vm");

// Tipos de pagamento do Mercado Pago. O Pix é "bank_transfer".
const NON_PIX_TYPES = ["credit_card", "debit_card", "ticket", "atm", "prepaid_card", "account_money"];

// Lê catálogo e dados da loja dos mesmos arquivos que o site usa (fonte única).
function loadCatalog() {
  const read = (file) => fs.readFileSync(path.join(process.cwd(), file), "utf8");
  const code = `${read("js/store-data.js")}\n;${read("js/products-data.js")}\n;({ STORE, PRODUCTS })`;
  return vm.runInNewContext(code, {}, { timeout: 1000 });
}

// Mesma conta do navegador (js/cart.js → pixUnitPrice), em centavos inteiros.
function pixCents(basePrice, percent) {
  return Math.round((Math.round(basePrice * 100) * (100 - percent)) / 100);
}

function buildPixItems(rawItems) {
  const { STORE, PRODUCTS } = loadCatalog();
  const percent = Number(STORE.pixDiscountPercent) || 0;
  if (!(percent > 0 && percent < 100)) throw new Error("Desconto Pix não configurado.");

  return rawItems.map((raw) => {
    const product = PRODUCTS.find((p) => p.id === String(raw.id));
    if (!product) throw Object.assign(new Error("Produto não encontrado no catálogo."), { status: 400 });

    const base = product.promoPrice && product.promoPrice < product.price ? product.promoPrice : product.price;
    const cents = pixCents(base, percent);
    const quantity = Math.min(20, Math.max(1, Math.floor(Number(raw.quantity)) || 1));

    // Cor e tamanho só entram no título se existirem de verdade na peça.
    const color = product.colors.find((c) => c.name === raw.color);
    const sizes = (color && color.sizes) || product.sizes || [];
    const details = [color ? color.name : "", sizes.includes(raw.size) ? `Tam. ${raw.size}` : ""]
      .filter(Boolean)
      .join(", ");

    return {
      title: `${product.name}${details ? ` (${details})` : ""} — Pix ${percent}% OFF`.slice(0, 256),
      quantity,
      unit_price: cents / 100,
      currency_id: "BRL",
    };
  });
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Método não permitido." });
    return;
  }

  const accessToken = process.env.MP_ACCESS_TOKEN;
  if (!accessToken) {
    res.status(500).json({ error: "Token do Mercado Pago não configurado no servidor." });
    return;
  }

  const { items, method } = req.body || {};
  if (!Array.isArray(items) || items.length === 0) {
    res.status(400).json({ error: "Carrinho vazio." });
    return;
  }

  const isPix = method === "pix";
  let mpItems;

  if (isPix) {
    try {
      mpItems = buildPixItems(items);
    } catch (err) {
      const status = err.status || 500;
      res.status(status).json({
        error:
          status === 400
            ? err.message
            : "Não foi possível calcular o desconto Pix agora. Tente pelo WhatsApp.",
      });
      return;
    }
  } else {
    mpItems = items.map((item) => ({
      title: String(item.title || "Produto").slice(0, 256),
      quantity: Math.max(1, Math.floor(Number(item.quantity)) || 1),
      unit_price: Number(item.unit_price),
      currency_id: "BRL",
    }));

    const hasInvalidItem = mpItems.some((item) => !item.title || !(item.unit_price > 0));
    if (hasInvalidItem) {
      res.status(400).json({ error: "Itens do carrinho inválidos." });
      return;
    }
  }

  const origin = `https://${req.headers.host}`;

  // Pix só existe com desconto: o checkout "Pix" mostra apenas Pix, e o checkout
  // de cartão/boleto esconde o Pix (senão alguém pagaria Pix pelo valor cheio).
  const paymentMethods = isPix
    ? { excluded_payment_types: NON_PIX_TYPES.map((id) => ({ id })), default_payment_method_id: "pix" }
    : { excluded_payment_types: [{ id: "bank_transfer" }] };

  try {
    const mpResponse = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        items: mpItems,
        payment_methods: paymentMethods,
        back_urls: {
          success: `${origin}/obrigado.html`,
          failure: `${origin}/carrinho.html?status=failure`,
          pending: `${origin}/carrinho.html?status=pending`,
        },
        auto_return: "approved",
      }),
    });

    const data = await mpResponse.json();

    if (!mpResponse.ok) {
      res.status(mpResponse.status).json({ error: data.message || "Erro ao criar preferência de pagamento." });
      return;
    }

    res.status(200).json({ init_point: data.init_point });
  } catch (err) {
    res.status(500).json({ error: "Falha ao conectar com o Mercado Pago." });
  }
};
