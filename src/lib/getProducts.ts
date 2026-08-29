import { supabase } from "@/lib/supabase";
<<<<<<< HEAD
import type { CategoryId, Product, ProductColor } from "@/data/products";

// Forma cruda de una fila de la tabla `products` en Supabase.
=======
import { type Product, type ProductColor, type PatternId } from "@/data/products";

>>>>>>> 88bb355 (Agrega modo admin, descuentos y productos)
type ProductRow = {
  id: string;
  name: string;
  price: number | string;
<<<<<<< HEAD
  category: CategoryId;
  badge: string | null;
  accent: string;
  pattern: Product["pattern"];
  description: string;
  details: string[] | null;
  colors: ProductColor[] | null;
=======
  category: string;
  badge: string | null;
  accent: string;
  pattern: PatternId;
  description: string;
  details: string[] | null;
  colors: ProductColor[] | null;
  discount_percent: number | null;
  discount_ends_at: string | null;
  views: number;
  sales: number;
  image_url: string | null;
>>>>>>> 88bb355 (Agrega modo admin, descuentos y productos)
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
<<<<<<< HEAD
=======
    discountPercent: row.discount_percent ?? undefined,
    discountEndsAt: row.discount_ends_at ?? undefined,
    views: row.views,
    sales: row.sales,
    imageUrl: row.image_url ?? undefined,
>>>>>>> 88bb355 (Agrega modo admin, descuentos y productos)
  };
}

/**
 * Trae todos los productos desde la tabla `products` de Supabase.
<<<<<<< HEAD
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

=======
 * Corre desde un Server Component (o server action) y nunca expone
 * credenciales al navegador. Si Supabase no está configurado o la
 * consulta falla, devuelve [] en lugar de tumbar la página.
 *
 * `filterCategory` (opcional) filtra ya desde la consulta; los slugs
 * "novedades" y "ofertas" son catálogos derivados y no son categorías.
 */
export async function getProducts(
  options: { category?: string } = {},
): Promise<Product[]> {
  if (!supabase) {
    return [];
  }

  const select =
    "id, name, price, category, badge, accent, pattern, description, details, colors, discount_percent, discount_ends_at, views, sales, image_url";
  const category = options.category;

  let query = supabase
    .from("products")
    .select(select)
    .order("created_at", { ascending: true });

  if (category) {
    query = query.eq("category", category);
  }

  const { data, error } = await query;

>>>>>>> 88bb355 (Agrega modo admin, descuentos y productos)
  if (error) {
    console.error("[supabase] Error al leer products:", error.message);
    return [];
  }

  return (data ?? []).map(mapRow);
<<<<<<< HEAD
}
=======
}
>>>>>>> 88bb355 (Agrega modo admin, descuentos y productos)
