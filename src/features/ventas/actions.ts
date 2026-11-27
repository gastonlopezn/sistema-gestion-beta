"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { requerirSesion } from "@/lib/sesion";

import { buscarProductosConStock } from "./queries";
import { ventaSchema, type EstadoVenta } from "./schema";
import { guardarVenta, VentaRechazada } from "./servicio";

export async function buscarProductos(texto: string) {
  await requerirSesion();
  const busqueda = texto.trim();
  if (busqueda.length < 2) return [];
  return buscarProductosConStock(busqueda);
}

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

  let ventaId: number;
  try {
    ventaId = await db.transaction((tx) => guardarVenta(tx, lectura.data));
  } catch (error) {
    if (error instanceof VentaRechazada) return { error: error.message };
    console.error(error);
    return { error: "No se pudo registrar la venta. Probá de nuevo." };
  }

  revalidatePath("/panel/ventas");
  revalidatePath("/panel/stock");
  redirect(`/panel/ventas/${ventaId}`);
}
