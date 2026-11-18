# EVTOR

Marca de pneus para carros elétricos e híbridos da América do Sul. Assinatura: **Torque em silêncio.**

## O que tem aqui

| Pasta | Conteúdo |
|---|---|
| `site/index.html` | Camada 1, o pitch em 9 telas: ícone animado, pergunta, produto, dor, solução, números, expectativa |
| `site/logos.html` | Logotipo EVTOR (aro e raio): versões e tamanhos. Arquivos em `site/logo/evtor*.svg` |
| `site/produto.html` | Protótipo do site de produto: pneu 3D guiado por scroll, medida por carro, reserva |
| `site/src/pneu3d.js` | Fonte do pneu 3D (three.js). Gera `site/pneu3d.js`: `npx esbuild site/src/pneu3d.js --bundle --minify --format=iife --global-name=EVTOR3D --outfile=site/pneu3d.js` (precisa de `npm i three@0.160.0`) |
| `site/catalogo.html` | Catálogo técnico: uso real, calculadora de rodagem, anatomia, validação, tabela de medidas |
| `site/marca.html` | Camada 2, a marca: logotipo, ficha técnica e aplicações |
| `site/estudo.html` | Camada 3, o estudo de mercado: volumes, modelos, medidas, portfólio e fontes |
| `site/logo/` | Logotipo em SVG (claro e escuro) e símbolo |
| `site/img/` | Fotografia e vídeo do hero, gerados por IA (Higgsfield) |
| `site/data/evtor.js` | Fonte única: linhas, tecnologias, 21 medidas, 20 veículos |
| `pesquisa/mercado.md` | Ranking de eletrificados no Brasil, medidas de pneu, fontes |
| `produto/linha.md` | Linhas Volt, Arco, Tera e Trilha, medidas e ordem de lançamento |
| `negocio/plano.md` | Posicionamento, etapas de lançamento, riscos |

## Como abrir

Abra `site/index.html` no navegador. Não há build nem servidor.

## Como apresentar

- Seta, espaço ou PageDown: próxima parada. Seta para cima ou PageUp: volta. O passador de slides usa as mesmas teclas.
- `N` abre a janela de notas: fala da parada, próxima parada e cronômetro. As falas ficam em `data-fala` no `site/index.html`.
- `F` liga a tela cheia.
- `site/index.html?parada=7` abre direto na parada 7.
- Roda sem internet: a fonte está em `site/fonts/`.
- PDF de reserva: `npm i --no-save puppeteer-core && node site/pdf.mjs`. Sai em `site/pdf/evtor-pitch.pdf`.

## Como atualizar os dados

Edite `site/data/evtor.js`. O site lê esse arquivo. Depois rode:

```
node site/data/check.js
```

O teste falha se um veículo usar uma medida fora do portfólio, ou se uma linha ficar sem medida.

## Pendências

- Medidas com `conf: "rev"` em `site/data/evtor.js` precisam ser confirmadas no manual de cada veículo.
- O e-mail `contato@evtor.com.br` no site é um marcador. O domínio não foi registrado.
- Marca e nomes de linha não foram pesquisados no INPI.
- As metas de etiqueta são de projeto, sem ensaio.
- Não há versão em espanhol.
- As fotos são geradas por IA e ilustrativas: os pneus não têm o desenho de banda real nem a marca gravada no flanco.
