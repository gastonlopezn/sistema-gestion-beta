import type { presupuestos } from "@/db/schema/presupuestos";

export type EstadoPresupuesto = (typeof presupuestos.$inferSelect)["estado"];

export const nombresEstado: Record<EstadoPresupuesto, string> = {
  pendiente: "Pendiente",
  aceptado: "Aceptado",
  rechazado: "Rechazado",
  vencido: "Vencido",
};

export const DIAS_DE_VALIDEZ = 15;

export function esEstado(valor: unknown): valor is EstadoPresupuesto {
  return typeof valor === "string" && Object.hasOwn(nombresEstado, valor);
}

// Un presupuesto pendiente cuya fecha de validez ya pasó se muestra como vencido,
// aunque nadie lo haya marcado así en la base.
export function estadoVisible(
  estado: EstadoPresupuesto,
  validoHasta: string | null,
  hoy: string,
): EstadoPresupuesto {
  if (estado === "pendiente" && validoHasta && validoHasta < hoy)
    return "vencido";
  return estado;
}
