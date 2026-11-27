import { MapPin } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { negocio, urlMapa, urlWhatsapp } from "@/config/negocio";
import { cn } from "@/lib/utils";

import { IconoWhatsapp } from "./icono-whatsapp";

export function Portada() {
  return (
    <section id="inicio" className="bg-marca-azul text-white">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-20 sm:py-28">
        <p className="rounded-full bg-white/10 px-3 py-1 text-sm">
          {negocio.direccion.ciudad}, {negocio.direccion.provincia}
        </p>
        <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
          Repuestos para tu vehículo, <span className="text-marca-rojo">cerca tuyo</span>
        </h1>
        <p className="max-w-xl text-lg text-white/80">{negocio.descripcion}</p>
        <div className="flex flex-wrap gap-3">
          <a
            href={urlWhatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ size: "lg" }), "h-11 px-5 text-base")}
          >
            <IconoWhatsapp className="size-5" />
            Consultar por WhatsApp
          </a>
          <a
            href={urlMapa}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "h-11 border-white/30 bg-transparent px-5 text-base text-white hover:bg-white/10 hover:text-white",
            )}
          >
            <MapPin className="size-5" />
            Cómo llegar
          </a>
        </div>
      </div>
    </section>
  );
}
