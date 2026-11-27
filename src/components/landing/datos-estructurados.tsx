import { horarios, negocio } from "@/config/negocio";

const diasEnIngles = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// Datos estructurados (schema.org) para que Google muestre dirección, horarios y teléfono.
export function DatosEstructurados() {
  const datos = {
    "@context": "https://schema.org",
    "@type": "AutoPartsStore",
    name: negocio.nombre,
    description: negocio.descripcion,
    image: "/images/logo-sm-repuestos.png",
    telephone: negocio.telefono.numero,
    address: {
      "@type": "PostalAddress",
      streetAddress: negocio.direccion.calle,
      addressLocality: negocio.direccion.ciudad,
      addressRegion: negocio.direccion.provincia,
      addressCountry: negocio.direccion.codigoPais,
    },
    sameAs: [negocio.instagram.url],
    openingHoursSpecification: horarios.flatMap(({ turnos }, i) =>
      turnos.map(([opens, closes]) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: diasEnIngles.at(i),
        opens,
        closes,
      })),
    ),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(datos) }}
    />
  );
}
