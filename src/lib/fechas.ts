// El negocio está en Córdoba: "hoy" se calcula en esa zona, no en la del servidor.
const ZONA = "America/Argentina/Cordoba";

// AAAA-MM-DD del día de hoy en Argentina.
export function hoyEnArgentina(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: ZONA }).format(new Date());
}

export function sumarDias(dia: string, dias: number): string {
  const fecha = new Date(`${dia}T12:00:00Z`);
  fecha.setUTCDate(fecha.getUTCDate() + dias);
  return fecha.toISOString().slice(0, 10);
}

// "2026-12-12" -> "12/12/2026"
export function formatearDia(dia: string): string {
  const [anio, mes, d] = dia.split("-");
  return `${d}/${mes}/${anio}`;
}
