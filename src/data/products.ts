// Las categorías son configurables: viven en la tabla `categories` de
// Supabase y se leen con `getCategories()` desde el servidor. Aquí solo
// quedan los tipos, helpers y constantes de presentación.

export type CategoryId = string;

export type PatternId = "quilt" | "stripe" | "dot" | "wave";

export type ProductColor = {
  id: string;
  name: string;
  hex: string;
};

export type ProductImage = {
  colorId?: string | null;
  url: string;
};

export type Category = {
  id: string;
  label: string;
  position: number;
  active: boolean;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  badge?: string;
  accent: string;
  pattern: PatternId;
  description: string;
  details: string[];
  colors?: ProductColor[];
  images?: ProductImage[];
  discountPercent?: number;
  discountEndsAt?: string;
  views: number;
  sales: number;
  imageUrl?: string;
};

export const derivedCatalogSlugs = ["novedades", "ofertas", "mas-vendidos"] as const;

export type DerivedCatalogSlug = (typeof derivedCatalogSlugs)[number];

export function isDerivedCatalogSlug(value: string): value is DerivedCatalogSlug {
  return (derivedCatalogSlugs as readonly string[]).includes(value);
}

export function isDiscountActive(product: Pick<Product, "discountPercent" | "discountEndsAt">): boolean {
  return (
    typeof product.discountPercent === "number" &&
    product.discountPercent > 0 &&
    typeof product.discountEndsAt === "string" &&
    new Date(product.discountEndsAt).getTime() > Date.now()
  );
}

export function isDiscountExpired(product: Pick<Product, "discountPercent" | "discountEndsAt">): boolean {
  return (
    typeof product.discountPercent === "number" &&
    product.discountPercent > 0 &&
    typeof product.discountEndsAt === "string" &&
    new Date(product.discountEndsAt).getTime() <= Date.now()
  );
}

export function discountedPrice(product: Pick<Product, "price" | "discountPercent" | "discountEndsAt">): number {
  if (!isDiscountActive(product) || typeof product.discountPercent !== "number") {
    return product.price;
  }
  const price = product.price * (1 - product.discountPercent / 100);
  return Math.round(price * 100) / 100;
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-EC", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

/** Primera imagen del producto (miniatura principal), o undefined si no tiene. */
export function mainImage(product: Pick<Product, "images" | "imageUrl">): string | undefined {
  return product.images?.[0]?.url ?? product.imageUrl;
}

/**
 * Imagen que corresponde al color seleccionado: la del color si existe,
 * si no la general, si no la primera. undefined si no hay fotos.
 */
export function imageForColor(
  product: Pick<Product, "images">,
  colorId?: string | null,
): string | undefined {
  const images = product.images ?? [];
  if (images.length === 0) return undefined;
  if (colorId) {
    const match = images.find((image) => image.colorId === colorId);
    if (match) return match.url;
  }
  const general = images.find((image) => !image.colorId);
  if (general) return general.url;
  return images[0].url;
}

/** Cuántos productos muestra la sección "Más vendidos" (top por vistas). */
export const BEST_SELLERS_LIMIT = 8;

/** Los productos más clickeados, de mayor a menor vistas (top `limit`). */
export function topViewed(products: Product[], limit: number = BEST_SELLERS_LIMIT): Product[] {
  return [...products].sort((a, b) => b.views - a.views).slice(0, limit);
}

export function categoryLabel(id: string, categories: Category[]): string {
  return categories.find((c) => c.id === id)?.label ?? id;
}
