import Link from "next/link";

import { formatearPesos } from "@/lib/formato";

import type { listarProductos } from "../queries";
import { EstadoStock } from "./estado-stock";

type Fila = Awaited<ReturnType<typeof listarProductos>>["productos"][number];

export function TablaProductos({ productos }: { productos: Fila[] }) {
  if (productos.length === 0) {
    return (
      <p className="text-muted-foreground bg-white p-8 text-center text-sm shadow-sm">
        No hay productos que coincidan con la búsqueda.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead className="text-muted-foreground border-b bg-neutral-50 text-left text-xs uppercase">
          <tr>
            <th className="px-4 py-3">Código</th>
            <th className="px-4 py-3">Producto</th>
            <th className="hidden px-4 py-3 lg:table-cell">Compatibilidad</th>
            <th className="px-4 py-3 text-right">Precio</th>
            <th className="px-4 py-3 text-right">Stock</th>
            <th className="px-4 py-3">Estado</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {productos.map((p) => (
            <tr key={p.id} className="hover:bg-neutral-50">
              <td className="px-4 py-3 font-mono text-xs whitespace-nowrap">
                {p.codigo}
              </td>
              <td className="px-4 py-3">
                <Link
                  href={`/panel/stock/${p.id}`}
                  className="hover:text-marca-rojo font-medium hover:underline"
                >
                  {p.descripcion}
                </Link>
                <p className="text-muted-foreground text-xs">{p.rubro}</p>
              </td>
              <td className="text-muted-foreground hidden px-4 py-3 lg:table-cell">
                {p.compatibilidad}
              </td>
              <td className="px-4 py-3 text-right whitespace-nowrap">
                {formatearPesos(p.precio)}
              </td>
              <td className="px-4 py-3 text-right">
                {p.stock}{" "}
                <span className="text-muted-foreground text-xs">
                  / mín. {p.stockMinimo}
                </span>
              </td>
              <td className="px-4 py-3">
                <EstadoStock stock={p.stock} stockMinimo={p.stockMinimo} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
