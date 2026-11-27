import Link from "next/link";

import { EncabezadoPagina } from "@/components/panel/encabezado-pagina";
import { modulosPanel } from "@/config/panel";
import { requerirSesion } from "@/lib/sesion";

export default async function PanelInicio() {
  const { user } = await requerirSesion();
  const modulos = modulosPanel.filter((m) => m.href !== "/panel");

  return (
    <>
      <EncabezadoPagina
        titulo={`Hola, ${user.name.split(" ")[0]}`}
        descripcion="Elegí un módulo para empezar."
      />
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {modulos.map(({ href, nombre, descripcion, icono: Icono }) => (
          <li key={href}>
            <Link
              href={href}
              className="flex h-full items-start gap-4 border-l-4 border-marca-rojo bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <Icono className="mt-1 size-6 text-marca-azul" />
              <span>
                <span className="block font-heading text-xl font-bold text-marca-azul uppercase italic">
                  {nombre}
                </span>
                <span className="text-sm text-muted-foreground">{descripcion}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
