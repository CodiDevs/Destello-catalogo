export type CategoryId = "carteras" | "termos" | "novedades" | "ofertas";

export type ProductColor = {
  id: string;
  name: string;
  hex: string;
};

export type Product = {
  id: string;
  name: string;
  price: number;
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

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-EC", {
    style: "currency",
    currency: "USD",
  }).format(price);
}
