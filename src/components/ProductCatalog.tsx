"use client";

import { isDiscountActive, type Category, type Product } from "@/data/products";
import { trackProductView } from "@/lib/trackView";
import { useCallback, useState } from "react";
import { ProductCard } from "./ProductCard";
import { ProductModal } from "./ProductModal";
import { ScrollReveal } from "./ScrollReveal";
import { SparkleIcon } from "./SparkleIcon";

function SectionHeading({ title }: { title: string }) {
  return (
    <div className="mb-5 flex items-center justify-center gap-2 sm:mb-8 sm:gap-3">
      <SparkleIcon className="h-3 w-3 text-gold sm:h-4 sm:w-4" />
      <h2 className="font-serif text-lg tracking-[0.14em] text-gold uppercase sm:text-2xl sm:tracking-[0.18em] md:text-3xl">
        {title}
      </h2>
      <SparkleIcon className="h-3 w-3 text-gold sm:h-4 sm:w-4" />
    </div>
  );
}

function ProductSection({
  id,
  title,
  products,
  onOpen,
}: {
  id: string;
  title: string;
  products: Product[];
  onOpen: (product: Product) => void;
}) {
  if (products.length === 0) {
    return (
      <section id={id} className="scroll-mt-28">
        <SectionHeading title={title} />
        <p className="text-center text-sm text-ink-muted">
          Pronto habrá piezas en esta sección.
        </p>
      </section>
    );
  }

  return (
    <section id={id} className="scroll-mt-28">
      <ScrollReveal delay={80}>
        <SectionHeading title={title} />
      </ScrollReveal>
      <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6 lg:grid-cols-4">
        {products.map((product, index) => (
          <ScrollReveal key={`${id}-${product.id}`} delay={index * 60} className="h-full">
            <ProductCard product={product} onOpen={onOpen} />
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

function matchesNovedades(product: Product): boolean {
  return product.badge === "Nuevo" || product.badge === "Best seller";
}

function matchesOfertas(product: Product): boolean {
  return isDiscountActive(product);
}

export function ProductCatalog({
  products,
  categories,
  slug,
}: {
  products: Product[];
  categories: Category[];
  slug?: string;
}) {
  const [selected, setSelected] = useState<Product | null>(null);
  const close = useCallback(() => setSelected(null), []);

  const open = useCallback((product: Product) => {
    trackProductView(product.id);
    setSelected(product);
  }, []);

  let sections: { id: string; title: string; items: Product[] }[];

  if (slug) {
    const items =
      slug === "novedades"
        ? products.filter(matchesNovedades)
        : slug === "ofertas"
          ? products.filter(matchesOfertas)
          : products.filter((p) => p.category === slug);
    const title =
      slug === "novedades"
        ? "Shop New"
        : slug === "ofertas"
          ? "Ofertas"
          : categories.find((c) => c.id === slug)?.label ?? slug;
    sections = [{ id: `cat-${slug}`, title, items }];
  } else {
    sections = [
      { id: "novedades", title: "Shop New", items: products.filter(matchesNovedades) },
      ...categories.map((category) => ({
        id: category.id,
        title: category.label,
        items: products.filter((p) => p.category === category.id),
      })),
      { id: "ofertas", title: "Ofertas", items: products.filter(matchesOfertas) },
    ];
  }

  return (
    <>
      <div
        id="catalogo"
        className="mx-auto max-w-6xl space-y-10 px-3 py-10 sm:space-y-16 sm:px-6 sm:py-20"
      >
        {sections.map((section) => (
          <ProductSection
            key={section.id}
            id={section.id}
            title={section.title}
            products={section.items}
            onOpen={open}
          />
        ))}
      </div>
      {selected ? (
        <ProductModal
          key={selected.id}
          product={selected}
          categories={categories}
          onClose={close}
        />
      ) : null}
    </>
  );
}
