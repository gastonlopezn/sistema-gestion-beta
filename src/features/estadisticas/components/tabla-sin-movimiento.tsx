import Link from "next/link";

import { formatearFechaHora, formatearPesos } from "@/lib/formato";

import type { sinMovimiento } from "../queries";

type Fila = Awaited<ReturnType<typeof sinMovimiento>>[number];

export function TablaSinMovimiento({
  productos,
  dias,
}: {
  productos: Fila[];
  dias: number;
}) {
  const total = productos.reduce((suma, p) => suma + p.inmovilizado, 0);

  return (
    <section className="bg-white shadow-sm">
      <div className="p-5">
        <h2 className="font-medium">Artículos sin movimiento</h2>
        <p className="text-muted-foreground text-xs">
          Con stock y sin ventas en los últimos {dias} días, ordenados por plata
          inmovilizada (costo × stock).
          {productos.length > 0 &&
            ` Estos ${productos.length} suman ${formatearPesos(total)}.`}
        </p>
      </div>
      {productos.length === 0 ? (
        <p className="text-muted-foreground p-8 pt-0 text-center text-sm">
          Todos los productos con stock se vendieron en el período.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-muted-foreground border-y bg-neutral-50 text-left text-xs uppercase">
              <tr>
                <th className="px-5 py-2">Producto</th>
                <th className="px-4 py-2 text-right">Stock</th>
                <th className="px-4 py-2 text-right">Inmovilizado</th>
                <th className="hidden px-5 py-2 sm:table-cell">Última venta</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {productos.map((p) => (
                <tr key={p.id}>
                  <td className="px-5 py-2">
                    <Link
                      href={`/panel/stock/${p.id}`}
                      className="hover:underline"
                    >
                      {p.descripcion}
                    </Link>
                    <span className="text-muted-foreground ml-2 font-mono text-xs">
                      {p.codigo}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right tabular-nums">
                    {p.stock}
                  </td>
                  <td className="px-4 py-2 text-right tabular-nums">
                    {formatearPesos(p.inmovilizado)}
                  </td>
                  <td className="text-muted-foreground hidden px-5 py-2 sm:table-cell">
                    {p.ultimaVenta
                      ? formatearFechaHora(p.ultimaVenta)
                      : "Nunca"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
