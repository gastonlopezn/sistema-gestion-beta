import { z } from "zod";

import { CAMPOS, REDONDEOS } from "./calculo";

const textoOpcional = z
  .string()
  .trim()
  .optional()
  .transform((t) => t || undefined);

// Los mismos parámetros sirven para la vista previa (URL) y para aplicar (formulario).
export const parametrosSchema = z.object({
  rubro: textoOpcional,
  marca: textoOpcional,
  proveedorId: z.coerce
    .number()
    .int()
    .min(0)
    .optional()
    .transform((id) => id || undefined),
  porcentaje: z.coerce
    .number({ message: "Escribí un porcentaje" })
    .min(-90, "El descuento máximo es 90%")
    .max(500, "El aumento máximo es 500%")
    .refine((p) => p !== 0, "El porcentaje no puede ser 0"),
  campo: z.enum(Object.keys(CAMPOS) as [keyof typeof CAMPOS]),
  redondeo: z.coerce
    .number()
    .refine((r): r is (typeof REDONDEOS)[number] =>
      (REDONDEOS as readonly number[]).includes(r),
    ),
});

export type Parametros = z.infer<typeof parametrosSchema>;
export type Filtros = Pick<Parametros, "rubro" | "marca" | "proveedorId">;
