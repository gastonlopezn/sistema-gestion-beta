"use client";

import { Minus, Plus, Search, X } from "lucide-react";
import Link from "next/link";
import { useActionState, useEffect, useState, useTransition } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatearPesos } from "@/lib/formato";

import { buscarProductos, registrarVenta } from "../actions";
import { opcionesMedioDePago } from "../medios-de-pago";
import type { ProductoParaVenta } from "../queries";

type Linea = ProductoParaVenta & { cantidad: number };

const claseSelect =
  "h-9 w-full rounded-lg border border-input bg-transparent px-3 text-sm";

export function FormularioVenta({
  clientes,
}: {
  clientes: { id: number; nombre: string }[];
}) {
  const [estado, enviar, enviando] = useActionState(registrarVenta, {});
  const [busqueda, setBusqueda] = useState("");
  const [resultados, setResultados] = useState<ProductoParaVenta[]>([]);
  const [buscando, iniciarBusqueda] = useTransition();
  const [lineas, setLineas] = useState<Linea[]>([]);

  // Busca 300 ms después de que se deja de escribir.
  useEffect(() => {
    const espera = setTimeout(() => {
      iniciarBusqueda(async () =>
        setResultados(await buscarProductos(busqueda)),
      );
    }, 300);
    return () => clearTimeout(espera);
  }, [busqueda]);

  const agregar = (producto: ProductoParaVenta) => {
    setLineas((actuales) => {
      const existente = actuales.find((l) => l.id === producto.id);
      if (existente)
        return actuales.map((l) =>
          l.id === producto.id
            ? { ...l, cantidad: Math.min(l.cantidad + 1, l.stock) }
            : l,
        );
      return [...actuales, { ...producto, cantidad: 1 }];
    });
    setBusqueda("");
  };

  const cambiarCantidad = (id: number, cantidad: number) =>
    setLineas((actuales) =>
      actuales.map((l) =>
        l.id === id
          ? { ...l, cantidad: Math.max(1, Math.min(cantidad || 1, l.stock)) }
          : l,
      ),
    );

  const quitar = (id: number) =>
    setLineas((actuales) => actuales.filter((l) => l.id !== id));

  const total = lineas.reduce(
    (suma, l) => suma + Number(l.precio) * l.cantidad,
    0,
  );

  return (
    <form
      action={enviar}
      className="grid max-w-5xl gap-6 lg:grid-cols-[1fr_20rem]"
    >
      <input
        type="hidden"
        name="items"
        value={JSON.stringify(
          lineas.map((l) => ({ productoId: l.id, cantidad: l.cantidad })),
        )}
      />

      <section className="flex flex-col gap-4 bg-white p-6 shadow-sm">
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (resultados[0]) agregar(resultados[0]);
              }
            }}
            placeholder="Buscar por código, descripción, marca o vehículo"
            className="pl-9"
            aria-label="Buscar producto"
            autoFocus
          />
          {busqueda.trim().length >= 2 && (
            <ul className="absolute z-10 mt-1 w-full divide-y border bg-white shadow-lg">
              {resultados.length === 0 && (
                <li className="text-muted-foreground p-3 text-sm">
                  {buscando
                    ? "Buscando..."
                    : "No hay productos con stock que coincidan"}
                </li>
              )}
              {resultados.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => agregar(p)}
                    className="flex w-full items-center justify-between gap-4 p-3 text-left text-sm hover:bg-neutral-50"
                  >
                    <span>
                      {p.descripcion}
                      <span className="text-muted-foreground block font-mono text-xs">
                        {p.codigo} · stock {p.stock}
                      </span>
                    </span>
                    <span className="font-medium">
                      {formatearPesos(p.precio)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {lineas.length === 0 ? (
          <p className="text-muted-foreground py-10 text-center text-sm">
            Buscá un producto para agregarlo a la venta.
          </p>
        ) : (
          <ul className="divide-y">
            {lineas.map((l) => (
              <li
                key={l.id}
                className="flex flex-wrap items-center gap-3 py-3 text-sm"
              >
                <div className="min-w-48 flex-1">
                  <p className="font-medium">{l.descripcion}</p>
                  <p className="text-muted-foreground font-mono text-xs">
                    {l.codigo} · {formatearPesos(l.precio)} c/u · stock{" "}
                    {l.stock}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    aria-label="Restar uno"
                    onClick={() => cambiarCantidad(l.id, l.cantidad - 1)}
                  >
                    <Minus />
                  </Button>
                  <Input
                    type="number"
                    min={1}
                    max={l.stock}
                    value={l.cantidad}
                    onChange={(e) =>
                      cambiarCantidad(l.id, Number(e.target.value))
                    }
                    className="w-16 text-center"
                    aria-label={`Cantidad de ${l.descripcion}`}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    aria-label="Sumar uno"
                    onClick={() => cambiarCantidad(l.id, l.cantidad + 1)}
                  >
                    <Plus />
                  </Button>
                </div>
                <p className="w-28 text-right font-medium">
                  {formatearPesos(Number(l.precio) * l.cantidad)}
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={`Quitar ${l.descripcion}`}
                  onClick={() => quitar(l.id)}
                >
                  <X />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </section>

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
