import Link from "next/link";

import { formatearDia } from "@/lib/fechas";
import { formatearFechaHora, formatearPesos } from "@/lib/formato";

import { estadoVisible } from "../estados";
import type { listarPresupuestos } from "../queries";
import { EstadoPresupuestoBadge } from "./estado-presupuesto";

type Resultado = Awaited<ReturnType<typeof listarPresupuestos>>;

export function TablaPresupuestos({
  presupuestos,
  hoy,
}: {
  presupuestos: Resultado["presupuestos"];
  hoy: string;
}) {
  if (presupuestos.length === 0) {
    return (
      <p className="text-muted-foreground bg-white p-8 text-center text-sm shadow-sm">
        No hay presupuestos con ese estado.
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
            <th className="hidden px-4 py-3 md:table-cell">Válido hasta</th>
            <th className="px-4 py-3">Estado</th>
            <th className="px-4 py-3 text-right">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {presupuestos.map((p) => (
            <tr key={p.id} className="hover:bg-neutral-50">
              <td className="px-4 py-3 font-mono text-xs">
                <Link
                  href={`/panel/presupuestos/${p.id}`}
                  className="font-medium hover:underline"
                >
                  #{p.id}
                </Link>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                {formatearFechaHora(p.fecha)}
              </td>
              <td className="px-4 py-3">
                {p.cliente ?? (
                  <span className="text-muted-foreground">
                    Consumidor final
                  </span>
                )}
              </td>
              <td className="hidden px-4 py-3 md:table-cell">
                {p.validoHasta ? formatearDia(p.validoHasta) : "-"}
              </td>
              <td className="px-4 py-3">
                <EstadoPresupuestoBadge
                  estado={estadoVisible(p.estado, p.validoHasta, hoy)}
                />
              </td>
              <td className="px-4 py-3 text-right font-medium">
                {formatearPesos(p.total)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
