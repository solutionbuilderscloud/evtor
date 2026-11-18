# Plano: apresentação EVTOR que impressiona

Alvo: `site/index.html` (pitch), com `site/pitch.js` e `site/pitch.css`.

O plano anterior consertava defeitos. Este troca a pergunta: o que a plateia vai contar para outra pessoa no dia seguinte? Uma apresentação correta não é lembrada. Três momentos são.

Li o código e os dados. Não abri a apresentação no navegador: a etapa 0 faz isso.

## O que já existe e o pitch não usa

| Ativo | Onde | Hoje |
|---|---|---|
| Pneu 3D em three.js, com medida gravada no flanco | `site/src/pneu3d.js`, `EVTOR3D.montar()` | Só em `produto.html` |
| 20 veículos com vendas e medida de pneu | `site/data/evtor.js` | Pitch mostra só a soma |
| Calculadora de rodagem | `site/catalogo.js`, `rodagem()` | Só no catálogo |
| Vídeos `hero.mp4` e `giro.mp4` | `site/img/` | `giro.mp4` sem uso, `hero.mp4` só no catálogo |
| Fotos `buraco`, `peso`, `torque`, `tunel` | `site/img/pitch/` | Sem uso |

O pitch hoje é texto grande sobre fundo preto e três fotos. O material mais forte do projeto está nas outras páginas.

## Os três momentos

### Momento 1: o pneu abre na frente da plateia

Tela "A solução". Hoje é uma foto parada (`anatomia.jpg`) e quatro palavras.

Proposta: o pneu 3D ocupa a tela. A cada passo, uma camada se separa das outras e acende em limão: Garra, Giro, Fibra, Calma. No último passo, o pneu se fecha e gira.

Custo: `pneu3d.js` hoje monta a roda inteira. Precisa separar a roda em quatro malhas e animar o afastamento. É o item mais caro do plano.

### Momento 2: "qual é o seu carro?"

Tela nova, depois de "A dor". Você pergunta à sala quem tem carro elétrico ou híbrido e clica no modelo.

A tela responde com três linhas:

- a medida do pneu daquele carro
- quantos desses carros foram vendidos de janeiro a outubro de 2026
- o pneu EVTOR daquela medida, com a medida gravada no flanco do 3D

Os dados já existem: 20 veículos em `site/data/evtor.js`. O 3D já aceita a medida como parâmetro.

Por que impressiona: o pitch deixa de falar de mercado e fala do carro de alguém sentado na sala.

### Momento 3: 965.012 pneus, vistos

Tela "A expectativa". Hoje é um número contando até 965.012.

Proposta: a tela enche de pontos, um para cada mil pneus, agrupados pelos seis modelos. O grupo do Dolphin Mini acende, e aparece a frase: essa medida não existia no Brasil quando o carro chegou.

Custo: baixo. Um canvas 2D com 965 pontos.

## Etapas

### 0. Ver como a plateia vê

Abrir `site/index.html` em 1920×1080, 1366×768 e celular. Capturar cada tela. Listar defeitos: texto cortado, contraste baixo sobre foto, salto de animação.

Pronto quando: lista de defeitos por tela, com captura.

### 1. Fechar a história

Ordem proposta, 12 telas:

1. Abertura
2. A pergunta
3. O produto
4. A dor (com `buraco`, `peso` e `torque` ao fundo, uma foto por passo)
5. **Nova: qual é o seu carro?** (momento 2)
6. A solução (momento 1)
7. Na rua
8. Os números
9. A expectativa (momento 3)
10. **Nova: por que nós.** Marcas grandes têm uma linha elétrica em um catálogo de centenas. A EVTOR só faz isso.
11. **Nova: o plano.** Marca, fábrica, homologação, piloto com 175/55 R16. Texto de `negocio/plano.md`.
12. Fecho, com o pedido escrito e um QR para `produto.html`.

Pronto quando: cada tela responde a uma pergunta, e a última diz o que você pede.

### 2. Construir os três momentos

Ordem: momento 3, depois 2, depois 1. Do mais barato para o mais caro. Se o prazo apertar, o momento 1 cai e a foto `anatomia.jpg` fica.

Pronto quando: cada momento roda em um notebook comum sem travar.

### 3. Movimento entre as telas

- Abertura: o vídeo `giro.mp4` atrás do símbolo, no lugar do fundo preto.
- Fotos com zoom lento contínuo, para a tela nunca ficar parada enquanto você fala.
- Troca entre telas com um corte só, igual em todas. Sem efeito diferente por tela.

