import { type PatternId, type Product, type ProductColor } from "@/data/products";
import { supabase } from "@/lib/supabase";

type ProductRow = {
  id: string;
  name: string;
  price: number | string;
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
    discountPercent: row.discount_percent ?? undefined,
    discountEndsAt: row.discount_ends_at ?? undefined,
    views: row.views,
    sales: row.sales,
    imageUrl: row.image_url ?? undefined,
  };
}

/**
 * Trae todos los productos desde `products` en Supabase.
 * Corre desde un Server Component y nunca expone credenciales al navegador.
 * Si Supabase no está configurado o falla la consulta, devuelve [] para
 * que la UI degrade sin romper la app.
 */
export async function getProducts(options: { category?: string } = {}): Promise<Product[]> {
  if (!supabase) {
    return [];
  }

  const select =
    "id, name, price, category, badge, accent, pattern, description, details, colors, discount_percent, discount_ends_at, views, sales, image_url";

  let query = supabase.from("products").select(select).order("created_at", { ascending: true });

  if (options.category) {
    query = query.eq("category", options.category);
  }

  const { data, error } = await query;

  if (error) {
    console.error("[supabase] Error al leer products:", error.message);
    return [];
  }

  return (data ?? []).map(mapRow);
}
