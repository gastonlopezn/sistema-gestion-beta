import Image from "next/image";

import { buttonVariants } from "@/components/ui/button";
import { negocio, urlWhatsapp } from "@/config/negocio";

import { IconoWhatsapp } from "./icono-whatsapp";

const enlaces = [
  { href: "#horarios", texto: "Horarios" },
  { href: "#ubicacion", texto: "Ubicación" },
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
        <nav className="hidden gap-6 text-sm font-medium text-marca-azul sm:flex">
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
          className={buttonVariants({ size: "lg" })}
        >
          <IconoWhatsapp className="size-4" />
          Escribinos
        </a>
      </div>
    </header>
  );
}