Pronto quando: nenhuma tela fica estática por mais de três segundos.

### 4. Modo apresentador

- Seta, espaço e PageDown avançam uma tela ou um passo. Passador de slides usa essas teclas.
- Tecla `N` abre uma segunda janela com a fala da tela atual, a próxima tela e um cronômetro.
- Fonte Archivo salva em `site/`. Hoje vem do Google Fonts: sem internet na sala, a tipografia cai.

Pronto quando: a apresentação inteira roda com o Wi-Fi desligado, só com o passador.

### 5. Blindar os números

- Fecho diz "Um milhão de carros novos". O dado é a frota total. Corrigir.
- "20% a 30% mais rápido" e "reprova na vistoria" citam blogs. Trocar por fonte primária (ABVE, fabricante de pneu, Inmetro) ou suavizar a frase.
- Conferir cada número com `pesquisa/mercado.md`.

Pronto quando: cada número da tela tem fonte que você cita de cabeça.

### 6. Roteiro e ensaio

- `negocio/roteiro.md`: uma a três frases de fala por tela, com tempo.
- Dez perguntas prováveis com resposta curta: preço, fábrica, INPI, time, por que não Michelin.
- Um ensaio cronometrado, com o momento 2 feito com uma pessoa de verdade.

Pronto quando: o ensaio fecha no tempo, sem ler a tela.

### 7. Plano B

- PDF com uma página por tela.
- Os três momentos têm versão parada: se o 3D falhar, a foto aparece no lugar.

Pronto quando: o PDF abre no celular, e a apresentação roda com o 3D desligado.

## Opcional: trailer de 30 segundos

Um vídeo curto com as fotos e os vídeos que já existem, a assinatura "Torque em silêncio" e o logo. Serve para abrir a sala antes de você falar e para enviar depois.

Fica fora do plano principal: é um segundo produto, com trilha e edição próprias.

## Não entra

- Refazer identidade, logo ou fotos.
- Versão em espanhol.
- Mudanças em `produto.html` e `catalogo.html`.
- Som durante a apresentação. Áudio em sala alheia falha com frequência.

## Riscos

| Risco | Resposta |
|---|---|
| 3D trava no notebook ou projetor da sala | Versão parada de cada momento (etapa 7). Testar na máquina real antes. |
| Momento 2: ninguém na sala tem carro eletrificado | Você escolhe o Dolphin Mini, o mais vendido. O roteiro já prevê. |
| Momento 2: o carro da pessoa não está nos 20 | A tela mostra a lista. Quem não está na lista vira argumento: o plano cobre os mais vendidos primeiro. |
| Medidas com `conf: "rev"` aparecem como certas no momento 2 | A tela marca "a confirmar", como a camada Estudo já faz. |
| Prazo curto | Ordem de corte: trailer, momento 1, modo apresentador com segunda janela. |

## Perguntas

:::question
Para quem é a apresentação?

Muda a tela de pedido e o tom. Investidor quer tamanho de mercado e o que você pede. Fábrica ou parceiro quer volume e medidas. Banca quer método e fontes.

- [ ] Investidor
- [ ] Fábrica ou parceiro comercial
- [ ] Banca ou professor
- [ ] Cliente que encomendou a marca

:::

:::question
Você apresenta ao vivo ou envia o link?

O momento 2 só funciona ao vivo, com você perguntando à sala. Por link, ele vira um seletor que a pessoa usa sozinha, e o modo apresentador sai do plano.

- [ ] Ao vivo, com projetor ou tela
- [ ] Ao vivo, por videochamada
- [ ] Envio o link, a pessoa lê sozinha
- [ ] Os dois

Recommended: Os dois
:::

:::question-text
Quanto tempo você tem de fala, e qual a data da apresentação?

Doze telas com três momentos pedem cerca de dez minutos. A data define se o momento 1 (pneu 3D que abre) cabe.
:::

:::question-text
O que você pede no final?

A última tela hoje não pede nada. Exemplos: investimento, uma reunião com a fábrica, aprovação da marca, nota.
:::

:::question-multi
Quais momentos entram?

Cada um é independente. O momento 1 é o mais caro: exige separar o pneu 3D em quatro camadas. Os outros dois usam o que já existe.

- [ ] Momento 1 — o pneu abre em quatro camadas, em 3D
- [ ] Momento 2 — "qual é o seu carro?"
- [ ] Momento 3 — 965.012 pneus em pontos
- [ ] Trailer de 30 segundos

Recommended: Momento 1, Momento 2 e Momento 3
:::
