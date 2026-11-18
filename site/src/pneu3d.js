// Pneu EVTOR em 3D. Fonte de site/pneu3d.js (gerado com esbuild, ver README).
import * as THREE from "three";

const TAU = Math.PI * 2;
const R = 1, W = 0.5; // raio externo e largura da banda
const TOM = { luz: 0x2fe0d0, pinca: 0x0fa397 }; // destaque do site de produto; o pitch passa o limão
const css = (hex) => "#" + hex.toString(16).padStart(6, "0");

// ---------- Texturas desenhadas em canvas ----------

function tela(w, h, desenhar) {
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  desenhar(c.getContext("2d"), w, h);
  return c;
}

// Mapa de altura da banda: branco = topo do bloco, preto = fundo do sulco.
// x corre ao redor do pneu (ladrilho repetido), y atravessa a largura.
const bandas = {
  volt(g, w, h) {
    sulcos(g, w, h, [0.33, 0.5, 0.67], 26);
    lamelas(g, w, h, [0, 0.33, 0.5, 0.67, 1], 5, 0.35);
  },
  arco(g, w, h) {
    sulcos(g, w, h, [0.28, 0.48, 0.72], 22);
    lamelas(g, w, h, [0, 0.28, 0.48, 0.72, 1], 5, -0.6);
  },
  tera(g, w, h) {
    sulcos(g, w, h, [0.24, 0.41, 0.59, 0.76], 26);
    lamelas(g, w, h, [0, 0.24, 0.41, 0.59, 0.76, 1], 9, 0.12);
  },
  trilha(g, w, h) {
    g.strokeStyle = "#000"; g.lineWidth = 34; g.lineJoin = "miter";
    for (const y of [0.3, 0.5, 0.7]) {
      g.beginPath();
      for (let i = -1; i <= 4; i++) g.lineTo((i * w) / 4 + w / 8, y * h + (i % 2 ? 34 : -34));
      g.stroke();
    }
    g.lineWidth = 26;
    for (const x of [0.25, 0.75]) for (const dx of [-w, 0, w]) {
      g.beginPath(); g.moveTo(x * w + dx - 20, 0); g.lineTo(x * w + dx + 20, h); g.stroke();
    }
  },
};
function sulcos(g, w, h, ys, largura) {
  g.fillStyle = "#000";
  for (const y of ys) g.fillRect(0, y * h - largura / 2, w, largura);
}
function lamelas(g, w, h, faixas, espessura, inclinacao) {
  g.strokeStyle = "#000"; g.lineWidth = espessura; g.lineCap = "butt";
  for (let f = 0; f < faixas.length - 1; f++) {
    const y0 = faixas[f] * h + 18, y1 = faixas[f + 1] * h - 18, d = (y1 - y0) * inclinacao;
    for (const x of [0.25, 0.75]) for (const dx of [-w, 0, w]) {
      const cx = x * w + dx + (f % 2 ? w / 4 : 0);
      g.beginPath(); g.moveTo(cx - d / 2, y0); g.lineTo(cx + d / 2, y1); g.stroke();
    }
  }
}
function texBanda(nome) {
  const c = tela(256, 512, (g, w, h) => {
    g.fillStyle = "#fff"; g.fillRect(0, 0, w, h);
    g.filter = "blur(1.5px)"; // paredes do sulco levemente inclinadas
    bandas[nome](g, w, h);
  });
  const t = new THREE.CanvasTexture(c);
  t.wrapS = THREE.RepeatWrapping; t.repeat.set(34, 1); t.anisotropy = 8;
  return t;
}

// Logotipo EVTOR em traços (mesma geometria de logo/evtor-wordmark.svg, 470 x 100)
// sx compensa o estiramento horizontal do flanco desenrolado
function logo(g, x, y, altura, cor, faisca, sx = 0.6) {
  const s = altura / 100;
  g.save(); g.translate(x - 235 * s * sx, y - 50 * s); g.scale(s * sx, s);
  g.strokeStyle = cor; g.lineWidth = 11; g.lineCap = "butt"; g.lineJoin = "miter";
  g.beginPath(); g.rect(0, 0, 470, 100); g.clip();
  for (const d of ["M70 5.5H5.5V94.5H70M5.5 50H56", "M92 -10L130 92L168 -10", "M190 5.5H266M228 0V100", "M400.5 100V5.5H436a24.5 24.5 0 0 1 0 49H400.5M432 54L466 108"]) g.stroke(new Path2D(d));
  g.beginPath(); g.arc(326, 50, 44.5, -0.52 + 0.27, -0.52 + TAU - 0.26); g.stroke();
  g.strokeStyle = faisca; g.lineWidth = 7; g.stroke(new Path2D("M349 27L371 5"));
  g.restore();
}

