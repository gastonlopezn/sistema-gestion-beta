import { cn } from "@/lib/utils";

export function TituloSeccion({
  children,
  className,
  claro = false,
}: {
  children: React.ReactNode;
  className?: string;
  claro?: boolean;
}) {
  return (
    <h2
      className={cn(
        "font-heading text-4xl font-extrabold tracking-tight uppercase italic sm:text-5xl",
        claro ? "text-white" : "text-marca-azul",
        className,
      )}
    >
      {children}
      <span className="bg-marca-rojo mt-2 block h-1.5 w-20 -skew-x-12" />
    </h2>
  );
}
