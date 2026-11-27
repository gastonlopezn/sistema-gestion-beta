import { Plus } from "lucide-react";
import Link from "next/link";

import { EncabezadoPagina } from "@/components/panel/encabezado-pagina";
import { Paginacion } from "@/components/panel/paginacion";
import { buttonVariants } from "@/components/ui/button";
import { FiltrosStock } from "@/features/stock/components/filtros-stock";
import { ResumenStock } from "@/features/stock/components/resumen-stock";
import { TablaProductos } from "@/features/stock/components/tabla-productos";
import { listarProductos, listarRubros } from "@/features/stock/queries";
import { requerirSesion } from "@/lib/sesion";

const texto = (valor: string | string[] | undefined) =>
  typeof valor === "string" && valor.trim() ? valor.trim() : undefined;

export default async function StockPage({
  searchParams,
}: PageProps<"/panel/stock">) {
  await requerirSesion();
  const parametros = await searchParams;
  const filtros = {
    busqueda: texto(parametros.q),
    rubro: texto(parametros.rubro),
    soloBajoMinimo: parametros.bajo === "1",
    pagina: Number(texto(parametros.pagina) ?? 1) || 1,
  };

  const [resultado, rubros] = await Promise.all([
    listarProductos(filtros),
    listarRubros(),
  ]);

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <EncabezadoPagina
          titulo="Stock"
          descripcion="Productos, búsqueda y alertas de stock mínimo"
        />
        <Link
          href="/panel/stock/nuevo"
          className={buttonVariants({ size: "lg" })}
        >
          <Plus />
          Nuevo producto
        </Link>
      </div>
      <ResumenStock />
      <FiltrosStock filtros={filtros} rubros={rubros} />
      <TablaProductos productos={resultado.productos} />
      <Paginacion
        ruta="/panel/stock"
        pagina={resultado.pagina}
        paginas={resultado.paginas}
        total={resultado.total}
        parametros={{
          q: filtros.busqueda,
          rubro: filtros.rubro,
          bajo: filtros.soloBajoMinimo ? "1" : undefined,
        }}
      />
    </>
  );
}
