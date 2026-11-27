import {
  CarFront,
  Cog,
  Disc3,
  Filter,
  Lightbulb,
  Settings2,
  Snowflake,
  Workflow,
} from "lucide-react";

import { TituloSeccion } from "./titulo-seccion";

const rubros = [
  { icono: Cog, nombre: "Motores", detalle: "Motores 0 km y partes de motor" },
  {
    icono: Filter,
    nombre: "Filtros",
    detalle: "Aceite, aire, combustible y habitáculo",
  },
  {
    icono: Disc3,
    nombre: "Frenos",
    detalle: "Discos, pastillas, cilindros y kits",
  },
  {
    icono: Workflow,
    nombre: "Distribución",
    detalle: "Kits de distribución, correas y tensores",
  },
  {
    icono: Snowflake,
    nombre: "Refrigeración",
    detalle: "Bombas, termostatos y ventiladores",
  },
  {
    icono: Lightbulb,
    nombre: "Ópticas y faros",
    detalle: "Ópticas, faros y espejos",
  },
  {
    icono: Settings2,
    nombre: "Embrague",
    detalle: "Kits de embrague y rulemanes",
  },
  {
    icono: CarFront,
    nombre: "Dirección",
    detalle: "Cajas de dirección y tren delantero",
  },
];

export function Rubros() {
  return (
    <section id="rubros" className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-20">
        <TituloSeccion>Todo para tu Ford y tu Chevrolet</TituloSeccion>
        <p className="mt-4 max-w-2xl text-neutral-600">
          Stock permanente de repuestos originales y alternativos. Si no lo ves
          acá, consultanos: lo conseguimos.
        </p>
        <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {rubros.map(({ icono: Icono, nombre, detalle }) => (
            <li
              key={nombre}
              className="group border-marca-rojo border-t-4 bg-neutral-50 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <Icono className="text-marca-azul size-8" />
              <p className="font-heading text-marca-azul mt-3 text-2xl font-bold uppercase italic">
                {nombre}
              </p>
              <p className="text-sm text-neutral-600">{detalle}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
