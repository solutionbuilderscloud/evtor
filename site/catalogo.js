const E = EVTOR; // global declarado em data/evtor.js
const $ = (id) => document.getElementById(id);
const porMedida = Object.fromEntries(E.medidas.map((m) => [m.medida, m]));
const num = (n) => n.toLocaleString("pt-BR");
const ehBEV = (v) => v.tipo === "BEV";
const tipos = { BEV: "Elétrico", HEV: "Híbrido", PHEV: "Híbrido plug-in", "HEV/PHEV": "Híbrido e plug-in" };

// Seletor de carro
const sel = $("carro");
const grupo = (rotulo, lista) =>
  `<optgroup label="${rotulo}">${lista.map((v) => `<option value="${E.veiculos.indexOf(v)}">${v.marca} ${v.modelo}</option>`).join("")}</optgroup>`;
sel.innerHTML = grupo("Elétricos", E.veiculos.filter(ehBEV)) + grupo("Híbridos", E.veiculos.filter((v) => !ehBEV(v)));

function mostrar() {
  const v = E.veiculos[sel.value];
  const itens = v.medidas.map((medida) => {
    const m = porMedida[medida];
    return `<li><span class="medida">${medida} <small>${m.indice}</small></span><a href="#linha-${m.linha}">EVTOR ${E.linhas[m.linha].nome}</a></li>`;
  });
  $("resultado").innerHTML =
    `<ul>${itens.join("")}</ul>` +
    (v.nota ? `<p>${v.nota[0].toUpperCase() + v.nota.slice(1)}.</p>` : "") +
    (v.conf === "rev" ? `<p>Confira a medida na etiqueta da coluna da porta antes de comprar.</p>` : "");
}
sel.addEventListener("change", mostrar);
mostrar();

// Uso real: abas de perfil e calculadora de rodagem
const rKm = $("rKm"), rDias = $("rDias"), rVida = $("rVida");
function rodagem() {
  const ano = rKm.value * rDias.value * 52;
  const meses = (rVida.value / ano) * 12;
  $("oKm").textContent = `${rKm.value} km`;
  $("oDias").textContent = rDias.value;
  $("oVida").textContent = `${num(+rVida.value)} km`;
  $("sAno").textContent = num(ano);
  $("sMeses").textContent = meses >= 24 ? `${(meses / 12).toFixed(1).replace(".", ",")} anos` : `${Math.round(meses)} meses`;
  $("sPneus").textContent = ((ano / rVida.value) * 4).toFixed(1).replace(".", ",");
}
[rKm, rDias, rVida].forEach((r) => r.addEventListener("input", rodagem));

function uso(id) {
  const u = E.usos[id], l = E.linhas[u.linha];
  document.querySelectorAll("#usoAbas button").forEach((b) => b.setAttribute("aria-selected", b.dataset.uso === id));
  const carros = u.veiculos.map((m) => E.veiculos.find((v) => v.modelo === m));
  $("usoPainel").innerHTML = `
    <figure><img src="img/uso-${id}.jpg" alt="${u.nome}: imagem ilustrativa"><figcaption>${u.titulo}</figcaption></figure>
    <div class="uso-texto">
      <p class="fato">${u.fato}</p>
      <ul class="exige">${u.exige.map((x) => `<li>${x}</li>`).join("")}</ul>
      <table><tbody>${carros.map((v) => `<tr><th scope="row">${v.marca} ${v.modelo}</th><td class="medida">${v.medidas.join(" · ")}</td></tr>`).join("")}</tbody></table>
      <a class="botao" href="#linha-${u.linha}">Ver EVTOR ${l.nome}</a>
    </div>`;
  [rKm.value, rDias.value] = u.roda;
  rodagem();
}
$("usoAbas").innerHTML = Object.entries(E.usos)
  .map(([id, u]) => `<button type="button" role="tab" data-uso="${id}">${u.nome}</button>`)
  .join("");
$("usoAbas").addEventListener("click", (e) => e.target.dataset.uso && uso(e.target.dataset.uso));
uso("app");

// Tecnologias, ordenadas de fora para dentro do pneu
$("tecnologias").innerHTML = Object.values(E.tecnologias)
  .sort((a, b) => a.camada - b.camada)
  .map((t) => `<li data-camada="${t.camada}"><p class="olho">${t.parte}</p><h3>${t.nome}</h3><p>${t.texto}</p></li>`)
  .join("");

