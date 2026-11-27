import { BotonCerrarSesion } from "@/features/auth/components/boton-cerrar-sesion";
import { requerirSesion } from "@/lib/sesion";

// Lee la sesión: si no hay, redirige al login. Va dentro de un Suspense en el layout del panel.
export async function BarraSuperior() {
  const { user } = await requerirSesion();

  return (
    <header className="flex h-14 items-center justify-end gap-3 border-b bg-white px-4">
      <div className="text-right text-sm leading-tight">
        <p className="font-medium">{user.name}</p>
        <p className="text-muted-foreground text-xs capitalize">
          {user.rol ?? "vendedor"}
        </p>
      </div>
      <BotonCerrarSesion />
    </header>
  );
}

export function BarraSuperiorCargando() {
  return <div className="h-14 border-b bg-white" />;
}
