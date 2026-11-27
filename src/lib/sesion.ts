import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

import { auth } from "@/lib/auth";

// Devuelve la sesión actual o redirige al login. Se usa en cada página o acción del panel.
export const requerirSesion = cache(async () => {
  const sesion = await auth.api.getSession({ headers: await headers() });
  if (!sesion) redirect("/login");
  return sesion;
});
