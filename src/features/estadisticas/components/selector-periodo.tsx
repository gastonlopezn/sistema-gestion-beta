import Link from "next/link";

import { cn } from "@/lib/utils";

import { PERIODOS, type Periodo } from "../queries";

export function SelectorPeriodo({ actual }: { actual: Periodo }) {
  return (
    <nav
      className="mb-6 flex flex-wrap items-center gap-2 text-sm"
      aria-label="Período"
    >
      <span className="text-muted-foreground mr-1">Período:</span>
      {PERIODOS.map((dias) => (
        <Link
          key={dias}
          href={`/panel/estadisticas?dias=${dias}`}
          aria-current={dias === actual ? "page" : undefined}
          className={cn(
            "rounded-full border px-3 py-1 transition",
            dias === actual
              ? "border-marca-azul bg-marca-azul text-white"
              : "bg-white hover:bg-neutral-100",
          )}
        >
          Últimos {dias} días
        </Link>
      ))}
    </nav>
  );
}
