// Datos de referencia para generar un catálogo de repuestos creíble en la demo.

export const proveedoresDemo = [
  "Distribuidora Autopartes del Centro",
  "Repuestos Mayoristas Norte",
  "Frenos y Embragues SRL",
  "Filtros Argentinos SA",
  "Eléctrica Automotor Sur",
  "Lubricantes del Litoral",
  "Suspensión Total",
  "Importadora Rodamientos SA",
];

export const vehiculos = [
  "Fiat Palio 1.4 2008-2017",
  "Fiat Cronos 1.3 2018-2024",
  "VW Gol Trend 1.6 2009-2023",
  "VW Amarok 2.0 TDI 2010-2024",
  "Chevrolet Corsa 1.6 2002-2012",
  "Chevrolet Onix 1.4 2013-2019",
  "Ford Fiesta 1.6 2011-2019",
  "Ford Ka 1.5 2016-2021",
  "Ford Ranger 3.2 2012-2023",
  "Renault Clio 1.2 2010-2016",
  "Renault Sandero 1.6 2013-2022",
  "Peugeot 206 1.6 2001-2012",
  "Peugeot 208 1.6 2013-2023",
  "Toyota Hilux 2.8 2016-2024",
  "Toyota Etios 1.5 2013-2023",
];

type Rubro = {
  nombre: string;
  marcas: string[];
  productos: string[];
  costo: [number, number];
};

// Costos aproximados en pesos argentinos, solo para la demo.
export const rubros: Rubro[] = [
  {
    nombre: "Filtros",
    marcas: ["Fram", "Mann", "Mahle", "Wega"],
    productos: ["Filtro de aceite", "Filtro de aire", "Filtro de combustible", "Filtro de habitáculo"],
    costo: [6000, 30000],
  },
  {
    nombre: "Frenos",
    marcas: ["Ferodo", "Fras-le", "Bosch", "TRW"],
    productos: ["Pastillas de freno delanteras", "Disco de freno", "Cintas de freno traseras", "Bomba de freno"],
    costo: [18000, 120000],
  },
  {
    nombre: "Suspensión",
    marcas: ["Monroe", "Corven", "Sachs", "Fric-Rot"],
    productos: ["Amortiguador delantero", "Amortiguador trasero", "Rótula", "Bieleta", "Buje de parrilla"],
    costo: [9000, 160000],
  },
  {
    nombre: "Encendido",
    marcas: ["NGK", "Bosch", "Champion"],
    productos: ["Bujía", "Cable de bujía", "Bobina de encendido"],
    costo: [5000, 90000],
  },
  {
    nombre: "Distribución",
    marcas: ["Gates", "Dayco", "SKF", "Contitech"],
    productos: ["Kit de distribución", "Correa poly-V", "Tensor de correa", "Bomba de agua"],
    costo: [25000, 250000],
  },
  {
    nombre: "Embrague",
    marcas: ["Sachs", "Valeo", "LuK"],
    productos: ["Kit de embrague", "Rulemán de embrague", "Cable de embrague"],
    costo: [20000, 280000],
  },
  {
    nombre: "Refrigeración",
    marcas: ["Valeo", "Nissens", "Mahle"],
    productos: ["Termostato", "Radiador", "Electroventilador", "Manguera de radiador"],
    costo: [8000, 200000],
  },
  {
    nombre: "Eléctrico",
    marcas: ["Bosch", "Moura", "Valeo"],
    productos: ["Batería 12V 65Ah", "Alternador", "Burro de arranque", "Sensor de temperatura"],
    costo: [12000, 300000],
  },
  {
    nombre: "Lubricantes",
    marcas: ["YPF Elaion", "Shell Helix", "Castrol", "Total"],
    productos: ["Aceite 10W40 4L", "Aceite 5W30 4L", "Líquido refrigerante 1L", "Líquido de frenos DOT4"],
    costo: [5000, 60000],
  },
  {
    nombre: "Iluminación",
    marcas: ["Philips", "Osram", "Hella"],
    productos: ["Lámpara H4", "Lámpara H7", "Óptica delantera", "Faro trasero"],
    costo: [3000, 150000],
  },
];
