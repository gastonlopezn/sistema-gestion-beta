"use server";

import { eq, inArray, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { movimientosStock, productos, ventaItems, ventas } from "@/db/schema";
import { requerirSesion } from "@/lib/sesion";

import { buscarProductosConStock } from "./queries";
import { ventaSchema, type EstadoVenta } from "./schema";

class StockInsuficiente extends Error {}

export async function buscarProductos(texto: string) {
  await requerirSesion();
  const busqueda = texto.trim();
  if (busqueda.length < 2) return [];
  return buscarProductosConStock(busqueda);
}

// Registra la venta, descuenta stock y deja un movimiento por producto, todo en una transacción.
// Los precios se toman de la base, no del navegador.
export async function registrarVenta(
  _anterior: EstadoVenta,
  formData: FormData,
): Promise<EstadoVenta> {
  await requerirSesion();

  let items: unknown;
  try {
    items = JSON.parse(String(formData.get("items") ?? "[]"));
  } catch {
    return { error: "No se pudo leer la lista de productos" };
  }
  const lectura = ventaSchema.safeParse({
    clienteId: formData.get("clienteId") ?? "0",
    medioPago: formData.get("medioPago"),
    notas: String(formData.get("notas") ?? ""),
    items,
  });
  if (!lectura.success) return { error: lectura.error.issues[0].message };
  const venta = lectura.data;

  // Si el mismo producto viene dos veces, se suman las cantidades.
  const cantidades = new Map<number, number>();
  for (const { productoId, cantidad } of venta.items)
    cantidades.set(productoId, (cantidades.get(productoId) ?? 0) + cantidad);

  let ventaId: number;
  try {
    ventaId = await db.transaction(async (tx) => {
      const filas = await tx
        .select({
          id: productos.id,
          descripcion: productos.descripcion,
          precio: productos.precio,
          stock: productos.stock,
          activo: productos.activo,
        })
        .from(productos)
        .where(inArray(productos.id, [...cantidades.keys()]))
        .for("update");

      const lineas = [...cantidades].map(([productoId, cantidad]) => {
        const producto = filas.find((f) => f.id === productoId);
        if (!producto || !producto.activo)
          throw new StockInsuficiente(
            "Uno de los productos ya no está disponible",
          );
        if (producto.stock < cantidad)
          throw new StockInsuficiente(
            `No hay stock suficiente de ${producto.descripcion} (quedan ${producto.stock})`,
          );
        const precio = Number(producto.precio);
        return { productoId, cantidad, precio, subtotal: precio * cantidad };
      });
      const total = lineas.reduce((suma, l) => suma + l.subtotal, 0);

      const [{ id }] = await tx
        .insert(ventas)
        .values({
          clienteId: venta.clienteId,
          medioPago: venta.medioPago,
          notas: venta.notas,
          total: total.toFixed(2),
        })
        .$returningId();

      await tx.insert(ventaItems).values(
        lineas.map((l) => ({
          ventaId: id,
          productoId: l.productoId,
          cantidad: l.cantidad,
          precioUnitario: l.precio.toFixed(2),
          subtotal: l.subtotal.toFixed(2),
        })),
      );
      await tx.insert(movimientosStock).values(
        lineas.map((l) => ({
          productoId: l.productoId,
          tipo: "venta" as const,
          cantidad: -l.cantidad,
          ventaId: id,
        })),
      );
      for (const l of lineas) {
        await tx
          .update(productos)
          .set({ stock: sql`${productos.stock} - ${l.cantidad}` })
          .where(eq(productos.id, l.productoId));
      }
      return id;
    });
  } catch (error) {
    if (error instanceof StockInsuficiente) return { error: error.message };
    console.error(error);
    return { error: "No se pudo registrar la venta. Probá de nuevo." };
  }

  revalidatePath("/panel/ventas");
  revalidatePath("/panel/stock");
  redirect(`/panel/ventas/${ventaId}`);
}
