"use client";

import { useActionState, useRef, useState } from "react";
import {
  type Category,
  type PatternId,
  type Product,
  type ProductImage,
} from "@/data/products";
import { saveProductAction, type ActionResult } from "@/app/admin/actions";
import { PreviewCard } from "@/components/admin/PreviewCard";

const patterns: PatternId[] = ["quilt", "stripe", "dot", "wave"];

type ColorRow = { id: string; name: string; hex: string };

type ImageSlot = { url?: string; file?: File; remove?: boolean };

const GENERAL_IMAGE_KEY = "general";

function slugifyId(input: string, taken: string[]): string {
  const base0 =
    input
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "color";
  let candidate = base0;
  let i = 2;
  while (taken.includes(candidate)) {
    candidate = `${base0}-${i}`;
    i += 1;
  }
  return candidate;
}

function initImageSlots(initial?: Product): Record<string, ImageSlot> {
  const images: ProductImage[] =
    initial?.images ??
    (initial?.imageUrl ? [{ colorId: null, url: initial.imageUrl }] : []);
  const slots: Record<string, ImageSlot> = {};
  for (const image of images) {
    slots[image.colorId ?? GENERAL_IMAGE_KEY] = { url: image.url };
  }
  return slots;
}

function slotThumbUrl(slot?: ImageSlot): string | undefined {
  if (!slot) return undefined;
  if (slot.remove) return undefined;
  if (slot.file && slot.file.size > 0) return URL.createObjectURL(slot.file);
  return slot.url;
}

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
    discountPercent: initial?.discountPercent?.toString() ?? "",
    discountEndsAt: initial?.discountEndsAt
      ? new Date(initial.discountEndsAt).toISOString().slice(0, 16)
      : "",
  });
  const [colorRows, setColorRows] = useState<ColorRow[]>(initial?.colors ?? []);
  const [imageSlots, setImageSlots] = useState<Record<string, ImageSlot>>(() =>
    initImageSlots(initial),
  );
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
    colors: colorRows.length > 0 ? colorRows : undefined,
    discountPercent: draft.discountPercent === "" ? undefined : Number(draft.discountPercent),
    discountEndsAt:
      draft.discountPercent !== "" && draft.discountEndsAt
        ? new Date(draft.discountEndsAt).toISOString()
        : undefined,
    views: initial?.views ?? 0,
    sales: initial?.sales ?? 0,
  };

  const addColor = () => {
    setColorRows((rows) => {
      const id = slugifyId(`color-${rows.length + 1}`, rows.map((r) => r.id));
      return [...rows, { id, name: "", hex: "#e8a0b5" }];
    });
  };

  const updateColor = (id: string, patch: Partial<ColorRow>) => {
    setColorRows((rows) => rows.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  };

  const removeColor = (id: string) => {
    setColorRows((rows) => rows.filter((row) => row.id !== id));
    setImageSlots((slots) => {
      const next = { ...slots };
      delete next[id];
      return next;
    });
  };

  const setSlotFile = (key: string, file?: File) => {
    setImageSlots((slots) => ({
      ...slots,
      [key]: { url: slots[key]?.url, file, remove: false },
    }));
  };

  const removeSlot = (key: string) => {
    setImageSlots((slots) => ({
      ...slots,
      [key]: { url: slots[key]?.url, file: undefined, remove: true },
    }));
  };

  const restoreSlot = (key: string) => {
    setImageSlots((slots) => ({
      ...slots,
      [key]: { url: slots[key]?.url, remove: false },
    }));
  };

  const slotKeys = [GENERAL_IMAGE_KEY, ...colorRows.map((row) => row.id)];

  const imageSlotsJson = slotKeys.map((key) => {
    const slot = imageSlots[key] ?? {};
    const removed = Boolean(slot.remove);
    const hasFile = !removed && slot.file != null && slot.file.size > 0;
    const url = !removed && !hasFile && slot.url ? slot.url : "";
    return { colorId: key === GENERAL_IMAGE_KEY ? null : key, url, hasFile };
  });

  const previewImage =
  slotKeys.map((key) => slotThumbUrl(imageSlots[key])).find(Boolean) ?? undefined;

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
        <input type="hidden" name="colors" value={JSON.stringify(colorRows)} />
        <input type="hidden" name="imagenes" value={JSON.stringify(imageSlotsJson)} />
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

        <div className="grid gap-4 sm:grid-cols-2">
          <label className={labelCls}>
            <span className={labelTitle}>Color acento (fondo si falta foto)</span>
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
        </div>

        <div className="rounded-2xl border border-border bg-surface-elevated p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="font-serif text-xs tracking-[0.14em] text-ink-muted uppercase">
              Colores del producto
            </p>
            <button
              type="button"
              onClick={addColor}
              className="rounded-lg bg-blush px-3 py-1.5 text-xs font-semibold text-ink transition hover:bg-blush-deep"
            >
              + Agregar color
            </button>
          </div>
          {colorRows.length === 0 ? (
            <p className="text-xs text-ink-muted">
              Sin colores aún. Si el producto tiene variantes de color, agrégalas para poder
              asociarle una foto a cada una.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {colorRows.map((row) => (
                <div key={row.id} className="flex flex-wrap items-center gap-2">
                  <input
                    value={row.name}
                    placeholder="Nombre del color"
                    className="min-w-36 flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-gold"
                    onChange={(e) => updateColor(row.id, { name: e.target.value })}
                  />
                  <input
                    type="color"
                    value={row.hex}
                    className="h-9 w-12 cursor-pointer rounded-lg border border-border bg-surface p-1"
                    onChange={(e) => updateColor(row.id, { hex: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => removeColor(row.id)}
                    className="rounded-lg border border-border px-2 py-1.5 text-xs text-ink-muted transition hover:border-blush-deep hover:text-ink"
                    aria-label={`Quitar color ${row.name || row.id}`}
                  >
                    Quitar
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-surface-elevated p-4">
          <p className="mb-1 font-serif text-xs tracking-[0.14em] text-ink-muted uppercase">
            Imágenes por color
          </p>
          <p className="mb-4 text-xs leading-relaxed text-ink-muted">
            Una foto por color + una general. La primera con foto se usa como miniatura. Si no
            subes foto para un color, se muestra la general o la primera.
          </p>
          <div className="flex flex-col gap-3">
            {slotKeys.map((key, index) => {
              const label =
                key === GENERAL_IMAGE_KEY ? "Imagen general" : colorRows.find((r) => r.id === key)?.name || key;
              const slot = imageSlots[key] ?? {};
              const removed = Boolean(slot.remove);
              const thumb = slotThumbUrl(slot);
              return (
                <div
                  key={key}
                  className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-surface p-3"
                >
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-border bg-blush/30">
                    {thumb ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={thumb} alt={label} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[0.6rem] text-ink-muted">
                        sin foto
                      </div>
                    )}
                  </div>
                  <div className="min-w-40 flex-1">
                    <p className="text-sm font-medium text-ink">{label}</p>
                    {removed ? (
                      <p className="text-xs text-blush-deep">Se quitará al guardar.</p>
                    ) : (
                      <input
                        name={`imagen_${index}`}
                        type="file"
                        accept="image/*"
                        className="text-xs text-ink-muted file:mr-2 file:rounded-lg file:border-0 file:bg-blush file:px-2.5 file:py-1 file:text-[0.65rem] file:font-semibold file:text-ink"
                        onChange={(e) => setSlotFile(key, e.target.files?.[0])}
                      />
                    )}
                  </div>
                  {removed ? (
                    <button
                      type="button"
                      onClick={() => restoreSlot(key)}
                      className="rounded-lg border border-border px-2.5 py-1.5 text-xs text-ink-muted transition hover:border-gold hover:text-gold"
                    >
                      Deshacer
                    </button>
                  ) : slot.url || slot.file ? (
                    <button
                      type="button"
                      onClick={() => removeSlot(key)}
                      className="rounded-lg border border-border px-2.5 py-1.5 text-xs text-ink-muted transition hover:border-blush-deep hover:text-ink"
                    >
                      Quitar
                    </button>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>

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
        <PreviewCard product={{ ...draftProduct, imageUrl: previewImage }} />
        <p className="mt-3 text-xs leading-relaxed text-ink-muted">
          Así se verá el producto en el catálogo, con su descuento y temporizador si los tiene.
        </p>
      </div>
    </form>
  );
}