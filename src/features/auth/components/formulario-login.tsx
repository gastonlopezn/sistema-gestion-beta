"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

export function FormularioLogin() {
  const router = useRouter();
  const desde = useSearchParams().get("desde");
  // Solo se permite volver a rutas internas del panel.
  const destino = desde?.startsWith("/panel") ? desde : "/panel";
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  async function ingresar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const datos = new FormData(evento.currentTarget);
    setError(null);
    setCargando(true);

    const { error } = await authClient.signIn.email({
      email: String(datos.get("email")),
      password: String(datos.get("password")),
    });

    if (error) {
      setError("Email o contraseña incorrectos.");
      setCargando(false);
      return;
    }
    router.push(destino);
    router.refresh();
  }

  return (
    <form onSubmit={ingresar} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Contraseña</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </div>
      {error && (
        <p role="alert" className="text-destructive text-sm">
          {error}
        </p>
      )}
      <Button type="submit" size="lg" disabled={cargando} className="h-10">
        {cargando ? "Ingresando..." : "Ingresar"}
      </Button>
    </form>
  );
}
