// Máximo "redondo" para el eje (1, 2 o 5 por una potencia de 10) y sus marcas.
export function escalaRedonda(maximo: number, marcas = 4) {
  if (maximo <= 0) return { tope: 1, valores: [0] };
  const paso = maximo / marcas;
  const potencia = 10 ** Math.floor(Math.log10(paso));
  const pasoRedondo = [1, 2, 2.5, 5, 10]
    .map((m) => m * potencia)
    .find((p) => p >= paso)!;
  const tope = pasoRedondo * Math.ceil(maximo / pasoRedondo);
  const valores = Array.from(
    { length: Math.round(tope / pasoRedondo) + 1 },
    (_, i) => i * pasoRedondo,
  );
  return { tope, valores };
}
