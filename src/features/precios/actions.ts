"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { actualizacionesPrecios, productos } from "@/db/schema";
import { requerirSesion } from "@/lib/sesion";

import { calcularNuevoValor, type Redondeo } from "./calculo";
import { parametrosSchema } from "./parametros";
import { condicionesFiltros, resumenFiltros } from "./queries";

export type EstadoAplicar = { error?: string };

// Vuelve a calcular todo en el servidor: no confía en los precios que mostró la vista previa.
export async function aplicarActualizacion(
  _anterior: EstadoAplicar,
  formData: FormData,
): Promise<EstadoAplicar> {
  const { user } = await requerirSesion();
  const lectura = parametrosSchema.safeParse(Object.fromEntries(formData));
  if (!lectura.success) return { error: lectura.error.issues[0].message };
  const { porcentaje, campo, rubro, marca, proveedorId } = lectura.data;
  const redondeo = lectura.data.redondeo as Redondeo;
  const filtros = { rubro, marca, proveedorId };

  const id = await db.transaction(async (tx) => {
    const filas = await tx
      .select({
        id: productos.id,
        costo: productos.costo,
        precio: productos.precio,
      })
      .from(productos)
      .where(condicionesFiltros(filtros))
      .for("update");
    if (filas.length === 0) return null;

    for (const fila of filas) {
      const cambios: { costo?: string; precio?: string } = {};
      if (campo !== "precio")
        cambios.costo = calcularNuevoValor(
          Number(fila.costo),
          porcentaje,
          0,
        ).toFixed(2);
      if (campo !== "costo")
        cambios.precio = calcularNuevoValor(
          Number(fila.precio),
          porcentaje,
          redondeo,
        ).toFixed(2);
      await tx.update(productos).set(cambios).where(eq(productos.id, fila.id));
    }

    const [{ id }] = await tx
      .insert(actualizacionesPrecios)
      .values({
        usuario: user.name,
        porcentaje: porcentaje.toFixed(2),
        campo,
        redondeo,
        filtros: await resumenFiltros(filtros),
        productos: filas.length,
      })
      .$returningId();
    return id;
  });

  if (id === null)
    return { error: "No hay productos que coincidan con los filtros" };
  revalidatePath("/panel/stock");
  redirect(`/panel/stock/precios?aplicada=${id}`);
}
