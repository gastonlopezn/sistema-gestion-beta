import { ModuloEnConstruccion } from "@/components/panel/modulo-en-construccion";
import { modulosPanel } from "@/config/panel";

export default function Pagina() {
  return (
    <ModuloEnConstruccion
      modulo={modulosPanel.find((m) => m.href === "/panel/presupuestos")!}
    />
  );
}
