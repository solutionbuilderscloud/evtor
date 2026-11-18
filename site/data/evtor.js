// Fonte única de dados do ecossistema EVTOR: linhas, medidas e veículos.
// Usado pelo site (window.EVTOR) e pelo teste (node data/check.js).
//
// vendas: emplacamentos Brasil 2026. `acum` = jan–out, `out` = só outubro. null = não encontrado.
// conf: "ok" = medida confirmada em ficha/fonte direta; "rev" = revisar no manual/etiqueta da porta antes de produzir.

const EVTOR = {
  linhas: {
    volt: {
      nome: "Volt",
      uso: "Elétricos urbanos",
      resumo: "Para o hatch elétrico que roda 40 km por dia na cidade. Leve, silencioso e com a menor resistência ao rolamento da marca.",
      meta: { rolamento: "A", molhado: "B", ruido: 68 },
      tecnologias: ["rola", "calma", "garra"],
    },
    arco: {
      nome: "Arco",
      uso: "Sedãs e hatches médios",
      resumo: "Para sedã híbrido e elétrico de estrada. Conforto em viagem longa e frenagem curta no molhado.",
      meta: { rolamento: "A", molhado: "A", ruido: 69 },
      tecnologias: ["rola", "calma", "fibra"],
    },
    tera: {
      nome: "Tera",
      uso: "SUVs híbridos e plug-in",
      resumo: "Para SUV que carrega bateria e família. Carcaça reforçada XL e flanco protegido contra buraco e guia.",
      meta: { rolamento: "B", molhado: "A", ruido: 70 },
      tecnologias: ["fibra", "garra", "calma"],
    },
    trilha: {
      nome: "Trilha",
      uso: "Picapes e 4x4 híbridos",
      resumo: "Para picape híbrida que sai do asfalto. Uso misto, blocos largos e ombro reforçado. Fase 2 do lançamento.",
      meta: { rolamento: "C", molhado: "B", ruido: 72 },
      tecnologias: ["fibra", "garra"],
    },
  },

  tecnologias: {
    rola: { camada: 2, parte: "Composto", nome: "Giro", texto: "Composto com sílica de baixa histerese. Menos energia perdida a cada volta, mais quilômetros por carga." },
    calma: { camada: 4, parte: "Interior", nome: "Calma", texto: "Sequência de blocos com passo variável e, nas medidas aro 19, espuma acústica colada por dentro. Sem motor para encobrir, o ruído do pneu é o ruído do carro." },
    fibra: { camada: 3, parte: "Carcaça", nome: "Fibra", texto: "Carcaça com índice de carga XL. Bateria pesa: um SUV plug-in leva de 200 a 400 kg a mais que o equivalente a combustão." },
    garra: { camada: 1, parte: "Banda de rodagem", nome: "Garra", texto: "Banda mais rígida e composto resistente à abrasão. O torque do motor elétrico chega inteiro na saída, e é ali que o pneu comum se gasta." },
  },

  // Medidas do portfólio. Índices de carga/velocidade seguem a tabela ETRTO para a medida (XL quando indicado).
  medidas: [
    { medida: "175/55 R16", indice: "80H", linha: "volt" },
    { medida: "195/60 R16", indice: "89H", linha: "volt" },
    { medida: "205/65 R15", indice: "94H", linha: "volt" },
    { medida: "205/60 R16", indice: "96H XL", linha: "volt" },
    { medida: "205/50 R17", indice: "93V XL", linha: "volt" },
    { medida: "215/55 R16", indice: "97H XL", linha: "volt" },
    { medida: "205/55 R16", indice: "94V XL", linha: "arco" },
    { medida: "215/55 R17", indice: "98V XL", linha: "arco" },
    { medida: "225/45 R17", indice: "94W XL", linha: "arco" },
    { medida: "215/50 R18", indice: "96V XL", linha: "arco" },
    { medida: "235/45 R19", indice: "99W XL", linha: "arco" },
    { medida: "215/60 R17", indice: "96H", linha: "tera" },
    { medida: "215/55 R18", indice: "99V XL", linha: "tera" },
    { medida: "225/50 R18", indice: "99V XL", linha: "tera" },
    { medida: "225/55 R18", indice: "102V XL", linha: "tera" },
    { medida: "225/60 R18", indice: "104V XL", linha: "tera" },
    { medida: "225/55 R19", indice: "103V XL", linha: "tera" },
    { medida: "235/50 R19", indice: "103V XL", linha: "tera" },
    { medida: "235/55 R19", indice: "105V XL", linha: "tera" },
    { medida: "265/65 R18", indice: "114T", linha: "trilha" },
    { medida: "265/60 R18", indice: "110H", linha: "trilha" },
  ],

  // Perfis de uso real. `roda` é só o valor inicial da calculadora (km por dia, dias por semana): exemplo, não estatística.
  usos: {
    app: {
      nome: "Motorista de aplicativo",
      titulo: "O pneu que trabalha dez horas por dia",
      fato: "O BYD Dolphin é o eletrificado mais usado na Uber e na 99, com o Dolphin Mini logo atrás (CNN Brasil, dados de 2024).",
      exige: ["Rodagem alta: o pneu é custo fixo do mês, junto com a recarga", "Arranca e para o dia inteiro, com o torque elétrico em cada saída", "Guia, valeta e buraco a cada embarque"],
      veiculos: ["Dolphin", "Dolphin Mini", "EX2", "Spark EUV"],
      linha: "volt",
      roda: [200, 5],
    },
    familia: {
      nome: "Família e estrada",
      titulo: "Cinco pessoas, bagagem e uma bateria",
      fato: "Seis dos dez híbridos mais vendidos do Brasil em outubro de 2026 são SUVs médios.",
      exige: ["Carro cheio somado ao peso da bateria: índice de carga XL", "Serra e chuva: frenagem no molhado vem primeiro", "Horas de estrada: o ruído de rolagem cansa"],
      veiculos: ["Haval H6", "Song Pro", "Song Plus", "Corolla Cross Hybrid"],
      linha: "tera",
      roda: [40, 6],
    },
    executivo: {
      nome: "Executivo e frota",
      titulo: "Silêncio é parte do serviço",
      fato: "Sedãs híbridos e elétricos rodam em frotas corporativas, transporte executivo e táxi.",
      exige: ["Cabine silenciosa com passageiro no banco de trás", "Rodovia e aeroporto: estabilidade em velocidade", "Custo por quilômetro previsível para o gestor da frota"],
      veiculos: ["King", "Corolla Hybrid", "Seal", "Ora 5"],
      linha: "arco",
      roda: [90, 5],
    },
    campo: {
      nome: "Campo e trabalho",
      titulo: "Do asfalto para a terra, sem trocar de pneu",
      fato: "As picapes híbridas plug-in chegaram ao agro: torque elétrico em estrada de terra.",
      exige: ["Terra, cascalho e lama: bloco largo e ombro reforçado", "Carga na caçamba somada à bateria", "Volta pelo asfalto sem ruído de pneu de lama"],
      veiculos: ["Shark", "Tank 300"],
      linha: "trilha",
      roda: [80, 6],
    },
  },

  veiculos: [
    // Elétricos (BEV)
    { marca: "BYD", modelo: "Dolphin Mini", tipo: "BEV", acum: 69061, out: 8432, medidas: ["175/55 R16"], conf: "ok" },
    { marca: "BYD", modelo: "Dolphin", tipo: "BEV", acum: 40691, out: 5273, medidas: ["195/60 R16", "205/50 R17"], conf: "rev", nota: "GS aro 16, Plus aro 17" },
    { marca: "Geely", modelo: "EX2", tipo: "BEV", acum: 30689, out: 1483, medidas: ["205/65 R15", "205/60 R16"], conf: "rev", nota: "Pro aro 15, Max aro 16" },
    { marca: "Chevrolet", modelo: "Spark EUV", tipo: "BEV", acum: 6076, out: 882, medidas: ["215/55 R16"], conf: "rev" },
    { marca: "BYD", modelo: "Yuan Pro", tipo: "BEV", acum: 4538, out: null, medidas: ["215/60 R17"], conf: "rev" },
    { marca: "GWM", modelo: "Ora 5", tipo: "BEV", acum: null, out: 1598, medidas: ["215/50 R18"], conf: "ok" },
    { marca: "BYD", modelo: "Seal", tipo: "BEV", acum: null, out: null, medidas: ["235/45 R19"], conf: "rev" },
    // Híbridos (HEV e PHEV; o ranking da ABVE soma as versões)
    { marca: "GWM", modelo: "Haval H6", tipo: "HEV/PHEV", acum: 44676, out: 5995, medidas: ["235/55 R19", "225/55 R19"], conf: "rev", nota: "fontes divergem entre 225 e 235 conforme a versão" },
    { marca: "BYD", modelo: "Song Pro", tipo: "PHEV", acum: 33023, out: 2831, medidas: ["225/60 R18"], conf: "ok" },
    { marca: "BYD", modelo: "Song Plus", tipo: "PHEV", acum: 23113, out: 2317, medidas: ["235/50 R19"], conf: "ok" },
    { marca: "Omoda", modelo: "5 HEV", tipo: "HEV", acum: null, out: 2718, medidas: ["215/55 R18"], conf: "rev" },
    { marca: "Toyota", modelo: "Yaris Cross Hybrid", tipo: "HEV", acum: null, out: 2413, medidas: ["215/55 R18"], conf: "ok" },
    { marca: "BYD", modelo: "Atto 2 DM-i", tipo: "PHEV", acum: null, out: 2274, medidas: ["215/60 R17"], conf: "rev" },
    { marca: "Jaecoo", modelo: "7", tipo: "PHEV", acum: null, out: 2208, medidas: ["235/50 R19"], conf: "rev" },
    { marca: "BYD", modelo: "King", tipo: "PHEV", acum: null, out: 2205, medidas: ["215/55 R17"], conf: "rev" },
    { marca: "Geely", modelo: "EX5 EM-i", tipo: "PHEV", acum: null, out: 1238, medidas: ["225/55 R18", "235/50 R19"], conf: "ok", nota: "Pro aro 18, Max aro 19" },
    { marca: "Toyota", modelo: "Corolla Cross Hybrid", tipo: "HEV", acum: null, out: 1098, medidas: ["225/50 R18"], conf: "ok" },
    { marca: "Toyota", modelo: "Corolla Hybrid", tipo: "HEV", acum: null, out: null, medidas: ["205/55 R16", "225/45 R17"], conf: "rev" },
    { marca: "BYD", modelo: "Shark", tipo: "PHEV", acum: null, out: null, medidas: ["265/65 R18"], conf: "rev" },
    { marca: "GWM", modelo: "Tank 300", tipo: "HEV/PHEV", acum: null, out: null, medidas: ["265/60 R18"], conf: "rev" },
  ],
};

if (typeof module !== "undefined") module.exports = EVTOR;
