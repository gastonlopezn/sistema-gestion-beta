// Carga datos de prueba para la demo: `npm run db:seed`.
// Borra todo lo que haya en las tablas, así que nunca se corre contra producción.
import "dotenv/config";

import { fakerES as faker } from "@faker-js/faker";
import { sql } from "drizzle-orm";

import { db } from "../index";
import {
  clientes,
  mediosDePago,
  movimientosStock,
  presupuestoItems,
  presupuestos,
  productos,
  proveedores,
  ventaItems,
  ventas,
} from "../schema";
import { proveedoresDemo, rubros, vehiculos } from "./catalogo";

const CANTIDAD_PRODUCTOS = 200;
const CANTIDAD_CLIENTES = 60;
const CANTIDAD_PRESUPUESTOS = 40;
const MESES_DE_VENTAS = 6;

// Semilla fija: cada corrida genera exactamente los mismos datos.
faker.seed(1412);

const pesos = (n: number) => n.toFixed(2);
const redondear = (n: number) => Math.round(n / 50) * 50;

async function limpiarTablas() {
  const tablas = [
    "movimientos_stock",
    "presupuesto_items",
    "presupuestos",
    "venta_items",
    "ventas",
    "productos",
    "clientes",
    "proveedores",
  ];
  await db.execute(sql`SET FOREIGN_KEY_CHECKS = 0`);
  for (const tabla of tablas) {
    await db.execute(sql.raw(`TRUNCATE TABLE \`${tabla}\``));
  }
  await db.execute(sql`SET FOREIGN_KEY_CHECKS = 1`);
}

async function cargarProveedores() {
  await db.insert(proveedores).values(
    proveedoresDemo.map((nombre) => ({
      nombre,
      telefono: faker.phone.number(),
      email: faker.internet
        .email({ firstName: nombre.split(" ")[0] })
        .toLowerCase(),
    })),
  );
  return (await db.select({ id: proveedores.id }).from(proveedores)).map(
    (p) => p.id,
  );
}

async function cargarProductos(proveedorIds: number[]) {
  const codigos = new Set<string>();
  const filas = Array.from({ length: CANTIDAD_PRODUCTOS }, () => {
    const rubro = faker.helpers.arrayElement(rubros);
    const marca = faker.helpers.arrayElement(rubro.marcas);
    const nombre = faker.helpers.arrayElement(rubro.productos);
    const vehiculo = faker.helpers.arrayElement(vehiculos);

    let codigo: string;
    do {
      codigo = `${rubro.nombre.slice(0, 3).toUpperCase()}-${faker.string.numeric(5)}`;
    } while (codigos.has(codigo));
    codigos.add(codigo);

    const costo = redondear(
      faker.number.int({ min: rubro.costo[0], max: rubro.costo[1] }),
    );
    const margen = faker.number.float({ min: 1.35, max: 1.8 });

    return {
      codigo,
      descripcion: `${nombre} ${marca}`,
      marca,
      rubro: rubro.nombre,
      compatibilidad: vehiculo,
      proveedorId: faker.helpers.arrayElement(proveedorIds),
      costo: pesos(costo),
      precio: pesos(redondear(costo * margen)),
      stockMinimo: faker.number.int({ min: 2, max: 8 }),
      stock: 0,
    };
  });
  await db.insert(productos).values(filas);
  return db
    .select({
      id: productos.id,
      precio: productos.precio,
      stockMinimo: productos.stockMinimo,
    })
    .from(productos);
}

async function cargarClientes() {
  const filas = Array.from({ length: CANTIDAD_CLIENTES }, () => {
    const tipo = faker.helpers.weightedArrayElement([
      { weight: 7, value: "particular" as const },
      { weight: 2, value: "taller" as const },
      { weight: 1, value: "mayorista" as const },
    ]);
    const nombre =
      tipo === "particular"
        ? faker.person.fullName()
        : `${tipo === "taller" ? "Taller" : "Repuestera"} ${faker.person.lastName()}`;
    return {
      nombre,
      tipo,
      telefono: faker.phone.number(),
      email: faker.datatype.boolean(0.6)
        ? faker.internet.email().toLowerCase()
        : null,
      cuit:
        tipo === "particular"
          ? null
          : `30-${faker.string.numeric(8)}-${faker.string.numeric(1)}`,
      direccion: faker.location.streetAddress(),
    };
  });
  await db.insert(clientes).values(filas);
  return (await db.select({ id: clientes.id }).from(clientes)).map((c) => c.id);
}

type Producto = Awaited<ReturnType<typeof cargarProductos>>[number];

