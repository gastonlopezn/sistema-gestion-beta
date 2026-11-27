import { BotonCerrarSesion } from "@/features/auth/components/boton-cerrar-sesion";

export function BarraSuperior({ nombre, rol }: { nombre: string; rol: string }) {
  return (
    <header className="flex h-14 items-center justify-end gap-3 border-b bg-white px-4">
      <div className="text-right text-sm leading-tight">
        <p className="font-medium">{nombre}</p>
        <p className="text-xs text-muted-foreground capitalize">{rol}</p>
      </div>
      <BotonCerrarSesion />
    </header>
  );
}
