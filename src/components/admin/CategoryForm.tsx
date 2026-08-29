"use client";

import { useActionState } from "react";
import { saveCategoryAction, type ActionResult } from "@/app/admin/actions";

export function CategoryForm({ category }: { category?: { id: string; label: string } }) {
  const [state, formAction, pending] = useActionState<ActionResult, FormData>(saveCategoryAction, {
    ok: false,
  });

  return (
    <form action={formAction} className="grid gap-2 sm:grid-cols-[1fr_auto] sm:items-center">
      <input type="hidden" name="id" value={category?.id ?? ""} />
      <input
        name="label"
        placeholder={category ? category.label : "Nueva categoría"}
        defaultValue={category?.label ?? ""}
        required
        className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-ink outline-none transition focus:border-gold"
      />
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-gold px-4 py-2 text-xs font-semibold tracking-[0.12em] text-ink uppercase transition hover:bg-gold-soft disabled:opacity-60"
      >
        {pending ? "…" : category ? "Renombrar" : "Agregar"}
      </button>
      {state.error ? (
        <p className="text-xs text-ink-muted sm:col-span-2" role="alert">
          {state.error}
        </p>
      ) : null}
      {state.ok && !category ? <p className="text-xs text-gold-ink sm:col-span-2">Categoría creada ✓</p> : null}
    </form>
  );
}