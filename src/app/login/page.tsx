import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

import { negocio } from "@/config/negocio";
import { FormularioLogin } from "@/features/auth/components/formulario-login";

export const metadata: Metadata = {
  title: "Ingresar",
  robots: { index: false },
};

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center bg-neutral-100 px-4 py-16">
      <div className="border-marca-rojo w-full max-w-sm border-t-4 bg-white p-8 shadow-md">
        <Link href="/" className="mx-auto block w-fit">
          <Image
            src="/images/logo-sm-repuestos.png"
            alt={negocio.nombre}
            width={88}
            height={88}
          />
        </Link>
        <h1 className="font-heading text-marca-azul mt-4 text-center text-3xl font-extrabold uppercase italic">
          Panel de gestión
        </h1>
        <p className="mb-6 text-center text-sm text-neutral-600">
          Ingresá con tu cuenta
        </p>
        <Suspense>
          <FormularioLogin />
        </Suspense>
      </div>
    </main>
  );
}
