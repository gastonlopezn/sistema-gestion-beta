import { EncabezadoPagina } from "@/components/panel/encabezado-pagina";
import { FormularioPresupuesto } from "@/features/presupuestos/components/formulario-presupuesto";
import { DIAS_DE_VALIDEZ } from "@/features/presupuestos/estados";
import { listarClientes } from "@/features/ventas/queries";
import { hoyEnArgentina, sumarDias } from "@/lib/fechas";
import { requerirSesion } from "@/lib/sesion";

export default async function NuevoPresupuestoPage() {
  await requerirSesion();
  const clientes = await listarClientes();
  const hoy = hoyEnArgentina();

  return (
    <>
      <EncabezadoPagina
        titulo="Nuevo presupuesto"
        descripcion="Los precios quedan fijos hasta la fecha de validez. No descuenta stock."
      />
      <FormularioPresupuesto
        clientes={clientes}
        hoy={hoy}
        validoHastaSugerido={sumarDias(hoy, DIAS_DE_VALIDEZ)}
      />
    </>
  );
}
