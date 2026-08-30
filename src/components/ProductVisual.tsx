import { isDiscountActive, type Product } from "@/data/products";
import { SparkleIcon } from "./SparkleIcon";

export function ProductVisual({
  product,
  accent,
  image,
  className = "",
  showBadge = true,
}: {
  product: Product;
  accent?: string;
  image?: string;
  className?: string;
  showBadge?: boolean;
}) {
  const color = accent ?? product.accent;
  const discounted = isDiscountActive(product);
  const imageSrc = image ?? product.imageUrl;

  return (
    <div
      className={`relative aspect-square overflow-hidden pattern-${product.pattern} ${className}`}
      style={{ backgroundColor: color }}
    >
{imageSrc ? (
        // Los productos usan fotos reales del almacenamiento; next/image no conviene para objetos de catálogo responsivo.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageSrc}
          alt={product.name}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
      ) : null}

      {showBadge ? (
        <span className="absolute top-1.5 left-1.5 flex gap-1.5 sm:top-3 sm:left-3">
          {product.badge ? (
            <span className="rounded-full bg-surface-elevated/90 px-1.5 py-0.5 text-[0.55rem] font-medium tracking-wide text-ink sm:px-2.5 sm:py-1 sm:text-[0.65rem]">
              {product.badge}
            </span>
          ) : null}
          {discounted ? (
            <span className="rounded-full bg-gold px-1.5 py-0.5 text-[0.55rem] font-medium tracking-wide text-ink sm:px-2.5 sm:py-1 sm:text-[0.65rem]">
              Oferta
            </span>
          ) : null}
        </span>
      ) : null}

      <div className="absolute inset-0 flex items-center justify-center">
        <SparkleIcon className="h-6 w-6 text-white/50 sm:h-10 sm:w-10" />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/15 to-transparent" />
    </div>
  );
}
