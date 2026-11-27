import { formatearPesos } from "@/lib/formato";
import { cn } from "@/lib/utils";

import { calcularNuevoValor, type Campo, type Redondeo } from "../calculo";
import type { productosAfectados } from "../queries";

type Producto = Awaited<ReturnType<typeof productosAfectados>>[number];
type Columna = "costo" | "precio";

const FILAS_VISIBLES = 50;

export function VistaPrevia({
  productos,
  porcentaje,
  campo,
  redondeo,
}: {
  productos: Producto[];
  porcentaje: number;
  campo: Campo;
  redondeo: Redondeo;
}) {
  const columnas: Columna[] = campo === "ambos" ? ["costo", "precio"] : [campo];
  const nuevo = (p: Producto, col: Columna) =>
    calcularNuevoValor(
      Number(p[col]),
      porcentaje,
      col === "precio" ? redondeo : 0,
    );

  return (
    <div className="overflow-x-auto bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead className="text-muted-foreground border-b bg-neutral-50 text-left text-xs uppercase">
          <tr>
            <th className="px-4 py-3">Producto</th>
            {columnas.map((col) => (
              <th key={col} colSpan={2} className="px-4 py-3 text-right">
                {col === "precio"
                  ? "Precio: actual y nuevo"
                  : "Costo: actual y nuevo"}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y">
          {productos.slice(0, FILAS_VISIBLES).map((p) => (
            <tr key={p.id}>
              <td className="px-4 py-2">
                {p.descripcion}
                <span className="text-muted-foreground ml-2 font-mono text-xs">
                  {p.codigo}
                </span>
              </td>
              {columnas.map((col) => (
                <Celdas
                  key={col}
                  actual={Number(p[col])}
                  nuevo={nuevo(p, col)}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {productos.length > FILAS_VISIBLES && (
        <p className="text-muted-foreground border-t p-3 text-center text-xs">
          Se muestran {FILAS_VISIBLES} de {productos.length} productos. El
          cambio se aplica a todos.
        </p>
      )}
    </div>
  );
}

function Celdas({ actual, nuevo }: { actual: number; nuevo: number }) {
  return (
    <>
      <td className="text-muted-foreground px-4 py-2 text-right tabular-nums">
        {formatearPesos(actual)}
      </td>
      <td
        className={cn(
          "px-4 py-2 text-right font-medium tabular-nums",
          nuevo < actual && "text-red-700",
        )}
      >
        {formatearPesos(nuevo)}
      </td>
    </>
  );
}
