"use client";

import { useState } from "react";
import { useActionState, useRef } from "react";
import {
  type Category,
  type PatternId,
  type Product,
} from "@/data/products";
import { saveProductAction, type ActionResult } from "@/app/admin/actions";
import { PreviewCard } from "@/components/admin/PreviewCard";

const patterns: PatternId[] = ["quilt", "stripe", "dot", "wave"];

export function ProductForm({
  initial,
  categories,
}: {
  initial?: Product;
  categories: Category[];
}) {
  const [state, formAction, pending] = useActionState<ActionResult, FormData>(saveProductAction, {
    ok: false,
  });

  const [draft, setDraft] = useState<{
    id: string;
    name: string;
    price: number;
    category: string;
    badge: string;
    accent: string;
    pattern: PatternId;
    description: string;
    details: string;
    colors: string;
    discountPercent: string;
    discountEndsAt: string;
  }>({
    id: initial?.id ?? "",
    name: initial?.name ?? "",
    price: initial?.price ?? 0,
    category: initial?.category ?? categories[0]?.id ?? "",
    badge: initial?.badge ?? "",
    accent: initial?.accent ?? "#e8a0b5",
    pattern: initial?.pattern ?? "quilt",
    description: initial?.description ?? "",
    details: initial?.details.join("\n") ?? "",
    colors: initial?.colors ? JSON.stringify(initial.colors, null, 0) : "",
    discountPercent: initial?.discountPercent?.toString() ?? "",
    discountEndsAt: initial?.discountEndsAt
      ? new Date(initial.discountEndsAt).toISOString().slice(0, 16)
      : "",
  });
  const [imageDataUrl, setImageDataUrl] = useState<string | undefined>();
  const [deleteImage, setDeleteImage] = useState(false);
  const endsAtIsoInput = useRef<HTMLInputElement | null>(null);

  const set = <K extends keyof typeof draft>(key: K, value: (typeof draft)[K]) =>
    setDraft((prev) => ({ ...prev, [key]: value }));

  const draftProduct: Product = {
    id: draft.id,
    name: draft.name || "(sin nombre)",
    price: Number(draft.price) || 0,
    category: draft.category,
    badge: draft.badge || undefined,
    accent: draft.accent,
    pattern: draft.pattern,
    description: draft.description,
    details: [],
    discountPercent: draft.discountPercent === "" ? undefined : Number(draft.discountPercent),
    discountEndsAt:
      draft.discountPercent !== "" && draft.discountEndsAt
        ? new Date(draft.discountEndsAt).toISOString()
        : undefined,
    views: initial?.views ?? 0,
    sales: initial?.sales ?? 0,
  };

  const inputCls =
    "w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-ink outline-none transition focus:border-gold";
  const labelCls = "flex flex-col gap-1.5 text-sm text-ink";
  const labelTitle = "font-serif text-xs tracking-[0.12em] text-ink-muted uppercase";

  return (
    <form action={formAction} className="grid gap-8 lg:grid-cols-[1fr_260px]">
      <div className="flex flex-col gap-4">
        {state.error ? (
          <p className="rounded-lg bg-blush/60 px-3 py-2 text-sm text-ink" role="alert">
            {state.error}
          </p>
        ) : null}

        <input type="hidden" name="id" value={draft.id} />
        <input type="hidden" name="delete_image" value={deleteImage ? "1" : "0"} />
        <input ref={endsAtIsoInput} type="hidden" name="discount_ends_at_iso" />

        <div className="grid gap-4 sm:grid-cols-2">
          <label className={labelCls}>
            <span className={labelTitle}>Nombre</span>
            <input
              name="name"
              className={inputCls}
              required
              value={draft.name}
              onChange={(e) => set("name", e.target.value)}
            />
          </label>

          <label className={labelCls}>
            <span className={labelTitle}>Precio (USD)</span>
            <input
              name="price"
              type="number"
              min={0}
              step="0.01"
              className={inputCls}
              required
              value={draft.price}
              onChange={(e) => set("price", Number(e.target.value))}
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className={labelCls}>
            <span className={labelTitle}>Categoría</span>
            <select
              name="category"
              className={inputCls}
              required
              value={draft.category}
              onChange={(e) => set("category", e.target.value)}
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>
          </label>

          <label className={labelCls}>
            <span className={labelTitle}>Etiqueta (badge)</span>
            <input
              name="badge"
              className={inputCls}
              placeholder="Ej: Nuevo, Best seller"
              value={draft.badge}
              onChange={(e) => set("badge", e.target.value)}
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <label className={labelCls}>
            <span className={labelTitle}>Color acento</span>
            <input
              name="accent"
              type="color"
              className="h-11 w-full cursor-pointer rounded-lg border border-border bg-surface p-1"
              value={draft.accent}
              onChange={(e) => set("accent", e.target.value)}
            />
          </label>

          <label className={labelCls}>
            <span className={labelTitle}>Patrón</span>
            <select
              name="pattern"
              className={inputCls}
              value={draft.pattern}
              onChange={(e) => set("pattern", e.target.value as PatternId)}
            >
              {patterns.map((pattern) => (
                <option key={pattern} value={pattern}>
                  {pattern}
                </option>
              ))}
            </select>
          </label>

          <label className={labelCls}>
            <span className={labelTitle}>Imagen</span>
            <input
              name="imagen"
              type="file"
              accept="image/*"
              className="text-sm text-ink-muted file:mr-2 file:rounded-lg file:border-0 file:bg-blush file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-ink"
              onChange={(e) => {
                const file = e.target.files?.[0];
                setImageDataUrl(file ? URL.createObjectURL(file) : undefined);
              }}
            />
          </label>
        </div>

        {initial?.imageUrl ? (
          <label className="flex items-center gap-2 text-sm text-ink-muted">
            <input
              type="checkbox"
              checked={deleteImage}
              onChange={(e) => setDeleteImage(e.target.checked)}
            />
            Quitar imagen actual
          </label>
        ) : null}

        <label className={labelCls}>
          <span className={labelTitle}>Descripción</span>
          <textarea
            name="description"
            rows={3}
            className={inputCls}
            required
            value={draft.description}
            onChange={(e) => set("description", e.target.value)}
          />
        </label>

        <label className={labelCls}>
          <span className={labelTitle}>Detalles (uno por línea)</span>
          <textarea
            name="details"
            rows={4}
            className={inputCls}
            placeholder={"Cierre con cremallera\nCorrea ajustable"}
            value={draft.details}
            onChange={(e) => set("details", e.target.value)}
          />
        </label>

        <input type="hidden" name="colors" value={draft.colors} />

        <div className="rounded-2xl border border-border bg-surface-elevated p-4">
          <p className="mb-3 font-serif text-xs tracking-[0.14em] text-ink-muted uppercase">
            Descuento (opcional)
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className={labelCls}>
              <span className={labelTitle}>% de descuento</span>
              <input
                name="discount_percent"
                type="number"
                min={0}
                max={100}
                step={1}
                className={inputCls}
                value={draft.discountPercent}
                onChange={(e) => set("discountPercent", e.target.value)}
              />
            </label>

            <label className={labelCls}>
              <span className={labelTitle}>Fin de la oferta</span>
              <input
                type="datetime-local"
                className={inputCls}
                value={draft.discountEndsAt}
                onChange={(e) => {
                  set("discountEndsAt", e.target.value);
                  if (endsAtIsoInput.current) {
                    endsAtIsoInput.current.value = e.target.value
                      ? new Date(e.target.value).toISOString()
                      : "";
                  }
                }}
              />
            </label>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-gold px-5 py-2.5 text-sm font-semibold tracking-[0.12em] text-ink uppercase transition hover:bg-gold-soft disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? "Guardando…" : initial ? "Guardar cambios" : "Agregar producto"}
          </button>
          {state.ok ? (
            <span className="text-sm text-gold-ink">Guardado ✓</span>
          ) : null}
        </div>
      </div>

      <div className="lg:sticky lg:top-20 lg:self-start">
        <p className="mb-3 font-serif text-xs tracking-[0.14em] text-ink-muted uppercase">
          Previsualización
        </p>
        <PreviewCard product={{ ...draftProduct, imageUrl: imageDataUrl ?? (deleteImage ? undefined : initial?.imageUrl) }} />
        <p className="mt-3 text-xs leading-relaxed text-ink-muted">
          Así se verá el producto en el catálogo, con su descuento y temporizador si los tiene.
        </p>
      </div>
    </form>
  );
}