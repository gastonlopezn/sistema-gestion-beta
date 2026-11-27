import { z } from "zod";

export const presupuestoSchema = z.object({
  clienteId: z.coerce
    .number()
    .int()
    .min(0)
    .transform((id) => (id === 0 ? null : id)),
  validoHasta: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Elegí hasta cuándo vale el presupuesto"),
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

export type EstadoAccion = { error?: string };
