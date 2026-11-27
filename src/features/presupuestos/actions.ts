"use server";

import { and, eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { presupuestoItems, presupuestos, productos } from "@/db/schema";
import { esMedioDePago } from "@/features/ventas/medios-de-pago";
import { guardarVenta, VentaRechazada } from "@/features/ventas/servicio";
import { hoyEnArgentina } from "@/lib/fechas";
import { requerirSesion } from "@/lib/sesion";

import { estadoVisible } from "./estados";
import { presupuestoSchema, type EstadoAccion } from "./schema";

class AccionRechazada extends Error {}

// Los precios se toman de la base y quedan fijos en el presupuesto.
export async function crearPresupuesto(
  _anterior: EstadoAccion,
  formData: FormData,
): Promise<EstadoAccion> {
  await requerirSesion();

  let items: unknown;
  try {
    items = JSON.parse(String(formData.get("items") ?? "[]"));
  } catch {
    return { error: "No se pudo leer la lista de productos" };
  }
  const lectura = presupuestoSchema.safeParse({
    clienteId: formData.get("clienteId") ?? "0",
    validoHasta: formData.get("validoHasta"),
    notas: String(formData.get("notas") ?? ""),
    items,
  });
  if (!lectura.success) return { error: lectura.error.issues[0].message };
  const datos = lectura.data;
  if (datos.validoHasta < hoyEnArgentina())
    return { error: "La fecha de validez no puede ser anterior a hoy" };

  const cantidades = new Map<number, number>();
  for (const { productoId, cantidad } of datos.items)
    cantidades.set(productoId, (cantidades.get(productoId) ?? 0) + cantidad);

  const filas = await db
    .select({ id: productos.id, precio: productos.precio })
    .from(productos)
    .where(
      and(
        inArray(productos.id, [...cantidades.keys()]),
        eq(productos.activo, true),
      ),
    );
  if (filas.length !== cantidades.size)
    return { error: "Uno de los productos ya no está disponible" };

  const lineas = filas.map((p) => {
    const cantidad = cantidades.get(p.id)!;
    const precio = Number(p.precio);
    return { productoId: p.id, cantidad, precio, subtotal: precio * cantidad };
  });
  const total = lineas.reduce((suma, l) => suma + l.subtotal, 0);

  const id = await db.transaction(async (tx) => {
    const [{ id }] = await tx
      .insert(presupuestos)
      .values({
        clienteId: datos.clienteId,
        validoHasta: datos.validoHasta,
        notas: datos.notas,
        total: total.toFixed(2),
      })
      .$returningId();
    await tx.insert(presupuestoItems).values(
      lineas.map((l) => ({
        presupuestoId: id,
        productoId: l.productoId,
        cantidad: l.cantidad,
        precioUnitario: l.precio.toFixed(2),
        subtotal: l.subtotal.toFixed(2),
      })),
    );
    return id;
  });

  revalidatePath("/panel/presupuestos");
  redirect(`/panel/presupuestos/${id}`);
}

// Bloquea el presupuesto y verifica que siga pendiente y vigente.
async function bloquearPendiente(
  tx: Parameters<Parameters<typeof db.transaction>[0]>[0],
  id: number,
) {
  const [presupuesto] = await tx
    .select()
    .from(presupuestos)
    .where(eq(presupuestos.id, id))
    .for("update");
  if (!presupuesto) throw new AccionRechazada("El presupuesto no existe");
  const estado = estadoVisible(
    presupuesto.estado,
    presupuesto.validoHasta,
    hoyEnArgentina(),
  );
  if (estado !== "pendiente")
    throw new AccionRechazada(
      `El presupuesto está ${estado} y ya no se puede modificar`,
    );
  return presupuesto;
}

// Respeta los precios del presupuesto, aunque el producto haya cambiado de precio después.
export async function convertirEnVenta(
  id: number,
  _anterior: EstadoAccion,
  formData: FormData,
): Promise<EstadoAccion> {
  await requerirSesion();
  const medioPago = formData.get("medioPago");
  if (!esMedioDePago(medioPago)) return { error: "Elegí un medio de pago" };

  let ventaId: number;
  try {
    ventaId = await db.transaction(async (tx) => {
      const presupuesto = await bloquearPendiente(tx, id);
      const items = await tx
        .select()
        .from(presupuestoItems)
        .where(eq(presupuestoItems.presupuestoId, id));

      const ventaId = await guardarVenta(tx, {
        clienteId: presupuesto.clienteId,
        medioPago,
        notas: `Presupuesto #${id}${presupuesto.notas ? `. ${presupuesto.notas}` : ""}`,
        items: items.map((i) => ({
          productoId: i.productoId,
          cantidad: i.cantidad,
          precioUnitario: Number(i.precioUnitario),
        })),
      });
      await tx
        .update(presupuestos)
        .set({ estado: "aceptado", ventaId })
        .where(eq(presupuestos.id, id));
      return ventaId;
    });
  } catch (error) {
    if (error instanceof VentaRechazada || error instanceof AccionRechazada)
      return { error: error.message };
    console.error(error);
    return { error: "No se pudo convertir en venta. Probá de nuevo." };
  }

  revalidatePath("/panel/presupuestos");
  revalidatePath("/panel/ventas");
  revalidatePath("/panel/stock");
  redirect(`/panel/ventas/${ventaId}`);
}

export async function rechazarPresupuesto(id: number): Promise<EstadoAccion> {
  await requerirSesion();
  try {
    await db.transaction(async (tx) => {
      await bloquearPendiente(tx, id);
      await tx
        .update(presupuestos)
        .set({ estado: "rechazado" })
        .where(eq(presupuestos.id, id));
    });
  } catch (error) {
    if (error instanceof AccionRechazada) return { error: error.message };
    throw error;
  }
  revalidatePath("/panel/presupuestos");
  revalidatePath(`/panel/presupuestos/${id}`);
  return {};
}
