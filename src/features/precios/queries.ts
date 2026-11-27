import "server-only";

import { and, asc, desc, eq, isNotNull } from "drizzle-orm";

import { db } from "@/db";
import { actualizacionesPrecios, productos, proveedores } from "@/db/schema";

import type { Filtros } from "./parametros";

export function condicionesFiltros({ rubro, marca, proveedorId }: Filtros) {
  return and(
    eq(productos.activo, true),
    rubro ? eq(productos.rubro, rubro) : undefined,
    marca ? eq(productos.marca, marca) : undefined,
    proveedorId ? eq(productos.proveedorId, proveedorId) : undefined,
  );
}

export async function productosAfectados(filtros: Filtros) {
  return db
    .select({
      id: productos.id,
      codigo: productos.codigo,
      descripcion: productos.descripcion,
      marca: productos.marca,
      costo: productos.costo,
      precio: productos.precio,
    })
    .from(productos)
    .where(condicionesFiltros(filtros))
    .orderBy(asc(productos.descripcion), asc(productos.id));
}

export async function listarMarcas() {
  const filas = await db
    .selectDistinct({ marca: productos.marca })
    .from(productos)
    .where(and(eq(productos.activo, true), isNotNull(productos.marca)))
    .orderBy(asc(productos.marca));
  return filas.map((f) => f.marca!);
}

export async function resumenFiltros({ rubro, marca, proveedorId }: Filtros) {
  const partes = [];
  if (rubro) partes.push(`Rubro: ${rubro}`);
  if (marca) partes.push(`Marca: ${marca}`);
  if (proveedorId) {
    const [proveedor] = await db
      .select({ nombre: proveedores.nombre })
      .from(proveedores)
      .where(eq(proveedores.id, proveedorId));
    partes.push(`Proveedor: ${proveedor?.nombre ?? proveedorId}`);
  }
  return partes.length ? partes.join(" · ") : "Todos los productos";
}

export async function ultimasActualizaciones(limite = 5) {
  return db
    .select()
    .from(actualizacionesPrecios)
    .orderBy(
      desc(actualizacionesPrecios.fecha),
      desc(actualizacionesPrecios.id),
    )
    .limit(limite);
}
