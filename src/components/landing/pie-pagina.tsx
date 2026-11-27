import { direccionCompleta, negocio } from "@/config/negocio";

export function PiePagina() {
  return (
    <footer className="border-t-4 border-marca-rojo bg-marca-azul text-white/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm sm:flex-row sm:justify-between">
        <p>
          <span className="font-heading text-lg font-bold text-white uppercase italic">
            {negocio.nombre}
          </span>{" "}
          · {direccionCompleta}
        </p>
        <p>
          Antes {negocio.historia.nombreAnterior}, desde {negocio.historia.desde}
        </p>
      </div>
    </footer>
  );
}
