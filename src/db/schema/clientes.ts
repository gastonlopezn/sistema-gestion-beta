import {
  int,
  mysqlEnum,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const clientes = mysqlTable("clientes", {
  id: int("id").autoincrement().primaryKey(),
  nombre: varchar("nombre", { length: 150 }).notNull(),
  tipo: mysqlEnum("tipo", ["particular", "taller", "mayorista"])
    .notNull()
    .default("particular"),
  telefono: varchar("telefono", { length: 50 }),
  email: varchar("email", { length: 150 }),
  cuit: varchar("cuit", { length: 13 }),
  direccion: varchar("direccion", { length: 255 }),
  creadoEn: timestamp("creado_en").notNull().defaultNow(),
});
