import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { negocio } from "@/config/negocio";
import { FormularioLogin } from "@/features/auth/components/formulario-login";

export const metadata: Metadata = {
  title: "Ingresar",
  robots: { index: false },
};

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { desde } = await searchParams;
  // Solo se permite volver a rutas internas del panel.
  const destino = typeof desde === "string" && desde.startsWith("/panel") ? desde : "/panel";

  return (
    <main className="flex flex-1 items-center justify-center bg-neutral-100 px-4 py-16">
      <div className="w-full max-w-sm border-t-4 border-marca-rojo bg-white p-8 shadow-md">
        <Link href="/" className="mx-auto block w-fit">
          <Image src="/images/logo-sm-repuestos.png" alt={negocio.nombre} width={88} height={88} />
        </Link>
        <h1 className="mt-4 text-center font-heading text-3xl font-extrabold text-marca-azul uppercase italic">
          Panel de gestión
        </h1>
        <p className="mb-6 text-center text-sm text-neutral-600">Ingresá con tu cuenta</p>
        <FormularioLogin destino={destino} />
      </div>
    </main>
  );
}
