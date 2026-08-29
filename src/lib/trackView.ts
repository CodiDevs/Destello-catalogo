import { supabase } from "@/lib/supabase";

/**
 * Suma +1 vista al abrir el detalle de un producto. No requiere compra.
 * Se dispara desde el client (ProductModal). La función
 * `increment_product_views` del lado Supabase es la única vía: el anon
 * no puede escribir en la tabla directamente (RLS).
 */
export function trackProductView(productId: string): void {
  if (!supabase) return;
  void supabase
    .rpc("increment_product_views", { p_id: productId })
    .then(({ error }) => {
      if (error) {
        console.error("[supabase] Error al registrar la vista:", error.message);
      }
    });
}