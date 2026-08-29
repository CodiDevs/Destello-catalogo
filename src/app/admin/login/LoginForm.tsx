"use client";

import { useActionState } from "react";
import { loginAction, type ActionResult } from "@/app/admin/actions";

export function LoginForm() {
  const [state, formAction, pending] = useActionState<ActionResult, FormData>(loginAction, {
    ok: false,
  });

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5">
        <span className="font-serif text-xs tracking-[0.12em] text-ink uppercase">Vendedor</span>
        <input
          name="vendedor"
          type="text"
          autoComplete="username"
          required
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-ink outline-none transition focus:border-gold"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="font-serif text-xs tracking-[0.12em] text-ink uppercase">Contraseña</span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-ink outline-none transition focus:border-gold"
        />
      </label>

      {state.error ? (
        <p className="rounded-lg bg-blush/60 px-3 py-2 text-sm text-ink" role="alert">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="mt-1 rounded-lg bg-gold px-4 py-2.5 text-sm font-semibold tracking-[0.12em] text-ink uppercase transition hover:bg-gold-soft disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}