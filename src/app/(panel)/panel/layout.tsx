import type { Metadata } from "next";

import { BarraSuperior } from "@/components/panel/barra-superior";
import { MenuLateral } from "@/components/panel/menu-lateral";
import { requerirSesion } from "@/lib/sesion";

export const metadata: Metadata = {
  title: "Panel",
  robots: { index: false },
};

export default async function PanelLayout({ children }: LayoutProps<"/panel">) {
  const { user } = await requerirSesion();

  return (
    <div className="flex min-h-screen flex-1 flex-col bg-neutral-50 md:flex-row">
      <MenuLateral />
      <div className="flex flex-1 flex-col">
        <BarraSuperior nombre={user.name} rol={user.rol ?? "vendedor"} />
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
