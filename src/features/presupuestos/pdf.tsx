import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";

import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
  renderToBuffer,
} from "@react-pdf/renderer";

import { negocio } from "@/config/negocio";
import { formatearDia } from "@/lib/fechas";
import { formatearFechaHora, formatearPesos } from "@/lib/formato";

import type { PresupuestoCompleto } from "./queries";

const AZUL = "#2e226a";
const ROJO = "#e42b0f";
const GRIS = "#6b7280";

const estilos = StyleSheet.create({
  pagina: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#111827",
  },
  encabezado: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 3,
    borderBottomColor: ROJO,
    paddingBottom: 12,
    marginBottom: 20,
  },
  marca: { flexDirection: "row", alignItems: "center", gap: 10 },
  logo: { width: 56, height: 56 },
  nombre: { fontSize: 18, fontFamily: "Helvetica-BoldOblique", color: AZUL },
  contacto: { color: GRIS, fontSize: 9, marginTop: 2 },
  titulo: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: AZUL,
    textAlign: "right",
  },
  datos: { flexDirection: "row", gap: 30, marginBottom: 20 },
  etiqueta: {
    fontSize: 8,
    color: GRIS,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  fila: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingVertical: 6,
  },
  cabecera: {
    backgroundColor: AZUL,
    color: "white",
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
  },
  colProducto: { flex: 1, paddingHorizontal: 6 },
  colCantidad: { width: 50, textAlign: "right", paddingHorizontal: 6 },
  colPrecio: { width: 80, textAlign: "right", paddingHorizontal: 6 },
  codigo: { color: GRIS, fontSize: 8 },
  total: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 20,
    marginTop: 12,
  },
  totalValor: { fontSize: 14, fontFamily: "Helvetica-Bold" },
  notas: { marginTop: 20, color: GRIS },
  pie: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    color: GRIS,
    fontSize: 8,
  },
});

function PresupuestoPdf({
  presupuesto,
  logo,
}: {
  presupuesto: PresupuestoCompleto;
  logo: Buffer;
}) {
  const { direccion, whatsapp, telefono } = negocio;
  return (
    <Document
      title={`Presupuesto #${presupuesto.id} - ${negocio.nombre}`}
      author={negocio.nombre}
    >
      <Page size="A4" style={estilos.pagina}>
        <View style={estilos.encabezado}>
          <View style={estilos.marca}>
            {/* eslint-disable-next-line jsx-a11y/alt-text -- Image de react-pdf no admite alt */}
            <Image src={{ data: logo, format: "png" }} style={estilos.logo} />
            <View>
              <Text style={estilos.nombre}>{negocio.nombre.toUpperCase()}</Text>
              <Text style={estilos.contacto}>
                {direccion.calle}, {direccion.ciudad}, {direccion.provincia}
              </Text>
              <Text style={estilos.contacto}>
                WhatsApp {whatsapp.visible} · Tel. {telefono.visible}
              </Text>
            </View>
          </View>
          <View>
            <Text style={estilos.titulo}>PRESUPUESTO</Text>
            <Text style={[estilos.contacto, { textAlign: "right" }]}>
              N.º {presupuesto.id}
            </Text>
          </View>
        </View>

        <View style={estilos.datos}>
          <View>
            <Text style={estilos.etiqueta}>Cliente</Text>
            <Text>{presupuesto.cliente?.nombre ?? "Consumidor final"}</Text>
          </View>
          <View>
            <Text style={estilos.etiqueta}>Fecha</Text>
            <Text>{formatearFechaHora(presupuesto.fecha)}</Text>
          </View>
          {presupuesto.validoHasta && (
            <View>
              <Text style={estilos.etiqueta}>Válido hasta</Text>
              <Text>{formatearDia(presupuesto.validoHasta)}</Text>
            </View>
          )}
        </View>

        <View style={[estilos.fila, estilos.cabecera]}>
          <Text style={estilos.colProducto}>Producto</Text>
          <Text style={estilos.colCantidad}>Cant.</Text>
          <Text style={estilos.colPrecio}>Precio</Text>
          <Text style={estilos.colPrecio}>Subtotal</Text>
        </View>
        {presupuesto.items.map((item) => (
          <View key={item.id} style={estilos.fila} wrap={false}>
            <View style={estilos.colProducto}>
              <Text>{item.producto.descripcion}</Text>
              <Text style={estilos.codigo}>{item.producto.codigo}</Text>
            </View>
            <Text style={estilos.colCantidad}>{item.cantidad}</Text>
            <Text style={estilos.colPrecio}>
              {formatearPesos(item.precioUnitario)}
            </Text>
            <Text style={estilos.colPrecio}>
              {formatearPesos(item.subtotal)}
            </Text>
          </View>
        ))}

        <View style={estilos.total}>
          <Text>Total</Text>
          <Text style={estilos.totalValor}>
            {formatearPesos(presupuesto.total)}
          </Text>
        </View>

        {presupuesto.notas && (
          <Text style={estilos.notas}>{presupuesto.notas}</Text>
        )}

        <Text style={estilos.pie} fixed>
          Precios sujetos a disponibilidad de stock. {negocio.nombre}, desde{" "}
          {negocio.historia.desde}.
        </Text>
      </Page>
    </Document>
  );
}

export async function generarPdfPresupuesto(presupuesto: PresupuestoCompleto) {
  const logo = await readFile(
    path.join(process.cwd(), "public/images/logo-sm-repuestos.png"),
  );
  return renderToBuffer(
    <PresupuestoPdf presupuesto={presupuesto} logo={logo} />,
  );
}