// Esteira de medidas
$("esteira").innerHTML = [...E.medidas, ...E.medidas].map((m) => `<span>${m.medida} <i>${m.indice}</i></span>`).join("");

// Cartões de linha
$("cartoes").innerHTML = Object.entries(E.linhas)
  .map(([id, l]) => {
    const medidas = E.medidas.filter((m) => m.linha === id);
    return `<article id="linha-${id}" class="cartao">
      <img src="img/${id}.jpg" alt="Pneu EVTOR ${l.nome}" loading="lazy" width="1100" height="1375">
      <div class="cartao-texto">
        <p class="olho">${l.uso}</p>
        <h3>${l.nome}</h3>
        <p class="resumo">${l.resumo}</p>
        <dl class="etiqueta">
          <div><dt>Rolamento</dt><dd>${l.meta.rolamento}</dd></div>
          <div><dt>Molhado</dt><dd>${l.meta.molhado}</dd></div>
          <div><dt>Ruído</dt><dd>${l.meta.ruido}<small> dB</small></dd></div>
        </dl>
        <p class="tecs">${l.tecnologias.map((t) => E.tecnologias[t].nome).join(" · ")}</p>
        <ul class="chips">${medidas.map((m) => `<li>${m.medida}</li>`).join("")}</ul>
      </div>
    </article>`;
  })
  .join("");

// Tabela de veículos
function tabela(filtro) {
  const lista = E.veiculos.filter((v) => filtro === "todos" || (filtro === "BEV") === ehBEV(v));
  $("tabela").innerHTML = lista
    .map((v) => {
      const vendas = v.acum ? `${num(v.acum)} <small>jan–out</small>` : v.out ? `${num(v.out)} <small>out</small>` : "—";
      const linhas = [...new Set(v.medidas.map((m) => porMedida[m].linha))];
      return `<tr>
        <th scope="row">${v.marca} ${v.modelo}</th>
        <td>${tipos[v.tipo]}</td>
        <td class="num">${vendas}</td>
        <td class="medida">${v.medidas.join("<br>")}${v.conf === "rev" ? " *" : ""}</td>
        <td>${linhas.map((l) => `<a href="#linha-${l}">${E.linhas[l].nome}</a>`).join(", ")}</td>
      </tr>`;
    })
    .join("");
}
document.querySelectorAll(".filtros button").forEach((b) =>
  b.addEventListener("click", () => {
    document.querySelectorAll(".filtros button").forEach((o) => o.setAttribute("aria-pressed", o === b));
    tabela(b.dataset.filtro);
  })
);
tabela("todos");

// Movimento: revelar ao rolar, camada ativa da anatomia, contadores
const semMovimento = matchMedia("(prefers-reduced-motion: reduce)").matches;
const ver = (els, fn, opts) => {
  const io = new IntersectionObserver((es) => es.forEach((e) => fn(e, io)), opts);
  els.forEach((el) => io.observe(el));
};

const foto = document.querySelector(".anatomia-foto");
ver(document.querySelectorAll(".camadas li"), (e) => {
  if (!e.isIntersecting) return;
  document.querySelectorAll(".camadas li").forEach((li) => li.classList.toggle("ativa", li === e.target));
  foto.dataset.camada = $("passo").textContent = e.target.dataset.camada;
}, { rootMargin: "-45% 0px -45% 0px" });

if (!semMovimento) {
  const alvos = document.querySelectorAll(".bloco > *:not(.usos), .conta article, .cartao, .caminho li, .codigo li, .estrada > div");
  alvos.forEach((el) => el.classList.add("revela"));
  ver(alvos, (e, io) => { if (e.isIntersecting) { e.target.classList.add("visivel"); io.unobserve(e.target); } }, { threshold: 0.12 });

  ver(document.querySelectorAll("[data-conta]"), (e, io) => {
    if (!e.isIntersecting) return;
    io.unobserve(e.target);
    const fim = +e.target.dataset.conta, t0 = performance.now();
    const passo = (t) => {
      const p = Math.min((t - t0) / 1200, 1);
      e.target.textContent = Math.round(fim * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(passo);
    };
    requestAnimationFrame(passo);
  }, { threshold: 0.6 });
}
