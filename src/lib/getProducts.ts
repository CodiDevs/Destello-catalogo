import { supabase } from "@/lib/supabase";
import type { CategoryId, Product, ProductColor } from "@/data/products";

// Forma cruda de una fila de la tabla `products` en Supabase.
type ProductRow = {
  id: string;
  name: string;
  price: number | string;
  category: CategoryId;
  badge: string | null;
  accent: string;
  pattern: Product["pattern"];
  description: string;
  details: string[] | null;
  colors: ProductColor[] | null;
};

function mapRow(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    price: Number(row.price),
    category: row.category,
    badge: row.badge ?? undefined,
    accent: row.accent,
    pattern: row.pattern,
    description: row.description,
    details: row.details ?? [],
    colors: row.colors ?? undefined,
  };
}

/**
 * Trae todos los productos desde la tabla `products` de Supabase.
 *
 * Se usa desde un Server Component (src/app/page.tsx), por lo que corre
 * en el servidor y nunca expone credenciales al navegador.
 *
 * Si Supabase no está configurado todavía (faltan las env vars) o la
 * consulta falla, devuelve un arreglo vacío en lugar de tumbar la página:
 * las secciones del catálogo ya manejan el caso "sin productos".
 */
export async function getProducts(): Promise<Product[]> {
  if (!supabase) {
    // Ya se avisó en consola desde src/lib/supabase.ts (faltan env vars).
    return [];
  }

  const { data, error } = await supabase
    .from("products")
    .select("id, name, price, category, badge, accent, pattern, description, details, colors")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[supabase] Error al leer products:", error.message);
    return [];
  }

  return (data ?? []).map(mapRow);
}
