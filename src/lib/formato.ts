const pesos = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

// "12345.00" -> "$ 12.345"
export function formatearPesos(valor: string | number) {
  return pesos.format(Number(valor));
}
