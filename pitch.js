// Um script para as três camadas (Pitch, Marca, Estudo). Cada bloco só roda se a página tiver o elemento.
const E = EVTOR; // global declarado em data/evtor.js
const $ = (id) => document.getElementById(id);
const poe = (id, valor) => $(id) && ($(id).textContent = valor);
const calmo = matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!calmo) document.documentElement.classList.add("anima"); // sem script, tudo fica visível
const nf = (n, casas = 0) => n.toLocaleString("pt-BR", { minimumFractionDigits: casas, maximumFractionDigits: casas });

// ---------- Dados do estudo ----------
const ranque = E.veiculos.filter((v) => v.acum).sort((a, b) => b.acum - a.acum);
const seis = ranque.slice(0, 6);
const medidasSeis = [...new Set(seis.flatMap((v) => v.medidas))];
const soma = seis.reduce((s, v) => s + v.acum, 0);

poe("nMedidas", medidasSeis.length);
poe("miniVol", nf(ranque[0].acum));
poe("miniOut", nf(ranque[0].out));
poe("gTotal", E.medidas.length);
document.querySelectorAll(".soma").forEach((n) => (n.textContent = nf(soma)));
for (const [id, valor] of [["nCarros", soma], ["nPneus", soma * 4]]) {
  if (!$(id)) continue;
  $(id).dataset.conta = valor;
  $(id).textContent = nf(valor);
}

if ($("barras"))
  $("barras").innerHTML = ranque
    .map((v, i) => `<div class="linha ${v.tipo === "BEV" ? "bev" : "hib"}${i < 6 ? "" : " resto"}" role="listitem">
      <p class="nome">${v.marca} ${v.modelo}</p>
      <p class="pneu">${v.medidas.join(" · ")}${v.conf === "ok" ? "" : " <em>a confirmar</em>"}</p>
      <p class="valor">${nf(v.acum)}</p>
      <div class="trilho"><i style="--w:${(v.acum / ranque[0].acum) * 100}%"></i></div>
    </div>`)
    .join("");

if ($("medidas"))
  $("medidas").innerHTML = medidasSeis
    .map((m) => `<p><b>${m}</b><small>${seis.filter((v) => v.medidas.includes(m)).map((v) => v.modelo).join(", ")}</small></p>`)
    .join("");

if ($("linhasGrade"))
  $("linhasGrade").innerHTML = Object.entries(E.linhas)
    .map(([id, l]) => `<div>
      <h3>${l.nome}</h3>
      <p class="uso">${l.uso}</p>
      <p class="metas">Rolamento <b>${l.meta.rolamento}</b> · Molhado <b>${l.meta.molhado}</b> · <b>${l.meta.ruido} dB</b></p>
      <p class="lista-medidas">${E.medidas.filter((m) => m.linha === id).map((m) => `${m.medida} <i>${m.indice}</i>`).join("<br>")}</p>
    </div>`)
    .join("");

function contar(el) {
  const alvo = +el.dataset.conta, casas = +(el.dataset.casas || 0), t0 = performance.now();
  (function passo(t) {
    const k = Math.min((t - t0) / 1200, 1);
    el.textContent = nf(alvo * (1 - Math.pow(1 - k, 4)), casas);
    if (k < 1) requestAnimationFrame(passo);
  })(t0);
}

// ---------- Pitch: pneu em camadas, seu carro e pontos ----------
const LIMAO = { luz: 0xd4ff1f };
const tem3d = !calmo && typeof EVTOR3D !== "undefined"; // sem 3D ficam as fotos

if (tem3d && $("pneuCamadas")) {
  const sol = $("solucao");
  sol.classList.add("tem3d"); // antes de montar: o canvas precisa estar visível para ser medido
  try {
    const pneu = EVTOR3D.camadas($("pneuCamadas"), { tom: LIMAO });
    sol.addEventListener("passo", (e) => pneu.passo(e.detail));
    sol.addEventListener("preso", (e) => pneu.abrir(e.detail)); // abre quando a cena prende, fecha quando solta
  } catch (erro) {
    sol.classList.remove("tem3d");
    console.warn("Sem WebGL: a solução segue com a foto.", erro);
  }
}

