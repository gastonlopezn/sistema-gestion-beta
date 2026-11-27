"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { modulosPanel } from "@/config/panel";
import { cn } from "@/lib/utils";

export function MenuLateral() {
  const ruta = usePathname();

  return (
    <aside className="bg-marca-azul flex shrink-0 flex-col text-white md:w-60">
      <Link
        href="/panel"
        className="flex items-center gap-3 border-b border-white/10 p-4"
      >
        <span className="rounded bg-white p-1">
          <Image
            src="/images/logo-sm-repuestos.png"
            alt="SM Repuestos"
            width={32}
            height={32}
          />
        </span>
        <span className="font-heading text-xl font-bold uppercase italic">
          Gestión
        </span>
      </Link>
      <nav className="flex gap-1 overflow-x-auto p-2 md:flex-col md:overflow-visible">
        {modulosPanel.map(({ href, nombre, icono: Icono }) => {
          const activo =
            href === "/panel" ? ruta === href : ruta.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={activo ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm whitespace-nowrap transition",
                activo
                  ? "bg-marca-rojo font-medium"
                  : "text-white/80 hover:bg-white/10",
              )}
            >
              <Icono className="size-4" />
              {nombre}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
