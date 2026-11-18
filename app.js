const E = EVTOR; // global declarado em data/evtor.js
const $ = (id) => document.getElementById(id);
const porMedida = Object.fromEntries(E.medidas.map((m) => [m.medida, m]));
const EMAIL = "contato@evtor.com.br"; // marcador: trocar quando o domínio existir

// Pneu 3D: o scroll move a câmera e troca a legenda
const giro = document.querySelector(".giro");
const legendas = [...document.querySelectorAll(".legenda")];
const calmo = matchMedia("(prefers-reduced-motion: reduce)").matches;
let pneu = null, fotos = {}, pedido = 0;
try {
  pneu = EVTOR3D.montar($("pneu"), { parado: calmo });
  fotos = EVTOR3D.retratos();
} catch (erro) {
  console.warn("Sem WebGL: página segue sem o pneu 3D.", erro);
}
function quadro() {
  pedido = 0;
  const r = giro.getBoundingClientRect();
  const p = Math.min(Math.max(-r.top / (r.height - innerHeight), 0), 1);
  pneu?.progresso(p);
  legendas.forEach((l) => l.classList.toggle("ativa", p >= +l.dataset.de && p <= +l.dataset.ate));
}
addEventListener("scroll", () => (pedido ||= requestAnimationFrame(quadro)), { passive: true });
quadro();
if (fotos.flanco) { $("fotoFlanco").src = fotos.flanco; $("fotoBanda").src = fotos.banda; }

// Seu carro: fichas dos mais vendidos e leitura da medida
const carros = E.veiculos.filter((v) => v.acum || v.out).sort((a, b) => (b.acum || b.out * 10) - (a.acum || a.out * 10));
function escolher(i) {
  const v = carros[i];
  document.querySelectorAll("#fichas button").forEach((b, j) => b.setAttribute("aria-pressed", j === i));
  $("leitura").innerHTML = v.medidas
    .map((medida) => {
      const m = porMedida[medida];
      return `<div><p class="medida">${medida}<small>${m.indice}</small></p><p>EVTOR ${E.linhas[m.linha].nome} para ${v.marca} ${v.modelo}</p></div>`;
    })
    .join("") + `<a class="botao" href="#reservar" data-carro="${v.marca} ${v.modelo}">Reservar para o meu ${v.modelo}</a>`;
}
$("fichas").innerHTML = carros.map((v, i) => `<button type="button" data-i="${i}">${v.marca} ${v.modelo}</button>`).join("");
$("fichas").addEventListener("click", (e) => e.target.dataset.i && escolher(+e.target.dataset.i));
escolher(carros.findIndex((v) => v.modelo === "Dolphin"));

// Galeria de usos
$("galeria").innerHTML = Object.entries(E.usos)
  .map(([id, u]) => `<figure><p class="km">${u.roda[0]}<small>km por dia</small></p><figcaption><b>${u.nome}</b>${u.titulo}. ${u.fato} <span>EVTOR ${E.linhas[u.linha].nome}</span></figcaption></figure>`)
  .join("");

// Comparar linhas
$("comparar").innerHTML = Object.entries(E.linhas)
  .map(([id, l]) => {
    const n = E.medidas.filter((m) => m.linha === id).length;
    return `<article>
      ${fotos[id] ? `<img src="${fotos[id]}" alt="Pneu EVTOR ${l.nome}">` : ""}
      <h3>${l.nome}</h3>
      <p class="uso">${l.uso}</p>
      <dl>
        <div><dt>${l.meta.ruido} dB</dt><dd>ruído externo</dd></div>
        <div><dt>${l.meta.rolamento}</dt><dd>rolamento</dd></div>
        <div><dt>${l.meta.molhado}</dt><dd>aderência no molhado</dd></div>
        <div><dt>${n}</dt><dd>medidas</dd></div>
      </dl>
      <a class="link" href="catalogo.html#linha-${id}">Ver medidas</a>
    </article>`;
  })
  .join("");

// Reserva: abre o e-mail já preenchido com o carro
const rCarro = $("rCarro");
rCarro.innerHTML = E.veiculos.map((v) => `<option>${v.marca} ${v.modelo}</option>`).join("");
document.addEventListener("click", (e) => {
  const c = e.target.dataset?.carro;
  if (c) rCarro.value = c;
});
$("reserva").addEventListener("submit", (e) => {
  e.preventDefault();
  const v = E.veiculos[rCarro.selectedIndex];
  const corpo = `Quero reservar pneus EVTOR.\n\nCarro: ${v.marca} ${v.modelo}\nMedida: ${v.medidas.join(" ou ")}\nCidade: `;
  location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(`Reserva EVTOR — ${v.marca} ${v.modelo}`)}&body=${encodeURIComponent(corpo)}`;
});

// Entrada suave das seções
if (!calmo) {
  const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && (e.target.classList.add("visivel"), io.unobserve(e.target))), { threshold: 0.15 });
  document.querySelectorAll(".titulo, .manifesto p, .bento article, .comparar article, .galeria figure, .reservar > *").forEach((el) => (el.classList.add("revela"), io.observe(el)));
}
