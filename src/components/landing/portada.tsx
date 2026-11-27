import { MapPin } from "lucide-react";
import Image from "next/image";

import { buttonVariants } from "@/components/ui/button";
import { negocio, urlMapa, urlWhatsapp } from "@/config/negocio";
import { cn } from "@/lib/utils";

import { Franjas } from "./franjas";
import { IconoWhatsapp } from "./icono-whatsapp";

export function Portada() {
  return (
    <section
      id="inicio"
      className="relative overflow-hidden bg-gradient-to-br from-white via-neutral-50 to-neutral-200"
    >
      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-10 px-4 pt-16 pb-28 md:grid-cols-[1.3fr_1fr] md:pt-24 md:pb-36">
        <div className="flex flex-col items-start gap-6">
          <p className="bg-marca-rojo px-3 py-1 font-heading text-sm font-bold tracking-wide text-white uppercase italic">
            {negocio.direccion.ciudad} · {negocio.direccion.provincia}
          </p>
          <h1 className="font-heading text-5xl leading-[0.95] font-extrabold tracking-tight text-marca-azul uppercase italic sm:text-7xl">
            Repuestos para <span className="text-marca-azul">Ford</span> y{" "}
            <span className="text-marca-rojo">Chevrolet</span>
          </h1>
          <p className="max-w-xl text-lg text-neutral-700">{negocio.descripcion}</p>
          <div className="flex flex-wrap gap-3">
            <a
              href={urlWhatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ size: "lg" }), "h-12 rounded-full px-6 text-base")}
            >
              <IconoWhatsapp className="size-5" />
              {negocio.whatsapp.visible}
            </a>
            <a
              href={urlMapa}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-12 rounded-full border-marca-azul px-6 text-base text-marca-azul",
              )}
            >
              <MapPin className="size-5" />
              {negocio.direccion.calle}
            </a>
          </div>
        </div>
        <div className="relative mx-auto w-56 sm:w-72 md:w-full md:max-w-sm">
          <div className="absolute inset-0 translate-x-4 translate-y-4 -skew-x-6 bg-marca-azul" />
          <div className="relative -skew-x-6 bg-white p-8 shadow-xl">
            <Image
              src="/images/logo-sm-repuestos.png"
              alt={`Logo de ${negocio.nombre}`}
              width={329}
              height={329}
              priority
              className="skew-x-6"
            />
          </div>
        </div>
      </div>
      <Franjas className="inset-x-0 bottom-0 h-24" />
    </section>
  );
}
