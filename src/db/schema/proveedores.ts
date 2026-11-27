import { int, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const proveedores = mysqlTable("proveedores", {
  id: int("id").autoincrement().primaryKey(),
  nombre: varchar("nombre", { length: 150 }).notNull(),
  telefono: varchar("telefono", { length: 50 }),
  email: varchar("email", { length: 150 }),
  notas: text("notas"),
  creadoEn: timestamp("creado_en").notNull().defaultNow(),
});