function armarItems(catalogo: Producto[]) {
  const elegidos = faker.helpers.arrayElements(catalogo, { min: 1, max: 4 });
  return elegidos.map((p) => {
    const cantidad = faker.number.int({ min: 1, max: 4 });
    const precio = Number(p.precio);
    return {
      productoId: p.id,
      cantidad,
      precioUnitario: pesos(precio),
      subtotal: pesos(precio * cantidad),
    };
  });
}

async function cargarVentas(catalogo: Producto[], clienteIds: number[]) {
  const vendidos = new Map<number, number>();
  const hoy = new Date();
  const inicio = new Date(hoy);
  inicio.setMonth(inicio.getMonth() - MESES_DE_VENTAS);

  for (let dia = new Date(inicio); dia <= hoy; dia.setDate(dia.getDate() + 1)) {
    if (dia.getDay() === 0) continue; // domingo cerrado
    const ventasDelDia = faker.number.int({
      min: 2,
      max: dia.getDay() === 6 ? 6 : 10,
    });

    for (let i = 0; i < ventasDelDia; i++) {
      const fecha = new Date(dia);
      fecha.setHours(
        faker.number.int({ min: 8, max: 19 }),
        faker.number.int({ min: 0, max: 59 }),
      );
      const items = armarItems(catalogo);
      const total = items.reduce(
        (suma, item) => suma + Number(item.subtotal),
        0,
      );

      const [venta] = await db
        .insert(ventas)
        .values({
          clienteId: faker.datatype.boolean(0.55)
            ? faker.helpers.arrayElement(clienteIds)
            : null,
          fecha,
          medioPago: faker.helpers.arrayElement(mediosDePago),
          total: pesos(total),
        })
        .$returningId();

      await db
        .insert(ventaItems)
        .values(items.map((item) => ({ ...item, ventaId: venta.id })));
      await db.insert(movimientosStock).values(
        items.map((item) => ({
          productoId: item.productoId,
          tipo: "venta" as const,
          cantidad: -item.cantidad,
          ventaId: venta.id,
          fecha,
        })),
      );
      for (const item of items) {
        vendidos.set(
          item.productoId,
          (vendidos.get(item.productoId) ?? 0) + item.cantidad,
        );
      }
    }
  }
  return { vendidos, inicio };
}

async function cargarStock(
  catalogo: Producto[],
  vendidos: Map<number, number>,
  inicio: Date,
) {
  for (const p of catalogo) {
    // Algunos productos quedan por debajo del mínimo para que se vean las alertas.
    const stockFinal = faker.datatype.boolean(0.15)
      ? faker.number.int({ min: 0, max: p.stockMinimo - 1 })
      : faker.number.int({ min: p.stockMinimo, max: 40 });
    const ingreso = stockFinal + (vendidos.get(p.id) ?? 0);

    await db.insert(movimientosStock).values({
      productoId: p.id,
      tipo: "ingreso",
      cantidad: ingreso,
      motivo: "Stock inicial",
      fecha: inicio,
    });
    await db
      .update(productos)
      .set({ stock: stockFinal })
      .where(sql`${productos.id} = ${p.id}`);
  }
}

async function cargarPresupuestos(catalogo: Producto[], clienteIds: number[]) {
  for (let i = 0; i < CANTIDAD_PRESUPUESTOS; i++) {
    const fecha = faker.date.recent({ days: 60 });
    const validoHasta = new Date(fecha);
    validoHasta.setDate(validoHasta.getDate() + 15);
    const items = armarItems(catalogo);
    const total = items.reduce((suma, item) => suma + Number(item.subtotal), 0);

    const [presupuesto] = await db
      .insert(presupuestos)
      .values({
        clienteId: faker.helpers.arrayElement(clienteIds),
        fecha,
        validoHasta: validoHasta.toISOString().slice(0, 10),
        estado:
          validoHasta < new Date()
            ? faker.helpers.arrayElement([
                "aceptado",
                "rechazado",
                "vencido",
              ] as const)
            : "pendiente",
        total: pesos(total),
      })
      .$returningId();

    await db
      .insert(presupuestoItems)
      .values(
        items.map((item) => ({ ...item, presupuestoId: presupuesto.id })),
      );
  }
}

async function main() {
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "El seed borra todos los datos: no se puede correr en producción.",
    );
  }

  console.log("Limpiando tablas...");
  await limpiarTablas();

  console.log("Cargando proveedores, productos y clientes...");
  const proveedorIds = await cargarProveedores();
  const catalogo = await cargarProductos(proveedorIds);
  const clienteIds = await cargarClientes();

  console.log(`Cargando ${MESES_DE_VENTAS} meses de ventas...`);
  const { vendidos, inicio } = await cargarVentas(catalogo, clienteIds);

  console.log("Calculando stock...");
  await cargarStock(catalogo, vendidos, inicio);

  console.log("Cargando presupuestos...");
  await cargarPresupuestos(catalogo, clienteIds);

  console.log("Datos de prueba cargados.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
