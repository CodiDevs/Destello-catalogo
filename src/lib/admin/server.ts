import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Cliente con el rol de servicio: habilita las escrituras del panel
// /admin. NUNCA importar desde componentes client: la clave no debe
// salir del servidor.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const adminClient: SupabaseClient | null =
  supabaseUrl && serviceRoleKey
    ? createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } })
    : null;

export function adminImageUrl(path: string): string {
  return `${supabaseUrl}/storage/v1/object/public/${path}`;
}