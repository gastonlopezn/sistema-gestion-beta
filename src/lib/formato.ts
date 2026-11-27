const pesos = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

// "12345.00" -> "$ 12.345"
export function formatearPesos(valor: string | number) {
  return pesos.format(Number(valor));
}

const fechaHora = new Intl.DateTimeFormat("es-AR", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "America/Argentina/Cordoba",
});

export function formatearFechaHora(fecha: Date): string {
  return fechaHora.format(fecha);
}

const pesosCompacto = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  notation: "compact",
  maximumFractionDigits: 1,
});

// 145645900 -> "$ 145,6 M". Para ejes y tarjetas donde el número completo no entra.
export function formatearPesosCompacto(valor: number) {
  return pesosCompacto.format(valor);
}
