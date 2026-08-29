<<<<<<< HEAD
export type CategoryId = "carteras" | "termos" | "novedades" | "ofertas";
=======
// Las categorías son configurables: viven en la tabla `categories` de
// Supabase y se leen con `getCategories()` desde el servidor. Aquí solo
// quedan los tipos, helpers y constantes de presentación.

export type CategoryId = string;

export type PatternId = "quilt" | "stripe" | "dot" | "wave";
>>>>>>> 88bb355 (Agrega modo admin, descuentos y productos)

export type ProductColor = {
  id: string;
  name: string;
  hex: string;
};

<<<<<<< HEAD
=======
export type Category = {
  id: string;
  label: string;
  position: number;
  active: boolean;
};

>>>>>>> 88bb355 (Agrega modo admin, descuentos y productos)
export type Product = {
  id: string;
  name: string;
  price: number;
<<<<<<< HEAD
  category: CategoryId;
  badge?: string;
  accent: string;
  pattern: "quilt" | "stripe" | "dot" | "wave";
  description: string;
  details: string[];
  colors?: ProductColor[];
};

export const categories: {
  id: CategoryId;
  label: string;
  href: string;
}[] = [
  { id: "novedades", label: "novedades", href: "#catalogo" },
  { id: "carteras", label: "carteras", href: "#carteras" },
  { id: "termos", label: "termos", href: "#termos" },
  { id: "ofertas", label: "ofertas", href: "#ofertas" },
];

export const categoryLabels: Record<CategoryId, string> = {
  carteras: "Carteras",
  termos: "Termos",
  novedades: "Novedades",
  ofertas: "Ofertas",
};

// Los productos ya no se hardcodean aquí: viven en la tabla `products`
// de Supabase y se leen con `getProducts()` (src/lib/getProducts.ts) desde
// un Server Component. Los datos de ejemplo que estaban aquí se migraron
// a supabase/schema.sql como seed.
=======
  category: string;
  badge?: string;
  accent: string;
  pattern: PatternId;
  description: string;
  details: string[];
  colors?: ProductColor[];
  // Descuento (temporizador + precio tachado mientras esté activo)
  discountPercent?: number;
  discountEndsAt?: string;
  // Métricas — dos conteos separados
  views: number;
  sales: number;
  // Imagen subida a Storage; si no hay, se usa el visual generado
  imageUrl?: string;
};

// Slugs especiales cuyo catálogo se deriva del badge o del descuento,
// no de una categoría de la tabla `categories`.
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
>>>>>>> 88bb355 (Agrega modo admin, descuentos y productos)

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-EC", {
    style: "currency",
    currency: "USD",
  }).format(price);
}
<<<<<<< HEAD
=======

// Etiquetas de categoría desde el server (getCategories). Se usa en
// componentes client y como fallback visual.
export function categoryLabel(id: string, categories: Category[]): string {
  return categories.find((c) => c.id === id)?.label ?? id;
}
>>>>>>> 88bb355 (Agrega modo admin, descuentos y productos)
