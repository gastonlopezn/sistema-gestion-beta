import { AlertTriangle, Package, PackageX } from "lucide-react";
import Link from "next/link";

import { resumenStock } from "../queries";

export async function ResumenStock() {
  const { activos, bajoMinimo, sinStock } = await resumenStock();

  const tarjetas = [
    {
      titulo: "Productos activos",
      valor: activos,
      icono: Package,
      href: "/panel/stock",
      clase: "text-marca-azul",
    },
    {
      titulo: "Bajo stock mínimo",
      valor: bajoMinimo,
      icono: AlertTriangle,
      href: "/panel/stock?bajo=1",
      clase: "text-amber-600",
    },
    {
      titulo: "Sin stock",
      valor: sinStock,
      icono: PackageX,
      href: "/panel/stock?bajo=1",
      clase: "text-red-600",
    },
  ];

  return (
    <div className="mb-6 grid gap-4 sm:grid-cols-3">
      {tarjetas.map(({ titulo, valor, icono: Icono, href, clase }) => (
        <Link
          key={titulo}
          href={href}
          className="flex items-center gap-4 bg-white p-4 shadow-sm transition hover:shadow-md"
        >
          <Icono className={`size-8 ${clase}`} />
          <div>
            <p className="text-2xl font-semibold">{valor}</p>
            <p className="text-muted-foreground text-sm">{titulo}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
