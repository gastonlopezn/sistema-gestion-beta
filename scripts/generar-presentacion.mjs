// Genera docs/presentacion/presentacion-sm-repuestos.pdf a partir de presentacion.html.
// Uso: npm run docs:presentacion
import { readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { cargarPlaywright } from "./playwright.mjs";

const { chromium } = cargarPlaywright();
const CARPETA = path.resolve("docs/presentacion");
const SALIDA = path.join(CARPETA, "presentacion-sm-repuestos.pdf");

// La fecha de la portada se completa al generar, así siempre muestra la versión actual.
const fecha = new Intl.DateTimeFormat("es-AR", {
  month: "long",
  year: "numeric",
  timeZone: "America/Argentina/Cordoba",
}).format(new Date());
const html = readFileSync(
  path.join(CARPETA, "presentacion.html"),
  "utf8",
).replaceAll("{{FECHA}}", fecha.charAt(0).toUpperCase() + fecha.slice(1));
// Se escribe al lado del original para que funcionen las rutas relativas a fuentes e imágenes.
const temporal = path.join(CARPETA, ".presentacion-generada.html");
writeFileSync(temporal, html);

const navegador = await chromium.launch();
const pagina = await navegador.newPage();
await pagina.goto(pathToFileURL(temporal).href, { waitUntil: "networkidle" });
await pagina.evaluate(() => document.fonts.ready);
await pagina.pdf({
  path: SALIDA,
  preferCSSPageSize: true,
  printBackground: true,
});
await navegador.close();
rmSync(temporal);
console.log(`PDF generado: ${SALIDA}`);
