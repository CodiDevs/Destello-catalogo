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
  discountPercent?: number;
  discountEndsAt?: string;
  views: number;
  sales: number;
  imageUrl?: string;
};

export const derivedCatalogSlugs = ["novedades", "ofertas"] as const;

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

export function categoryLabel(id: string, categories: Category[]): string {
  return categories.find((c) => c.id === id)?.label ?? id;
}
