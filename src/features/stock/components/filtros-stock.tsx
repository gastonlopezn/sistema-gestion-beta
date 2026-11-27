import { Search } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import type { FiltrosStock as Filtros } from "../queries";

// Formulario GET: los filtros quedan en la URL, así se pueden compartir y funcionan sin JavaScript.
export function FiltrosStock({ filtros, rubros }: { filtros: Filtros; rubros: string[] }) {
  return (
    <form action="/panel/stock" className="mb-4 flex flex-wrap items-center gap-3 bg-white p-4 shadow-sm">
      <div className="relative min-w-60 flex-1">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          name="q"
          defaultValue={filtros.busqueda}
          placeholder="Código, descripción, marca o vehículo"
          className="pl-9"
          aria-label="Buscar productos"
        />
      </div>
      <select
        name="rubro"
        defaultValue={filtros.rubro ?? ""}
        aria-label="Rubro"
        className="h-9 rounded-lg border border-input bg-transparent px-3 text-sm"
      >
        <option value="">Todos los rubros</option>
        {rubros.map((rubro) => (
          <option key={rubro} value={rubro}>
            {rubro}
          </option>
        ))}
      </select>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="bajo" value="1" defaultChecked={filtros.soloBajoMinimo} />
        Solo bajo mínimo
      </label>
      <Button type="submit">Buscar</Button>
      <Link href="/panel/stock" className="text-sm text-muted-foreground hover:underline">
        Limpiar
      </Link>
    </form>
  );
}