// Flanco desenrolado: x = ângulo ao redor do pneu, y = do ombro (topo) ao talão (base)
function texFlanco(modo, medida, luz) {
  const cor = modo === "cor";
  const c = tela(4096, 512, (g, w, h) => {
    g.fillStyle = cor ? "#0d0e0e" : "#555"; g.fillRect(0, 0, w, h);
    // frisos concêntricos junto ao ombro e ao talão
    g.strokeStyle = cor ? "#060707" : "#2a2a2a"; g.lineWidth = 3;
    for (const y of [40, 52, 64, 76, 88, 100, 410, 422, 434]) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
    const claro = cor ? "#e8eeec" : "#fff";
    for (const x of [w * 0.25, w * 0.75]) logo(g, x, 266, 112, claro, cor ? css(luz) : "#fff");
    g.fillStyle = cor ? "#4a504f" : "#bbb"; g.textAlign = "center"; g.textBaseline = "middle";
    g.font = "600 44px -apple-system, 'Helvetica Neue', Arial, sans-serif";
    if ("letterSpacing" in g) g.letterSpacing = "14px";
    for (const [txt, x] of [["TORQUE EM SILÊNCIO", w * 0.5], [medida, 0], [medida, w]]) {
      g.save(); g.translate(x, 266); g.scale(0.6, 1); g.fillText(txt, 0, 0); g.restore();
    }
    if (cor) { g.fillStyle = css(luz); g.fillRect(0, 168, w, 3); }
  });
  const t = new THREE.CanvasTexture(c);
  t.wrapS = THREE.RepeatWrapping; t.flipY = false; t.anisotropy = 8;
  if (cor) t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// ---------- Geometria ----------

// Troca o desenho da banda e o texto do flanco sem remontar a roda
function vestir(roda, nomeBanda, medida, tom) {
  const { banda, flancos } = roda.userData;
  if (banda.userData.nome !== nomeBanda) {
    banda.material.map?.dispose();
    const tb = texBanda(nomeBanda);
    Object.assign(banda.material, { map: tb, displacementMap: tb, bumpMap: tb });
    banda.material.needsUpdate = true;
    banda.userData.nome = nomeBanda;
  }
  const cor = texFlanco("cor", medida, tom.luz), relevo = texFlanco("relevo", medida, tom.luz);
  flancos.forEach((m, i) => {
    m.material.map?.dispose(); m.material.bumpMap?.dispose();
    const mapa = cor.clone(), bump = relevo.clone();
    for (const t of [mapa, bump]) { t.repeat.x = i ? 1 : -1; t.needsUpdate = true; }
    Object.assign(m.material, { map: mapa, bumpMap: bump });
    m.material.needsUpdate = true;
  });
}

function montarRoda(nomeBanda, medida, tom = TOM, comAro = true) {
  const roda = new THREE.Group();

  // Banda de rodagem: cilindro com os sulcos deslocados de verdade
  const banda = new THREE.Mesh(
    new THREE.CylinderGeometry(R, R, W, 720, 96, true),
    new THREE.MeshStandardMaterial({ color: 0x161717, displacementScale: 0.05, displacementBias: -0.05, bumpScale: 4, roughness: 0.58 })
  );
  roda.add(banda);

  // Flancos: perfil torneado, com EVTOR em relevo
  const perfil = new THREE.SplineCurve([[1.0, 0.25], [0.995, 0.29], [0.975, 0.33], [0.94, 0.36], [0.88, 0.378], [0.82, 0.378], [0.77, 0.36], [0.74, 0.32], [0.722, 0.27]].map(([r, y]) => new THREE.Vector2(r, y))).getSpacedPoints(48);
  const flancos = [1, -1].map((lado) => new THREE.Mesh(
    new THREE.LatheGeometry(perfil.map((p) => new THREE.Vector2(p.x, p.y * lado)), 240),
    new THREE.MeshStandardMaterial({ bumpScale: 2.2, roughness: 0.5, side: THREE.DoubleSide })
  ));
  roda.add(...flancos);
  roda.userData = { banda, flancos };
  vestir(roda, nomeBanda, medida, tom);
  if (!comAro) return roda; // a vista em camadas mostra só o pneu

  // Roda de liga: face usinada clara, bolsos escuros, pinça na cor da marca
  const metal = new THREE.MeshStandardMaterial({ color: 0xd4d8da, metalness: 1, roughness: 0.16 });
  const escuro = new THREE.MeshStandardMaterial({ color: 0x08090a, metalness: 0.7, roughness: 0.5, side: THREE.DoubleSide });
  const face = new THREE.Shape(); face.absarc(0, 0, 0.7, 0, TAU);
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * TAU, m = 0.5, furo = new THREE.Path();
    furo.absarc(0, 0, 0.635, a - m, a + m, false);
    furo.absarc(0, 0, 0.2, a + m * 0.35, a - m * 0.35, true);
    furo.closePath();
    face.holes.push(furo);
  }
  const disco = new THREE.Mesh(new THREE.ExtrudeGeometry(face, { depth: 0.06, bevelEnabled: true, bevelSize: 0.014, bevelThickness: 0.014, bevelSegments: 4, curveSegments: 64 }), metal);
  disco.rotation.x = -Math.PI / 2; disco.position.y = 0.19;
  roda.add(disco);
  // aba polida do aro
  const aba = [[0.722, 0.27], [0.726, 0.292], [0.716, 0.3], [0.7, 0.285], [0.695, 0.2]].map(([r, y]) => new THREE.Vector2(r, y));
  roda.add(new THREE.Mesh(new THREE.LatheGeometry(aba, 160), metal));
  roda.add(new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.55, 96, 1, true), escuro));
  const fundo = new THREE.Mesh(new THREE.CircleGeometry(0.7, 64), escuro); fundo.rotation.x = -Math.PI / 2; fundo.position.y = -0.05;
  roda.add(fundo);
  const freio = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.52, 0.03, 96), new THREE.MeshStandardMaterial({ color: 0x8a8f91, metalness: 1, roughness: 0.35 })); freio.position.y = 0.08;
  roda.add(freio);
  const pinca = new THREE.Mesh(new THREE.CylinderGeometry(0.56, 0.56, 0.09, 48, 1, false, 0.5, 0.6), new THREE.MeshStandardMaterial({ color: tom.pinca, roughness: 0.4, metalness: 0.3 })); pinca.position.y = 0.09;
  roda.userData.pinca = pinca; // fica presa ao eixo: não gira com a roda
  const cubo = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 0.04, 64), metal); cubo.position.y = 0.26;
  roda.add(cubo);
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * TAU + 0.63, porca = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.03, 6), escuro);
    porca.position.set(Math.cos(a) * 0.15, 0.285, Math.sin(a) * 0.15); roda.add(porca);
  }
  const calota = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.03, 48), new THREE.MeshStandardMaterial({ color: 0x08090a, metalness: 0.8, roughness: 0.25 })); calota.position.y = 0.29;
  roda.add(calota);
  const anel = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.01, 12, 48, TAU * 0.9), new THREE.MeshStandardMaterial({ color: tom.luz, emissive: tom.luz, emissiveIntensity: 0.6 })); anel.rotation.x = Math.PI / 2; anel.position.y = 0.306;
  roda.add(anel);

  return roda;
}

