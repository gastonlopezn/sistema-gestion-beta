import { z } from "zod";

const opcional = z
  .string()
  .trim()
  .transform((v) => v || null);

const pesos = z.coerce
  .number({ error: "Ingresá un número" })
  .min(0, "No puede ser negativo")
  .transform((n) => n.toFixed(2));

const entero = z.coerce
  .number({ error: "Ingresá un número" })
  .int("Tiene que ser un número entero")
  .min(0, "No puede ser negativo");

export const productoSchema = z.object({
  codigo: z.string().trim().min(1, "El código es obligatorio").max(64),
  descripcion: z.string().trim().min(3, "Escribí una descripción").max(255),
  marca: opcional,
  rubro: opcional,
  compatibilidad: opcional,
  proveedorId: z.coerce
    .number()
    .int()
    .transform((n) => (n > 0 ? n : null)),
  costo: pesos,
  precio: pesos,
  stock: entero,
  stockMinimo: entero,
});

export type ProductoForm = z.infer<typeof productoSchema>;

export type EstadoFormulario = {
  errores?: Partial<Record<keyof ProductoForm | "general", string>>;
  valores?: Record<string, string>;
};
