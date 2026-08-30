import { type PatternId, type Product, type ProductColor, type ProductImage } from "@/data/products";
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
  images: ProductImage[] | null;
  discount_percent: number | null;
  discount_ends_at: string | null;
  views: number;
  sales: number;
  image_url: string | null;
};

function mapRow(row: ProductRow): Product {
  const images =
    row.images && row.images.length > 0
      ? row.images
      : row.image_url
        ? [{ colorId: null, url: row.image_url }]
        : [];
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
    images: images.length > 0 ? images : undefined,
    discountPercent: row.discount_percent ?? undefined,
    discountEndsAt: row.discount_ends_at ?? undefined,
    views: row.views,
    sales: row.sales,
    imageUrl: images[0]?.url ?? undefined,
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
    "id, name, price, category, badge, accent, pattern, description, details, colors, images, discount_percent, discount_ends_at, views, sales, image_url";
  const legacySelect =
    "id, name, price, category, badge, accent, pattern, description, details, colors, discount_percent, discount_ends_at, views, sales, image_url";

async function query(selectList: string) {
    let query = supabase!.from("products").select(selectList).order("created_at", { ascending: true });
    if (options.category) {
      query = query.eq("category", options.category);
    }
    const { data, error } = await query;
    return { data: data as ProductRow[] | null, error };
  }

  let result = await query(select);

  // Fallback: si la columna `images` aún no está migrada (42703), se lee el
  // modelo anterior solo con `image_url` para no romper la tienda.
  if (result.error && /images/i.test(result.error.message)) {
    result = await query(legacySelect);
  }

  if (result.error) {
    console.error("[supabase] Error al leer products:", result.error.message);
    return [];
  }

  return (result.data ?? []).map(mapRow);
}
