import { supabase } from "@/lib/supabase";
import { type Category } from "@/data/products";

/**
 * Trae las categorías activas del catálogo (tabla `categories`, las
 * gestiona el vendedor en /admin). Corre en servidor. Con fallback a
 * carteras + termos si Supabase no está configurado o falla la consulta.
 */
export async function getCategories(): Promise<Category[]> {
  if (!supabase) {
    return [
      { id: "carteras", label: "Carteras", position: 0, active: true },
      { id: "termos", label: "Termos", position: 1, active: true },
    ];
  }

  const { data, error } = await supabase
    .from("categories")
    .select("id, label, position, active")
    .eq("active", true)
    .order("position", { ascending: true });

  if (error) {
    console.error("[supabase] Error al leer categories:", error.message);
    return [
      { id: "carteras", label: "Carteras", position: 0, active: true },
      { id: "termos", label: "Termos", position: 1, active: true },
    ];
  }

  const rows = (data ?? []) as { id: string; label: string; position: number; active: boolean }[];
  if (rows.length === 0) {
    return [
      { id: "carteras", label: "Carteras", position: 0, active: true },
      { id: "termos", label: "Termos", position: 1, active: true },
    ];
  }
  return rows;
}