import { CheckCircle2 } from "lucide-react";

import { EncabezadoPagina } from "@/components/panel/encabezado-pagina";
import { CAMPOS, type Redondeo } from "@/features/precios/calculo";
import { BotonAplicar } from "@/features/precios/components/boton-aplicar";
import { FormularioParametros } from "@/features/precios/components/formulario-parametros";
import { VistaPrevia } from "@/features/precios/components/vista-previa";
import { parametrosSchema } from "@/features/precios/parametros";
import {
  listarMarcas,
  productosAfectados,
  resumenFiltros,
  ultimasActualizaciones,
} from "@/features/precios/queries";
import { listarProveedores, listarRubros } from "@/features/stock/queries";
import { formatearFechaHora } from "@/lib/formato";
import { requerirSesion } from "@/lib/sesion";

const porcentajeLegible = (p: number) =>
  `${p > 0 ? "+" : ""}${String(p).replace(".", ",")}%`;

export default async function PreciosPage({
  searchParams,
}: PageProps<"/panel/stock/precios">) {
  await requerirSesion();
  const crudos = await searchParams;
  const valores = Object.fromEntries(
    Object.entries(crudos).map(([clave, valor]) => [
      clave,
      typeof valor === "string" ? valor : undefined,
    ]),
  );

  const [rubros, marcas, proveedores, historial] = await Promise.all([
    listarRubros(),
    listarMarcas(),
    listarProveedores(),
    ultimasActualizaciones(),
  ]);

  // Sin porcentaje todavía no hay vista previa; con datos inválidos se muestra el error.
  const lectura = valores.porcentaje
    ? parametrosSchema.safeParse(valores)
    : null;
  const parametros = lectura?.success ? lectura.data : null;
  const filtros = parametros && {
    rubro: parametros.rubro,
    marca: parametros.marca,
    proveedorId: parametros.proveedorId,
  };
  const [afectados, resumen] = filtros
    ? await Promise.all([productosAfectados(filtros), resumenFiltros(filtros)])
    : [[], ""];
  const aplicada = historial.find((h) => String(h.id) === valores.aplicada);

  return (
    <>
      <EncabezadoPagina
        titulo="Actualizar precios"
        descripcion="Aumentá o bajá precios por porcentaje, con vista previa antes de aplicar"
      />

      {aplicada && (
        <p className="mb-6 flex items-center gap-2 bg-emerald-50 p-4 text-sm text-emerald-800">
          <CheckCircle2 className="size-4" />
          Listo: {porcentajeLegible(Number(aplicada.porcentaje))} en{" "}
          {CAMPOS[aplicada.campo].toLowerCase()} de {aplicada.productos}{" "}
          productos ({aplicada.filtros}).
        </p>
      )}

      <FormularioParametros
        valores={valores}
        rubros={rubros}
        marcas={marcas}
        proveedores={proveedores}
      />

      {lectura && !lectura.success && (
        <p className="text-destructive mb-6 text-sm">
          {lectura.error.issues[0].message}
        </p>
      )}

      {parametros && (
        <section className="mb-8">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-medium">Vista previa</h2>
              <p className="text-muted-foreground text-sm">
                {resumen} · {porcentajeLegible(parametros.porcentaje)} en{" "}
                {CAMPOS[parametros.campo].toLowerCase()}
                {parametros.campo !== "costo" && parametros.redondeo
                  ? `, redondeado hacia arriba a múltiplos de $${parametros.redondeo}`
                  : ""}
                . Todavía no se cambió nada.
              </p>
            </div>
            {afectados.length > 0 && (
              <BotonAplicar
                cantidad={afectados.length}
                parametros={{
                  rubro: parametros.rubro ?? "",
                  marca: parametros.marca ?? "",
                  proveedorId: String(parametros.proveedorId ?? ""),
                  porcentaje: String(parametros.porcentaje),
                  campo: parametros.campo,
                  redondeo: String(parametros.redondeo),
                }}
              />
            )}
          </div>
          {afectados.length === 0 ? (
            <p className="text-muted-foreground bg-white p-8 text-center text-sm shadow-sm">
              No hay productos que coincidan con los filtros.
            </p>
          ) : (
            <VistaPrevia
              productos={afectados}
              porcentaje={parametros.porcentaje}
              campo={parametros.campo}
              redondeo={parametros.redondeo as Redondeo}
            />
          )}
        </section>
      )}

      {historial.length > 0 && (
        <section className="bg-white shadow-sm">
          <h2 className="p-5 pb-3 font-medium">Últimas actualizaciones</h2>
          <table className="w-full text-sm">
            <tbody className="divide-y border-t">
              {historial.map((h) => (
                <tr key={h.id}>
                  <td className="px-5 py-2 whitespace-nowrap">
                    {formatearFechaHora(h.fecha)}
                  </td>
                  <td className="px-4 py-2 font-medium tabular-nums">
                    {porcentajeLegible(Number(h.porcentaje))}
                  </td>
                  <td className="px-4 py-2">{CAMPOS[h.campo]}</td>
                  <td className="text-muted-foreground px-4 py-2">
                    {h.filtros}
                  </td>
                  <td className="px-4 py-2 text-right tabular-nums">
                    {h.productos} productos
                  </td>
                  <td className="text-muted-foreground px-5 py-2">
                    {h.usuario}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </>
  );
}
