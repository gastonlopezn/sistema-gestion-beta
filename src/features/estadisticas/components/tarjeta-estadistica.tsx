import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";

// Tarjeta con un número y, si se pasa, la variación contra el período anterior.
export function TarjetaEstadistica({
  titulo,
  valor,
  actual,
  anterior,
  comparacion,
}: {
  titulo: string;
  valor: string;
  actual?: number;
  anterior?: number;
  comparacion?: string;
}) {
  const variacion =
    actual !== undefined && anterior
      ? ((actual - anterior) / anterior) * 100
      : undefined;
  const sube = (variacion ?? 0) >= 0;
  const Flecha = sube ? ArrowUpRight : ArrowDownRight;

  return (
    <div className="bg-white p-5 shadow-sm">
      <p className="text-muted-foreground text-sm">{titulo}</p>
      <p className="mt-1 text-3xl font-semibold">{valor}</p>
      {variacion !== undefined && (
        <p
          className={cn(
            "mt-1 flex items-center gap-1 text-xs font-medium",
            sube ? "text-emerald-700" : "text-red-700",
          )}
        >
          <Flecha className="size-3.5" aria-hidden />
          {sube ? "+" : "−"}
          {Math.abs(variacion).toFixed(1).replace(".", ",")}%
          <span className="text-muted-foreground font-normal">
            {comparacion}
          </span>
        </p>
      )}
    </div>
  );
}
