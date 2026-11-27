import {
  boolean,
  decimal,
  index,
  int,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

import { proveedores } from "./proveedores";

export const productos = mysqlTable(
  "productos",
  {
    id: int("id").autoincrement().primaryKey(),
    codigo: varchar("codigo", { length: 64 }).notNull().unique(),
    descripcion: varchar("descripcion", { length: 255 }).notNull(),
    marca: varchar("marca", { length: 100 }),
    rubro: varchar("rubro", { length: 100 }),
    // Vehículos con los que es compatible, en texto libre por ahora (ej. "Fiat Palio 1.4 2008-2016").
    compatibilidad: varchar("compatibilidad", { length: 255 }),
    proveedorId: int("proveedor_id").references(() => proveedores.id, {
      onDelete: "set null",
    }),
    costo: decimal("costo", { precision: 12, scale: 2 }).notNull().default("0"),
    precio: decimal("precio", { precision: 12, scale: 2 })
      .notNull()
      .default("0"),
    stock: int("stock").notNull().default(0),
    stockMinimo: int("stock_minimo").notNull().default(0),
    activo: boolean("activo").notNull().default(true),
    creadoEn: timestamp("creado_en").notNull().defaultNow(),
    actualizadoEn: timestamp("actualizado_en")
      .notNull()
      .defaultNow()
      .onUpdateNow(),
  },
  (t) => [
    index("productos_descripcion_idx").on(t.descripcion),
    index("productos_marca_idx").on(t.marca),
  ],
);
