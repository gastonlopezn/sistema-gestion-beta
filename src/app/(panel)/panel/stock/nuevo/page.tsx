import { EncabezadoPagina } from "@/components/panel/encabezado-pagina";
import { crearProducto } from "@/features/stock/actions";
import { FormularioProducto } from "@/features/stock/components/formulario-producto";
import { listarProveedores, listarRubros } from "@/features/stock/queries";
import { requerirSesion } from "@/lib/sesion";

export default async function NuevoProductoPage() {
  await requerirSesion();
  const [proveedores, rubros] = await Promise.all([
    listarProveedores(),
    listarRubros(),
  ]);

  return (
    <>
      <EncabezadoPagina
        titulo="Nuevo producto"
        descripcion="Cargá un repuesto al stock"
      />
      <FormularioProducto
        accion={crearProducto}
        proveedores={proveedores}
        rubros={rubros}
        textoBoton="Crear producto"
      />
    </>
  );
}
