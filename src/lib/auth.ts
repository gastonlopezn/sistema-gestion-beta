import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";

import { db } from "@/db";
import * as schema from "@/db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "mysql", schema }),
  emailAndPassword: {
    enabled: true,
    // Los usuarios los crea el administrador; no hay registro público.
    disableSignUp: true,
  },
  user: {
    additionalFields: {
      rol: {
        type: ["admin", "vendedor"],
        required: false,
        defaultValue: "vendedor",
        input: false,
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 días
  },
  plugins: [nextCookies()],
});

export type Sesion = typeof auth.$Infer.Session;
