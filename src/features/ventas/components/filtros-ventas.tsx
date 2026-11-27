import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mediosDePago } from "@/db/schema/ventas";

import { nombresMedioDePago } from "../medios-de-pago";
import type { FiltrosVentas as Filtros } from "../queries";

// Formulario GET, igual que en stock: los filtros quedan en la URL.
export function FiltrosVentas({
  filtros,
  clientes,
}: {
  filtros: Filtros;
  clientes: { id: number; nombre: string }[];
}) {
  const claseSelect =
    "h-9 rounded-lg border border-input bg-transparent px-3 text-sm";
  return (
    <form
      action="/panel/ventas"
      className="mb-4 flex flex-wrap items-end gap-3 bg-white p-4 shadow-sm"
    >
      <label className="text-muted-foreground flex flex-col gap-1 text-xs">
        Desde
        <Input
          type="date"
          name="desde"
          defaultValue={filtros.desde}
          className="w-40"
        />
      </label>
      <label className="text-muted-foreground flex flex-col gap-1 text-xs">
        Hasta
        <Input
          type="date"
          name="hasta"
          defaultValue={filtros.hasta}
          className="w-40"
        />
      </label>
      <label className="text-muted-foreground flex flex-col gap-1 text-xs">
        Medio de pago
        <select
          name="medio"
          defaultValue={filtros.medioPago ?? ""}
          className={claseSelect}
        >
          <option value="">Todos</option>
          {mediosDePago.map((medio) => (
            <option key={medio} value={medio}>
              {nombresMedioDePago[medio]}
            </option>
          ))}
        </select>
      </label>
      <label className="text-muted-foreground flex flex-col gap-1 text-xs">
        Cliente
        <select
          name="cliente"
          defaultValue={filtros.clienteId ?? ""}
          className={`${claseSelect} max-w-56`}
        >
          <option value="">Todos</option>
          {clientes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>
      </label>
      <Button type="submit">Filtrar</Button>
      <Link
        href="/panel/ventas"
        className="text-muted-foreground pb-2 text-sm hover:underline"
      >
        Limpiar
      </Link>
    </form>
  );
}