if ($("fichas")) {
  const porMedida = Object.fromEntries(E.medidas.map((m) => [m.medida, m]));
  const carros = E.veiculos.filter((v) => v.acum || v.out).sort((a, b) => (b.acum || b.out * 10) - (a.acum || a.out * 10));
  const escolher = (i) => {
    const v = carros[i], [medida, outra] = v.medidas, m = porMedida[medida];
    document.querySelectorAll("#fichas button").forEach((b, j) => b.setAttribute("aria-pressed", j === i));
    const vendas = v.acum ? `${nf(v.acum)} vendidos de janeiro a outubro de 2026` : `${nf(v.out)} vendidos em outubro de 2026`;
    $("leitura").innerHTML = `<p class="numero">${medida}</p>
      <p class="dito">${v.marca} ${v.modelo}. ${vendas}. Pneu EVTOR ${E.linhas[m.linha].nome}, índice ${m.indice}.
      <em>${outra ? `Outra versão usa ${outra}. ` : ""}${v.conf === "ok" ? "" : "Medida a confirmar no manual."}</em></p>`;
  };
  $("fichas").innerHTML = carros.map((v, i) => `<button type="button" data-i="${i}">${v.modelo}</button>`).join("");
  $("fichas").addEventListener("click", (e) => e.target.dataset.i && escolher(+e.target.dataset.i));
  escolher(0);
}

// Pontos: um para cada mil pneus, um bloco por modelo. No último passo só o mais vendido fica aceso.
if ($("pontos") && !calmo) {
  const tela = $("pontos"), g = tela.getContext("2d");
  const blocos = seis.map((v) => ({ nome: v.modelo, pneus: v.acum * 4, n: Math.round((v.acum * 4) / 1000) }));
  poe("nMini", nf(blocos[0].pneus));
  let surge = 0, foco = 0, alvoSurge = 0, alvoFoco = 0, rodando = 0;
  function desenhar() {
    rodando = 0;
    surge += (alvoSurge - surge) * 0.06; foco += (alvoFoco - foco) * 0.1;
    const dpr = Math.min(devicePixelRatio, 2), W = tela.clientWidth, H = tela.clientHeight, vao = 2, pe = 46;
    if (tela.width !== W * dpr) { tela.width = W * dpr; tela.height = H * dpr; }
    g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, W, H);
    // a maior célula que cabe: testa o número de fileiras
    let lado = 0, fileiras = 1;
    for (let f = 4; f <= 60; f++) {
      const colunas = blocos.reduce((c, b) => c + Math.ceil(b.n / f), 0) + vao * (blocos.length - 1);
      const l = Math.min((H - pe) / f, W / colunas);
      if (l > lado) { lado = l; fileiras = f; }
    }
    const total = blocos.reduce((c, b) => c + b.n, 0);
    let x = 0, feitos = 0;
    g.font = `600 ${W < 700 ? 10 : 13}px Archivo, Arial, sans-serif`; g.textBaseline = "top";
    blocos.forEach((b, k) => {
      const apagado = k ? 1 - foco * 0.86 : 1;
      for (let i = 0; i < b.n; i++, feitos++) {
        const a = Math.min(Math.max(surge * 1.6 - (feitos / total) * 0.6, 0) * 4, 1); // entram em onda, da esquerda para a direita
        if (!a) continue;
        g.globalAlpha = a * apagado; g.fillStyle = "#0A0C05";
        g.beginPath(); g.arc(x + (Math.floor(i / fileiras) + 0.5) * lado, H - pe - ((i % fileiras) + 0.5) * lado, lado * 0.34 * (0.6 + 0.4 * a), 0, 7); g.fill();
      }
      g.globalAlpha = Math.min(surge * 2, 1) * apagado;
      const tx = Math.min(x, W - g.measureText(b.nome).width); // o último rótulo não sai da tela
      g.fillText(b.nome, tx, H - pe + 12); g.globalAlpha *= 0.6; g.fillText(nf(b.pneus), tx, H - pe + 29);
      x += (Math.ceil(b.n / fileiras) + vao) * lado;
    });
    g.globalAlpha = 1;
    if (Math.abs(alvoSurge - surge) > 0.002 || Math.abs(alvoFoco - foco) > 0.002) rodando = requestAnimationFrame(desenhar);
  }
  const cena = $("expectativa");
  cena.addEventListener("passo", (e) => {
    cena.classList.toggle("ve-pontos", e.detail > 0);
    alvoSurge = e.detail > 0 ? 1 : 0; alvoFoco = e.detail > 1 ? 1 : 0;
    if (!e.detail) surge = 0;
    rodando ||= requestAnimationFrame(desenhar);
  });
  addEventListener("resize", () => (rodando ||= requestAnimationFrame(desenhar)));
}

