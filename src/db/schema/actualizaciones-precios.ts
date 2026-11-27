import {
  decimal,
  int,
  mysqlEnum,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

// Historial de aumentos masivos: quién, cuándo, cuánto y a qué productos.
export const actualizacionesPrecios = mysqlTable("actualizaciones_precios", {
  id: int("id").autoincrement().primaryKey(),
  fecha: timestamp("fecha").notNull().defaultNow(),
  usuario: varchar("usuario", { length: 150 }).notNull(),
  porcentaje: decimal("porcentaje", { precision: 6, scale: 2 }).notNull(),
  campo: mysqlEnum("campo", ["precio", "costo", "ambos"]).notNull(),
  // Múltiplo al que se redondea hacia arriba el precio nuevo (0 = sin redondeo).
  redondeo: int("redondeo").notNull().default(0),
  // Resumen legible de los filtros usados, por ejemplo "Rubro: Frenos · Marca: Bosch".
  filtros: varchar("filtros", { length: 255 }).notNull(),
  productos: int("productos").notNull(),
});
