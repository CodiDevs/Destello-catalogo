"use client";

import { useActionState } from "react";
import { deleteProductAction, type ActionResult } from "@/app/admin/actions";

export function DeleteProductForm({ productId, name }: { productId: string; name: string }) {
  const [state, formAction, pending] = useActionState<ActionResult, FormData>(
    (_prev, formData) => deleteProductAction(formData),
    { ok: false },
  );

  return (
    <form action={formAction} className="inline-flex items-center gap-2">
      <input type="hidden" name="id" value={productId} />
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg border border-blush-deep px-3 py-2 text-xs font-semibold tracking-wide text-ink-muted uppercase transition hover:border-red-400 hover:text-ink disabled:opacity-60"
        onClick={(e) => {
          if (!window.confirm(`¿Eliminar "${name}"? Esta acción no se puede deshacer.`)) {
            e.preventDefault();
          }
        }}
      >
        {pending ? "…" : "Eliminar"}
      </button>
      {state.error ? <span className="text-xs text-ink-muted">{state.error}</span> : null}
    </form>
  );
}