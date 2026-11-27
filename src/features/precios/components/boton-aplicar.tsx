"use client";

import { Check } from "lucide-react";
import { useActionState, useState } from "react";

import { Button } from "@/components/ui/button";

import { aplicarActualizacion } from "../actions";

// Manda los mismos parámetros de la vista previa. Pide confirmar en el mismo botón.
export function BotonAplicar({
  parametros,
  cantidad,
}: {
  parametros: Record<string, string>;
  cantidad: number;
}) {
  const [estado, aplicar, aplicando] = useActionState(aplicarActualizacion, {});
  const [confirmando, setConfirmando] = useState(false);

  return (
    <form action={aplicar} className="flex flex-wrap items-center gap-3">
      {Object.entries(parametros).map(([nombre, valor]) => (
        <input key={nombre} type="hidden" name={nombre} value={valor} />
      ))}
      {confirmando ? (
        <>
          <span className="text-sm">
            ¿Confirmás? Se cambian los precios de {cantidad} productos.
          </span>
          <Button type="submit" size="lg" disabled={aplicando}>
            {aplicando ? "Aplicando..." : "Sí, aplicar"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setConfirmando(false)}
          >
            Cancelar
          </Button>
        </>
      ) : (
        <Button type="button" size="lg" onClick={() => setConfirmando(true)}>
          <Check />
          Aplicar a {cantidad} producto{cantidad === 1 ? "" : "s"}
        </Button>
      )}
      {estado.error && (
        <p className="text-destructive w-full text-sm">{estado.error}</p>
      )}
    </form>
  );
}