// Estúdio: sala preta com painéis de luz, para reflexos limpos na borracha e no metal
function estudio(luz) {
  const sala = new THREE.Scene();
  sala.add(new THREE.Mesh(new THREE.BoxGeometry(30, 30, 30), new THREE.MeshBasicMaterial({ color: 0x020202, side: THREE.BackSide })));
  const painel = (w, h, cor, forca, pos) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(cor).multiplyScalar(forca), side: THREE.DoubleSide }));
    m.position.set(...pos); m.lookAt(0, 0, 0); sala.add(m);
  };
  painel(9, 4, 0xffffff, 9, [0, 9, 2]); // teto
  painel(3, 10, 0xffffff, 7, [9, 2, 6]); // lateral direita
  painel(1.2, 10, 0xffffff, 12, [-3, 1, 10]); // filete frontal
  painel(2, 9, luz, 5, [-9, 2, -5]); // contraluz na cor da marca
  painel(8, 2, 0xc6f432, 2, [2, -9, 3]); // rebatedor de baixo
  return sala;
}
let ambiente = null, donoAmbiente = null;

function montarCena(renderer, nomeBanda, medida, tom = TOM, comAro = true) {
  const cena = new THREE.Scene();
  if (donoAmbiente !== renderer) { ambiente = new THREE.PMREMGenerator(renderer).fromScene(estudio(tom.luz), 0.02).texture; donoAmbiente = renderer; }
  cena.environment = ambiente;

  const roda = montarRoda(nomeBanda, medida, tom, comAro);
  const eixo = new THREE.Group(); eixo.rotation.z = -Math.PI / 2; eixo.add(roda); if (comAro) eixo.add(roda.userData.pinca); // eixo deitado: a face olha para +X
  const pose = new THREE.Group(); pose.add(eixo);
  cena.add(pose);

  const chave = new THREE.DirectionalLight(0xffffff, 1.6); chave.position.set(3, 4, 5); cena.add(chave);
  const contorno = new THREE.DirectionalLight(tom.luz, 1.2); contorno.position.set(-4, 1.5, -3); cena.add(contorno);
  return { cena, roda, pose };
}

