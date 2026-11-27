import "server-only";

import { and, desc, eq, gt, gte, lt, sql, sum } from "drizzle-orm";

import { db } from "@/db";
import { productos, ventaItems, ventas } from "@/db/schema";

export const PERIODOS = [30, 90, 180] as const;
export type Periodo = (typeof PERIODOS)[number];

const DIA = 24 * 60 * 60 * 1000;
const haceDias = (dias: number) => new Date(Date.now() - dias * DIA);

// Mes en hora argentina, para que una venta del 31 a las 22 h no caiga en el mes siguiente.
const mesArgentina = sql<string>`date_format(convert_tz(${ventas.fecha}, '+00:00', '-03:00'), '%Y-%m')`;

async function totales(desde: Date, hasta: Date) {
  const [fila] = await db
    .select({
      cantidad: sql<number>`count(*)`.mapWith(Number),
      facturado: sum(ventas.total).mapWith(Number),
    })
    .from(ventas)
    .where(and(gte(ventas.fecha, desde), lt(ventas.fecha, hasta)));
  return { cantidad: fila.cantidad, facturado: fila.facturado ?? 0 };
}

// Período actual y el anterior de la misma duración, para mostrar la variación.
export async function resumenPeriodo(dias: Periodo) {
  const ahora = new Date();
  const inicio = haceDias(dias);
  const [actual, anterior, [inventario]] = await Promise.all([
    totales(inicio, ahora),
    totales(haceDias(dias * 2), inicio),
    db
      .select({
        valor:
          sql<number>`sum(${productos.costo} * ${productos.stock})`.mapWith(
            Number,
          ),
      })
      .from(productos)
      .where(eq(productos.activo, true)),
  ]);
  return {
    actual,
    anterior,
    ticketPromedio: actual.cantidad ? actual.facturado / actual.cantidad : 0,
    ticketAnterior: anterior.cantidad
      ? anterior.facturado / anterior.cantidad
      : 0,
    valorInventario: inventario.valor ?? 0,
  };
}

// Facturación de los últimos `meses` meses, incluido el actual. Los meses sin ventas vuelven en 0.
export async function facturacionPorMes(meses = 6) {
  const filas = await db
    .select({ mes: mesArgentina, facturado: sum(ventas.total).mapWith(Number) })
    .from(ventas)
    .where(gte(ventas.fecha, haceDias(meses * 31)))
    .groupBy(mesArgentina);
  const porMes = new Map(filas.map((f) => [f.mes, f.facturado ?? 0]));

  const [anio, mes] = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Argentina/Cordoba",
    year: "numeric",
    month: "2-digit",
  })
    .format(new Date())
    .split("-")
    .map(Number);
  return Array.from({ length: meses }, (_, i) => {
    const fecha = new Date(Date.UTC(anio, mes - 1 - (meses - 1 - i), 1));
    const clave = fecha.toISOString().slice(0, 7);
    return { mes: clave, facturado: porMes.get(clave) ?? 0 };
  });
}

export async function masVendidos(dias: Periodo, limite = 10) {
  const unidades = sum(ventaItems.cantidad).mapWith(Number);
  return db
    .select({
      id: productos.id,
      codigo: productos.codigo,
      descripcion: productos.descripcion,
      unidades,
      facturado: sum(ventaItems.subtotal).mapWith(Number),
    })
    .from(ventaItems)
    .innerJoin(ventas, eq(ventaItems.ventaId, ventas.id))
    .innerJoin(productos, eq(ventaItems.productoId, productos.id))
    .where(gte(ventas.fecha, haceDias(dias)))
    .groupBy(productos.id)
    .orderBy(desc(unidades))
    .limit(limite);
}

// Productos con stock que no se vendieron en el período: plata inmovilizada.
export async function sinMovimiento(dias: Periodo, limite = 15) {
  const ultimaVenta = db
    .select({
      productoId: ventaItems.productoId,
      fecha: sql<Date>`max(${ventas.fecha})`.as("ultima_venta"),
    })
    .from(ventaItems)
    .innerJoin(ventas, eq(ventaItems.ventaId, ventas.id))
    .groupBy(ventaItems.productoId)
    .as("ultima");
  const inmovilizado =
    sql<number>`${productos.costo} * ${productos.stock}`.mapWith(Number);

  const filas = await db
    .select({
      id: productos.id,
      codigo: productos.codigo,
      descripcion: productos.descripcion,
      stock: productos.stock,
      inmovilizado,
      ultimaVenta: ultimaVenta.fecha,
    })
    .from(productos)
    .leftJoin(ultimaVenta, eq(ultimaVenta.productoId, productos.id))
    .where(
      and(
        eq(productos.activo, true),
        gt(productos.stock, 0),
        sql`(${ultimaVenta.fecha} is null or ${ultimaVenta.fecha} < ${haceDias(dias)})`,
      ),
    )
    .orderBy(desc(inmovilizado))
    .limit(limite);

  // max() en una subconsulta vuelve como texto en UTC ("2026-10-23 09:08:18").
  return filas.map((f) => ({
    ...f,
    ultimaVenta: f.ultimaVenta
      ? new Date(`${String(f.ultimaVenta).replace(" ", "T")}Z`)
      : null,
  }));
}
