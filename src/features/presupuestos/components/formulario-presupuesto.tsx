"use client";

import Link from "next/link";
import { useActionState, useState } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Carrito,
  totalLineas,
  type Linea,
} from "@/features/ventas/components/carrito";
import { formatearPesos } from "@/lib/formato";

import { crearPresupuesto } from "../actions";

export function FormularioPresupuesto({
  clientes,
  hoy,
  validoHastaSugerido,
}: {
  clientes: { id: number; nombre: string }[];
  hoy: string;
  validoHastaSugerido: string;
}) {
  const [estado, enviar, enviando] = useActionState(crearPresupuesto, {});
  const [lineas, setLineas] = useState<Linea[]>([]);

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
            className="border-input h-9 w-full rounded-lg border bg-transparent px-3 text-sm"
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
          <Label htmlFor="validoHasta">Válido hasta</Label>
          <Input
            id="validoHasta"
            name="validoHasta"
            type="date"
            min={hoy}
            defaultValue={validoHastaSugerido}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="notas">Notas</Label>
          <textarea
            id="notas"
            name="notas"
            rows={2}
            maxLength={500}
            placeholder="Aparecen en el PDF"
            className="border-input rounded-lg border bg-transparent px-3 py-2 text-sm"
          />
        </div>
        <div className="flex items-baseline justify-between border-t pt-4">
          <span className="text-muted-foreground text-sm">Total</span>
          <span className="text-2xl font-semibold">
            {formatearPesos(totalLineas(lineas))}
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
          {enviando ? "Guardando..." : "Crear presupuesto"}
        </Button>
        <Link
          href="/panel/presupuestos"
          className={buttonVariants({ variant: "outline", size: "lg" })}
        >
          Cancelar
        </Link>
      </aside>
    </form>
  );
}
