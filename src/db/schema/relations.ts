import { relations } from "drizzle-orm";

import { clientes } from "./clientes";
import { movimientosStock } from "./movimientos-stock";
import { presupuestoItems, presupuestos } from "./presupuestos";
import { productos } from "./productos";
import { proveedores } from "./proveedores";
import { ventaItems, ventas } from "./ventas";

export const proveedoresRelations = relations(proveedores, ({ many }) => ({
  productos: many(productos),
}));

export const productosRelations = relations(productos, ({ one, many }) => ({
  proveedor: one(proveedores, {
    fields: [productos.proveedorId],
    references: [proveedores.id],
  }),
  movimientos: many(movimientosStock),
}));

export const clientesRelations = relations(clientes, ({ many }) => ({
  ventas: many(ventas),
  presupuestos: many(presupuestos),
}));

export const ventasRelations = relations(ventas, ({ one, many }) => ({
  cliente: one(clientes, { fields: [ventas.clienteId], references: [clientes.id] }),
  items: many(ventaItems),
}));

export const ventaItemsRelations = relations(ventaItems, ({ one }) => ({
  venta: one(ventas, { fields: [ventaItems.ventaId], references: [ventas.id] }),
  producto: one(productos, {
    fields: [ventaItems.productoId],
    references: [productos.id],
  }),
}));

export const presupuestosRelations = relations(presupuestos, ({ one, many }) => ({
  cliente: one(clientes, {
    fields: [presupuestos.clienteId],
    references: [clientes.id],
  }),
  venta: one(ventas, { fields: [presupuestos.ventaId], references: [ventas.id] }),
  items: many(presupuestoItems),
}));

export const presupuestoItemsRelations = relations(presupuestoItems, ({ one }) => ({
  presupuesto: one(presupuestos, {
    fields: [presupuestoItems.presupuestoId],
    references: [presupuestos.id],
  }),
  producto: one(productos, {
    fields: [presupuestoItems.productoId],
    references: [productos.id],
  }),
}));

export const movimientosStockRelations = relations(movimientosStock, ({ one }) => ({
  producto: one(productos, {
    fields: [movimientosStock.productoId],
    references: [productos.id],
  }),
  venta: one(ventas, { fields: [movimientosStock.ventaId], references: [ventas.id] }),
}));
