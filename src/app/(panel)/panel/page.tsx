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
              className="border-marca-rojo flex h-full items-start gap-4 border-l-4 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <Icono className="text-marca-azul mt-1 size-6" />
              <span>
                <span className="font-heading text-marca-azul block text-xl font-bold uppercase italic">
                  {nombre}
                </span>
                <span className="text-muted-foreground text-sm">
                  {descripcion}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
