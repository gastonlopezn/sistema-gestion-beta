// Datos del negocio que usa la landing. Para cambiar un horario o un teléfono, se edita solo este archivo.

export const negocio = {
  nombre: "SM Repuestos",
  descripcion:
    "Especialistas en repuestos Ford y Chevrolet en Río Cuarto. Originales y alternativos, con stock permanente y asesoramiento personalizado.",
  historia: {
    nombreAnterior: "Sarmiento Repuestos",
    desde: 1974,
  },
  marcas: ["Ford", "Chevrolet"],
  direccion: {
    calle: "Av. Sabattini 1999",
    ciudad: "Río Cuarto",
    provincia: "Córdoba",
    pais: "Argentina",
    codigoPais: "AR",
  },
  whatsapp: {
    visible: "+54 9 358 509-8884",
    // Formato internacional sin espacios ni signos, para wa.me.
    numero: "5493585098884",
    mensaje: "Hola SM Repuestos, quería hacer una consulta.",
  },
  telefono: {
    visible: "358 576-0980",
    numero: "+543585760980",
  },
  instagram: {
    usuario: "smrepuestosfyc",
    url: "https://www.instagram.com/smrepuestosfyc/",
  },
} as const;

// Días en orden de lunes a domingo. Cada turno es [apertura, cierre] en formato 24 h.
export const horarios = [
  {
    dia: "Lunes",
    turnos: [
      ["08:00", "12:30"],
      ["15:00", "19:00"],
    ],
  },
  {
    dia: "Martes",
    turnos: [
      ["08:00", "12:30"],
      ["15:00", "19:00"],
    ],
  },
  {
    dia: "Miércoles",
    turnos: [
      ["08:00", "12:30"],
      ["15:00", "19:00"],
    ],
  },
  {
    dia: "Jueves",
    turnos: [
      ["08:00", "12:30"],
      ["15:00", "19:00"],
    ],
  },
  {
    dia: "Viernes",
    turnos: [
      ["08:00", "12:30"],
      ["15:00", "19:00"],
    ],
  },
  { dia: "Sábado", turnos: [["08:00", "12:00"]] },
  { dia: "Domingo", turnos: [] },
] as const;

export const direccionCompleta = `${negocio.direccion.calle}, ${negocio.direccion.ciudad}, ${negocio.direccion.provincia}, ${negocio.direccion.pais}`;

export const urlWhatsapp = `https://wa.me/${negocio.whatsapp.numero}?text=${encodeURIComponent(negocio.whatsapp.mensaje)}`;

export const urlMapa = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(direccionCompleta)}`;

export const urlMapaEmbebido = `https://www.google.com/maps?q=${encodeURIComponent(direccionCompleta)}&output=embed`;