// ---------- Cenas: o palco fica preso e os passos trocam no lugar ----------
const cenas = [...document.querySelectorAll(".cena")].map((c) => {
  const passos = [...c.querySelectorAll(".passo")];
  c.style.setProperty("--n", passos.length);
  const marcas = document.createElement("div");
  marcas.className = "marcas";
  marcas.setAttribute("aria-hidden", "true");
  marcas.innerHTML = passos.map(() => "<i></i>").join("");
  c.querySelector(".palco").append(marcas);
  return { c, passos, marcas: [...marcas.children], fundos: [...c.querySelectorAll(".fundo-passo")], atual: -1, preso: false };
});
function trocar() {
  for (const s of cenas) {
    const r = s.c.getBoundingClientRect();
    const preso = r.top <= 1 && r.bottom >= innerHeight - 1;
    if (preso !== s.preso) s.c.dispatchEvent(new CustomEvent("preso", { detail: (s.preso = preso) }));
    if (r.bottom < 0 || r.top > innerHeight) continue;
    const n = s.passos.length;
    const i = Math.max(0, Math.min(n - 1, Math.floor((-r.top / (r.height - innerHeight)) * n)));
    if (i === s.atual) continue;
    s.atual = i;
    s.passos.forEach((p, j) => p.classList.toggle("ativo", j === i));
    s.marcas.forEach((m, j) => m.classList.toggle("ativo", j === i));
    s.fundos.forEach((f) => f.classList.toggle("ativo", +f.dataset.passo === i));
    s.c.dispatchEvent(new CustomEvent("passo", { detail: i }));
    s.passos[i].querySelectorAll("[data-conta]").forEach(contar);
  }
}

// ---------- Progresso no topo ----------
let pedido = 0;
function quadro() {
  pedido = 0;
  $("avanco").style.transform = `scaleX(${scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight)})`;
  if (!calmo) trocar();
}
addEventListener("scroll", () => (pedido ||= requestAnimationFrame(quadro)), { passive: true });
addEventListener("resize", quadro);
quadro();

// Topo preto enquanto uma tela limão está no meio da janela
const ioVolt = new IntersectionObserver(
  (es) => es.forEach((e) => e.isIntersecting && document.body.classList.toggle("sobre-volt", e.target.classList.contains("volt"))),
  { rootMargin: "-45% 0px -45% 0px" }
);
document.querySelectorAll(".tela, .cena, .secao").forEach((t) => ioVolt.observe(t));

