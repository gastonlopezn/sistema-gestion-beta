// Saca las capturas de pantalla que usa docs/presentacion.
// Necesita la app corriendo (npm run dev o npm start) con los datos de prueba (npm run db:seed).
// Uso: npm run docs:capturas   (BASE_URL y DEMO_PASSWORD son opcionales)
import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import { cargarPlaywright } from "./playwright.mjs";

const { chromium, devices } = cargarPlaywright();
const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const CLAVE = process.env.DEMO_PASSWORD ?? "demo-sm-2026";
const DESTINO = path.resolve("docs/presentacion/capturas");
const archivo = (nombre) => path.join(DESTINO, nombre);

const navegador = await chromium.launch();

// Página web: computadora y celular, solo la parte de arriba.
const escritorio = await navegador.newPage({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
});
await escritorio.goto(BASE, { waitUntil: "networkidle" });
await escritorio.screenshot({ path: archivo("web-escritorio.png") });
const celular = await navegador.newPage({ ...devices["iPhone 13"] });
await celular.goto(BASE, { waitUntil: "networkidle" });
await celular.screenshot({ path: archivo("web-celular.png") });

// Sistema de gestión
const panel = await navegador.newPage({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
});
await panel.goto(`${BASE}/login`);
await panel.fill("#email", "demo@smrepuestos.com.ar");
await panel.fill("#password", CLAVE);
await panel.click("button[type=submit]");
await panel.waitForURL("**/panel");
await panel.screenshot({ path: archivo("panel-inicio.png") });

await panel.goto(`${BASE}/panel/stock`);
await panel.waitForSelector("tbody tr");
await panel.screenshot({ path: archivo("stock.png") });

// Vista previa de un aumento (no se aplica).
await panel.goto(
  `${BASE}/panel/stock/precios?rubro=Frenos&porcentaje=8&campo=precio&redondeo=100`,
);
await panel.waitForSelector("text=Vista previa");
await panel.screenshot({ path: archivo("precios.png") });

await panel.goto(`${BASE}/panel/ventas/nueva`);
const buscador = panel.getByLabel("Buscar producto");
for (const texto of ["aceite", "bujia", "pastilla"]) {
  await buscador.fill(texto);
  await panel.waitForSelector("ul.absolute button");
  await buscador.press("Enter");
}
await panel.selectOption("#clienteId", { index: 3 });
await panel.selectOption("#medioPago", "transferencia");
await panel.screenshot({ path: archivo("ventas.png") });

await panel.goto(`${BASE}/panel/presupuestos?estado=pendiente`);
await panel.locator("tbody tr a").first().click();
await panel.waitForURL(/presupuestos\/\d+$/);
await panel.waitForSelector("text=Convertir en venta");
await panel.screenshot({ path: archivo("presupuesto.png") });

// Primera página del PDF del presupuesto, si está pdftoppm (poppler-utils).
const pdf = await panel.request.get(`${panel.url()}/pdf`);
const carpeta = mkdtempSync(path.join(tmpdir(), "presupuesto-"));
writeFileSync(path.join(carpeta, "presupuesto.pdf"), await pdf.body());
try {
  execFileSync("pdftoppm", [
    "-png",
    "-r",
    "110",
    "-singlefile",
    "-f",
    "1",
    path.join(carpeta, "presupuesto.pdf"),
    archivo("presupuesto-pdf").replace(/\.png$/, ""),
  ]);
} catch {
  console.warn(
    "No se encontró pdftoppm: se mantiene la captura anterior del PDF.",
  );
}

await panel.goto(`${BASE}/panel/estadisticas`);
await panel.waitForSelector("text=Productos más vendidos");
await panel.screenshot({ path: archivo("estadisticas.png") });

await navegador.close();
console.log(`Capturas guardadas en ${DESTINO}`);
