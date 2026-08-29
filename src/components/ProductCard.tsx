"use client";

<<<<<<< HEAD
import { formatPrice, type Product } from "@/data/products";
import { ProductVisual } from "./ProductVisual";
=======
import {
  discountedPrice,
  formatPrice,
  isDiscountActive,
  type Product,
} from "@/data/products";
import { ProductVisual } from "./ProductVisual";
import { DiscountCountdown } from "./DiscountCountdown";
>>>>>>> 88bb355 (Agrega modo admin, descuentos y productos)

type ProductCardProps = {
  product: Product;
  onOpen: (product: Product) => void;
};

export function ProductCard({ product, onOpen }: ProductCardProps) {
<<<<<<< HEAD
=======
  const discounted = isDiscountActive(product);

>>>>>>> 88bb355 (Agrega modo admin, descuentos y productos)
  return (
    <article className="group flex flex-col bg-surface-elevated">
      <button
        type="button"
        onClick={() => onOpen(product)}
        className="flex flex-1 flex-col text-left outline-none transition focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        aria-label={`Ver detalle de ${product.name}`}
      >
        <ProductVisual product={product} />
        <div className="flex flex-1 flex-col gap-0.5 px-0.5 pt-2 pb-0 sm:gap-1 sm:px-1 sm:pt-3">
          <h3 className="font-serif text-xs leading-snug text-ink sm:text-base md:text-lg">
            {product.name}
          </h3>
<<<<<<< HEAD
          <p className="text-[0.65rem] text-ink-muted sm:text-sm">
            {formatPrice(product.price)}
          </p>
=======
          <p className="flex flex-wrap items-baseline gap-x-1.5 text-[0.65rem] text-ink-muted sm:text-sm">
            {discounted ? (
              <>
                <span className="text-gold-ink font-semibold">
                  {formatPrice(discountedPrice(product))}
                </span>
                <span className="text-ink-muted line-through">
                  {formatPrice(product.price)}
                </span>
              </>
            ) : (
              <span>{formatPrice(product.price)}</span>
            )}
          </p>
          {discounted && product.discountEndsAt ? (
            <div className="pt-1">
              <DiscountCountdown endsAt={product.discountEndsAt} compact />
            </div>
          ) : null}
>>>>>>> 88bb355 (Agrega modo admin, descuentos y productos)
        </div>
      </button>
      <button
        type="button"
        onClick={() => onOpen(product)}
        className="mt-2 block w-full bg-blush px-1 py-1.5 text-center text-[0.55rem] font-semibold tracking-[0.08em] text-ink uppercase transition group-hover:bg-blush-deep sm:mt-3 sm:px-3 sm:py-2.5 sm:text-xs sm:tracking-[0.12em]"
      >
        Ver más
      </button>
    </article>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 88bb355 (Agrega modo admin, descuentos y productos)
