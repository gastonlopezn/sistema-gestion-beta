import "server-only";

import { and, count, desc, eq, gte, isNull, lt, or } from "drizzle-orm";

import { db } from "@/db";
import { clientes, presupuestoItems, presupuestos } from "@/db/schema";
import { hoyEnArgentina } from "@/lib/fechas";

import type { EstadoPresupuesto } from "./estados";

export const PRESUPUESTOS_POR_PAGINA = 25;

export type FiltrosPresupuestos = {
  estado?: EstadoPresupuesto;
  pagina?: number;
};

// "pendiente" y "vencido" tienen en cuenta la fecha de validez (ver estadoVisible).
function condicionEstado(estado: EstadoPresupuesto | undefined, hoy: string) {
  const vigente = or(
    isNull(presupuestos.validoHasta),
    gte(presupuestos.validoHasta, hoy),
  );
  switch (estado) {
    case undefined:
      return undefined;
    case "pendiente":
      return and(eq(presupuestos.estado, "pendiente"), vigente);
    case "vencido":
      return or(
        eq(presupuestos.estado, "vencido"),
        and(
          eq(presupuestos.estado, "pendiente"),
          lt(presupuestos.validoHasta, hoy),
        ),
      );
    default:
      return eq(presupuestos.estado, estado);
  }
}

export async function listarPresupuestos(filtros: FiltrosPresupuestos) {
  const pagina = Math.max(1, filtros.pagina ?? 1);
  const hoy = hoyEnArgentina();
  const donde = condicionEstado(filtros.estado, hoy);

  const [filas, [{ total }]] = await Promise.all([
    db
      .select({
        id: presupuestos.id,
        fecha: presupuestos.fecha,
        validoHasta: presupuestos.validoHasta,
        estado: presupuestos.estado,
        total: presupuestos.total,
        cliente: clientes.nombre,
        ventaId: presupuestos.ventaId,
      })
      .from(presupuestos)
      .leftJoin(clientes, eq(presupuestos.clienteId, clientes.id))
      .where(donde)
      .orderBy(desc(presupuestos.fecha), desc(presupuestos.id))
      .limit(PRESUPUESTOS_POR_PAGINA)
      .offset((pagina - 1) * PRESUPUESTOS_POR_PAGINA),
    db.select({ total: count() }).from(presupuestos).where(donde),
  ]);

  return {
    presupuestos: filas,
    total,
    hoy,
    pagina,
    paginas: Math.max(1, Math.ceil(total / PRESUPUESTOS_POR_PAGINA)),
  };
}

export async function obtenerPresupuesto(id: number) {
  const presupuesto = await db.query.presupuestos.findFirst({
    where: eq(presupuestos.id, id),
    with: {
      cliente: true,
      items: {
        orderBy: [presupuestoItems.id],
        with: {
          producto: {
            columns: {
              id: true,
              codigo: true,
              descripcion: true,
              marca: true,
              stock: true,
              activo: true,
            },
          },
        },
      },
    },
  });
  return presupuesto ?? null;
}

export type PresupuestoCompleto = NonNullable<
  Awaited<ReturnType<typeof obtenerPresupuesto>>
>;
