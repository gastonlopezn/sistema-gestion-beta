import { urlWhatsapp } from "@/config/negocio";

import { IconoWhatsapp } from "./icono-whatsapp";

export function BotonWhatsappFlotante() {
  return (
    <a
      href={urlWhatsapp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribinos por WhatsApp"
      className="fixed right-5 bottom-5 z-50 flex size-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-lg transition hover:scale-105"
    >
      <IconoWhatsapp className="size-8" />
    </a>
  );
}
