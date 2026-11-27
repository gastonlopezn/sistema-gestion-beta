import { formatearPesos, formatearPesosCompacto } from "@/lib/formato";

import { COLOR_SERIE } from "./colores";
import { escalaRedonda } from "./escala";

type Mes = { mes: string; facturado: number };

const nombreMes = (clave: string, largo = false) =>
  new Intl.DateTimeFormat("es-AR", {
    month: largo ? "long" : "short",
    year: largo ? "numeric" : undefined,
    timeZone: "UTC",
  }).format(new Date(`${clave}-01T12:00:00Z`));

const ALTO = 220;

// Columnas en HTML: una sola serie, sin leyenda (el título dice qué es).
// Cada columna es enfocable y muestra el valor exacto al pasar el mouse o con el teclado.
export function GraficoFacturacion({ meses }: { meses: Mes[] }) {
  const { tope, valores } = escalaRedonda(
    Math.max(...meses.map((m) => m.facturado)),
  );
  const ultimo = meses.length - 1;

  return (
    <section className="bg-white p-5 shadow-sm">
      <h2 className="font-medium">Facturación por mes</h2>
      <p className="text-muted-foreground mb-4 text-xs">
        Últimos {meses.length} meses. El último está en curso.
      </p>

      <div className="mt-8 flex gap-2">
        {/* Eje Y */}
        <div
          className="text-muted-foreground relative w-14 shrink-0 text-right text-xs tabular-nums"
          style={{ height: ALTO }}
        >
          {valores.map((v) => (
            <span
              key={v}
              className="absolute right-0 -translate-y-1/2"
              style={{ bottom: `${(v / tope) * 100}%` }}
            >
              {formatearPesosCompacto(v)}
            </span>
          ))}
        </div>

        <div className="flex-1">
          <div className="relative" style={{ height: ALTO }}>
            {valores.map((v) => (
              <div
                key={v}
                className="absolute inset-x-0 border-t border-neutral-200"
                style={{ bottom: `${(v / tope) * 100}%` }}
              />
            ))}
            <ul className="absolute inset-0 flex items-end">
              {meses.map((m, i) => {
                const alto = (m.facturado / tope) * 100;
                const etiqueta = `${nombreMes(m.mes, true)}${i === ultimo ? " (en curso)" : ""}: ${formatearPesos(m.facturado)}`;
                return (
                  <li
                    key={m.mes}
                    className="group relative flex h-full flex-1 items-end justify-center"
                  >
                    {/* El área enfocable ocupa toda la franja del mes, más grande que la columna. */}
                    <button
                      type="button"
                      aria-label={etiqueta}
                      className="focus-visible:ring-marca-azul/40 absolute inset-0 cursor-default rounded outline-none focus-visible:ring-2"
                    />
                    <div
                      className="pointer-events-none w-6 rounded-t transition-opacity group-hover:opacity-80"
                      style={{
                        height: `${alto}%`,
                        backgroundColor: COLOR_SERIE,
                        opacity: i === ultimo ? 0.55 : 1,
                      }}
                    />
                    {i === ultimo - 1 && (
                      <span
                        className="pointer-events-none absolute -translate-y-full pb-1 text-xs font-medium tabular-nums"
                        style={{ bottom: `${alto}%` }}
                      >
                        {formatearPesosCompacto(m.facturado)}
                      </span>
                    )}
                    <span
                      role="tooltip"
                      className="pointer-events-none absolute z-10 hidden -translate-y-full rounded-md bg-neutral-900 px-2 py-1 text-xs whitespace-nowrap text-white shadow group-focus-within:block group-hover:block"
                      style={{ bottom: `calc(${alto}% + 1.5rem)` }}
                    >
                      {etiqueta}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
          <ul className="text-muted-foreground mt-2 flex border-t border-neutral-300 pt-2 text-xs">
            {meses.map((m) => (
              <li key={m.mes} className="flex-1 text-center capitalize">
                {nombreMes(m.mes)}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <details className="mt-4 text-sm">
        <summary className="text-muted-foreground cursor-pointer">
          Ver como tabla
        </summary>
        <table className="mt-2 w-full max-w-sm">
          <tbody className="divide-y">
            {meses.map((m) => (
              <tr key={m.mes}>
                <td className="py-1 capitalize">{nombreMes(m.mes, true)}</td>
                <td className="py-1 text-right tabular-nums">
                  {formatearPesos(m.facturado)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </section>
  );
}
