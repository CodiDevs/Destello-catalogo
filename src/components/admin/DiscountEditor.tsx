"use client";

import { useRef, useState } from "react";
import { useActionState } from "react";
import { type Product } from "@/data/products";
import { saveProductAction, type ActionResult } from "@/app/admin/actions";
import { PreviewCard } from "@/components/admin/PreviewCard";

export function DiscountEditor({ product }: { product: Product }) {
  const [state, formAction, pending] = useActionState<ActionResult, FormData>(saveProductAction, {
    ok: false,
  });

  const [percent, setPercent] = useState(product.discountPercent?.toString() ?? "");
  const [endsAt, setEndsAt] = useState(
    product.discountEndsAt ? new Date(product.discountEndsAt).toISOString().slice(0, 16) : "",
  );
  const endsAtIsoInput = useRef<HTMLInputElement | null>(null);

  const draft: Product = {
    ...product,
    discountPercent: percent === "" ? undefined : Math.max(0, Math.min(100, Number(percent))),
    discountEndsAt: percent !== "" && endsAt ? new Date(endsAt).toISOString() : undefined,
  };

  const inputCls =
    "w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-ink outline-none transition focus:border-gold";

  return (
    <form action={formAction} className="grid gap-6 md:grid-cols-[1fr_220px] md:items-start">
      <div className="flex flex-col gap-4">
        <input type="hidden" name="id" value={product.id} />
        <input type="hidden" name="name" value={product.name} />
        <input type="hidden" name="price" value={product.price} />
        <input type="hidden" name="category" value={product.category} />
        <input type="hidden" name="accent" value={product.accent} />
        <input type="hidden" name="pattern" value={product.pattern} />
        <input type="hidden" name="description" value={product.description} />
        <input type="hidden" name="details" value={product.details.join("\n")} />
        {product.colors && product.colors.length > 0 ? (
          <input type="hidden" name="colors" value={JSON.stringify(product.colors)} />
        ) : null}
        {product.badge ? <input type="hidden" name="badge" value={product.badge} /> : null}
        <input type="hidden" name="delete_image" value="0" />
        <input ref={endsAtIsoInput} type="hidden" name="discount_ends_at_iso" />

        {state.error ? (
          <p className="rounded-lg bg-blush/60 px-3 py-2 text-sm text-ink" role="alert">
            {state.error}
          </p>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-sm text-ink">
            <span className="font-serif text-xs tracking-[0.12em] text-ink-muted uppercase">
              % de descuento
            </span>
            <input
              name="discount_percent"
              type="number"
              min={0}
              max={100}
              className={inputCls}
              placeholder="Dejar vacío para quitar la oferta"
              value={percent}
              onChange={(e) => setPercent(e.target.value)}
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm text-ink">
            <span className="font-serif text-xs tracking-[0.12em] text-ink-muted uppercase">
              Fin de la oferta
            </span>
            <input
              type="datetime-local"
              className={inputCls}
              value={endsAt}
              onChange={(e) => {
                setEndsAt(e.target.value);
                if (endsAtIsoInput.current) {
                  endsAtIsoInput.current.value = e.target.value ? new Date(e.target.value).toISOString() : "";
                }
              }}
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={pending}
          className="w-fit rounded-lg bg-gold px-4 py-2 text-xs font-semibold tracking-[0.12em] text-ink uppercase transition hover:bg-gold-soft disabled:opacity-60"
        >
          {pending ? "Guardando…" : "Guardar descuento"}
        </button>
        {state.ok ? <p className="text-sm text-gold-ink">Descuento guardado ✓</p> : null}
      </div>

      <div>
        <p className="mb-3 font-serif text-xs tracking-[0.14em] text-ink-muted uppercase">
          Previsualización y temporizador
        </p>
        <PreviewCard product={draft} />
      </div>
    </form>
  );
}