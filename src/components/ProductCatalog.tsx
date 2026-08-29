"use client";

import { useCallback, useState } from "react";
import { type CategoryId, type Product } from "@/data/products";
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
  filter,
  onOpen,
}: {
  id: string;
  title: string;
  products: Product[];
  filter: (category: CategoryId, badge?: string) => boolean;
  onOpen: (product: Product) => void;
}) {
  const items = products.filter((p) => filter(p.category, p.badge));
  if (items.length === 0) {
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
        {items.map((product, index) => (
          <ScrollReveal key={`${id}-${product.id}`} delay={index * 60} className="h-full">
            <ProductCard product={product} onOpen={onOpen} />
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

export function ProductCatalog({ products }: { products: Product[] }) {
  const [selected, setSelected] = useState<Product | null>(null);
  const close = useCallback(() => setSelected(null), []);

  return (
    <>
      <div
        id="catalogo"
        className="mx-auto max-w-6xl space-y-10 px-3 py-10 sm:space-y-16 sm:px-6 sm:py-20"
      >
        <ProductSection
          id="novedades"
          title="Shop New"
          products={products}
          filter={(_c, badge) => badge === "Nuevo" || badge === "Best seller"}
          onOpen={setSelected}
        />
        <ProductSection
          id="carteras"
          title="Carteras"
          products={products}
          filter={(c) => c === "carteras"}
          onOpen={setSelected}
        />
        <ProductSection
          id="termos"
          title="Termos"
          products={products}
          filter={(c) => c === "termos"}
          onOpen={setSelected}
        />
        <ProductSection
          id="ofertas"
          title="Ofertas"
          products={products}
          filter={(_c, badge) => badge === "Oferta"}
          onOpen={setSelected}
        />
      </div>
      <ProductModal product={selected} onClose={close} />
    </>
  );
}
