import { cn } from "@/lib/utils";

export function EstadoStock({ stock, stockMinimo }: { stock: number; stockMinimo: number }) {
  const estado =
    stock === 0
      ? { texto: "Sin stock", clase: "bg-red-100 text-red-700" }
      : stock < stockMinimo
        ? { texto: "Bajo mínimo", clase: "bg-amber-100 text-amber-800" }
        : { texto: "OK", clase: "bg-emerald-100 text-emerald-700" };

  return (
    <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap", estado.clase)}>
      {estado.texto}
    </span>
  );
}