function novoRenderer(canvas) {
  const r = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  r.toneMapping = THREE.ACESFilmicToneMapping; r.toneMappingExposure = 1.25;
  return r;
}

// ---------- API ----------

// Quadros-chave do scroll: [progresso, giro da pose (rad), distância da câmera, deslocamento lateral, descida do pneu]
const QUADROS = [
  [0, -0.95, 5.4, 0, 0.95],
  [0.3, -0.75, 4.3, 0.9, 0],
  [0.6, -Math.PI / 2, 4.0, 0.9, 0],
  [1, -0.06, 2.5, 0.75, 0],
];
const suave = (t) => t * t * (3 - 2 * t);
function quadro(p) {
  let i = 0;
  while (i < QUADROS.length - 2 && p > QUADROS[i + 1][0]) i++;
  const a = QUADROS[i], b = QUADROS[i + 1], t = suave(Math.min(Math.max((p - a[0]) / (b[0] - a[0]), 0), 1));
  return a.map((v, k) => v + (b[k] - v) * t);
}

const fora = (canvas) => { const r = canvas.getBoundingClientRect(); return r.bottom < 0 || r.top > innerHeight; };

// pose: [giro, distância, deslocamento lateral, descida] fixa, no lugar dos quadros do scroll
export function montar(canvas, { medida = "195/60 R16 89H", parado = false, tom = TOM, pose: fixa = null } = {}) {
  const renderer = novoRenderer(canvas);
  const { cena, roda, pose } = montarCena(renderer, "volt", medida, tom);
  const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 50);
  let p = 0, arrasto = 0, alvoArrasto = 0, giro = 0, estreito = false;

  function medir() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
    estreito = w / h < 0.9;
  }
  function desenhar() {
    const [, yaw, dist, lado, desce] = fixa ? [0, ...fixa] : quadro(p);
    arrasto += (alvoArrasto - arrasto) * 0.08;
    pose.rotation.y = yaw + arrasto;
    roda.rotation.y = giro + p * 2.2;
    camera.position.set(0, 0.12, dist * (estreito ? 1.55 : 1));
    camera.lookAt(estreito ? 0 : -lado, estreito ? desce * 1.5 - 0.45 : desce, 0); // no celular o texto fica embaixo, o pneu sobe
    renderer.render(cena, camera);
  }
  function laco() {
    requestAnimationFrame(laco);
    if (fora(canvas)) return; // fora da janela não gasta GPU
    if (!parado) giro += 0.0016;
    alvoArrasto *= 0.985; // volta devagar para a pose do scroll
    desenhar();
  }

  let x0 = null;
  canvas.addEventListener("pointerdown", (e) => { x0 = e.clientX; canvas.setPointerCapture(e.pointerId); });
  canvas.addEventListener("pointermove", (e) => { if (x0 !== null) { alvoArrasto += (e.clientX - x0) * 0.006; x0 = e.clientX; } });
  canvas.addEventListener("pointerup", () => (x0 = null));
  addEventListener("resize", medir);
  medir();
  if (parado) desenhar(); else laco();

  return {
    progresso(v) { p = v; if (parado) desenhar(); },
    vestir(linha, texto) { vestir(roda, linha, texto, tom); if (parado) desenhar(); },
  };
}

// ---------- Vista em camadas: o pneu se abre ao longo do eixo ----------

function texFios() { // lonas da carcaça: fios atravessando a largura
  const t = new THREE.CanvasTexture(tela(32, 32, (g) => { g.fillStyle = "#777"; g.fillRect(0, 0, 32, 32); g.fillStyle = "#fff"; g.fillRect(10, 0, 12, 32); }));
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(260, 1);
  return t;
}
function texEspuma() {
  const t = new THREE.CanvasTexture(tela(256, 256, (g) => {
    g.fillStyle = "#888"; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 2600; i++) { g.fillStyle = i % 2 ? "#333" : "#ddd"; g.beginPath(); g.arc(Math.random() * 256, Math.random() * 256, 1 + Math.random() * 2.4, 0, TAU); g.fill(); }
  }));
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(24, 2);
  return t;
}

