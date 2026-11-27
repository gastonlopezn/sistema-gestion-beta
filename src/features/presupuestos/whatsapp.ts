import { negocio } from "@/config/negocio";
import { formatearDia } from "@/lib/fechas";
import { formatearPesos } from "@/lib/formato";

import type { PresupuestoCompleto } from "./queries";

// Pasa un teléfono argentino a formato wa.me (549 + característica + número).
// Si no se puede interpretar, devuelve null y WhatsApp deja elegir el contacto.
export function telefonoParaWhatsApp(
  telefono: string | null | undefined,
): string | null {
  if (!telefono) return null;
  let digitos = telefono.replace(/\D/g, "");
  if (digitos.startsWith("549") && digitos.length === 13) return digitos;
  if (digitos.startsWith("54") && digitos.length === 12)
    return `549${digitos.slice(2)}`;
  if (digitos.startsWith("0")) digitos = digitos.slice(1);
  return digitos.length === 10 ? `549${digitos}` : null;
}

export function mensajePresupuesto(presupuesto: PresupuestoCompleto): string {
  const lineas = presupuesto.items.map(
    (i) =>
      `• ${i.cantidad} x ${i.producto.descripcion} (${i.producto.codigo}): ${formatearPesos(i.subtotal)}`,
  );
  return [
    `Hola${presupuesto.cliente ? ` ${presupuesto.cliente.nombre}` : ""}, te paso el presupuesto N.º ${presupuesto.id} de ${negocio.nombre}:`,
    "",
    ...lineas,
    "",
    `*Total: ${formatearPesos(presupuesto.total)}*`,
    presupuesto.validoHasta
      ? `Válido hasta el ${formatearDia(presupuesto.validoHasta)}.`
      : "",
    "",
    `${negocio.direccion.calle}, ${negocio.direccion.ciudad}.`,
  ]
    .filter((linea, i, todas) => linea !== "" || todas[i - 1] !== "")
    .join("\n")
    .trim();
}

export function urlWhatsAppPresupuesto(
  presupuesto: PresupuestoCompleto,
): string {
  const numero = telefonoParaWhatsApp(presupuesto.cliente?.telefono);
  const texto = encodeURIComponent(mensajePresupuesto(presupuesto));
  return `https://wa.me/${numero ?? ""}?text=${texto}`;
}
