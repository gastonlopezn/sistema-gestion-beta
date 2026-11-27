// "08:00" -> "8:00"
const hora = (h: string) => h.replace(/^0/, "");

export function formatearTurnos(
  turnos: readonly (readonly [string, string])[],
) {
  if (turnos.length === 0) return "Cerrado";
  return turnos
    .map(([abre, cierra]) => `${hora(abre)} a ${hora(cierra)}`)
    .join(" y ");
}
