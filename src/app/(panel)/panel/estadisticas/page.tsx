import { EncabezadoPagina } from "@/components/panel/encabezado-pagina";
import { BarrasMasVendidos } from "@/features/estadisticas/components/barras-mas-vendidos";
import { GraficoFacturacion } from "@/features/estadisticas/components/grafico-facturacion";
import { SelectorPeriodo } from "@/features/estadisticas/components/selector-periodo";
import { TablaSinMovimiento } from "@/features/estadisticas/components/tabla-sin-movimiento";
import { TarjetaEstadistica } from "@/features/estadisticas/components/tarjeta-estadistica";
import {
  facturacionPorMes,
  masVendidos,
  PERIODOS,
  resumenPeriodo,
  sinMovimiento,
  type Periodo,
} from "@/features/estadisticas/queries";
import { formatearPesos, formatearPesosCompacto } from "@/lib/formato";
import { requerirSesion } from "@/lib/sesion";

export default async function EstadisticasPage({
  searchParams,
}: PageProps<"/panel/estadisticas">) {
  await requerirSesion();
  const pedido = Number((await searchParams).dias);
  const dias: Periodo = PERIODOS.find((p) => p === pedido) ?? 30;

  const [resumen, meses, vendidos, quietos] = await Promise.all([
    resumenPeriodo(dias),
    facturacionPorMes(),
    masVendidos(dias),
    sinMovimiento(dias),
  ]);
  const comparacion = `vs. los ${dias} días anteriores`;

  return (
    <>
      <EncabezadoPagina
        titulo="Estadísticas"
        descripcion="Cómo viene el negocio"
      />
      <SelectorPeriodo actual={dias} />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <TarjetaEstadistica
          titulo="Facturado"
          valor={formatearPesosCompacto(resumen.actual.facturado)}
          actual={resumen.actual.facturado}
          anterior={resumen.anterior.facturado}
          comparacion={comparacion}
        />
        <TarjetaEstadistica
          titulo="Ventas"
          valor={String(resumen.actual.cantidad)}
          actual={resumen.actual.cantidad}
          anterior={resumen.anterior.cantidad}
          comparacion={comparacion}
        />
        <TarjetaEstadistica
          titulo="Ticket promedio"
          valor={formatearPesos(resumen.ticketPromedio)}
          actual={resumen.ticketPromedio}
          anterior={resumen.ticketAnterior}
          comparacion={comparacion}
        />
        <TarjetaEstadistica
          titulo="Inventario a costo"
          valor={formatearPesosCompacto(resumen.valorInventario)}
        />
      </div>

      <div className="mb-6 grid gap-6 xl:grid-cols-2">
        <GraficoFacturacion meses={meses} />
        <BarrasMasVendidos productos={vendidos} dias={dias} />
      </div>
      <TablaSinMovimiento productos={quietos} dias={dias} />
    </>
  );
}
