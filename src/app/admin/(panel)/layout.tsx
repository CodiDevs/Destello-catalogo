import Link from "next/link";
import type { ReactNode } from "react";
import { requireSeller } from "@/lib/admin/auth";
import { logoutAction } from "../actions";

export default async function AdminPanelLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireSeller();

  const links = [
    { href: "/admin", label: "Panel" },
    { href: "/admin/productos", label: "Productos" },
    { href: "/admin/categorias", label: "Categorías" },
    { href: "/admin/descuentos", label: "Descuentos" },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border/70 bg-surface/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link href="/admin" className="font-script text-2xl text-gold">
            Destello · Admin
          </Link>
          <nav aria-label="Administración" className="flex flex-wrap items-center gap-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-serif text-xs tracking-[0.14em] text-ink-muted uppercase transition hover:text-gold"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/"
              className="font-serif text-xs tracking-[0.14em] text-ink-muted uppercase transition hover:text-gold"
            >
              Ver tienda
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="font-serif text-xs tracking-[0.14em] text-ink-muted uppercase underline-offset-2 transition hover:text-gold hover:underline"
              >
                Salir
              </button>
            </form>
          </nav>
        </div>
      </header>

      <main className="flex-1 py-8 sm:py-12">{children}</main>
    </div>
  );
}