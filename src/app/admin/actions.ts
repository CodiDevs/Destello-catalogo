"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { adminClient, adminImageUrl } from "@/lib/admin/server";
import { requireSeller } from "@/lib/admin/auth";
import { SESSION_COOKIE, createSessionToken, verifyCredentials } from "@/lib/admin/session";

export type ActionResult = {
  ok: boolean;
  error?: string;
};

type InsertValue = string | number | boolean | null | unknown[];

function slugify(input: string): string {
  const value = input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return value || "item";
}

async function uniqueId(initial: string, table: string, column: string): Promise<string> {
  const base = slugify(initial);
  let candidate = base;
  let i = 2;
  let taken = true;
  while (taken) {
    const { data, error } = await adminClient!
      .from(table)
      .select(column)
      .eq(column, candidate)
      .maybeSingle();

    if (error) throw new Error("No se pudo verificar el id. Revisa la clave de servicio.");
    if (!data) {
      taken = false;
    } else {
      candidate = `${base}-${i}`;
      i += 1;
    }
  }
  return candidate;
}

function parseDetails(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function parseColors(value: string): unknown[] | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  try {
    return JSON.parse(trimmed) as unknown[];
  } catch {
    return null;
  }
}

function parseDateIso(value: string | null | undefined): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

async function ensureAdmin(): Promise<void> {
  if (!adminClient) {
    throw new Error("Falta configurar SUPABASE_SERVICE_ROLE_KEY en .env.local.");
  }
}

async function refresh() {
  revalidatePath("/", "layout");
}

// ---------- Sesión ----------

export async function loginAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const name = String(formData.get("vendedor") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!name || !password) {
    return { ok: false, error: "Ingresa vendedor y contraseña." };
  }

  const seller = verifyCredentials(name, password);
  if (!seller) {
    return { ok: false, error: "Vendedor o contraseña incorrectos." };
  }

  const token = await createSessionToken(seller.name);
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 12 * 60 * 60,
  });

  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  redirect("/admin/login");
}

// ---------- Productos ----------

