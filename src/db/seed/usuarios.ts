import { hashPassword } from "better-auth/crypto";
import { randomUUID } from "node:crypto";

import { db } from "../index";
import { account, user } from "../schema";

// Usuario de demo para mostrarle el panel al cliente. Solo para entornos de prueba.
export const usuarioDemo = {
  nombre: "Usuario Demo",
  email: "demo@smrepuestos.com.ar",
  password: process.env.DEMO_PASSWORD ?? "demo-sm-2026",
  rol: "admin" as const,
};

export async function cargarUsuarioDemo() {
  const id = randomUUID();
  await db.insert(user).values({
    id,
    name: usuarioDemo.nombre,
    email: usuarioDemo.email,
    emailVerified: true,
    rol: usuarioDemo.rol,
  });
  await db.insert(account).values({
    id: randomUUID(),
    accountId: id,
    providerId: "credential",
    userId: id,
    password: await hashPassword(usuarioDemo.password),
  });
}
