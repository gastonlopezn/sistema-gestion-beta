import {
  date,
  decimal,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
} from "drizzle-orm/mysql-core";

import { clientes } from "./clientes";
import { productos } from "./productos";
import { ventas } from "./ventas";

export const presupuestos = mysqlTable("presupuestos", {
  id: int("id").autoincrement().primaryKey(),
  clienteId: int("cliente_id").references(() => clientes.id, {
    onDelete: "set null",
  }),
  fecha: timestamp("fecha").notNull().defaultNow(),
  validoHasta: date("valido_hasta", { mode: "string" }),
  estado: mysqlEnum("estado", ["pendiente", "aceptado", "rechazado", "vencido"])
    .notNull()
    .default("pendiente"),
  total: decimal("total", { precision: 12, scale: 2 }).notNull(),
  // Se completa cuando el presupuesto se convierte en venta.
  ventaId: int("venta_id").references(() => ventas.id, {
    onDelete: "set null",
  }),
  notas: text("notas"),
});

export const presupuestoItems = mysqlTable("presupuesto_items", {
  id: int("id").autoincrement().primaryKey(),
  presupuestoId: int("presupuesto_id")
    .notNull()
    .references(() => presupuestos.id, { onDelete: "cascade" }),
  productoId: int("producto_id")
    .notNull()
    .references(() => productos.id),
  cantidad: int("cantidad").notNull(),
  precioUnitario: decimal("precio_unitario", {
    precision: 12,
    scale: 2,
  }).notNull(),
  subtotal: decimal("subtotal", { precision: 12, scale: 2 }).notNull(),
});
