/*
  ================================================================
  CATÁLOGO DE PRODUTOS — edite este arquivo para adicionar, remover
  ou alterar produtos da loja.

  Copie um bloco { ... } inteiro para criar um produto novo e ajuste
  os campos abaixo:

    id          -> texto único, sem espaços (ex: "vestido-liso-01")
    name        -> nome do produto
    category    -> categoria (ex: "Vestidos", "Blusas", "Acessórios")
    price       -> preço normal, use ponto para centavos (ex: 129.90)
    promoPrice  -> preço com desconto (use null se não houver promoção)
    sizes       -> lista de tamanhos disponíveis (ou [] se não se aplica).
                   Usado quando todas as cores têm os mesmos tamanhos. Se
                   uma cor específica tiver tamanhos diferentes (ex: uma
                   cor só tem M e outra tem P/M/G), defina `sizes` dentro
                   daquela cor (veja `colors` abaixo) — a cor sobrescreve
                   este valor do produto quando presente.
    description -> descrição curta do produto (aparece na página da peça)
    gender      -> (opcional) "masc" para aparecer na seção masculina
                   (masculino.html). Sem este campo a peça é feminina.
    featured    -> true para destacar o produto na página inicial
    coverImage  -> (opcional) foto usada na vitrine do catálogo (grade da
                   home). Se não definir, usa automaticamente a 1ª foto da
                   1ª cor. Use quando quiser uma foto diferente na vitrine
                   (ex: uma foto com todas as cores juntas) sem misturar
                   ela na galeria de nenhuma cor específica.
    notes       -> (opcional) lista de observações rápidas, tipo os bullets
                   com emoji que a cliente manda (tamanho/veste como,
                   material, modelagem etc.). Aparecem em lista na página
                   do produto, abaixo da descrição.

    colors      -> lista de cores disponíveis da peça. Toda peça tem pelo
                   menos 1 cor, mesmo que só venha numa cor só.
                   Se tiver mais de uma cor, o botão "Selecionar cor"
                   aparece automaticamente na página do produto.

                     name   -> nome da cor (ex: "Areia", "Preto")
                     hex    -> cor aproximada em hexadecimal, usada na
                               bolinha de seleção (ex: "#d8c6a8").
                               Se não souber, deixe uma cor aproximada.
                     code   -> (opcional) código/referência interna da
                               cliente pra essa cor específica (ex: "1959").
                               Aparece como "Cód." na página do produto.
                     sizes  -> (opcional) só use se essa cor tiver tamanhos
                               diferentes das outras cores da mesma peça.
                               Quando presente, troca o `sizes` do produto
                               só pra essa cor.
                     stock  -> (opcional) quantas peças dessa cor tem em loja.
                               Se for um número baixo (5 ou menos), mostra um
                               aviso em vermelho "Apenas N peça(s)!" na página
                               do produto. Deixe null/sem o campo se não quiser
                               mostrar aviso nenhum (estoque não é um problema).
                     images -> lista de fotos dessa cor. A primeira foto
                               da primeira cor é a que aparece na vitrine
                               (grade de produtos). As demais aparecem
                               na galeria da página do produto.
                               Coloque os arquivos em "assets/produtos/"
                               e aponte o caminho aqui. Enquanto não
                               houver foto, o site mostra automaticamente
                               um espaço reservado — nada quebra.
  ================================================================
*/

