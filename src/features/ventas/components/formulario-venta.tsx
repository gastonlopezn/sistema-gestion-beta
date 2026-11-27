"use client";

import Link from "next/link";
import { useActionState, useState } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { formatearPesos } from "@/lib/formato";

import { registrarVenta } from "../actions";
import { opcionesMedioDePago } from "../medios-de-pago";
import { Carrito, totalLineas, type Linea } from "./carrito";

const claseSelect =
  "h-9 w-full rounded-lg border border-input bg-transparent px-3 text-sm";

export function FormularioVenta({
  clientes,
}: {
  clientes: { id: number; nombre: string }[];
}) {
  const [estado, enviar, enviando] = useActionState(registrarVenta, {});
  const [lineas, setLineas] = useState<Linea[]>([]);
  const total = totalLineas(lineas);

  return (
    <form
      action={enviar}
      className="grid max-w-5xl gap-6 lg:grid-cols-[1fr_20rem]"
    >
      <Carrito lineas={lineas} setLineas={setLineas} />

      <aside className="flex h-fit flex-col gap-4 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2">
          <Label htmlFor="clienteId">Cliente</Label>
          <select
            id="clienteId"
            name="clienteId"
            defaultValue="0"
            className={claseSelect}
          >
            <option value="0">Consumidor final</option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="medioPago">Medio de pago</Label>
          <select
            id="medioPago"
            name="medioPago"
            defaultValue="efectivo"
            className={claseSelect}
          >
            {opcionesMedioDePago.map(([medio, nombre]) => (
              <option key={medio} value={medio}>
                {nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="notas">Notas</Label>
          <textarea
            id="notas"
            name="notas"
            rows={2}
            maxLength={500}
            className="border-input rounded-lg border bg-transparent px-3 py-2 text-sm"
          />
        </div>
        <div className="flex items-baseline justify-between border-t pt-4">
          <span className="text-muted-foreground text-sm">Total</span>
          <span className="text-2xl font-semibold">
            {formatearPesos(total)}
          </span>
        </div>
        {estado.error && (
          <p className="text-destructive text-sm">{estado.error}</p>
        )}
        <Button
          type="submit"
          size="lg"
          disabled={enviando || lineas.length === 0}
        >
          {enviando ? "Registrando..." : "Registrar venta"}
        </Button>
        <Link
          href="/panel/ventas"
          className={buttonVariants({ variant: "outline", size: "lg" })}
        >
          Cancelar
        </Link>
      </aside>
    </form>
  );
}
