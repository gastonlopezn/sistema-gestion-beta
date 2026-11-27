import { negocio } from "@/config/negocio";

import { Franjas } from "./franjas";

export function Historia() {
  return (
    <section className="relative overflow-hidden bg-neutral-100">
      <div className="relative z-10 mx-auto max-w-4xl px-4 pt-20 pb-28 text-center">
        <p className="font-heading text-lg font-bold tracking-widest text-marca-rojo uppercase">
          Desde {negocio.historia.desde}
        </p>
        <h2 className="mt-2 font-heading text-4xl font-extrabold text-marca-azul uppercase italic sm:text-5xl">
          Una historia que evoluciona
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-700">
          Antes {negocio.historia.nombreAnterior}, hoy {negocio.nombre}. Más de 50 años
          acompañando a nuestros clientes con la misma atención y el mismo compromiso.
        </p>
      </div>
      <Franjas className="inset-x-0 bottom-0 h-20" />
    </section>
  );
}
