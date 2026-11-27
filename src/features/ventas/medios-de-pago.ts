import type { mediosDePago } from "@/db/schema/ventas";

// Solo importa tipos del esquema, así se puede usar en componentes de cliente sin sumar Drizzle al bundle.
export type MedioDePago = (typeof mediosDePago)[number];

export const nombresMedioDePago: Record<MedioDePago, string> = {
  efectivo: "Efectivo",
  transferencia: "Transferencia",
  debito: "Débito",
  credito: "Crédito",
  mercado_pago: "Mercado Pago",
};

export const opcionesMedioDePago = Object.entries(nombresMedioDePago) as [
  MedioDePago,
  string,
][];

export function esMedioDePago(valor: unknown): valor is MedioDePago {
  return typeof valor === "string" && Object.hasOwn(nombresMedioDePago, valor);
}
