export const REDONDEOS = [0, 10, 50, 100] as const;
export type Redondeo = (typeof REDONDEOS)[number];

export const CAMPOS = {
  precio: "Precio de venta",
  costo: "Costo",
  ambos: "Costo y precio de venta",
} as const;
export type Campo = keyof typeof CAMPOS;

// Aplica el porcentaje y redondea hacia arriba al múltiplo elegido.
// Con 0 deja dos decimales. Nunca devuelve un valor negativo.
export function calcularNuevoValor(
  actual: number,
  porcentaje: number,
  redondeo: Redondeo,
): number {
  const bruto = actual * (1 + porcentaje / 100);
  const valor = redondeo
    ? Math.ceil(bruto / redondeo - 1e-9) * redondeo
    : Math.round(bruto * 100) / 100;
  return Math.max(0, valor);
}
