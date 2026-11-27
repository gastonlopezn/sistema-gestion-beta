import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { EncabezadoPagina } from "@/components/panel/encabezado-pagina";
import { buttonVariants } from "@/components/ui/button";
import { nombresMedioDePago } from "@/features/ventas/medios-de-pago";
import { obtenerVenta } from "@/features/ventas/queries";
import { formatearFechaHora, formatearPesos } from "@/lib/formato";
import { requerirSesion } from "@/lib/sesion";

export default async function DetalleVentaPage({
  params,
}: PageProps<"/panel/ventas/[id]">) {
  await requerirSesion();
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const venta = await obtenerVenta(id);
  if (!venta) notFound();

  const datos = [
    ["Fecha", formatearFechaHora(venta.fecha)],
    ["Cliente", venta.cliente?.nombre ?? "Consumidor final"],
    ["Medio de pago", nombresMedioDePago[venta.medioPago]],
  ];

  return (
    <>
      <EncabezadoPagina titulo={`Venta #${venta.id}`} />
      <div className="max-w-3xl bg-white shadow-sm">
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
            {venta.items.map((item) => (
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
                    {formatearPesos(venta.total)}
                  </span>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
        {venta.notas && (
          <p className="text-muted-foreground border-t p-6 text-sm">
            {venta.notas}
          </p>
        )}
      </div>
      <Link
        href="/panel/ventas"
        className={`${buttonVariants({ variant: "outline" })} mt-6`}
      >
        <ArrowLeft />
        Volver al historial
      </Link>
    </>
  );
}
