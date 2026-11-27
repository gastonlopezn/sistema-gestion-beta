"use client";

import { ShoppingCart, XCircle } from "lucide-react";
import { useActionState, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { opcionesMedioDePago } from "@/features/ventas/medios-de-pago";

import { convertirEnVenta, rechazarPresupuesto } from "../actions";

// Acciones de un presupuesto pendiente: convertirlo en venta o rechazarlo.
export function AccionesPresupuesto({ id }: { id: number }) {
  const [estado, convertir, convirtiendo] = useActionState(
    convertirEnVenta.bind(null, id),
    {},
  );
  const [errorRechazo, setErrorRechazo] = useState<string>();
  const [confirmandoRechazo, setConfirmandoRechazo] = useState(false);
  const [rechazando, iniciarRechazo] = useTransition();

  const rechazar = () =>
    iniciarRechazo(async () => {
      const resultado = await rechazarPresupuesto(id);
      setErrorRechazo(resultado.error);
      setConfirmandoRechazo(false);
    });

  return (
    <div className="flex max-w-3xl flex-col gap-4 bg-white p-6 shadow-sm">
      <form action={convertir} className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-2">
          <Label htmlFor="medioPago">Medio de pago</Label>
          <select
            id="medioPago"
            name="medioPago"
            defaultValue="efectivo"
            className="border-input h-9 rounded-lg border bg-transparent px-3 text-sm"
          >
            {opcionesMedioDePago.map(([medio, nombre]) => (
              <option key={medio} value={medio}>
                {nombre}
              </option>
            ))}
          </select>
        </div>
        <Button type="submit" size="lg" disabled={convirtiendo}>
          <ShoppingCart />
          {convirtiendo ? "Registrando venta..." : "Convertir en venta"}
        </Button>
        <p className="text-muted-foreground w-full text-xs">
          Se registra la venta con los precios del presupuesto y se descuenta el
          stock.
        </p>
      </form>
      {estado.error && (
        <p className="text-destructive text-sm">{estado.error}</p>
      )}

      <div className="flex flex-wrap items-center gap-2 border-t pt-4 text-sm">
        {confirmandoRechazo ? (
          <>
            <span>¿Marcar el presupuesto como rechazado?</span>
            <Button
              variant="destructive"
              disabled={rechazando}
              onClick={rechazar}
            >
              {rechazando ? "Rechazando..." : "Sí, rechazar"}
            </Button>
            <Button
              variant="ghost"
              onClick={() => setConfirmandoRechazo(false)}
            >
              Cancelar
            </Button>
          </>
        ) : (
          <Button variant="ghost" onClick={() => setConfirmandoRechazo(true)}>
            <XCircle />
            El cliente lo rechazó
          </Button>
        )}
        {errorRechazo && (
          <p className="text-destructive w-full">{errorRechazo}</p>
        )}
      </div>
    </div>
  );
}
