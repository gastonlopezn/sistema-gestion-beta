import Link from "next/link";

import { cn } from "@/lib/utils";

import { nombresEstado, type EstadoPresupuesto } from "../estados";

const opciones: (EstadoPresupuesto | undefined)[] = [
  undefined,
  "pendiente",
  "aceptado",
  "rechazado",
  "vencido",
];

export function FiltroEstado({ actual }: { actual?: EstadoPresupuesto }) {
  return (
    <nav className="mb-4 flex flex-wrap gap-2" aria-label="Filtrar por estado">
      {opciones.map((estado) => (
        <Link
          key={estado ?? "todos"}
          href={
            estado
              ? `/panel/presupuestos?estado=${estado}`
              : "/panel/presupuestos"
          }
          aria-current={estado === actual ? "page" : undefined}
          className={cn(
            "rounded-full border px-3 py-1 text-sm transition",
            estado === actual
              ? "border-marca-azul bg-marca-azul text-white"
              : "bg-white hover:bg-neutral-100",
          )}
        >
          {estado ? nombresEstado[estado] : "Todos"}
        </Link>
      ))}
    </nav>
  );
}
