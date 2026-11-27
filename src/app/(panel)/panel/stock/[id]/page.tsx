import { notFound } from "next/navigation";

import { EncabezadoPagina } from "@/components/panel/encabezado-pagina";
import { actualizarProducto, darDeBajaProducto } from "@/features/stock/actions";
import { BotonDarDeBaja } from "@/features/stock/components/boton-dar-de-baja";
import { EstadoStock } from "@/features/stock/components/estado-stock";
import { FormularioProducto } from "@/features/stock/components/formulario-producto";
import { listarProveedores, listarRubros, obtenerProducto } from "@/features/stock/queries";
import { requerirSesion } from "@/lib/sesion";

export default async function EditarProductoPage({ params }: PageProps<"/panel/stock/[id]">) {
  await requerirSesion();
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();

  const [producto, proveedores, rubros] = await Promise.all([
    obtenerProducto(id),
    listarProveedores(),
    listarRubros(),
  ]);
  if (!producto || !producto.activo) notFound();

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <EncabezadoPagina titulo={producto.descripcion} descripcion={`Código ${producto.codigo}`} />
        <EstadoStock stock={producto.stock} stockMinimo={producto.stockMinimo} />
      </div>
      <FormularioProducto
        accion={actualizarProducto.bind(null, producto.id)}
        inicial={producto}
        proveedores={proveedores}
        rubros={rubros}
        textoBoton="Guardar cambios"
      />
      <div className="mt-8 max-w-3xl border-t pt-6">
        <BotonDarDeBaja accion={darDeBajaProducto.bind(null, producto.id)} />
      </div>
    </>
  );
}
