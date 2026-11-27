# Presentación para el cliente

PDF para mostrarle el proyecto a SM Repuestos en las reuniones. Tiene la misma estética que la landing
(logo, azul y rojo, títulos en Barlow Condensed y franjas diagonales). Está escrito para el dueño del
negocio, no para programadores.

- `presentacion.html` y `estilos.css`: el contenido y el diseño. Cada página es un `<section class="pagina">` en A4 horizontal.
- `capturas/`: pantallas de la app con los datos de prueba.
- `fuentes/`: Barlow Condensed y Geist (licencia SIL Open Font License), para que el PDF salga igual en cualquier máquina.
- `presentacion-sm-repuestos.pdf`: el resultado, listo para compartir.

## Cómo actualizarla

Cada vez que se suma o cambia algo que el cliente vaya a ver:

1. Editar el texto en `presentacion.html` (por ejemplo, agregar una página de módulo copiando una existente).
2. Si cambió alguna pantalla, regenerar las capturas con la app corriendo y los datos de prueba:

   ```bash
   npm run db:seed
   npm run build && npm start   # o npm run dev, en otra terminal
   npm run docs:capturas
   ```

   Para agregar una pantalla nueva, sumarla en `scripts/capturas-presentacion.mjs`.

3. Generar el PDF: `npm run docs:presentacion`. La fecha de la portada se completa sola.

Los dos scripts usan Playwright, que no es dependencia del proyecto. Si no está instalado:
`npm i -D playwright && npx playwright install chromium`. La captura del PDF de presupuesto usa además
`pdftoppm` (paquete poppler-utils); si no está, se mantiene la captura anterior.
