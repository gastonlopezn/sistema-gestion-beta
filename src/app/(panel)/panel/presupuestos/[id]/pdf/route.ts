import { headers } from "next/headers";

import { generarPdfPresupuesto } from "@/features/presupuestos/pdf";
import { obtenerPresupuesto } from "@/features/presupuestos/queries";
import { auth } from "@/lib/auth";

export async function GET(
  _request: Request,
  { params }: RouteContext<"/panel/presupuestos/[id]/pdf">,
) {
  const sesion = await auth.api.getSession({ headers: await headers() });
  if (!sesion) return new Response("No autorizado", { status: 401 });

  const id = Number((await params).id);
  const presupuesto = Number.isInteger(id)
    ? await obtenerPresupuesto(id)
    : null;
  if (!presupuesto)
    return new Response("Presupuesto no encontrado", { status: 404 });

  const pdf = await generarPdfPresupuesto(presupuesto);
  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="presupuesto-${id}-sm-repuestos.pdf"`,
      "Cache-Control": "private, no-store",
    },
  });
}
