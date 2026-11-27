"use client";

import { Minus, Plus, Search, X } from "lucide-react";
import { useEffect, useRef, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatearPesos } from "@/lib/formato";

import { buscarProductos } from "../actions";
import type { ProductoParaVenta } from "../queries";

export type Linea = ProductoParaVenta & { cantidad: number };

export const totalLineas = (lineas: Linea[]) =>
  lineas.reduce((suma, l) => suma + Number(l.precio) * l.cantidad, 0);

// Buscador de productos y lista de líneas. Lo usan la venta y el presupuesto.
// Manda las líneas al servidor en un campo oculto "items" como JSON.
export function Carrito({
  lineas,
  setLineas,
}: {
  lineas: Linea[];
  setLineas: React.Dispatch<React.SetStateAction<Linea[]>>;
}) {
  const [busqueda, setBusqueda] = useState("");
  // Cada respuesta guarda el texto que la originó: si no coincide con lo escrito, está desactualizada.
  const [respuesta, setRespuesta] = useState<{
    texto: string;
    productos: ProductoParaVenta[];
  }>({ texto: "", productos: [] });
  const [, iniciarBusqueda] = useTransition();
  const ultimaBusqueda = useRef("");
  const texto = busqueda.trim();
  const buscando = respuesta.texto !== texto;
  const resultados = buscando ? [] : respuesta.productos;

  // Busca 300 ms después de que se deja de escribir.
  useEffect(() => {
    ultimaBusqueda.current = busqueda;
    const espera = setTimeout(() => {
      iniciarBusqueda(async () => {
        const productos = await buscarProductos(busqueda);
        // Una respuesta lenta de una búsqueda anterior no pisa la actual.
        if (ultimaBusqueda.current === busqueda)
          setRespuesta({ texto: busqueda.trim(), productos });
      });
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

  return (
    <>
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
    </>
  );
}
