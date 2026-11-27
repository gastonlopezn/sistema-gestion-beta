export function EncabezadoPagina({
  titulo,
  descripcion,
}: {
  titulo: string;
  descripcion?: string;
}) {
  return (
    <div className="mb-6">
      <h1 className="font-heading text-marca-azul text-3xl font-extrabold uppercase italic">
        {titulo}
      </h1>
      {descripcion && (
        <p className="text-muted-foreground text-sm">{descripcion}</p>
      )}
    </div>
  );
}
