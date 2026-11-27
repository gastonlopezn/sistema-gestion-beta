import { Receipt, ShoppingCart, Wallet } from "lucide-react";

import { formatearPesos } from "@/lib/formato";

export function ResumenVentas({
  cantidad,
  facturado,
  ticketPromedio,
}: {
  cantidad: number;
  facturado: number;
  ticketPromedio: number;
}) {
  const tarjetas = [
    { titulo: "Ventas", valor: String(cantidad), icono: ShoppingCart },
    { titulo: "Facturado", valor: formatearPesos(facturado), icono: Wallet },
    { titulo: "Ticket promedio", valor: formatearPesos(ticketPromedio), icono: Receipt },
  ];
  return (
    <div className="mb-6 grid gap-4 sm:grid-cols-3">
      {tarjetas.map(({ titulo, valor, icono: Icono }) => (
        <div key={titulo} className="flex items-center gap-4 bg-white p-4 shadow-sm">
          <Icono className="size-8 text-marca-azul" />
          <div>
            <p className="text-2xl font-semibold">{valor}</p>
            <p className="text-sm text-muted-foreground">{titulo}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
