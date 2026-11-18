// Plano B: captura cada parada do pitch e junta em um PDF. Também serve para revisar as telas.
// Uso: npm i --no-save puppeteer-core && node site/pdf.mjs [pasta de saída] [largura] [altura]
import puppeteer from "puppeteer-core";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const aqui = dirname(fileURLToPath(import.meta.url));
const saida = resolve(process.argv[2] || `${aqui}/pdf`), width = +process.argv[3] || 1600, height = +process.argv[4] || 900;
mkdirSync(saida, { recursive: true });
const chrome = await puppeteer.launch({
  executablePath: process.env.CHROME || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  args: ["--enable-unsafe-swiftshader", "--allow-file-access-from-files"],
});
const pagina = await chrome.newPage();
pagina.on("pageerror", (e) => console.error("erro na página:", e.message));
pagina.on("console", (m) => ["error", "warning"].includes(m.type()) && console.error(m.type(), m.text()));
await pagina.setViewport({ width, height });
await pagina.goto(`file://${aqui}/index.html`);
await pagina.evaluate(() => document.fonts.ready);
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
await espera(2600); // o símbolo da abertura se desenha
const fotos = [];
for (let i = 0, antes = -1; i < 60; i++) {
  const y = await pagina.evaluate(() => scrollY);
  if (y === antes) break; // a seta não andou: acabou
  antes = y;
  fotos.push(`${String(i + 1).padStart(2, "0")}.png`);
  await pagina.screenshot({ path: `${saida}/${fotos.at(-1)}` });
  await pagina.keyboard.press("ArrowDown"); // o mesmo caminho do passador de slides
  await espera(2400);
}
writeFileSync(`${saida}/paginas.html`, `<style>@page{size:${width}px ${height}px;margin:0}body{margin:0}img{display:block;width:${width}px;height:${height}px}</style>` + fotos.map((f) => `<img src="${f}">`).join(""));
await pagina.goto(`file://${saida}/paginas.html`);
await pagina.pdf({ path: `${saida}/evtor-pitch.pdf`, width, height, printBackground: true });
await chrome.close();
console.log(`${fotos.length} paradas: ${saida}/evtor-pitch.pdf`);
