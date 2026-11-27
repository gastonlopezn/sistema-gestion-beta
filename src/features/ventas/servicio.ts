import "server-only";

import { eq, inArray, sql } from "drizzle-orm";

import { db } from "@/db";
import { movimientosStock, productos, ventaItems, ventas } from "@/db/schema";

import type { MedioDePago } from "./medios-de-pago";

export class VentaRechazada extends Error {}

type Transaccion = Parameters<Parameters<typeof db.transaction>[0]>[0];

export type DatosVenta = {
  clienteId: number | null;
  medioPago: MedioDePago;
  notas: string | null;
  // precioUnitario es opcional: si no viene, se usa el precio actual del producto.
  items: { productoId: number; cantidad: number; precioUnitario?: number }[];
};

// Guarda la venta, descuenta stock y deja un movimiento por producto, dentro de la transacción recibida.
// Bloquea los productos para que dos ventas simultáneas no vendan el mismo stock.
export async function guardarVenta(
  tx: Transaccion,
  datos: DatosVenta,
): Promise<number> {
  // Si el mismo producto viene dos veces, se suman las cantidades.
  const pedidos = new Map<
    number,
    { cantidad: number; precioUnitario?: number }
  >();
  for (const { productoId, cantidad, precioUnitario } of datos.items) {
    const anterior = pedidos.get(productoId);
    pedidos.set(productoId, {
      cantidad: (anterior?.cantidad ?? 0) + cantidad,
      precioUnitario: anterior?.precioUnitario ?? precioUnitario,
    });
  }

  const filas = await tx
    .select({
      id: productos.id,
      descripcion: productos.descripcion,
      precio: productos.precio,
      stock: productos.stock,
      activo: productos.activo,
    })
    .from(productos)
    .where(inArray(productos.id, [...pedidos.keys()]))
    .for("update");

  const lineas = [...pedidos].map(([productoId, pedido]) => {
    const producto = filas.find((f) => f.id === productoId);
    if (!producto || !producto.activo)
      throw new VentaRechazada("Uno de los productos ya no está disponible");
    if (producto.stock < pedido.cantidad)
      throw new VentaRechazada(
        `No hay stock suficiente de ${producto.descripcion} (quedan ${producto.stock})`,
      );
    const precio = pedido.precioUnitario ?? Number(producto.precio);
    return {
      productoId,
      cantidad: pedido.cantidad,
      precio,
      subtotal: precio * pedido.cantidad,
    };
  });
  const total = lineas.reduce((suma, l) => suma + l.subtotal, 0);

  const [{ id }] = await tx
    .insert(ventas)
    .values({
      clienteId: datos.clienteId,
      medioPago: datos.medioPago,
      notas: datos.notas,
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
}
