// Verifica a consistência dos dados: node data/check.js
const assert = require("assert");
const E = require("./evtor.js");

const porMedida = new Map(E.medidas.map((m) => [m.medida, m]));
assert.strictEqual(porMedida.size, E.medidas.length, "medida duplicada no portfólio");

for (const m of E.medidas) {
  assert.match(m.medida, /^\d{3}\/\d{2} R\d{2}$/, `formato inválido: ${m.medida}`);
  assert.match(m.indice, /^\d{2,3}[A-Z]( XL)?$/, `índice inválido: ${m.indice}`);
  assert.ok(E.linhas[m.linha], `linha inexistente: ${m.linha}`);
}
for (const [id, l] of Object.entries(E.linhas)) {
  assert.ok(E.medidas.some((m) => m.linha === id), `linha sem medida: ${id}`);
  for (const t of l.tecnologias) assert.ok(E.tecnologias[t], `tecnologia inexistente: ${t}`);
}
for (const v of E.veiculos) {
  assert.ok(v.medidas.length, `veículo sem medida: ${v.modelo}`);
  for (const m of v.medidas) assert.ok(porMedida.has(m), `${v.modelo}: medida ${m} fora do portfólio`);
}
for (const [id, u] of Object.entries(E.usos)) {
  assert.ok(E.linhas[u.linha], `uso ${id}: linha inexistente`);
  for (const m of u.veiculos) assert.ok(E.veiculos.some((v) => v.modelo === m), `uso ${id}: veículo inexistente: ${m}`);
}
const usadas = new Set(E.veiculos.flatMap((v) => v.medidas));
for (const m of E.medidas) assert.ok(usadas.has(m.medida), `medida sem veículo: ${m.medida}`);

console.log(`ok: ${E.veiculos.length} veículos, ${E.medidas.length} medidas, ${Object.keys(E.linhas).length} linhas`);
