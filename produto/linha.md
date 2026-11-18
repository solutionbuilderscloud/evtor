# Linha de produto EVTOR

Quatro linhas, divididas por tipo de carro. As 21 medidas e os carros que usam cada uma estão em `data/evtor.js`.

Os valores de rolamento, molhado e ruído abaixo são **metas de projeto** para a etiqueta do Inmetro. Não são resultado de ensaio. Os índices de carga e velocidade seguem o padrão ETRTO para cada medida e devem ser iguais ou superiores aos do pneu original do carro.

## Volt — elétricos urbanos

Para o hatch elétrico de uso diário. Prioridade: autonomia e silêncio.

- Metas de etiqueta: rolamento A, molhado B, ruído 68 dB
- Tecnologias: Giro, Calma, Garra
- Carros: BYD Dolphin Mini, BYD Dolphin, Geely EX2, Chevrolet Spark EUV

| Medida | Índice |
|---|---|
| 175/55 R16 | 80H |
| 195/60 R16 | 89H |
| 205/65 R15 | 94H |
| 205/60 R16 | 96H XL |
| 205/50 R17 | 93V XL |
| 215/55 R16 | 97H XL |

## Arco — sedãs e hatches médios

Para sedã híbrido ou elétrico que pega estrada. Prioridade: conforto e frenagem no molhado.

- Metas de etiqueta: rolamento A, molhado A, ruído 69 dB
- Tecnologias: Giro, Calma, Fibra
- Carros: BYD King, Toyota Corolla Hybrid, GWM Ora 5, BYD Seal

| Medida | Índice |
|---|---|
| 205/55 R16 | 94V XL |
| 215/55 R17 | 98V XL |
| 225/45 R17 | 94W XL |
| 215/50 R18 | 96V XL |
| 235/45 R19 | 99W XL |

## Tera — SUVs híbridos e plug-in

Para o SUV que carrega bateria e família. É a linha de maior volume: seis dos dez híbridos mais vendidos são SUVs médios. Prioridade: capacidade de carga e resistência a buraco.

- Metas de etiqueta: rolamento B, molhado A, ruído 70 dB
- Tecnologias: Fibra, Garra, Calma
- Carros: GWM Haval H6, BYD Song Pro, BYD Song Plus, Toyota Corolla Cross, Toyota Yaris Cross, Omoda 5, Jaecoo 7, Geely EX5 EM-i, BYD Atto 2, BYD Yuan Pro

| Medida | Índice |
|---|---|
| 215/60 R17 | 96H |
| 215/55 R18 | 99V XL |
| 225/50 R18 | 99V XL |
| 225/55 R18 | 102V XL |
| 225/60 R18 | 104V XL |
| 225/55 R19 | 103V XL |
| 235/50 R19 | 103V XL |
| 235/55 R19 | 105V XL |

## Trilha — picapes e 4x4 híbridos

Para a picape híbrida que sai do asfalto. Uso misto. Entra na fase 2.

- Metas de etiqueta: rolamento C, molhado B, ruído 72 dB
- Tecnologias: Fibra, Garra
- Carros: BYD Shark, GWM Tank 300

| Medida | Índice |
|---|---|
| 265/65 R18 | 114T |
| 265/60 R18 | 110H |

## Tecnologias

| Nome | Problema do eletrificado | Solução |
|---|---|---|
| **Giro** | Cada watt perdido no pneu é autonomia perdida | Composto com sílica de baixa histerese |
| **Calma** | Sem motor, o pneu é a fonte de ruído da cabine | Blocos com passo variável; espuma acústica interna nas medidas aro 19 |
| **Fibra** | A bateria soma de 200 a 400 kg ao carro | Carcaça com índice de carga XL |
| **Garra** | O torque instantâneo gasta a banda mais rápido | Banda mais rígida e composto resistente à abrasão |

## Ordem de lançamento

**Fase 1 — 10 medidas.** Cobrem os seis modelos de maior volume.

- Volt: 175/55 R16, 195/60 R16, 205/50 R17, 205/65 R15, 205/60 R16
- Tera: 235/55 R19, 225/55 R19, 225/60 R18, 235/50 R19, 225/50 R18

**Fase 2 — 11 medidas.** Linha Arco completa, restante da Tera, linha Trilha.

A 175/55 R16 vem primeiro. É o carro elétrico mais vendido do país, usa uma medida que só ele usa, e a oferta de reposição ainda é curta.

## Antes de encomendar moldes

- Confirmar cada medida marcada “rev” em `data/evtor.js` no manual do veículo.
- Confirmar o índice de carga e de velocidade do pneu original de cada carro. O da EVTOR não pode ser menor.
- Validar as metas de etiqueta com a fábrica parceira. Rolamento A com molhado A é difícil e caro.
