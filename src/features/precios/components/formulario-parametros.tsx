import { Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { CAMPOS, REDONDEOS } from "../calculo";

const claseSelect =
  "h-9 w-full rounded-lg border border-input bg-white px-3 text-sm";

type Valores = Record<string, string | undefined>;

// Formulario GET: la vista previa queda en la URL y no cambia nada hasta confirmar.
export function FormularioParametros({
  valores,
  rubros,
  marcas,
  proveedores,
}: {
  valores: Valores;
  rubros: string[];
  marcas: string[];
  proveedores: { id: number; nombre: string }[];
}) {
  return (
    <form
      action="/panel/stock/precios"
      className="mb-6 grid gap-4 bg-white p-6 shadow-sm md:grid-cols-3"
    >
      <p className="text-sm font-medium md:col-span-3">1. Qué productos</p>
      <div className="flex flex-col gap-2">
        <Label htmlFor="rubro">Rubro</Label>
        <select
          id="rubro"
          name="rubro"
          defaultValue={valores.rubro ?? ""}
          className={claseSelect}
        >
          <option value="">Todos</option>
          {rubros.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="marca">Marca</Label>
        <select
          id="marca"
          name="marca"
          defaultValue={valores.marca ?? ""}
          className={claseSelect}
        >
          <option value="">Todas</option>
          {marcas.map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="proveedorId">Proveedor</Label>
        <select
          id="proveedorId"
          name="proveedorId"
          defaultValue={valores.proveedorId ?? ""}
          className={claseSelect}
        >
          <option value="">Todos</option>
          {proveedores.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre}
            </option>
          ))}
        </select>
      </div>

      <p className="mt-2 text-sm font-medium md:col-span-3">2. Cuánto</p>
      <div className="flex flex-col gap-2">
        <Label htmlFor="porcentaje">Porcentaje</Label>
        <div className="relative">
          <Input
            id="porcentaje"
            name="porcentaje"
            type="number"
            step="0.1"
            min={-90}
            max={500}
            required
            defaultValue={valores.porcentaje ?? ""}
            placeholder="Ej. 8 para aumentar, -5 para bajar"
            className="bg-white pr-8"
          />
          <span className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2 text-sm">
            %
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="campo">Aplicar a</Label>
        <select
          id="campo"
          name="campo"
          defaultValue={valores.campo ?? "precio"}
          className={claseSelect}
        >
          {Object.entries(CAMPOS).map(([valor, nombre]) => (
            <option key={valor} value={valor}>
              {nombre}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="redondeo">Redondear precio de venta</Label>
        <select
          id="redondeo"
          name="redondeo"
          defaultValue={valores.redondeo ?? "10"}
          className={claseSelect}
        >
          {REDONDEOS.map((r) => (
            <option key={r} value={r}>
              {r ? `Hacia arriba, a múltiplos de ${r}` : "Sin redondeo"}
            </option>
          ))}
        </select>
      </div>

      <div className="md:col-span-3">
        <Button type="submit" size="lg">
          <Eye />
          Ver vista previa
        </Button>
      </div>
    </form>
  );
}
