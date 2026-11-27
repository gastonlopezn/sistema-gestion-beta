import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

import * as schema from "./schema";

// El pool no se conecta hasta la primera consulta, así que el build funciona sin DATABASE_URL.
// En ejecución, si falta la variable, la consulta falla con un error de conexión.
const pool = mysql.createPool(
  process.env.DATABASE_URL ?? "mysql://localhost:3306/sin_configurar",
);

export const db = drizzle(pool, { schema, mode: "default" });
