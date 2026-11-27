import { Plus } from "lucide-react";
import Link from "next/link";

import { EncabezadoPagina } from "@/components/panel/encabezado-pagina";
import { Paginacion } from "@/components/panel/paginacion";
import { buttonVariants } from "@/components/ui/button";
import { FiltroEstado } from "@/features/presupuestos/components/filtro-estado";
import { TablaPresupuestos } from "@/features/presupuestos/components/tabla-presupuestos";
import { esEstado } from "@/features/presupuestos/estados";
import { listarPresupuestos } from "@/features/presupuestos/queries";
import { requerirSesion } from "@/lib/sesion";

export default async function PresupuestosPage({
  searchParams,
}: PageProps<"/panel/presupuestos">) {
  await requerirSesion();
  const parametros = await searchParams;
  const estado = esEstado(parametros.estado) ? parametros.estado : undefined;
  const resultado = await listarPresupuestos({
    estado,
    pagina: Number(parametros.pagina) || 1,
  });

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <EncabezadoPagina
          titulo="Presupuestos"
          descripcion="Armá presupuestos, descargalos en PDF o mandalos por WhatsApp"
        />
        <Link
          href="/panel/presupuestos/nuevo"
          className={buttonVariants({ size: "lg" })}
        >
          <Plus />
          Nuevo presupuesto
        </Link>
      </div>
      <FiltroEstado actual={estado} />
      <TablaPresupuestos
        presupuestos={resultado.presupuestos}
        hoy={resultado.hoy}
      />
      <Paginacion
        ruta="/panel/presupuestos"
        pagina={resultado.pagina}
        paginas={resultado.paginas}
        total={resultado.total}
        parametros={{ estado }}
      />
    </>
  );
}
