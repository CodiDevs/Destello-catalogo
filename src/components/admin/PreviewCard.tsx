"use client";

import {
  discountedPrice,
  formatPrice,
  isDiscountActive,
  type Product,
} from "@/data/products";
import { ProductVisual } from "@/components/ProductVisual";
import { DiscountCountdown } from "@/components/DiscountCountdown";

export function PreviewCard({ product }: { product: Product }) {
  return (
    <article className="w-full max-w-56 bg-surface-elevated">
      <ProductVisual product={product} showBadge />
      <div className="px-1 pt-2 pb-1">
        <h3 className="font-serif text-sm text-ink">{product.name || "Nombre del producto"}</h3>
        <div className="flex items-baseline gap-1.5 text-xs text-ink-muted">
          {isDiscountActive(product) ? (
            <>
              <span className="font-semibold text-gold-ink">
                {formatPrice(discountedPrice(product))}
              </span>
              <span className="line-through">{formatPrice(product.price)}</span>
            </>
          ) : (
            <span>{formatPrice(product.price)}</span>
          )}
        </div>
        {isDiscountActive(product) && product.discountEndsAt ? (
          <div className="pt-2">
            <DiscountCountdown endsAt={product.discountEndsAt} compact />
          </div>
        ) : null}
      </div>
    </article>
  );
}