export async function saveProductAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  await requireSeller();

  const existingId = String(formData.get("id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const price = Number(formData.get("price"));
  const category = String(formData.get("category") ?? "").trim();

  if (!name || Number.isNaN(price) || price < 0 || !category) {
    return { ok: false, error: "Nombre, precio y categoría son obligatorios." };
  }

  const pattern = String(formData.get("pattern") ?? "quilt");
  const accent = String(formData.get("accent") ?? "#e8a0b5");
  const badge = String(formData.get("badge") ?? "").trim() || null;
  const description = String(formData.get("description") ?? "").trim();
  const details = parseDetails(String(formData.get("details") ?? ""));
  const colors = parseColors(String(formData.get("colors") ?? ""));

  const discountPercentRaw = String(formData.get("discount_percent") ?? "").trim();
  const discountPercentValue =
    discountPercentRaw === "" ? null : Math.min(100, Math.max(0, Number(discountPercentRaw)));
  const discountPercent =
    discountPercentValue === null || Number.isNaN(discountPercentValue) ? null : discountPercentValue;
  const discountEndsAt = parseDateIso(
    String(formData.get("discount_ends_at_iso") ?? formData.get("discount_ends_at") ?? "") || null,
  );

  const deleteImage = formData.get("delete_image") === "1";

  try {
    await ensureAdmin(); // guard de clave de servicio

    const payload: Record<string, InsertValue> = {
      name,
      price,
      category,
      badge,
      accent,
      pattern,
      description,
      details,
    };
    payload["discount_percent"] = discountPercent as number | null;
    payload["discount_ends_at"] = discountEndsAt;
    if (colors) payload["colors"] = colors;

    let productId = existingId;
    if (productId) {
      const { error } = await adminClient!.from("products").update(payload).eq("id", productId);
      if (error) return { ok: false, error: `No se pudo actualizar: ${error.message}` };
    } else {
      productId = await uniqueId(name, "products", "id");
      const { error } = await adminClient!
        .from("products")
        .insert({ id: productId, views: 0, sales: 0, ...payload });
      if (error) return { ok: false, error: `No se pudo crear: ${error.message}` };
    }

    // Imagen opcional
    const image = formData.get("imagen");
    if (image instanceof File && image.size > 0) {
      const ext = (image.name.split(".").pop() ?? "png").toLowerCase().replace(/[^a-z0-9]/g, "");
      const path = `productos/${productId}/imagen.${ext || "png"}`;
      const { error: uploadError } = await adminClient!.storage
        .from("productos")
        .upload(path, image, { upsert: true, contentType: image.type || "image/png" });
      if (uploadError) {
        return { ok: false, error: `No se pudo subir la imagen: ${uploadError.message}` };
      }
      await adminClient!.from("products").update({ image_url: adminImageUrl(path) }).eq("id", productId);
    } else if (deleteImage) {
      await adminClient!.from("products").update({ image_url: null }).eq("id", productId);
    }

    await refresh();
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Error al guardar producto" };
  }
}

export async function deleteProductAction(formData: FormData): Promise<ActionResult> {
  await requireSeller();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return { ok: false, error: "Falta el id del producto." };

  try {
    await ensureAdmin();
    await adminClient!.storage.from("productos").remove([`productos/${id}`]);
    const { error } = await adminClient!.from("products").delete().eq("id", id);
    if (error) return { ok: false, error: `No se pudo eliminar: ${error.message}` };
    await refresh();
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Error al eliminar" };
  }
}

export async function setSalesAction(formData: FormData): Promise<ActionResult> {
  await requireSeller();
  const id = String(formData.get("id") ?? "").trim();
  const sales = Number(formData.get("sales"));
  if (!id || Number.isNaN(sales) || sales < 0) {
    return { ok: false, error: "Indica unidades vendidas válidas." };
  }

  try {
    await ensureAdmin();
    const { error } = await adminClient!.from("products").update({ sales }).eq("id", id);
    if (error) return { ok: false, error: `No se pudo registrar la venta: ${error.message}` };
    await refresh();
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Error al registrar venta" };
  }
}

// ---------- Categorías ----------

export async function saveCategoryAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  await requireSeller();
  const id = String(formData.get("id") ?? "").trim();
  const label = String(formData.get("label") ?? "").trim();
  if (!label) return { ok: false, error: "La categoría necesita un nombre." };

  try {
    await ensureAdmin();
    if (id === "novedades" || id === "ofertas") {
      return { ok: false, error: "novedades y ofertas son catálogos reservados." };
    }

    if (id) {
      const { error } = await adminClient!.from("categories").update({ label }).eq("id", id);
      if (error) return { ok: false, error: `No se pudo actualizar: ${error.message}` };
    } else {
      const newId = await uniqueId(label, "categories", "id");
      const { count, error: countError } = await adminClient!
        .from("categories")
        .select("id", { count: "exact", head: true })
        .eq("active", true);
      if (countError) return { ok: false, error: countError.message };
      const { error } = await adminClient!
        .from("categories")
        .insert({ id: newId, label, position: count ?? 0, active: true });
      if (error) return { ok: false, error: `No se pudo crear: ${error.message}` };
    }

    await refresh();
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Error al guardar categoría" };
  }
}

export async function deleteCategoryAction(formData: FormData): Promise<ActionResult> {
  await requireSeller();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return { ok: false, error: "Falta la categoría." };

  try {
    await ensureAdmin();
    const { data, error } = await adminClient!
      .from("products")
      .select("id")
      .eq("category", id)
      .limit(1);
    if (error) return { ok: false, error: error.message };
    if (data && data.length > 0) {
      return { ok: false, error: "No se puede borrar: tiene productos." };
    }

    const { error: delError } = await adminClient!.from("categories").delete().eq("id", id);
    if (delError) return { ok: false, error: `No se pudo eliminar: ${delError.message}` };
    await refresh();
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Error al eliminar categoría" };
  }
}