// ---------- Entrada das telas ----------
if (!calmo) {
  const io = new IntersectionObserver(
    (es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("vista");
      e.target.querySelectorAll("[data-conta]").forEach(contar);
      io.unobserve(e.target);
    }),
    // sem threshold: uma seção mais alta que quatro telas (Marca no celular) nunca chega a 25% visível e ficava invisível
    { rootMargin: "0px 0px -20% 0px" }
  );
  document.querySelectorAll(".tela, .secao").forEach((t) => io.observe(t));
}

// ---------- Modo apresentador: setas e passador avançam uma parada; N abre as notas; F, tela cheia ----------
if (document.body.classList.contains("p-pitch")) {
  // parada = uma tela, ou um passo de uma cena
  const paradas = () => [...document.querySelectorAll(".tela, .cena")].flatMap((el) => {
    const topo = el.getBoundingClientRect().top + scrollY, nome = el.dataset.nome;
    const passos = calmo ? [] : [...el.querySelectorAll(".passo")];
    if (!passos.length) return [{ y: topo, nome, fala: el.dataset.fala }];
    return passos.map((p, i) => ({ y: topo + ((i + 0.5) / passos.length) * (el.offsetHeight - innerHeight), nome: `${nome} · ${i + 1} de ${passos.length}`, fala: p.dataset.fala }));
  });
  const onde = (ps) => ps.reduce((m, p, i) => (Math.abs(p.y - scrollY) < Math.abs(ps[m].y - scrollY) ? i : m), 0);
  const ir = (d) => { const ps = paradas(), p = ps[onde(ps) + d]; if (p) scrollTo({ top: p.y }); };

  let notas = null, inicio = 0;
  function atualizarNotas() {
    if (!notas || notas.closed) return;
    const ps = paradas(), i = onde(ps), d = notas.document, s = inicio ? Math.floor((Date.now() - inicio) / 1000) : 0;
    d.getElementById("onde").textContent = `${i + 1} / ${ps.length} · ${ps[i].nome}`;
    d.getElementById("fala").textContent = ps[i].fala || "";
    d.getElementById("depois").textContent = ps[i + 1] ? `Depois: ${ps[i + 1].nome}` : "Fim";
    d.getElementById("tempo").textContent = `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  }
  function abrirNotas() {
    notas = open("", "evtor-notas", "width=560,height=460");
    if (!notas) return;
    notas.document.body.innerHTML = `<style>body{margin:0;padding:28px;background:#050605;color:#F2F4EC;font:400 17px/1.4 Archivo,Arial,sans-serif}#onde,#depois{font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#8E9384}#fala{font-size:30px;line-height:1.25;margin:24px 0}#tempo{position:fixed;right:28px;bottom:24px;font-size:44px;font-weight:800;color:#D4FF1F;font-variant-numeric:tabular-nums}</style><p id="onde"></p><p id="fala"></p><p id="depois"></p><p id="tempo"></p>`;
    notas.document.title = "EVTOR — Notas";
    inicio = Date.now(); // o cronômetro começa quando as notas abrem
    atualizarNotas();
  }
  setInterval(atualizarNotas, 500);

  addEventListener("keydown", (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const emBotao = e.target.closest("button, a, input, select, textarea");
    const frente = ["ArrowDown", "ArrowRight", "PageDown"].includes(e.key) || (e.key === " " && !e.shiftKey && !emBotao);
    const tras = ["ArrowUp", "ArrowLeft", "PageUp"].includes(e.key) || (e.key === " " && e.shiftKey && !emBotao);
    if (frente || tras) { e.preventDefault(); ir(frente ? 1 : -1); }
    else if (e.key === "n" || e.key === "N") abrirNotas();
    else if (e.key === "f" || e.key === "F") document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
  });

  // index.html?parada=7 abre direto na parada 7 (ensaio e geração do PDF)
  const pedida = new URLSearchParams(location.search).get("parada");
  if (pedida) addEventListener("load", () => {
    document.documentElement.style.scrollBehavior = "auto";
    const p = paradas()[pedida - 1];
    if (p) scrollTo(0, p.y);
  });
}
