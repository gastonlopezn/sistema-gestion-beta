"use client";

import { Trash2 } from "lucide-react";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";

// Pide una segunda confirmación en el mismo botón, sin ventanas emergentes.
export function BotonDarDeBaja({ accion }: { accion: () => Promise<void> }) {
  const [confirmando, setConfirmando] = useState(false);
  const [pendiente, iniciar] = useTransition();

  if (!confirmando) {
    return (
      <Button variant="destructive" onClick={() => setConfirmando(true)}>
        <Trash2 />
        Dar de baja
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <span>¿Seguro? Deja de aparecer en el stock.</span>
      <Button variant="destructive" disabled={pendiente} onClick={() => iniciar(() => accion())}>
        {pendiente ? "Dando de baja..." : "Sí, dar de baja"}
      </Button>
      <Button variant="ghost" onClick={() => setConfirmando(false)}>
        Cancelar
      </Button>
    </div>
  );
}
