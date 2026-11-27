import { cn } from "@/lib/utils";

// Franjas diagonales rojas y azules, el recurso gráfico de las piezas de Instagram del negocio.
export function Franjas({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute overflow-hidden", className)}>
      <div className="absolute -left-10 bottom-6 h-6 w-[140%] -rotate-6 bg-marca-azul" />
      <div className="absolute -left-10 bottom-0 h-4 w-[140%] -rotate-6 bg-marca-rojo" />
    </div>
  );
}
