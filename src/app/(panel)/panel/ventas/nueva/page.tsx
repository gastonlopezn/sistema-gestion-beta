import { EncabezadoPagina } from "@/components/panel/encabezado-pagina";
import { FormularioVenta } from "@/features/ventas/components/formulario-venta";
import { listarClientes } from "@/features/ventas/queries";
import { requerirSesion } from "@/lib/sesion";

export default async function NuevaVentaPage() {
  await requerirSesion();
  const clientes = await listarClientes();

  return (
    <>
      <EncabezadoPagina titulo="Nueva venta" descripcion="El stock se descuenta al registrarla" />
      <FormularioVenta clientes={clientes} />
    </>
  );
}
