"use client";

import Link from "next/link";
import { useActionState } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { EstadoFormulario } from "../schema";

type Valores = {
  codigo?: string;
  descripcion?: string;
  marca?: string | null;
  rubro?: string | null;
  compatibilidad?: string | null;
  proveedorId?: number | null;
  costo?: string;
  precio?: string;
  stock?: number;
  stockMinimo?: number;
};

type Props = {
  accion: (estado: EstadoFormulario, formData: FormData) => Promise<EstadoFormulario>;
  inicial?: Valores;
  proveedores: { id: number; nombre: string }[];
  rubros: string[];
  textoBoton: string;
};

export function FormularioProducto({ accion, inicial = {}, proveedores, rubros, textoBoton }: Props) {
  const [estado, enviar, enviando] = useActionState(accion, {});
  const valor = (campo: keyof Valores) =>
    estado.valores?.[campo] ?? (inicial[campo] == null ? "" : String(inicial[campo]));

  const campo = (
    nombre: keyof Valores,
    etiqueta: string,
    props: React.ComponentProps<typeof Input> = {},
  ) => (
    <div className="flex flex-col gap-2">
      <Label htmlFor={nombre}>{etiqueta}</Label>
      <Input
        id={nombre}
        name={nombre}
        defaultValue={valor(nombre)}
        aria-invalid={Boolean(estado.errores?.[nombre])}
        {...props}
      />
      {estado.errores?.[nombre] && (
        <p className="text-xs text-destructive">{estado.errores[nombre]}</p>
      )}
    </div>
  );

  return (
    <form action={enviar} className="grid max-w-3xl gap-5 bg-white p-6 shadow-sm sm:grid-cols-2">
      {campo("codigo", "Código", { required: true, placeholder: "FIL-12345" })}
      {campo("descripcion", "Descripción", { required: true, placeholder: "Filtro de aceite Fram" })}
      {campo("marca", "Marca")}
      <div className="flex flex-col gap-2">
        <Label htmlFor="rubro">Rubro</Label>
        <Input id="rubro" name="rubro" list="rubros" defaultValue={valor("rubro")} />
        <datalist id="rubros">
          {rubros.map((r) => (
            <option key={r} value={r} />
          ))}
        </datalist>
      </div>
      <div className="sm:col-span-2">
        {campo("compatibilidad", "Compatibilidad", { placeholder: "Ford Ranger 3.2 2012-2023" })}
      </div>
      <div className="flex flex-col gap-2 sm:col-span-2">
        <Label htmlFor="proveedorId">Proveedor</Label>
        <select
          id="proveedorId"
          name="proveedorId"
          defaultValue={valor("proveedorId") || "0"}
          className="h-9 rounded-lg border border-input bg-transparent px-3 text-sm"
        >
          <option value="0">Sin proveedor</option>
          {proveedores.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre}
            </option>
          ))}
        </select>
      </div>
      {campo("costo", "Costo ($)", { type: "number", min: 0, step: "0.01", required: true })}
      {campo("precio", "Precio de venta ($)", { type: "number", min: 0, step: "0.01", required: true })}
      {campo("stock", "Stock actual", { type: "number", min: 0, step: 1, required: true })}
      {campo("stockMinimo", "Stock mínimo", { type: "number", min: 0, step: 1, required: true })}
      {estado.errores?.general && (
        <p className="text-sm text-destructive sm:col-span-2">{estado.errores.general}</p>
      )}
      <div className="flex gap-3 sm:col-span-2">
        <Button type="submit" size="lg" disabled={enviando}>
          {enviando ? "Guardando..." : textoBoton}
        </Button>
        <Link href="/panel/stock" className={buttonVariants({ variant: "outline", size: "lg" })}>
          Cancelar
        </Link>
      </div>
    </form>
  );
}
