export function EncabezadoPagina({ titulo, descripcion }: { titulo: string; descripcion?: string }) {
  return (
    <div className="mb-6">
      <h1 className="font-heading text-3xl font-extrabold text-marca-azul uppercase italic">
        {titulo}
      </h1>
      {descripcion && <p className="text-sm text-muted-foreground">{descripcion}</p>}
    </div>
  );
}
