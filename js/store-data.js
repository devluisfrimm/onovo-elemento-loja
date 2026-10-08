/*
  ================================================================
  DADOS DA LOJA — edite este arquivo para atualizar as informações
  que aparecem no site (rodapé, página "Fale Conosco", WhatsApp).
  ================================================================
*/

const STORE = {
  // Nome da loja (aparece no rodapé e em títulos)
  name: "Novo Elemento",

  // Frase curta que aparece no topo do site / logo de texto
  tagline: "Seu novo essencial",

  // Texto de apresentação da loja (página "Fale Conosco").
  // Cada item da lista vira um parágrafo — adicione ou remova itens à vontade.
  aboutParagraphs: [
    "Bem-vinda à Novo Elemento.",
    "Nascemos em 2026 com uma ideia simples: você merece um guarda-roupa que combine luxo, leveza e respeito ao seu tempo. Nossas peças foram pensadas para trazer paz ao seu dia a dia, sem abrir mão da elegância que você merece.",
    "Cada peça da nossa curadoria é escolhida com cuidado, para agregar valor real ao que você já tem, não pela quantidade, mas pela qualidade. Porque acreditamos que vestir-se bem é, antes de tudo, uma forma de se respeitar.",
    "Novo Elemento. Luxo com propósito, feito para você.",
  ],

  // Assinatura das criadoras da loja (aparece em fonte cursiva, logo abaixo do texto "Sobre a loja")
  credit: "Eduarda Silva & Shay Prado",

  // Número de WhatsApp COM código do país e DDD, somente números.
  // Exemplo: 55 (Brasil) + 51 (DDD) + número = 5551999999999
  whatsappNumber: "5551999241237",

  // Mensagem padrão que abre já preenchida no WhatsApp
  whatsappDefaultMessage: "Olá! Vim pelo site da Novo Elemento e gostaria de saber mais 😊",

  // Desconto (%) para pagamentos via Pix, em todo o site. Usado nos preços
  // "no Pix", no carrinho, no WhatsApp e no checkout do Mercado Pago (o
  // servidor lê este mesmo valor). A faixa do topo é texto fixo nos HTMLs
  // (classe "promo-bar"): se mudar o %, ajuste também a faixa.
  pixDiscountPercent: 10,

  // Redes sociais (deixe "" para ocultar o ícone no rodapé)
  social: {
    instagram: "https://instagram.com/onovo.elemento",
    facebook: "",
    tiktok: "",
  },

  // Contato / localização (opcional — deixe "" para ocultar no site)
  email: "",
  address: "",
  hours: "",
};
