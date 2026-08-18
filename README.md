# Novo Elemento — Site da Loja

Site pronto em HTML/CSS/JavaScript puro — não precisa instalar nada, basta abrir os arquivos `.html` no navegador ou publicar a pasta em qualquer serviço de hospedagem.

## Como abrir

Dê duplo clique em `index.html` (ou clique com o botão direito → Abrir com → seu navegador).

## O que editar

### 1. Informações da loja
Arquivo: `js/store-data.js`
- Nome, frase de efeito, texto "Sobre a loja"
- **Número de WhatsApp** (campo `whatsappNumber`) — troque pelo número real antes de publicar
- Instagram, Facebook, TikTok (deixe `""` para ocultar o ícone)
- E-mail, endereço e horário de funcionamento (opcionais)

### 2. Produtos
Arquivo: `js/products-data.js`
- Copie um bloco de produto inteiro para adicionar um novo item
- Preencha nome, categoria, preço, tamanhos e descrição
- Marque `featured: true` para o produto aparecer na seção de destaques da home
- Cada produto tem uma lista `colors` — mesmo quando só vem numa cor, precisa de pelo menos 1 item nessa lista. Se tiver mais de uma cor, o botão "Selecionar cor" aparece sozinho na página da peça.
- Cada cor pode ter um `code` (o "Cód." que a cliente usa) — aparece na página da peça e troca junto quando o cliente muda de cor.
- Campo `notes` (opcional, lista de textos) vira uma caixa de observações na página da peça — bom pra "veste do X ao Y", avisos de material etc.
- Campo `stock` em cada cor (número de peças em loja) — se for 5 ou menos, mostra um aviso em vermelho "Apenas N peça(s)!" na página da peça. Deixe sem o campo pra não mostrar aviso nenhum.

### 3. Fotos dos produtos
Pasta: `assets/produtos/`
- Salve as fotos aqui (formato `.jpg` ou `.png`)
- Cada cor de cada produto tem sua própria lista `images` (pode ter várias fotos — elas viram a galeria da página do produto). A primeira foto da primeira cor é a que aparece na vitrine do catálogo.
- Enquanto não houver foto, o site mostra automaticamente um espaço reservado — nada quebra

### ✅ Catálogo com dados reais
As 15 peças no site têm fotos, preço e descrição reais da cliente — a lista completa com preço/código/estoque de cada uma está em `js/products-data.js` (é mais fácil de manter atualizada lá do que duplicar aqui). Só a **Calça Legging Fuso Prada** ainda está incompleta: a cor Marrom não tem fotos (só a Preta) — pendente do lado da cliente.

Peças mais recentes (2026-08-17): **Vestido Lili** (R$387,90, cód. 1979), **Vestido Ravena** (R$387,90, cód. 1980), **Vestido Vintage** (R$387,90, cód. 1981) e **Vestido Serena** (R$299,00, cód. 1984) — as 3 primeiras fazem parte da mesma "cápsula" noturna (peça única cada, veja a descrição de cada uma). Novas peças, trocas de preço ou de estoque: editar direto em `js/products-data.js`.

**Novidade:** cada cor agora pode ter seu próprio `sizes` (tamanhos disponíveis) — usado na Calça Legging Fuso Prada, onde a cor Preta vem em P/M/G mas a Marrom só em M. Antes disso, todas as cores de uma peça compartilhavam os mesmos tamanhos.

### Como funciona a vitrine e a página de cada peça
- **Catálogo (`index.html`)** mostra só a foto de capa de cada peça. Clicar em qualquer peça abre `produto.html?id=...`.
- **Página do produto (`produto.html`)** mostra a galeria completa (com miniaturas clicáveis), seletor de cor (quando há mais de uma, com troca suave da foto), seletor de tamanho, botão "Adicionar ao carrinho" e botão "Consulte disponibilidade" que abre o WhatsApp já com o nome da peça, cor e tamanho escolhidos na mensagem.

### 4. Logo da loja
Já aplicado a partir dos arquivos que você enviou (`logos_novo_elemento_separadas.zip`). Cada versão foi tratada (fundo removido/recortado) e distribuída assim:

| Arquivo | Onde é usado |
|---|---|
| `assets/logo.png` | Logo da navbar (topo do site, todas as páginas) |
| `assets/logo-badge.png` | Monograma pequeno ao lado do nome da loja, no rodapé |
| `assets/logo-seal.png` | Selo circular na página "Fale Conosco" |
| `assets/favicon.png` | Ícone da aba do navegador |
| `assets/logo-mark.png` | Monograma extra (sem uso fixo ainda — disponível para stickers, embalagens, etc.) |

Os arquivos originais enviados ficam guardados em `assets/logo-source/`, caso precise gerar outra versão (ex: para embalagens, redes sociais). Para trocar qualquer logo do site, basta substituir o arquivo correspondente na tabela acima mantendo o mesmo nome.

## Estrutura das páginas

- `index.html` — vitrine (destaques + catálogo completo com filtro por categoria)
- `produto.html` — página individual da peça (galeria, cor, tamanho, carrinho, WhatsApp)
- `sobre.html` — "Fale Conosco", com botão de WhatsApp e informações da loja
- `carrinho.html` — carrinho de compras, com finalização de pedido via WhatsApp

## Carrinho e checkout

O carrinho é salvo no navegador do visitante (não precisa de banco de dados). Duas formas de finalizar:

- **WhatsApp** — monta uma mensagem automática com os itens, quantidades e valor total, e abre o WhatsApp da loja.
- **Mercado Pago** (`api/create-preference.js`) — gera um link de pagamento (Checkout Pro) com cartão, Pix e boleto. **Ativo e testado** (ver seção abaixo) — o botão já processa pagamentos reais.

## Publicando o site

Qualquer serviço de hospedagem de arquivos estáticos funciona (ex: Hostinger, Vercel, Netlify, GitHub Pages). Basta enviar todos os arquivos e pastas mantendo a mesma estrutura.

**Site no ar no domínio definitivo:** https://onovoelemento.com.br (migração concluída em 2026-08-18 — domínio `.com.br` registrado e apontado na Vercel). O link antigo (https://onovo-elemento-loja.vercel.app) continua funcionando também, aponta pro mesmo projeto/deploy.

## Pagamento (Mercado Pago) — ativo em produção

Checkout via **Mercado Pago** (Checkout Pro), com o botão "Finalizar pedido no WhatsApp" mantido como alternativa.

- `api/create-preference.js` — function serverless (roda na Vercel) que recebe os itens do carrinho e cria a preferência de pagamento no Mercado Pago, devolvendo o link do checkout.
- `js/cart-page.js` (`payWithMercadoPago`) — no carrinho, monta os itens e chama a function acima; redireciona o cliente para o pagamento.
- `obrigado.html` — página de confirmação para onde o cliente volta após pagar; limpa o carrinho automaticamente.
- `carrinho.html?status=failure|pending` — mensagens de status quando o pagamento falha ou fica pendente.

**Status (desde 2026-08-17): `MP_ACCESS_TOKEN` de produção configurado** como variável de ambiente sensível no projeto Vercel (Settings → Environment Variables — nunca em arquivo do site) e testado: a function cria preferências reais e devolve um link de checkout válido do Mercado Pago.

⚠️ **O site já processa pagamentos reais** em ambos os domínios (`onovoelemento.com.br` e `onovo-elemento-loja.vercel.app`, que apontam pro mesmo projeto/deploy na Vercel).

⚠️ O Access Token é secreto — nunca deve ir para `js/store-data.js` ou qualquer outro arquivo servido ao navegador, só para a configuração de ambiente do servidor.
