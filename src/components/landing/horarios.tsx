import { Clock } from "lucide-react";

import { horarios } from "@/config/negocio";
import { formatearTurnos } from "@/lib/horarios";

export function Horarios() {
  return (
    <div className="bg-white p-6 shadow-sm">
      <div className="text-marca-azul flex items-center gap-2">
        <Clock className="text-marca-rojo size-6" />
        <h3 className="font-heading text-2xl font-bold uppercase italic">
          Horarios
        </h3>
      </div>
      <dl className="mt-4 divide-y">
        {horarios.map(({ dia, turnos }) => (
          <div key={dia} className="flex justify-between gap-4 py-2 text-sm">
            <dt className="font-medium text-neutral-800">{dia}</dt>
            <dd
              className={
                turnos.length === 0 ? "text-marca-rojo" : "text-neutral-600"
              }
            >
              {formatearTurnos(turnos)}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
