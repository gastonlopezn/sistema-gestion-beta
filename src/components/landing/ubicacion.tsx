import { MapPin, Navigation } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { negocio, urlMapa, urlMapaEmbebido } from "@/config/negocio";
import { cn } from "@/lib/utils";

import { Horarios } from "./horarios";
import { TituloSeccion } from "./titulo-seccion";

export function Ubicacion() {
  return (
    <section id="ubicacion" className="scroll-mt-16 bg-neutral-100">
      <div className="mx-auto max-w-6xl px-4 py-20">
        <TituloSeccion>Dónde estamos</TituloSeccion>
        <div className="mt-10 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="overflow-hidden bg-white shadow-sm">
            <iframe
              title={`Mapa de ${negocio.nombre}`}
              src={urlMapaEmbebido}
              className="h-80 w-full border-0 lg:h-full lg:min-h-96"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div id="horarios" className="flex scroll-mt-20 flex-col gap-6">
            <div className="bg-marca-azul p-6 text-white shadow-sm">
              <div className="flex items-center gap-2">
                <MapPin className="size-6 text-marca-rojo" />
                <h3 className="font-heading text-2xl font-bold uppercase italic">Dirección</h3>
              </div>
              <p className="mt-3 text-lg">{negocio.direccion.calle}</p>
              <p className="text-white/75">
                {negocio.direccion.ciudad}, {negocio.direccion.provincia}
              </p>
              <a
                href={urlMapa}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ size: "lg" }), "mt-4 rounded-full px-5")}
              >
                <Navigation className="size-4" />
                Cómo llegar
              </a>
            </div>
            <Horarios />
          </div>
        </div>
      </div>
    </section>
  );
}
