import type { Metadata } from "next";
import { Suspense } from "react";

import {
  BarraSuperior,
  BarraSuperiorCargando,
} from "@/components/panel/barra-superior";
import { MenuLateral } from "@/components/panel/menu-lateral";

export const metadata: Metadata = {
  title: "Panel",
  robots: { index: false },
};

// El menú se prerenderiza; lo que depende del usuario se carga dentro de Suspense.
export default function PanelLayout({ children }: LayoutProps<"/panel">) {
  return (
    <div className="flex min-h-screen flex-1 flex-col bg-neutral-50 md:flex-row">
      <MenuLateral />
      <div className="flex flex-1 flex-col">
        <Suspense fallback={<BarraSuperiorCargando />}>
          <BarraSuperior />
        </Suspense>
        <main className="flex-1 p-4 md:p-8">
          <Suspense
            fallback={
              <p className="text-muted-foreground text-sm">Cargando...</p>
            }
          >
            {children}
          </Suspense>
        </main>
      </div>
    </div>
  );
}
