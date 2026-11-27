import "server-only";

import {
  and,
  asc,
  count,
  desc,
  eq,
  gt,
  gte,
  like,
  lt,
  or,
  sum,
} from "drizzle-orm";

import { db } from "@/db";
import { clientes, productos, ventaItems, ventas } from "@/db/schema";

import type { MedioDePago } from "./medios-de-pago";

export const VENTAS_POR_PAGINA = 25;

export type FiltrosVentas = {
  desde?: string; // AAAA-MM-DD
  hasta?: string; // AAAA-MM-DD, inclusive
  medioPago?: MedioDePago;
  clienteId?: number;
  pagina?: number;
};

// Los días se cuentan en hora de Argentina, sin importar la zona del servidor.
const inicioDelDia = (dia: string) => new Date(`${dia}T00:00:00-03:00`);
const finDelDia = (dia: string) =>
  new Date(inicioDelDia(dia).getTime() + 24 * 60 * 60 * 1000);

function condiciones({ desde, hasta, medioPago, clienteId }: FiltrosVentas) {
  const filtros = [];
  if (desde) filtros.push(gte(ventas.fecha, inicioDelDia(desde)));
  if (hasta) filtros.push(lt(ventas.fecha, finDelDia(hasta)));
  if (medioPago) filtros.push(eq(ventas.medioPago, medioPago));
  if (clienteId) filtros.push(eq(ventas.clienteId, clienteId));
  return filtros.length ? and(...filtros) : undefined;
}

export async function listarVentas(filtros: FiltrosVentas) {
  const pagina = Math.max(1, filtros.pagina ?? 1);
  const donde = condiciones(filtros);

  const [filas, [resumen]] = await Promise.all([
    db
      .select({
        id: ventas.id,
        fecha: ventas.fecha,
        cliente: clientes.nombre,
        medioPago: ventas.medioPago,
        total: ventas.total,
        unidades: sum(ventaItems.cantidad).mapWith(Number),
      })
      .from(ventas)
      .leftJoin(clientes, eq(ventas.clienteId, clientes.id))
      .leftJoin(ventaItems, eq(ventaItems.ventaId, ventas.id))
      .where(donde)
      .groupBy(ventas.id, clientes.nombre)
      .orderBy(desc(ventas.fecha), desc(ventas.id))
      .limit(VENTAS_POR_PAGINA)
      .offset((pagina - 1) * VENTAS_POR_PAGINA),
    db
      .select({ cantidad: count(), facturado: sum(ventas.total) })
      .from(ventas)
      .where(donde),
  ]);

  const cantidad = Number(resumen.cantidad);
  const facturado = Number(resumen.facturado ?? 0);
  return {
    ventas: filas,
    total: cantidad,
    facturado,
    ticketPromedio: cantidad ? facturado / cantidad : 0,
    pagina,
    paginas: Math.max(1, Math.ceil(cantidad / VENTAS_POR_PAGINA)),
  };
}

export async function obtenerVenta(id: number) {
  const venta = await db.query.ventas.findFirst({
    where: eq(ventas.id, id),
    with: {
      cliente: true,
      items: {
        with: {
          producto: {
            columns: { id: true, codigo: true, descripcion: true, marca: true },
          },
        },
      },
    },
  });
  return venta ?? null;
}

export async function listarClientes() {
  return db
    .select({ id: clientes.id, nombre: clientes.nombre })
    .from(clientes)
    .orderBy(asc(clientes.nombre));
}

// Para el buscador de la venta: solo productos activos con stock.
export async function buscarProductosConStock(texto: string) {
  const patron = `%${texto}%`;
  return db
    .select({
      id: productos.id,
      codigo: productos.codigo,
      descripcion: productos.descripcion,
      marca: productos.marca,
      precio: productos.precio,
      stock: productos.stock,
    })
    .from(productos)
    .where(
      and(
        eq(productos.activo, true),
        gt(productos.stock, 0),
        or(
          like(productos.codigo, patron),
          like(productos.descripcion, patron),
          like(productos.marca, patron),
          like(productos.compatibilidad, patron),
        ),
      ),
    )
    .orderBy(asc(productos.descripcion))
    .limit(8);
}

export type ProductoParaVenta = Awaited<
  ReturnType<typeof buscarProductosConStock>
>[number];
