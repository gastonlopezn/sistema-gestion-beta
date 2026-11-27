import { Construction } from "lucide-react";

import type { ModuloPanel } from "@/config/panel";

import { EncabezadoPagina } from "./encabezado-pagina";

export function ModuloEnConstruccion({ modulo }: { modulo: ModuloPanel }) {
  return (
    <>
      <EncabezadoPagina titulo={modulo.nombre} descripcion={modulo.descripcion} />
      <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed bg-white p-12 text-center">
        <Construction className="size-8 text-marca-rojo" />
        <p className="font-medium">Módulo en construcción</p>
        {modulo.issue && (
          <p className="text-sm text-muted-foreground">Se desarrolla en la issue #{modulo.issue}.</p>
        )}
      </div>
    </>
  );
}