// As peças abaixo já têm preço, tamanho e descrição reais enviados pela
// cliente. Códigos: Short Fany 1959, Vestido Felice (Marrom) 1960, Blusa
// Tule Assimétrica 1961, Body Tule Corset 1962, Calça Legging Fuso Prada
// 1963, Vestido Bianco 1964, Conjunto Geórgia 1966, Conjunto Essence 1967,
// Conjunto Marília 1968, Body Roma 1969, Vestido Lili 1979, Vestido Ravena
// 1980, Vestido Vintage 1981, Vestido Serena 1984, Blusa Éloise 1987, Blusa
// Amélie 1988, Blusa Celeste 1989, Blusa Margot 1990, Blusa Bella 1991.
// Conjunto Cetim Duo ainda não tem código informado pela cliente.
const PRODUCTS = [
  {
    id: "blusa-eloise-1987",
    name: "Blusa Éloise",
    category: "Blusas",
    // Capa com a foto da modelo (pedido da cliente) — atenção: essa foto é
    // da cor Branco, não da Creme (única cor vendida). Cliente confirmou
    // que quer usar assim mesmo; a galeria do produto usa a foto da arara
    // com a cor Creme correta.
    coverImage: "assets/produtos/blusa-eloise-1987-capa.jpg",
    price: 217.9,
    promoPrice: null,
    sizes: ["P", "M"],
    description:
      "Elegante, moderna e cheia de personalidade. A Blusa Éloise é confeccionada em poliamida, com modelagem ajustada ao corpo e gola alta. O destaque fica por conta da abertura lateral assimétrica, que cria um efeito alongado e traz movimento à peça. No tom creme, é uma peça sofisticada e versátil, perfeita para combinar com jeans, alfaiataria ou peças mais estruturadas — daquelas que transformam uma produção básica em um look marcante.",
    notes: [
      "Tecido: poliamida",
      "Modelagem ajustada ao corpo",
      "Detalhes: gola alta e abertura lateral alongada",
    ],
    featured: true,
    colors: [
      {
        name: "Creme",
        hex: "#e8ddc4",
        code: "1987",
        images: ["assets/produtos/blusa-eloise-1987-creme-1.jpg"],
      },
    ],
  },
  {
    id: "blusa-amelie-1988",
    name: "Blusa Amélie",
    category: "Blusas",
    price: 147.9,
    promoPrice: null,
    sizes: [],
    // Capa própria com a foto da arara (as 4 cores penduradas) — os
    // recortes individuais por cor ficavam com um zoom exagerado (mesmo
    // problema da Blusa Margot/Éloise, ver nota em getProductCoverImage).
    coverImage: "assets/produtos/blusa-amelie-1988-capa.jpg",
    description:
      "Sofisticada e delicada na medida certa. A Blusa Amélie possui modelagem alongada e assimétrica, confeccionada em tecido acetinado com caimento leve e fluido. O acabamento em renda na barra traz transparência e um toque romântico à peça, deixando o look ainda mais elegante. Uma peça versátil que fica incrível tanto com jeans quanto com alfaiataria, podendo ser usada em produções mais casuais ou sofisticadas.",
    notes: [
      "Modelagem alongada e assimétrica",
      "Barra com acabamento em renda",
    ],
    featured: true,
    colors: [
      {
        name: "Preto",
        hex: "#161616",
        code: "1988",
        sizes: ["G"],
        images: ["assets/produtos/blusa-amelie-1988-capa.jpg"],
      },
      {
        name: "Branco",
        hex: "#f5f3ee",
        code: "1988",
        sizes: ["P"],
        images: ["assets/produtos/blusa-amelie-1988-capa.jpg"],
      },
      {
        name: "Marrom",
        hex: "#5a3a2a",
        code: "1988",
        sizes: ["M"],
        images: ["assets/produtos/blusa-amelie-1988-capa.jpg"],
      },
      {
        name: "Creme",
        hex: "#e8ddc4",
        code: "1988",
        sizes: ["P", "M"],
        images: ["assets/produtos/blusa-amelie-1988-capa.jpg"],
      },
    ],
  },
  {
    id: "blusa-celeste-1989",
    name: "Blusa Celeste",
    category: "Blusas",
    price: 139.9,
    promoPrice: null,
    sizes: ["P", "M"],
    description:
      "Delicada, feminina e super versátil. A Blusa Celeste possui modelagem ajustada ao corpo, alças finas e decote com efeito drapeado, finalizado com renda delicada que traz um toque romântico e sofisticado à peça. Em poliamida, tem ótimo caimento e é aquela blusinha perfeita para compor desde produções mais casuais com jeans até looks mais elegantes com alfaiataria.",
    notes: [
      "Tecido: poliamida",
      "Alças finas, decote drapeado e acabamento em renda",
      "Apenas 1 peça de cada tamanho (P e M)",
    ],
    featured: true,
    colors: [
      {
        name: "Branco",
        hex: "#f5f3ee",
        images: [
          "assets/produtos/blusa-celeste-1989-branco-1.jpg",
          "assets/produtos/blusa-celeste-1989-branco-2.jpg",
        ],
      },
    ],
  },
  {
    id: "blusa-margot-1990",
    name: "Blusa Margot",
    category: "Blusas",
    // Capa própria (foto do varal com as peças penduradas) em vez da 1ª
    // foto da 1ª cor — pedido da cliente, foto mais bonita que os recortes
    // individuais por cor.
    coverImage: "assets/produtos/blusa-margot-1990-capa.jpg",
    price: 149.9,
    promoPrice: null,
    sizes: ["P", "M"],
    description:
      "Clássica com um toque delicado. A Blusa Margot é confeccionada em poliamida, possui modelagem ajustada ao corpo e gola alta, valorizando a silhueta de forma elegante. Os detalhes em renda nos ombros e na barra trazem feminilidade e deixam a peça ainda mais sofisticada. Perfeita para usar com jeans em uma proposta moderna ou com alfaiataria para um look mais elegante.",
    notes: [
      "Tecido: poliamida",
      "Detalhes: gola alta e acabamentos em renda",
    ],
    featured: true,
    colors: [
      {
        // Sem foto individual boa dessa cor (recorte da foto da arara
        // ficava com o branco muito estourado/difícil de enxergar a peça)
        // — usa a mesma foto geral da arara (com as 3 peças penduradas)
        // que também é a capa do produto, em vez de uma galeria separada.
        name: "Branco",
        hex: "#f5f3ee",
        code: "1990",
        sizes: ["P", "M"],
        images: ["assets/produtos/blusa-margot-1990-capa.jpg"],
      },
      {
        name: "Preto",
        hex: "#161616",
        code: "1990",
        sizes: ["M"],
        images: ["assets/produtos/blusa-margot-1990-capa.jpg"],
      },
    ],
  },
  {
    id: "blusa-bella-1991",
    name: "Blusa Bella",
    category: "Blusas",
    price: 109.9,
    promoPrice: null,
    sizes: ["P", "M"],
    description:
      "Aquela básica nada óbvia que combina com tudo. A Blusa Bella é confeccionada em poliamida, com tecido duplo, modelagem ajustada ao corpo e decote frente única que valoriza o colo de forma feminina e moderna. Versátil e confortável, é perfeita para compor desde looks casuais com jeans até produções mais sofisticadas com alfaiataria, saias ou pantalonas.",
    notes: [
      "Tecido: poliamida com tecido duplo",
      "Modelagem ajustada ao corpo, decote frente única",
    ],
    featured: true,
    colors: [
      {
        name: "Rosa",
        hex: "#f2b8c6",
        code: "1991",
        sizes: ["P", "M"],
        images: [
          "assets/produtos/blusa-bella-1991-rosa-1.jpg",
          "assets/produtos/blusa-bella-1991-rosa-2.jpg",
        ],
      },
      {
        name: "Branco",
        hex: "#f5f3ee",
        code: "1991",
        sizes: ["P", "M"],
        images: [
          "assets/produtos/blusa-bella-1991-branco-1.jpg",
          "assets/produtos/blusa-bella-1991-branco-2.jpg",
        ],
      },
      {
        // Sem foto individual no modelo pra essas 2 cores — o recorte
        // estreito da foto da arara ficava com zoom exagerado no quadro
        // da galeria (mesmo problema da Margot/Éloise/Amélie). Usa a foto
        // da arara inteira (mostra também 2 tons de marrom que não são
        // vendidos, mesma solução aprovada nos outros produtos).
        name: "Preto",
        hex: "#161616",
        code: "1991",
        sizes: ["P", "M"],
        images: ["assets/produtos/blusa-bella-1991-preto-amarelo.jpg"],
      },
      {
        name: "Amarelo",
        hex: "#e9d27a",
        code: "1991",
        sizes: ["M"],
        images: ["assets/produtos/blusa-bella-1991-preto-amarelo.jpg"],
      },
    ],
  },
  {
    id: "vestido-lili-1979",
    name: "Vestido Lili",
    category: "Vestidos",
    price: 387.9,
    promoPrice: null,
    sizes: ["Único"],
    description:
      "Feminino, marcante e sofisticado, o Vestido Lili foi feito para quem gosta de uma produção que não passa despercebida. Sua modelagem ajustada valoriza a silhueta, com drapeados que desenham o corpo, decote profundo com detalhe em transparência e mangas longas e fluidas. A saia curta possui acabamento assimétrico com babadinhos, trazendo ainda mais charme e movimento à peça.",
    notes: [
      "Modelagem ajustada ao corpo",
      "Decote profundo com transparência",
      "Mangas longas",
      "Efeito drapeado",
      "Comprimento curto",
      "Barra assimétrica com detalhe franzido",
      "Tamanho único — veste aproximadamente do 34 ao 40",
    ],
    featured: true,
    colors: [
      {
        name: "Marrom",
        hex: "#4a2e22",
        code: "1979",
        stock: 1,
        images: [
          "assets/produtos/vestido-lili-1979-marrom-1.jpg",
          "assets/produtos/vestido-lili-1979-marrom-2.jpg",
          "assets/produtos/vestido-lili-1979-marrom-3.jpg",
        ],
      },
    ],
  },
  {
    id: "vestido-ravena-1980",
    name: "Vestido Ravena",
    category: "Vestidos",
    price: 387.9,
    promoPrice: null,
    sizes: ["Único"],
    description:
      "O Vestido Ravena une atitude e sensualidade em uma peça marcante. Em tom verde militar, possui acabamento com efeito couro e modelagem estruturada que acompanha e valoriza as curvas do corpo. O busto estilo corset, com recortes e costuras aparentes, traz um visual moderno e poderoso, enquanto as alças finas deixam o colo em evidência. O comprimento curto completa a proposta com uma pegada sofisticada e ousada.",
    notes: [
      "Efeito couro",
      "Cor verde militar",
      "Modelagem justa e estruturada",
      "Busto estilo corset",
      "Recortes e costuras que valorizam a silhueta",
      "Alças finas",
      "Fechamento posterior em zíper",
      "Comprimento curto",
      "Peça única disponível",
    ],
    featured: true,
    colors: [
      {
        name: "Verde Militar",
        hex: "#5c5f4a",
        code: "1980",
        stock: 1,
        images: [
          "assets/produtos/vestido-ravena-1980-verde-militar-1.jpg",
          "assets/produtos/vestido-ravena-1980-verde-militar-2.jpg",
        ],
      },
    ],
  },
  {
    id: "vestido-vintage-1981",
    name: "Vestido Vintage",
    category: "Vestidos",
    price: 387.9,
    promoPrice: null,
    sizes: ["Único"],
    description:
      "Inspirado na energia da noite, o Vestido Vintage é uma peça de impacto, perfeita para quem quer um look marcante e cheio de atitude. Com acabamento preto envernizado, possui modelagem bem ajustada ao corpo, recortes que valorizam a silhueta e decote estruturado em V, trazendo uma proposta sensual e moderna. O efeito drapeado nas laterais ajuda a desenhar ainda mais o corpo.",
    notes: [
      "Acabamento envernizado com efeito vinil",
      "Modelagem justa ao corpo",
      "Decote estruturado em V",
      "Recortes que valorizam a silhueta",
      "Detalhes drapeados",
      "Comprimento curto",
      "Tamanho único — veste aproximadamente do 34 ao 38",
    ],
    featured: true,
    colors: [
      {
        name: "Preto",
        hex: "#0d0d0d",
        code: "1981",
        stock: 1,
        images: [
          "assets/produtos/vestido-vintage-1981-preto-1.jpg",
          "assets/produtos/vestido-vintage-1981-preto-2.jpg",
          "assets/produtos/vestido-vintage-1981-preto-3.jpg",
        ],
      },
    ],
  },
  {
    id: "vestido-serena-1984",
    name: "Vestido Serena",
    category: "Vestidos",
    price: 299.0,
    promoPrice: null,
    sizes: ["Único"],
    description:
      "Sofisticado e marcante na medida certa, o Vestido Serena traz uma modelagem que valoriza lindamente as curvas, com uma proposta moderna, feminina e elegante. Em tom off-white, possui comprimento midi, modelagem de um ombro só e manga longa em um dos braços, criando uma assimetria sofisticada. O drapeado ao longo da peça acompanha a silhueta e proporciona um caimento impecável no corpo.",
    notes: [
      "Cor off-white",
      "Modelagem de um ombro só",
      "Manga longa assimétrica",
      "Comprimento midi",
      "Efeito drapeado",
      "Modelagem ajustada ao corpo",
      "Tecido com elasticidade e ótimo caimento",
      "Veste aproximadamente do 34 ao 40",
    ],
    featured: true,
    colors: [
      {
        name: "Off-White",
        hex: "#efe8db",
        code: "1984",
        stock: 1,
        images: ["assets/produtos/vestido-serena-1984-offwhite-1.jpg"],
      },
    ],
  },
  {
    id: "vestido-felice-1858",
    name: "Vestido Felice",
    category: "Vestidos",
    price: 419.9,
    promoPrice: null,
    sizes: ["M"],
    description:
      "Vestido longo em tecido de toque macio e modelagem ajustada ao corpo, com decote frente única, recortes estratégicos na cintura e detalhe sofisticado de fivela dourada nas costas. A peça valoriza a silhueta e traz um visual elegante e marcante.",
    notes: [
      "Tamanho M — veste aproximadamente do 36 ao 40",
      "Modelagem ajustada e super elegante",
      "Detalhe de fivela dourada nas costas",
    ],
    featured: true,
    // Só existe na cor Marrom em loja — Preto e Creme foram removidos
    // (eram só das fotos do ensaio, a peça não está disponível nessas cores).
    colors: [
      {
        name: "Marrom",
        hex: "#7a4a2f",
        code: "1960",
        stock: 1,
        images: [
          "assets/produtos/vestido-felice-1858-marrom-1.jpg",
          "assets/produtos/vestido-felice-1858-marrom-2.jpg",
          "assets/produtos/vestido-felice-1858-marrom-3.jpg",
          "assets/produtos/vestido-felice-1858-marrom-4.jpg",
        ],
      },
    ],
  },
  {
    id: "body-roma-1969",
    name: "Body Roma",
    category: "Body",
    price: 219.9,
    promoPrice: null,
    sizes: ["M"],
    description:
      "O Body Roma é a combinação perfeita de elegância e sensualidade. Confeccionado em renda de alta qualidade, possui toque macio e modelagem ajustada que valoriza as curvas com conforto. Com mangas longas e gola alta, traz um visual sofisticado, enquanto a transparência adiciona charme na medida certa. Versátil, é ideal tanto para looks casuais com jeans quanto para produções mais elegantes.",
    notes: [
      "Renda delicada e sofisticada",
      "Modelagem ajustada ao corpo",
      "Mangas longas com detalhe de dedo e gola alta",
      "Confortável e não marca",
      "Versátil para diversas ocasiões",
      "Tamanho M — veste do 34 ao 40",
    ],
    featured: false,
    colors: [
      {
        name: "Marrom",
        hex: "#4a2e22",
        code: "1969",
        stock: 1,
        images: [
          "assets/produtos/body-roma-1969-marrom-1.jpg",
          "assets/produtos/body-roma-1969-marrom-2.jpg",
        ],
      },
    ],
  },
  {
    id: "calca-legging-fuso-prada-1963",
    name: "Calça Legging Fuso Prada",
    category: "Calças",
    price: 419.9,
    promoPrice: null,
    sizes: ["P", "M", "G"],
    description:
      "Calça legging pezinho em malha Prada de alta compressão, que modela e valoriza a silhueta sem marcar o corpo. Tecido encorpado e sofisticado, com estrutura impecável e ajuste confortável — a escolha ideal para ocasiões especiais que pedem um visual deslumbrante.",
    notes: [
      "Malha Prada de alta compressão",
      "Tecido encorpado, mantém a estrutura da peça",
      "Conforto e liberdade de movimento",
      "Lavar à mão ou ciclo delicado, água fria, secar à sombra",
    ],
    featured: true,
    colors: [
      {
        name: "Preta",
        hex: "#1c1a18",
        code: "1963",
        stock: 3,
        sizes: ["P", "M", "G"],
        images: [
          "assets/produtos/calca-legging-1963-preta-1.jpg",
          "assets/produtos/calca-legging-1963-preta-2.jpg",
          "assets/produtos/calca-legging-1963-preta-3.jpg",
        ],
      },
      {
        // TODO (cliente): mandar fotos da cor Marrom — por enquanto aparece
        // o espaço reservado "Foto do produto" na página dessa cor.
        name: "Marrom",
        hex: "#4a2e22",
        code: "1963",
        stock: 1,
        sizes: ["M"],
        images: [],
      },
    ],
  },
  {
    id: "body-cloud-l49",
    name: "Body Tule Corset",
    category: "Body",
    price: 189.9,
    promoPrice: null,
    sizes: ["PP", "P", "M"],
    description:
      "Um body poderoso, feminino e super sofisticado. Possui modelagem ajustada ao corpo, valorizando a silhueta, com recortes estratégicos em tule transparente que trazem sensualidade na medida certa. O decote estruturado e os detalhes que remetem ao corset deixam a peça ainda mais marcante, perfeita para usar com jeans, alfaiataria ou produções noturnas.",
    notes: [
      "Detalhes em transparência",
      "Modelagem estilo corset",
      "Alças finas e reguláveis",
      "Ajuste que valoriza o corpo",
      "Veste do PP ao M — até o 40",
    ],
    featured: true,
    colors: [
      {
        name: "Preto",
        hex: "#1c1a18",
        code: "1962",
        stock: 2,
        images: [
          "assets/produtos/body-cloud-l49-preto-1.jpg",
          "assets/produtos/body-cloud-l49-preto-2.jpg",
          "assets/produtos/body-cloud-l49-preto-3.jpg",
          "assets/produtos/body-cloud-l49-preto-4.jpg",
        ],
      },
    ],
  },
  {
    id: "conjunto-marilia-1968",
    name: "Conjunto Marília",
    category: "Conjuntos",
    price: 604.9,
    promoPrice: null,
    sizes: ["M"],
    description:
      "Conjunto confeccionado em crepe texturizado, proporcionando leveza, conforto e um caimento impecável. A estampa clássica de poá traz charme e sofisticação, enquanto a modelagem moderna valoriza a silhueta com muito estilo. A jaqueta possui gola alta, mangas amplas e fechamento frontal em zíper, criando um visual elegante e contemporâneo. A calça pantalona de modelagem fluida garante movimento e alonga a silhueta, enquanto a listra lateral contrastante acrescenta um toque esportivo-chique à produção.",
    notes: [
      "Crepe texturizado",
      "Gola alta e fechamento em zíper",
      "Calça pantalona de modelagem fluida",
      "Listra lateral contrastante",
      "Acabamento premium",
      "Tamanho M — veste do 38 ao 42",
    ],
    featured: true,
    colors: [
      {
        name: "Rose",
        hex: "#ddc3b0",
        code: "1968",
        stock: 1,
        images: [
          "assets/produtos/conjunto-marilia-1968-rose-1.jpg",
          "assets/produtos/conjunto-marilia-1968-rose-2.jpg",
          "assets/produtos/conjunto-marilia-1968-rose-3.jpg",
          "assets/produtos/conjunto-marilia-1968-rose-4.jpg",
        ],
      },
    ],
  },
  {
    id: "conjunto-georgia-1966",
    name: "Conjunto Geórgia",
    category: "Conjuntos",
    price: 397.9,
    promoPrice: null,
    sizes: ["P"],
    description:
      "Um conjunto que une alfaiataria e uma proposta esportiva sofisticada. Na cor marrom, ele traz uma estética elegante e atual, com detalhes contrastantes que deixam a produção ainda mais marcante. A jaqueta possui modelagem cropped, gola estilo blazer, fechamento por botões e acabamento canelado com detalhe claro na barra e nos punhos. A calça tem cintura alta, modelagem ampla e faixa lateral contrastante, alongando a silhueta e trazendo um toque moderno ao conjunto.",
    notes: [
      "Jaqueta cropped + calça",
      "Detalhes contrastantes",
      "Calça de cintura alta e modelagem ampla",
      "Peças que também podem ser usadas separadamente",
      "Disponível somente no tamanho P (36–38)",
      "Medidas do P — Busto: 79–86 cm | Cintura: 66–72 cm | Quadril: 88–96 cm | Comprimento da calça: 113 cm",
    ],
    featured: true,
    colors: [
      {
        name: "Marrom",
        hex: "#4a2f22",
        code: "1966",
        stock: 1,
        images: [
          "assets/produtos/conjunto-georgia-1966-marrom-1.jpg",
          "assets/produtos/conjunto-georgia-1966-marrom-2.jpg",
          "assets/produtos/conjunto-georgia-1966-marrom-3.jpg",
          "assets/produtos/conjunto-georgia-1966-marrom-4.jpg",
        ],
      },
    ],
  },
  {
    id: "conjunto-essence-1967",
    name: "Conjunto Essence",
    category: "Conjuntos",
    price: 527.9,
    promoPrice: null,
    sizes: ["M"],
    description:
      "Elegância e conforto em perfeita sintonia! O Conjunto Essence traz uma estampa poá clássica em preto e branco, modelagem moderna e um caimento impecável, ideal para quem busca um visual sofisticado sem abrir mão da praticidade. Perfeito para diversas ocasiões, ele combina charme, versatilidade e muito estilo em uma única produção.",
    notes: [
      "Estampa poá atemporal",
      "Modelagem elegante e confortável",
      "Tecido leve com excelente caimento",
      "Fácil de combinar com acessórios e diferentes calçados",
      "Tamanho M — veste do 38 ao 42",
    ],
    featured: true,
    colors: [
      {
        name: "Preto Poá",
        hex: "#161616",
        code: "1967",
        stock: 1,
        images: [
          "assets/produtos/conjunto-essence-1967-preto-poa-1.jpg",
          "assets/produtos/conjunto-essence-1967-preto-poa-2.jpg",
          "assets/produtos/conjunto-essence-1967-preto-poa-3.jpg",
          "assets/produtos/conjunto-essence-1967-preto-poa-4.jpg",
        ],
      },
    ],
  },
  {
    id: "short-fany-1751",
    name: "Short Fany",
    category: "Shorts",
    price: 139.9,
    promoPrice: null,
    sizes: ["M"],
    description:
      "Short em couro sintético de cintura alta, com modelagem moderna e super versátil. Possui acabamento que imita couro, trazendo um toque sofisticado e estiloso ao look. Ideal para combinar com croppeds, blusas e camisas, tanto para produções mais arrumadas quanto para um visual mais fashionista.",
    notes: [
      "Tamanho M — veste do 34 ao 38",
      "Não é couro legítimo",
      "Modelagem que se adapta bem ao corpo",
    ],
    featured: true,
    colors: [
      {
        name: "Preto",
        hex: "#1c1a18",
        code: "1959",
        stock: 1,
        images: [
          "assets/produtos/short-fany-1751-preto-1.jpg",
          "assets/produtos/short-fany-1751-preto-2.jpg",
          "assets/produtos/short-fany-1751-preto-3.jpg",
          "assets/produtos/short-fany-1751-preto-4.jpg",
        ],
      },
    ],
  },
  {
    id: "conjunto-cetim-duo",
    name: "Conjunto Cetim Duo",
    category: "Conjuntos",
    price: 379.9,
    promoPrice: null,
    sizes: ["P", "M"],
    description:
      "Um conjunto elegante com uma pegada moderna e sofisticada. Confeccionado em tecido acetinado com toque semelhante à seda, possui brilho sutil e caimento leve, além de forro para maior conforto e segurança ao vestir. A camisa tem modelagem soltinha, fechamento frontal por botões e faixas contrastantes em marrom nas mangas. A calça acompanha a mesma proposta, com modelagem ampla e detalhe lateral marrom, trazendo aquele ar esportivo-chic que deixa a peça super atual.",
    notes: [
      "Tecido acetinado com toque de seda",
      "Possui forro",
      "Camisa + calça",
      "Detalhes contrastantes em marrom",
      "Calça de modelagem ampla",
      "Disponível nos tamanhos P e M",
    ],
    featured: true,
    colors: [
      {
        name: "Champagne",
        hex: "#e3d3af",
        stock: 1,
        images: [
          "assets/produtos/conjunto-cetim-duo-champagne-1.jpg",
          "assets/produtos/conjunto-cetim-duo-champagne-2.jpg",
          "assets/produtos/conjunto-cetim-duo-champagne-3.jpg",
          "assets/produtos/conjunto-cetim-duo-champagne-4.jpg",
        ],
      },
    ],
  },
  {
    id: "vestido-bianco-1964",
    name: "Vestido Bianco",
    category: "Vestidos",
    price: 729.9,
    promoPrice: null,
    sizes: ["P", "M", "G"],
    description:
      "Vestido em malha Prada de alta compressão, com modelagem que abraça as curvas e valoriza a silhueta sem marcar o corpo. Tecido encorpado e sofisticado, com estrutura impecável e ajuste confortável — a escolha ideal para ocasiões especiais que pedem um visual deslumbrante.",
    notes: [
      "Malha Prada de alta compressão",
      "Tecido encorpado, mantém a estrutura da peça",
      "Conforto e liberdade de movimento",
      "Lavar à mão ou ciclo delicado, água fria, secar à sombra",
    ],
    featured: true,
    colors: [
      {
        name: "Vermelho",
        hex: "#c0392b",
        code: "1964",
        stock: 1,
        images: [
          "assets/produtos/vestido-bianco-1964-vermelho-1.jpg",
          "assets/produtos/vestido-bianco-1964-vermelho-2.jpg",
        ],
      },
    ],
  },
  {
    id: "blusa-willow-l48",
    name: "Blusa Tule Assimétrica",
    category: "Blusas",
    price: 189.9,
    promoPrice: null,
    sizes: ["PP", "P", "M"],
    description:
      "Uma peça marcante, moderna e cheia de personalidade. Confeccionada em tule com transparência, possui drapeados que valorizam o corpo e acompanha top para usar por baixo, trazendo mais conforto e segurança. O destaque fica para o detalhe alongado em tule na lateral, que cria movimento e deixa a produção muito mais sofisticada. As mangas longas possuem abertura para o dedo, dando aquele acabamento fashionista que faz toda a diferença.",
    notes: [
      "Acompanha top",
      "Tule com transparência e drapeados",
      "Manga longa com abertura para o dedo",
      "Detalhe lateral alongado",
      "Modelagem ajustada ao corpo",
      "Veste do PP ao M — até o 40",
    ],
    featured: false,
    colors: [
      {
        name: "Preto",
        hex: "#1c1a18",
        code: "1961",
        stock: 3,
        images: [
          "assets/produtos/blusa-willow-l48-preto-1.jpg",
          "assets/produtos/blusa-willow-l48-preto-2.jpg",
          "assets/produtos/blusa-willow-l48-preto-3.jpg",
          "assets/produtos/blusa-willow-l48-preto-4.jpg",
        ],
      },
    ],
  },

  // ---------------- SEÇÃO MASCULINA (gender: "masc") ----------------
  // Preço unitário R$119,90 e tamanhos P ao GG informados pelo cliente.
  // Composição do tecido ainda não informada — descrições genéricas, sem
  // citar marcas (as fotos mostram logos de terceiros).
  {
    id: "camiseta-essential",
    gender: "masc",
    name: "Camiseta Essential",
    category: "Camisetas",
    price: 119.9,
    promoPrice: null,
    sizes: ["P", "M", "G", "GG"],
    description:
      "Camiseta de gola redonda e manga curta, de modelagem reta e visual limpo, com pequeno detalhe bordado no peito. A básica que combina com tudo — do jeans à alfaiataria — e entra fácil em qualquer rotina.",
    notes: ["Gola redonda e manga curta", "Pequeno detalhe bordado no peito"],
    featured: true,
    colors: [
      {
        name: "Bordô",
        hex: "#7a1226",
        images: ["assets/produtos/camiseta-essential-bordo-1.jpg"],
      },
      {
        name: "Marinho",
        hex: "#1c2a4a",
        images: ["assets/produtos/camiseta-essential-marinho-1.jpg"],
      },
      {
        name: "Branco",
        hex: "#f5f3ee",
        images: ["assets/produtos/camiseta-essential-branco-1.jpg"],
      },
    ],
  },
  {
    id: "camiseta-signature",
    gender: "masc",
    name: "Camiseta Signature",
    category: "Camisetas",
    price: 119.9,
    promoPrice: null,
    sizes: ["P", "M", "G", "GG"],
    description:
      "Camiseta de gola redonda e manga curta, com estampa de logo em relevo tom sobre tom no peito. Visual urbano e sofisticado, pensado para quem gosta de uma peça básica com personalidade.",
    notes: ["Gola redonda e manga curta", "Estampa de logo em relevo tom sobre tom"],
    featured: true,
    colors: [
      {
        name: "Branco",
        hex: "#f5f3ee",
        images: ["assets/produtos/camiseta-signature-branco-1.jpg"],
      },
      {
        name: "Azul",
        hex: "#23366b",
        images: ["assets/produtos/camiseta-signature-azul-1.jpg"],
      },
      {
        name: "Preto",
        hex: "#161616",
        images: ["assets/produtos/camiseta-signature-preto-1.jpg"],
      },
    ],
  },
];

// Atalhos usados pelo catálogo e pela página do produto — não precisa mexer aqui.
function getProductById(id) {
  return PRODUCTS.find((p) => p.id === id);
}

// Peças sem `gender` são femininas (todo o catálogo original).
function getProductGender(product) {
  return product.gender === "masc" ? "masc" : "fem";
}

function getProductsByGender(gender) {
  return PRODUCTS.filter((p) => getProductGender(p) === gender);
}

function getProductCoverImage(product) {
  return product.coverImage || product.colors[0].images[0];
}
