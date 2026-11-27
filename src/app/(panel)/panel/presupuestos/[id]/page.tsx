import { ArrowLeft, Download } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { IconoWhatsapp } from "@/components/landing/icono-whatsapp";
import { EncabezadoPagina } from "@/components/panel/encabezado-pagina";
import { buttonVariants } from "@/components/ui/button";
import { AccionesPresupuesto } from "@/features/presupuestos/components/acciones-presupuesto";
import { EstadoPresupuestoBadge } from "@/features/presupuestos/components/estado-presupuesto";
import { estadoVisible } from "@/features/presupuestos/estados";
import { obtenerPresupuesto } from "@/features/presupuestos/queries";
import { urlWhatsAppPresupuesto } from "@/features/presupuestos/whatsapp";
import { formatearDia, hoyEnArgentina } from "@/lib/fechas";
import { formatearFechaHora, formatearPesos } from "@/lib/formato";
import { requerirSesion } from "@/lib/sesion";
import { cn } from "@/lib/utils";

export default async function DetallePresupuestoPage({
  params,
}: PageProps<"/panel/presupuestos/[id]">) {
  await requerirSesion();
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const presupuesto = await obtenerPresupuesto(id);
  if (!presupuesto) notFound();

  const estado = estadoVisible(
    presupuesto.estado,
    presupuesto.validoHasta,
    hoyEnArgentina(),
  );
  const datos = [
    ["Fecha", formatearFechaHora(presupuesto.fecha)],
    ["Cliente", presupuesto.cliente?.nombre ?? "Consumidor final"],
    [
      "Válido hasta",
      presupuesto.validoHasta ? formatearDia(presupuesto.validoHasta) : "-",
    ],
  ];

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <EncabezadoPagina titulo={`Presupuesto #${presupuesto.id}`} />
        <EstadoPresupuestoBadge estado={estado} />
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        <a
          href={`/panel/presupuestos/${presupuesto.id}/pdf`}
          className={buttonVariants({ variant: "outline", size: "lg" })}
        >
          <Download />
          Descargar PDF
        </a>
        <a
          href={urlWhatsAppPresupuesto(presupuesto)}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            buttonVariants({ size: "lg" }),
            "bg-[#25d366] text-white hover:bg-[#1ebe5b]",
          )}
        >
          <IconoWhatsapp className="size-4" />
          Enviar por WhatsApp
        </a>
      </div>

      <div className="mb-6 max-w-3xl bg-white shadow-sm">
        <dl className="grid gap-4 border-b p-6 sm:grid-cols-3">
          {datos.map(([titulo, valor]) => (
            <div key={titulo}>
              <dt className="text-muted-foreground text-xs uppercase">
                {titulo}
              </dt>
              <dd className="font-medium">{valor}</dd>
            </div>
          ))}
        </dl>
        <table className="w-full text-sm">
          <thead className="text-muted-foreground border-b bg-neutral-50 text-left text-xs uppercase">
            <tr>
              <th className="px-6 py-3">Producto</th>
              <th className="px-4 py-3 text-right">Cant.</th>
              <th className="hidden px-4 py-3 text-right sm:table-cell">
                Precio
              </th>
              <th className="px-6 py-3 text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {presupuesto.items.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-3">
                  <Link
                    href={`/panel/stock/${item.producto.id}`}
                    className="hover:underline"
                  >
                    {item.producto.descripcion}
                  </Link>
                  <p className="text-muted-foreground font-mono text-xs">
                    {item.producto.codigo}
                    {estado === "pendiente" &&
                      item.producto.stock < item.cantidad && (
                        <span className="ml-2 font-sans text-amber-700">
                          Stock actual: {item.producto.stock}
                        </span>
                      )}
                  </p>
                </td>
                <td className="px-4 py-3 text-right">{item.cantidad}</td>
                <td className="hidden px-4 py-3 text-right sm:table-cell">
                  {formatearPesos(item.precioUnitario)}
                </td>
                <td className="px-6 py-3 text-right">
                  {formatearPesos(item.subtotal)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t">
              <td colSpan={4} className="px-6 py-4">
                <div className="flex items-baseline justify-end gap-6">
                  <span className="text-muted-foreground text-sm">Total</span>
                  <span className="text-lg font-semibold">
                    {formatearPesos(presupuesto.total)}
                  </span>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
        {presupuesto.notas && (
          <p className="text-muted-foreground border-t p-6 text-sm">
            {presupuesto.notas}
          </p>
        )}
      </div>

      {estado === "pendiente" && <AccionesPresupuesto id={presupuesto.id} />}
      {presupuesto.ventaId && (
        <p className="text-sm">
          Se convirtió en la{" "}
          <Link
            href={`/panel/ventas/${presupuesto.ventaId}`}
            className="font-medium underline"
          >
            venta #{presupuesto.ventaId}
          </Link>
          .
        </p>
      )}

      <Link
        href="/panel/presupuestos"
        className={`${buttonVariants({ variant: "outline" })} mt-6`}
      >
        <ArrowLeft />
        Volver a presupuestos
      </Link>
    </>
  );
}
