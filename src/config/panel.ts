import {
  BarChart3,
  FileText,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  type LucideIcon,
} from "lucide-react";

export type ModuloPanel = {
  href: string;
  nombre: string;
  descripcion: string;
  icono: LucideIcon;
  issue?: number;
};

// Módulos del panel, en el orden en que aparecen en el menú.
export const modulosPanel: ModuloPanel[] = [
  { href: "/panel", nombre: "Inicio", descripcion: "Resumen del día", icono: LayoutDashboard },
  { href: "/panel/stock", nombre: "Stock", descripcion: "Productos, búsqueda y alertas", icono: Package, issue: 7 },
  { href: "/panel/ventas", nombre: "Ventas", descripcion: "Registrar ventas e historial", icono: ShoppingCart, issue: 8 },
  { href: "/panel/presupuestos", nombre: "Presupuestos", descripcion: "Armar, enviar y convertir en venta", icono: FileText, issue: 9 },
  { href: "/panel/clientes", nombre: "Clientes", descripcion: "Particulares, talleres y mayoristas", icono: Users },
  { href: "/panel/estadisticas", nombre: "Estadísticas", descripcion: "Ventas, más vendidos y rotación", icono: BarChart3, issue: 10 },
];
