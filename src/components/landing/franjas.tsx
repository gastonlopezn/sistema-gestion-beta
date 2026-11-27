import { cn } from "@/lib/utils";

// Franjas diagonales rojas y azules, el recurso gráfico de las piezas de Instagram del negocio.
export function Franjas({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute overflow-hidden", className)}
    >
      <div className="bg-marca-azul absolute bottom-6 -left-10 h-6 w-[140%] -rotate-6" />
      <div className="bg-marca-rojo absolute bottom-0 -left-10 h-4 w-[140%] -rotate-6" />
    </div>
  );
}
