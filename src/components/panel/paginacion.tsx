import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  ruta: string;
  pagina: number;
  paginas: number;
  total: number;
  parametros: Record<string, string | undefined>;
};

export function Paginacion({
  ruta,
  pagina,
  paginas,
  total,
  parametros,
}: Props) {
  const url = (p: number) => {
    const query = new URLSearchParams();
    for (const [clave, valor] of Object.entries(parametros))
      if (valor) query.set(clave, valor);
    if (p > 1) query.set("pagina", String(p));
    const texto = query.toString();
    return texto ? `${ruta}?${texto}` : ruta;
  };

  return (
    <nav
      className="mt-4 flex items-center justify-between text-sm"
      aria-label="Paginación"
    >
      <p className="text-muted-foreground">
        {total} resultado{total === 1 ? "" : "s"} · página {pagina} de {paginas}
      </p>
      <div className="flex gap-2">
        <Link
          href={url(pagina - 1)}
          aria-disabled={pagina <= 1}
          className={cn(
            buttonVariants({ variant: "outline" }),
            pagina <= 1 && "pointer-events-none opacity-50",
          )}
        >
          Anterior
        </Link>
        <Link
          href={url(pagina + 1)}
          aria-disabled={pagina >= paginas}
          className={cn(
            buttonVariants({ variant: "outline" }),
            pagina >= paginas && "pointer-events-none opacity-50",
          )}
        >
          Siguiente
        </Link>
      </div>
    </nav>
  );
}
