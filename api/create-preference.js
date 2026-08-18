/*
  Function serverless (roda só no servidor da Vercel — nunca no navegador).
  Recebe os itens do carrinho e devolve o link de pagamento do Mercado Pago.

  Requer a variável de ambiente MP_ACCESS_TOKEN configurada no projeto Vercel
  (Settings → Environment Variables). Nunca coloque o Access Token em nenhum
  arquivo .js servido ao navegador.
*/

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

  const { items } = req.body || {};
  if (!Array.isArray(items) || items.length === 0) {
    res.status(400).json({ error: "Carrinho vazio." });
    return;
  }

  const mpItems = items.map((item) => ({
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

  const origin = `https://${req.headers.host}`;

  try {
    const mpResponse = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        items: mpItems,
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
}
