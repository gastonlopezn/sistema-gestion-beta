import { z } from "zod";

import { mediosDePago } from "@/db/schema/ventas";

export const ventaSchema = z.object({
  clienteId: z.coerce
    .number()
    .int()
    .min(0)
    .transform((id) => (id === 0 ? null : id)),
  medioPago: z.enum(mediosDePago, { message: "Elegí un medio de pago" }),
  notas: z
    .string()
    .trim()
    .max(500, "Máximo 500 caracteres")
    .transform((texto) => texto || null),
  items: z
    .array(
      z.object({
        productoId: z.number().int().positive(),
        cantidad: z.number().int().positive("La cantidad tiene que ser mayor a 0"),
      }),
    )
    .min(1, "Agregá al menos un producto"),
});

export type EstadoVenta = { error?: string };
