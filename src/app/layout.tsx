import type { Metadata } from "next";
import { Barlow_Condensed, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Tipografía condensada para títulos, en la línea de los posts de Instagram del negocio.
const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  style: ["normal", "italic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "SM Repuestos | Repuestos Ford y Chevrolet en Río Cuarto",
    template: "%s | SM Repuestos",
  },
  description:
    "Repuestos originales y alternativos para Ford y Chevrolet en Río Cuarto, Córdoba. Av. Sabattini 1999. Envíos a todo el país y 3 cuotas sin interés.",
  keywords: ["repuestos", "Ford", "Chevrolet", "Río Cuarto", "autopartes", "Sarmiento Repuestos"],
  icons: { icon: "/images/logo-sm-repuestos.png" },
  openGraph: {
    title: "SM Repuestos | Repuestos Ford y Chevrolet en Río Cuarto",
    description: "Repuestos originales y alternativos para Ford y Chevrolet. Av. Sabattini 1999, Río Cuarto.",
    locale: "es_AR",
    type: "website",
    images: ["/images/logo-sm-repuestos.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es-AR"
      className={`${geistSans.variable} ${geistMono.variable} ${barlowCondensed.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
