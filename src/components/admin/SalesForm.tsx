"use client";

import { useActionState } from "react";
import { setSalesAction, type ActionResult } from "@/app/admin/actions";

export function SalesForm({ productId, sales }: { productId: string; sales: number }) {
  const [state, formAction, pending] = useActionState<ActionResult, FormData>(
    (_prev, formData) => setSalesAction(formData),
    { ok: false },
  );

  return (
    <form action={formAction} className="flex items-center gap-1.5">
      <input type="hidden" name="id" value={productId} />
      <input
        type="number"
        name="sales"
        min={0}
        step={1}
        defaultValue={sales}
        aria-label="Unidades vendidas"
        className="w-16 rounded-lg border border-border bg-surface px-2 py-1 text-center text-sm text-ink outline-none transition focus:border-gold"
      />
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-blush px-2 py-1 text-xs font-semibold text-ink transition hover:bg-blush-deep disabled:opacity-60"
      >
        {pending ? "…" : "Guardar"}
      </button>
      {state.error ? (
        <span className="max-w-28 text-[0.6rem] text-ink-muted" title={state.error}>
          Error
        </span>
      ) : null}
    </form>
  );
}