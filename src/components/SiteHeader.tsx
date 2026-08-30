"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { type Category } from "@/data/products";
import { BrandMark } from "./BrandMark";
import { ThemeToggle } from "./ThemeToggle";

export function SiteHeader({ categories }: { categories: Category[] }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [open, setOpen] = useState(false);
  const [activeScrollKey, setActiveScrollKey] = useState("inicio");

  const navItems = useMemo(() => {
    const sectionHref = (id: string) => (isHome ? `#${id}` : `/catalogo/${id}`);
    return [
      { key: "inicio", href: isHome ? "#inicio" : "/", label: "Inicio", sectionId: "inicio" },
      { key: "novedades", href: isHome ? "#catalogo" : "/catalogo/novedades", label: "Novedades", sectionId: "novedades" },
      { key: "mas-vendidos", href: sectionHref("mas-vendidos"), label: "Más vendidos", sectionId: "mas-vendidos" },
      ...categories.map((category) => ({
        key: category.id,
        href: sectionHref(category.id),
        label: category.label,
        sectionId: category.id,
      })),
      { key: "ofertas", href: sectionHref("ofertas"), label: "Ofertas", sectionId: "ofertas" },
      { key: "nosotros", href: "/#nosotros", label: "Nosotros", sectionId: "nosotros" },
      { key: "contacto", href: "/#contacto", label: "Contacto", sectionId: "contacto" },
    ];
  }, [categories, isHome]);

  useEffect(() => {
    if (!isHome) return;

    const handleScroll = () => {
      const sectionIds = navItems.flatMap((item) => (item.sectionId ? [item.sectionId] : []));
      let active = "inicio";
      for (const sectionId of sectionIds) {
        const element = document.getElementById(sectionId);
        if (!element) continue;
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        if (rect.top < windowHeight && rect.bottom > 0) {
          if (rect.top <= windowHeight / 2 || sectionId === "contacto") {
            active = sectionId;
          }
        }
      }
      setActiveScrollKey(active);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome, navItems]);

  const activeKey = isHome ? activeScrollKey : navItems.find((item) => item.href === pathname)?.key ?? "inicio";

  const linkFor = (item: (typeof navItems)[number]) => {
    const isActive = activeKey === item.key || (item.key === "inicio" && pathname === "/");
    return (
      <li key={item.key}>
        <Link
          href={item.href}
          className={`transition ${isActive ? "text-gold font-semibold" : "hover:text-gold"}`}
          aria-current={isActive ? "page" : undefined}
        >
          {item.label}
        </Link>
      </li>
    );
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-surface/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-ink md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Menú</span>
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
            {open ? (
              <path d="M6 6l12 12M18 6 6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>

        <Link href="/" className="mx-auto inline-flex flex-col items-center md:mx-0" aria-label="Destello inicio">
          <BrandMark compact />
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href={isHome ? "#inicio" : "/"}
            className="hidden items-center gap-2 text-ink-muted transition hover:text-gold md:inline-flex"
            aria-label="Buscar en el catálogo"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
              <circle cx="11" cy="11" r="6.5" />
              <path d="m16 16 3.5 3.5" />
            </svg>
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="hidden h-8 w-8 items-center justify-center rounded-full border border-border text-ink-muted transition hover:border-gold hover:text-gold sm:inline-flex"
            aria-label="Instagram"
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
              <path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Zm10 2H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Zm-5 3.2A4.8 4.8 0 1 1 7.2 13 4.8 4.8 0 0 1 12 8.2Zm0 2A2.8 2.8 0 1 0 14.8 13 2.8 2.8 0 0 0 12 10.2Zm5.15-3.55a1.05 1.05 0 1 1-1.05 1.05 1.05 1.05 0 0 1 1.05-1.05Z" />
            </svg>
          </a>
          <ThemeToggle />
          <a
            href={isHome ? "#contacto" : "/#contacto"}
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface-elevated text-ink transition hover:border-gold hover:text-gold"
            aria-label="Consultar catálogo"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M6 7h12l-1 11H7L6 7Z" />
              <path d="M9 7a3 3 0 0 1 6 0" />
            </svg>
            <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-blush-deep px-1 text-[0.55rem] font-semibold text-ink">
              ·
            </span>
          </a>
        </div>
      </div>

      <nav className="hidden border-t border-border/50 md:block" aria-label="Principal">
        <ul className="mx-auto flex max-w-6xl items-center justify-center gap-8 px-6 py-3 font-serif text-sm tracking-[0.12em] text-ink uppercase">
          {navItems.map(linkFor)}
        </ul>
      </nav>

      {open ? (
        <nav id="mobile-nav" className="border-t border-border bg-surface px-4 py-4 md:hidden" aria-label="Móvil">
          <ul className="flex flex-col gap-3 font-serif tracking-[0.1em] text-ink uppercase">
            {navItems.map((item) => (
              <li key={item.key}>
                <Link href={item.href} className="block py-1" onClick={() => setOpen(false)}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
