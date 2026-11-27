import "server-only";

import { and, asc, count, eq, like, lt, or, sql } from "drizzle-orm";

import { db } from "@/db";
import { productos, proveedores } from "@/db/schema";

export const PRODUCTOS_POR_PAGINA = 25;

export type FiltrosStock = {
  busqueda?: string;
  rubro?: string;
  soloBajoMinimo?: boolean;
  pagina?: number;
};

function condiciones({ busqueda, rubro, soloBajoMinimo }: FiltrosStock) {
  const filtros = [eq(productos.activo, true)];
  if (busqueda) {
    const texto = `%${busqueda}%`;
    filtros.push(
      or(
        like(productos.codigo, texto),
        like(productos.descripcion, texto),
        like(productos.marca, texto),
        like(productos.compatibilidad, texto),
      )!,
    );
  }
  if (rubro) filtros.push(eq(productos.rubro, rubro));
  if (soloBajoMinimo) filtros.push(lt(productos.stock, productos.stockMinimo));
  return and(...filtros);
}

export async function listarProductos(filtros: FiltrosStock) {
  const pagina = Math.max(1, filtros.pagina ?? 1);
  const donde = condiciones(filtros);

  const [filas, [{ total }]] = await Promise.all([
    db
      .select({
        id: productos.id,
        codigo: productos.codigo,
        descripcion: productos.descripcion,
        marca: productos.marca,
        rubro: productos.rubro,
        compatibilidad: productos.compatibilidad,
        precio: productos.precio,
        stock: productos.stock,
        stockMinimo: productos.stockMinimo,
      })
      .from(productos)
      .where(donde)
      .orderBy(asc(productos.descripcion))
      .limit(PRODUCTOS_POR_PAGINA)
      .offset((pagina - 1) * PRODUCTOS_POR_PAGINA),
    db.select({ total: count() }).from(productos).where(donde),
  ]);

  return {
    productos: filas,
    total,
    pagina,
    paginas: Math.max(1, Math.ceil(total / PRODUCTOS_POR_PAGINA)),
  };
}

export async function resumenStock() {
  const [fila] = await db
    .select({
      activos: count(),
      bajoMinimo: sql<number>`sum(${productos.stock} < ${productos.stockMinimo})`,
      sinStock: sql<number>`sum(${productos.stock} = 0)`,
    })
    .from(productos)
    .where(eq(productos.activo, true));
  return {
    activos: Number(fila.activos),
    bajoMinimo: Number(fila.bajoMinimo ?? 0),
    sinStock: Number(fila.sinStock ?? 0),
  };
}

export async function listarRubros() {
  const filas = await db
    .selectDistinct({ rubro: productos.rubro })
    .from(productos)
    .where(eq(productos.activo, true))
    .orderBy(asc(productos.rubro));
  return filas.map((f) => f.rubro).filter((r): r is string => Boolean(r));
}

export async function listarProveedores() {
  return db
    .select({ id: proveedores.id, nombre: proveedores.nombre })
    .from(proveedores)
    .orderBy(asc(proveedores.nombre));
}

export async function obtenerProducto(id: number) {
  const [producto] = await db
    .select()
    .from(productos)
    .where(eq(productos.id, id))
    .limit(1);
  return producto ?? null;
}
