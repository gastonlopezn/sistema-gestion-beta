import Image from "next/image";

import { buttonVariants } from "@/components/ui/button";
import { negocio, urlWhatsapp } from "@/config/negocio";
import { cn } from "@/lib/utils";

import { IconoWhatsapp } from "./icono-whatsapp";

const enlaces = [
  { href: "#rubros", texto: "Repuestos" },
  { href: "#ubicacion", texto: "Ubicación" },
  { href: "#horarios", texto: "Horarios" },
  { href: "#contacto", texto: "Contacto" },
];

export function Encabezado() {
  return (
    <header className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <a href="#inicio" className="flex items-center" aria-label={negocio.nombre}>
          <Image
            src="/images/logo-sm-repuestos.png"
            alt={negocio.nombre}
            width={48}
            height={48}
            priority
          />
        </a>
        <nav className="hidden gap-6 font-heading text-lg font-bold text-marca-azul uppercase italic sm:flex">
          {enlaces.map((enlace) => (
            <a key={enlace.href} href={enlace.href} className="hover:text-marca-rojo">
              {enlace.texto}
            </a>
          ))}
        </nav>
        <a
          href={urlWhatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ size: "lg" }), "rounded-full px-4")}
        >
          <IconoWhatsapp className="size-4" />
          Escribinos
        </a>
      </div>
    </header>
  );
}
