import {
  index,
  int,
  mysqlEnum,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

import { productos } from "./productos";
import { ventas } from "./ventas";

// Registro de cada entrada y salida de stock, para poder auditar cambios.
export const movimientosStock = mysqlTable(
  "movimientos_stock",
  {
    id: int("id").autoincrement().primaryKey(),
    productoId: int("producto_id")
      .notNull()
      .references(() => productos.id, { onDelete: "cascade" }),
    tipo: mysqlEnum("tipo", ["ingreso", "venta", "ajuste", "devolucion"]).notNull(),
    // Positivo suma stock, negativo resta.
    cantidad: int("cantidad").notNull(),
    ventaId: int("venta_id").references(() => ventas.id, { onDelete: "set null" }),
    motivo: varchar("motivo", { length: 255 }),
    fecha: timestamp("fecha").notNull().defaultNow(),
  },
  (t) => [index("movimientos_producto_fecha_idx").on(t.productoId, t.fecha)],
);
