import {
  decimal,
  index,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
} from "drizzle-orm/mysql-core";

import { clientes } from "./clientes";
import { productos } from "./productos";

export const mediosDePago = [
  "efectivo",
  "transferencia",
  "debito",
  "credito",
  "mercado_pago",
] as const;

export const ventas = mysqlTable(
  "ventas",
  {
    id: int("id").autoincrement().primaryKey(),
    clienteId: int("cliente_id").references(() => clientes.id, {
      onDelete: "set null",
    }),
    fecha: timestamp("fecha").notNull().defaultNow(),
    medioPago: mysqlEnum("medio_pago", mediosDePago)
      .notNull()
      .default("efectivo"),
    total: decimal("total", { precision: 12, scale: 2 }).notNull(),
    notas: text("notas"),
  },
  (t) => [index("ventas_fecha_idx").on(t.fecha)],
);

export const ventaItems = mysqlTable("venta_items", {
  id: int("id").autoincrement().primaryKey(),
  ventaId: int("venta_id")
    .notNull()
    .references(() => ventas.id, { onDelete: "cascade" }),
  productoId: int("producto_id")
    .notNull()
    .references(() => productos.id),
  cantidad: int("cantidad").notNull(),
  // Precio al momento de la venta: no cambia si después se actualiza el precio del producto.
  precioUnitario: decimal("precio_unitario", {
    precision: 12,
    scale: 2,
  }).notNull(),
  subtotal: decimal("subtotal", { precision: 12, scale: 2 }).notNull(),
});
