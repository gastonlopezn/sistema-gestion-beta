import { Phone } from "lucide-react";

import { negocio, urlWhatsapp } from "@/config/negocio";

import { IconoInstagram } from "./icono-instagram";
import { IconoWhatsapp } from "./icono-whatsapp";
import { TituloSeccion } from "./titulo-seccion";

const canales = [
  {
    icono: IconoWhatsapp,
    titulo: "WhatsApp",
    valor: negocio.whatsapp.visible,
    href: urlWhatsapp,
    externo: true,
  },
  {
    icono: Phone,
    titulo: "Teléfono",
    valor: negocio.telefono.visible,
    href: `tel:${negocio.telefono.numero}`,
    externo: false,
  },
  {
    icono: IconoInstagram,
    titulo: "Instagram",
    valor: `@${negocio.instagram.usuario}`,
    href: negocio.instagram.url,
    externo: true,
  },
];

export function Contacto() {
  return (
    <section id="contacto" className="scroll-mt-16 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-20">
        <TituloSeccion>¿Buscás un repuesto?</TituloSeccion>
        <p className="mt-4 max-w-2xl text-neutral-600">
          Consultanos y te asesoramos. Respondemos en el horario del local.
        </p>
        <ul className="mt-10 grid gap-4 sm:grid-cols-3">
          {canales.map(({ icono: Icono, titulo, valor, href, externo }) => (
            <li key={titulo}>
              <a
                href={href}
                {...(externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="flex items-center gap-4 border-l-4 border-marca-rojo bg-neutral-50 p-5 shadow-sm transition hover:bg-neutral-100"
              >
                <Icono className="size-8 shrink-0 text-marca-azul" />
                <span>
                  <span className="block font-heading text-xl font-bold text-marca-azul uppercase italic">
                    {titulo}
                  </span>
                  <span className="text-neutral-700">{valor}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
