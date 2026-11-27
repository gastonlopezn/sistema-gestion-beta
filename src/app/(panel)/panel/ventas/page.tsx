import { Plus } from "lucide-react";
import Link from "next/link";

import { EncabezadoPagina } from "@/components/panel/encabezado-pagina";
import { Paginacion } from "@/components/panel/paginacion";
import { buttonVariants } from "@/components/ui/button";
import { FiltrosVentas } from "@/features/ventas/components/filtros-ventas";
import { ResumenVentas } from "@/features/ventas/components/resumen-ventas";
import { TablaVentas } from "@/features/ventas/components/tabla-ventas";
import { esMedioDePago } from "@/features/ventas/medios-de-pago";
import { listarClientes, listarVentas } from "@/features/ventas/queries";
import { requerirSesion } from "@/lib/sesion";

const fecha = (valor: string | string[] | undefined) =>
  typeof valor === "string" && /^\d{4}-\d{2}-\d{2}$/.test(valor)
    ? valor
    : undefined;

export default async function VentasPage({
  searchParams,
}: PageProps<"/panel/ventas">) {
  await requerirSesion();
  const parametros = await searchParams;
  const filtros = {
    desde: fecha(parametros.desde),
    hasta: fecha(parametros.hasta),
    medioPago: esMedioDePago(parametros.medio) ? parametros.medio : undefined,
    clienteId: Number(parametros.cliente) || undefined,
    pagina: Number(parametros.pagina) || 1,
  };

  const [resultado, clientes] = await Promise.all([
    listarVentas(filtros),
    listarClientes(),
  ]);

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <EncabezadoPagina
          titulo="Ventas"
          descripcion="Historial de ventas y registro de nuevas"
        />
        <Link
          href="/panel/ventas/nueva"
          className={buttonVariants({ size: "lg" })}
        >
          <Plus />
          Nueva venta
        </Link>
      </div>
      <ResumenVentas
        cantidad={resultado.total}
        facturado={resultado.facturado}
        ticketPromedio={resultado.ticketPromedio}
      />
      <FiltrosVentas filtros={filtros} clientes={clientes} />
      <TablaVentas ventas={resultado.ventas} />
      <Paginacion
        ruta="/panel/ventas"
        pagina={resultado.pagina}
        paginas={resultado.paginas}
        total={resultado.total}
        parametros={{
          desde: filtros.desde,
          hasta: filtros.hasta,
          medio: filtros.medioPago,
          cliente: filtros.clienteId ? String(filtros.clienteId) : undefined,
        }}
      />
    </>
  );
}
