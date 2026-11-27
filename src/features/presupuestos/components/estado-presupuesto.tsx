import { cn } from "@/lib/utils";

import { nombresEstado, type EstadoPresupuesto } from "../estados";

const colores: Record<EstadoPresupuesto, string> = {
  pendiente: "bg-amber-100 text-amber-800",
  aceptado: "bg-emerald-100 text-emerald-800",
  rechazado: "bg-red-100 text-red-800",
  vencido: "bg-neutral-200 text-neutral-700",
};

export function EstadoPresupuestoBadge({
  estado,
}: {
  estado: EstadoPresupuesto;
}) {
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-xs font-medium",
        colores[estado],
      )}
    >
      {nombresEstado[estado]}
    </span>
  );
}
