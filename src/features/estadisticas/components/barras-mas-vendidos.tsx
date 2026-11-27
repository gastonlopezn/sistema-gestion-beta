import Link from "next/link";

import { formatearPesos } from "@/lib/formato";

import type { masVendidos } from "../queries";
import { COLOR_SERIE } from "./colores";

type Fila = Awaited<ReturnType<typeof masVendidos>>[number];

// Barras horizontales: el nombre a la izquierda, las unidades en la punta de la barra.
export function BarrasMasVendidos({
  productos,
  dias,
}: {
  productos: Fila[];
  dias: number;
}) {
  const maximo = Math.max(1, ...productos.map((p) => p.unidades));

  return (
    <section className="bg-white p-5 shadow-sm">
      <h2 className="font-medium">Productos más vendidos</h2>
      <p className="text-muted-foreground mb-4 text-xs">
        Unidades vendidas en los últimos {dias} días
      </p>
      {productos.length === 0 ? (
        <p className="text-muted-foreground py-8 text-center text-sm">
          No hubo ventas en el período.
        </p>
      ) : (
        <ol className="flex flex-col gap-2">
          {productos.map((p) => (
            <li
              key={p.id}
              className="group relative grid grid-cols-[minmax(0,12rem)_1fr] items-center gap-3 text-sm"
            >
              <Link
                href={`/panel/stock/${p.id}`}
                className="truncate hover:underline"
                title={p.descripcion}
              >
                {p.descripcion}
                <span className="text-muted-foreground ml-1 font-mono text-xs">
                  {p.codigo}
                </span>
              </Link>
              <div className="flex items-center gap-2">
                <div
                  className="h-4 rounded-r transition-opacity group-hover:opacity-80"
                  style={{
                    width: `${(p.unidades / maximo) * 85}%`,
                    backgroundColor: COLOR_SERIE,
                  }}
                />
                <span className="text-xs font-medium tabular-nums">
                  {p.unidades} u.
                </span>
              </div>
              <span
                role="tooltip"
                className="pointer-events-none absolute right-0 bottom-full z-10 hidden rounded-md bg-neutral-900 px-2 py-1 text-xs whitespace-nowrap text-white shadow group-focus-within:block group-hover:block"
              >
                {p.unidades} unidades · {formatearPesos(p.facturado)} facturados
              </span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
