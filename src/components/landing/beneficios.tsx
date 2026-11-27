import { CreditCard, Headset, ShieldCheck, Truck } from "lucide-react";

const beneficios = [
  { icono: ShieldCheck, titulo: "Originales y alternativos", detalle: "Calidad garantizada" },
  { icono: CreditCard, titulo: "3 cuotas sin interés", detalle: "Miércoles y sábados con tarjetas bancarizadas" },
  { icono: Truck, titulo: "Envíos a todo el país", detalle: "Te lo mandamos a donde estés" },
  { icono: Headset, titulo: "Asesoramiento", detalle: "Te ayudamos a encontrar el repuesto justo" },
];

export function Beneficios() {
  return (
    <section className="bg-marca-azul text-white">
      <ul className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        {beneficios.map(({ icono: Icono, titulo, detalle }) => (
          <li key={titulo} className="flex items-start gap-3">
            <Icono className="mt-1 size-7 shrink-0 text-marca-rojo" />
            <div>
              <p className="font-heading text-xl font-bold uppercase italic">{titulo}</p>
              <p className="text-sm text-white/75">{detalle}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