// Devolve { passo(i), abrir(sim) }. Ordem das camadas: Garra, Giro, Fibra, Calma (como no pitch).
export function camadas(canvas, { tom = TOM, medida = "175/55 R16 80H" } = {}) {
  const renderer = novoRenderer(canvas);
  const { cena, roda, pose } = montarCena(renderer, "volt", medida, tom, false);
  const { banda, flancos } = roda.userData;
  const anel = (raio, largura, mat) => new THREE.Mesh(new THREE.CylinderGeometry(raio, raio, largura, 240, 1, true), new THREE.MeshStandardMaterial({ side: THREE.DoubleSide, ...mat }));
  const fios = texFios(), espuma = texEspuma();
  const giro = anel(0.955, W * 0.96, { color: 0x0c0d0d, roughness: 0.22 });
  const coroa = anel(0.925, W, { color: 0x4a463c, map: fios, bumpMap: fios, bumpScale: 3, roughness: 0.75 });
  const calma = anel(0.86, W * 0.7, { color: 0x5b5f5a, map: espuma, bumpMap: espuma, bumpScale: 6, roughness: 1 });
  roda.add(giro, coroa, calma);
  // cada camada: peças e quanto desliza no eixo quando o pneu abre (+ vem para a câmera)
  const partes = [
    { pecas: [banda], vai: 1.2 },
    { pecas: [giro], vai: 0.62 },
    { pecas: [coroa, ...flancos], vai: 0 },
    { pecas: [calma], vai: -0.75 },
  ];
  for (const c of partes) { c.brilho = 0; for (const m of c.pecas) { m.material.emissive = new THREE.Color(tom.luz); m.material.emissiveIntensity = 0; } }

  const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 50);
  let aberto = 0, alvoAberto = 0, ativo = -1, volta = 0, estreito = false;
  function medir() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
    estreito = w / h < 0.9;
  }
  function laco() {
    requestAnimationFrame(laco);
    if (fora(canvas)) return;
    aberto += (alvoAberto - aberto) * 0.07;
    volta += 0.0022;
    partes.forEach((c, i) => {
      c.brilho += ((i === ativo && alvoAberto ? 1 : 0) - c.brilho) * 0.1;
      for (const m of c.pecas) {
        m.position.y = c.vai * aberto;
        m.rotation.y = volta;
        m.material.emissiveIntensity = c.brilho * 0.07;
        m.material.envMapIntensity = 0.22 + c.brilho * 1.5 + (1 - aberto) * 0.8; // fechado: tudo aceso; aberto: só a camada da vez
      }
    });
    pose.rotation.y = -0.95 + aberto * 0.2;
    const dist = (5.4 + aberto * 2.4) * (estreito ? 1.5 : 1);
    camera.position.set(0, 0.5 * aberto, dist);
    // no computador o pneu fica à direita do texto; no celular, em cima
    camera.lookAt(estreito ? 0.16 * aberto : 0.16 * aberto - 0.165 * dist, estreito ? -0.2 * dist : 0, 0);
    renderer.render(cena, camera);
  }
  addEventListener("resize", medir);
  medir(); laco();
  return { passo(i) { ativo = i; }, abrir(sim) { alvoAberto = sim ? 1 : 0; } };
}

// Retratos das quatro linhas, para a comparação: devolve { volt: dataURL, ... }
export function retratos(lado = 720) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = lado;
  const renderer = novoRenderer(canvas);
  renderer.setSize(lado, lado, false);
  const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 50);
  camera.position.set(0, 0.1, 4.7); camera.lookAt(0, 0, 0);
  const saida = {};
  for (const nome of Object.keys(bandas)) {
    const { cena, pose } = montarCena(renderer, nome, nome.toUpperCase());
    pose.rotation.y = -0.62;
    renderer.render(cena, camera);
    saida[nome] = canvas.toDataURL("image/png");
  }
  // Detalhes do Volt: banda de frente e logotipo no flanco
  const { cena, pose } = montarCena(renderer, "volt", "195/60 R16 89H");
  pose.rotation.y = -0.06; camera.position.set(0, 0.1, 2.3); camera.lookAt(0, 0.1, 0);
  renderer.render(cena, camera); saida.banda = canvas.toDataURL("image/png");
  pose.rotation.y = -1.2; camera.position.set(0, 0.86, 1.9); camera.lookAt(0, 0.86, 0);
  renderer.render(cena, camera); saida.flanco = canvas.toDataURL("image/png");
  renderer.dispose();
  return saida;
}
