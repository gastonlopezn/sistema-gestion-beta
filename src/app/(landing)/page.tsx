import { Beneficios } from "@/components/landing/beneficios";
import { BotonWhatsappFlotante } from "@/components/landing/boton-whatsapp-flotante";
import { Contacto } from "@/components/landing/contacto";
import { Encabezado } from "@/components/landing/encabezado";
import { Historia } from "@/components/landing/historia";
import { PiePagina } from "@/components/landing/pie-pagina";
import { Portada } from "@/components/landing/portada";
import { Rubros } from "@/components/landing/rubros";
import { Ubicacion } from "@/components/landing/ubicacion";

export default function Inicio() {
  return (
    <>
      <Encabezado />
      <main className="flex-1">
        <Portada />
        <Beneficios />
        <Rubros />
        <Historia />
        <Ubicacion />
        <Contacto />
      </main>
      <PiePagina />
      <BotonWhatsappFlotante />
    </>
  );
}
