"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { movimientosStock, productos } from "@/db/schema";
import { requerirSesion } from "@/lib/sesion";

import { productoSchema, type EstadoFormulario } from "./schema";

function leerFormulario(formData: FormData) {
  const valores = Object.fromEntries(
    [...formData.entries()].map(([clave, valor]) => [clave, String(valor)]),
  );
  const resultado = productoSchema.safeParse(valores);
  if (!resultado.success) {
    const errores: EstadoFormulario["errores"] = {};
    for (const issue of resultado.error.issues) {
      const campo = issue.path[0] as keyof NonNullable<
        EstadoFormulario["errores"]
      >;
      errores[campo] ??= issue.message;
    }
    return { ok: false as const, estado: { errores, valores } };
  }
  return { ok: true as const, datos: resultado.data, valores };
}

function esCodigoDuplicado(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  if ("code" in error && error.code === "ER_DUP_ENTRY") return true;
  return "cause" in error && esCodigoDuplicado(error.cause);
}

export async function crearProducto(
  _anterior: EstadoFormulario,
  formData: FormData,
): Promise<EstadoFormulario> {
  await requerirSesion();
  const lectura = leerFormulario(formData);
  if (!lectura.ok) return lectura.estado;

  try {
    await db.transaction(async (tx) => {
      const [{ id }] = await tx
        .insert(productos)
        .values(lectura.datos)
        .$returningId();
      if (lectura.datos.stock > 0) {
        await tx.insert(movimientosStock).values({
          productoId: id,
          tipo: "ingreso",
          cantidad: lectura.datos.stock,
          motivo: "Alta de producto",
        });
      }
    });
  } catch (error) {
    if (esCodigoDuplicado(error)) {
      return {
        errores: { codigo: "Ya existe un producto con ese código" },
        valores: lectura.valores,
      };
    }
    throw error;
  }

  revalidatePath("/panel/stock");
  redirect("/panel/stock");
}

export async function actualizarProducto(
  id: number,
  _anterior: EstadoFormulario,
  formData: FormData,
): Promise<EstadoFormulario> {
  await requerirSesion();
  const lectura = leerFormulario(formData);
  if (!lectura.ok) return lectura.estado;

  try {
    await db.transaction(async (tx) => {
      const [actual] = await tx
        .select({ stock: productos.stock })
        .from(productos)
        .where(eq(productos.id, id))
        .for("update");
      if (!actual) throw new Error("Producto no encontrado");

      await tx.update(productos).set(lectura.datos).where(eq(productos.id, id));

      // Si se cambió el stock a mano, queda registrado como ajuste.
      const diferencia = lectura.datos.stock - actual.stock;
      if (diferencia !== 0) {
        await tx.insert(movimientosStock).values({
          productoId: id,
          tipo: "ajuste",
          cantidad: diferencia,
          motivo: "Ajuste manual desde el panel",
        });
      }
    });
  } catch (error) {
    if (esCodigoDuplicado(error)) {
      return {
        errores: { codigo: "Ya existe un producto con ese código" },
        valores: lectura.valores,
      };
    }
    throw error;
  }

  revalidatePath("/panel/stock");
  redirect("/panel/stock");
}

// Baja lógica: el producto deja de aparecer pero se conserva para el historial de ventas.
export async function darDeBajaProducto(id: number) {
  await requerirSesion();
  await db.update(productos).set({ activo: false }).where(eq(productos.id, id));
  revalidatePath("/panel/stock");
  redirect("/panel/stock");
}
