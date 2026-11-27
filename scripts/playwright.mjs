// Playwright no es dependencia del proyecto: se usa solo para generar la presentación.
// Si no está instalado: npm i -D playwright && npx playwright install chromium
import { createRequire } from "node:module";

export function cargarPlaywright() {
  try {
    return createRequire(import.meta.url)("playwright");
  } catch {
    console.error(
      "Falta Playwright. Instalalo con: npm i -D playwright && npx playwright install chromium",
    );
    process.exit(1);
  }
}
