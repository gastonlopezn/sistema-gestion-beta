import { mediosDePago } from "@/db/schema/ventas";

export type MedioDePago = (typeof mediosDePago)[number];

export const nombresMedioDePago: Record<MedioDePago, string> = {
  efectivo: "Efectivo",
  transferencia: "Transferencia",
  debito: "Débito",
  credito: "Crédito",
  mercado_pago: "Mercado Pago",
};

export function esMedioDePago(valor: unknown): valor is MedioDePago {
  return mediosDePago.includes(valor as MedioDePago);
}
