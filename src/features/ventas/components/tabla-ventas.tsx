import Link from "next/link";

import { formatearFechaHora, formatearPesos } from "@/lib/formato";

import { nombresMedioDePago } from "../medios-de-pago";
import type { listarVentas } from "../queries";

type Fila = Awaited<ReturnType<typeof listarVentas>>["ventas"][number];

export function TablaVentas({ ventas }: { ventas: Fila[] }) {
  if (ventas.length === 0) {
    return (
      <p className="text-muted-foreground bg-white p-8 text-center text-sm shadow-sm">
        No hay ventas en el período elegido.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead className="text-muted-foreground border-b bg-neutral-50 text-left text-xs uppercase">
          <tr>
            <th className="px-4 py-3">N.º</th>
            <th className="px-4 py-3">Fecha</th>
            <th className="px-4 py-3">Cliente</th>
            <th className="hidden px-4 py-3 md:table-cell">Medio de pago</th>
            <th className="hidden px-4 py-3 text-right sm:table-cell">
              Unidades
            </th>
            <th className="px-4 py-3 text-right">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {ventas.map((v) => (
            <tr key={v.id} className="hover:bg-neutral-50">
              <td className="px-4 py-3 font-mono text-xs">
                <Link
                  href={`/panel/ventas/${v.id}`}
                  className="font-medium hover:underline"
                >
                  #{v.id}
                </Link>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                {formatearFechaHora(v.fecha)}
              </td>
              <td className="px-4 py-3">
                {v.cliente ?? (
                  <span className="text-muted-foreground">
                    Consumidor final
                  </span>
                )}
              </td>
              <td className="hidden px-4 py-3 md:table-cell">
                {nombresMedioDePago[v.medioPago]}
              </td>
              <td className="hidden px-4 py-3 text-right sm:table-cell">
                {v.unidades}
              </td>
              <td className="px-4 py-3 text-right font-medium">
                {formatearPesos(v.total)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
