"use client";

import {
  categoryLabel,
  discountedPrice,
  formatPrice,
  isDiscountActive,
  type Category,
  type Product,
  type ProductColor,
} from "@/data/products";
import { useEffect, useId, useState } from "react";
import { DiscountCountdown } from "./DiscountCountdown";
import { ProductVisual } from "./ProductVisual";
import { SparkleIcon } from "./SparkleIcon";

type ProductModalProps = {
  product: Product;
  categories: Category[];
  onClose: () => void;
};

export function ProductModal({ product, categories, onClose }: ProductModalProps) {
  const titleId = useId();
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(
    () => product.colors?.[0] ?? null,
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const accent = selectedColor?.hex ?? product.accent;
  const colorLabel = selectedColor ? ` · color ${selectedColor.name}` : "";
  const message = encodeURIComponent(
    `Hola Destello, me interesa consultar: ${product.name}${colorLabel}`,
  );
  const discounted = isDiscountActive(product);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-ink/45 backdrop-blur-[2px]"
        aria-label="Cerrar"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl border border-border bg-surface-elevated shadow-[0_-8px_40px_rgba(42,31,36,0.25)] sm:max-h-[90vh] sm:rounded-2xl"
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <p className="font-serif text-xs tracking-[0.14em] text-ink-muted uppercase">
            {categoryLabel(product.category, categories)}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-ink transition hover:border-gold hover:text-gold"
            aria-label="Cerrar detalle"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>

        <div className="product-modal-scroll overflow-y-auto overscroll-contain">
          <ProductVisual
            product={product}
            accent={accent}
            className="rounded-none"
            showBadge
          />

          <div className="flex flex-col gap-4 px-4 py-5 sm:px-6 sm:py-6">
            <div>
              {product.badge ? (
                <span className="mb-2 inline-flex rounded-full bg-blush px-2.5 py-1 text-[0.65rem] font-medium tracking-wide text-ink">
                  {product.badge}
                </span>
              ) : null}
              <h2 id={titleId} className="font-serif text-2xl text-ink sm:text-3xl">
                {product.name}
              </h2>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                {discounted ? (
                  <>
                    <span className="text-lg font-semibold text-gold-ink">
                      {formatPrice(discountedPrice(product))}
                    </span>
                    <span className="text-base text-ink-muted line-through">
                      {formatPrice(product.price)}
                    </span>
                  </>
                ) : (
                  <span className="text-lg text-gold-ink">{formatPrice(product.price)}</span>
                )}
              </div>
              {discounted && product.discountEndsAt ? (
                <div className="mt-2">
                  <DiscountCountdown endsAt={product.discountEndsAt} />
                </div>
              ) : null}
            </div>

            <p className="text-sm leading-relaxed text-ink-muted">{product.description}</p>

            {product.colors && product.colors.length > 0 ? (
              <fieldset>
                <legend className="mb-3 font-serif text-sm tracking-[0.12em] text-ink uppercase">
                  Color
                </legend>
                <div className="flex flex-wrap gap-3" role="radiogroup" aria-label="Color">
                  {product.colors.map((color) => {
                    const selected = selectedColor?.id === color.id;
                    return (
                      <button
                        key={color.id}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => setSelectedColor(color)}
                        className={`flex items-center gap-2 rounded-full border px-2.5 py-1.5 text-sm transition ${
                          selected
                            ? "border-gold bg-blush/40 text-ink"
                            : "border-border bg-surface text-ink-muted hover:border-gold"
                        }`}
                      >
                        <span
                          className={`h-5 w-5 rounded-full border ${
                            selected
                              ? "ring-2 ring-gold ring-offset-2 ring-offset-surface-elevated"
                              : "border-black/10"
                          }`}
                          style={{ backgroundColor: color.hex }}
                          aria-hidden
                        />
                        {color.name}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            ) : null}

            <div>
              <p className="mb-2 flex items-center gap-2 font-serif text-sm tracking-[0.12em] text-ink uppercase">
                <SparkleIcon className="h-3.5 w-3.5 text-gold" />
                Detalles
              </p>
              <ul className="space-y-1.5 text-sm text-ink-muted">
                {product.details.map((detail) => (
                  <li key={detail} className="flex gap-2">
                    <span className="text-gold" aria-hidden>
                      ·
                    </span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            <a
              href={`https://wa.me/?text=${message}`}
              target="_blank"
              rel="noreferrer"
              className="mt-1 inline-flex w-full items-center justify-center gap-2 bg-gold px-4 py-3 text-sm font-semibold tracking-[0.12em] text-ink uppercase transition hover:bg-gold-soft"
            >
              Consultar
              {selectedColor ? ` · ${selectedColor.name}` : ""}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
