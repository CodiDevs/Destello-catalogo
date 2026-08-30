import Link from "next/link";
import { type Category } from "@/data/products";

export function CatalogNav({
  categories,
  activeSlug,
}: {
  categories: Category[];
  activeSlug?: string;
}) {
  const items: { id: string; label: string; href: string }[] = [
    { id: "novedades", label: "Shop New", href: "/catalogo/novedades" },
    { id: "mas-vendidos", label: "Más vendidos", href: "/catalogo/mas-vendidos" },
    ...categories.map((category) => ({
      id: category.id,
      label: category.label,
      href: `/catalogo/${category.id}`,
    })),
    { id: "ofertas", label: "Ofertas", href: "/catalogo/ofertas" },
  ];

  return (
    <nav
      aria-label="Catálogos"
      className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-2 px-3 pt-8 sm:gap-3 sm:px-6"
    >
      {items.map((item) => {
        const active = activeSlug === item.id;
        return (
          <Link
            key={item.id}
            href={item.href}
            className={`inline-flex rounded-full border px-3 py-1.5 font-serif text-[0.7rem] tracking-[0.14em] uppercase transition sm:px-4 sm:py-2 sm:text-xs ${
              active
                ? "border-gold bg-gold/15 text-gold"
                : "border-border bg-surface-elevated text-ink-muted hover:border-gold hover:text-gold"
            }`}
            aria-current={active ? "page" : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}