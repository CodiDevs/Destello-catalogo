import { redirect } from "next/navigation";
import { getCurrentSeller } from "@/lib/admin/auth";
import { LoginForm } from "./LoginForm";

export default async function AdminLoginPage() {
  const seller = await getCurrentSeller();
  if (seller) redirect("/admin");

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-surface-elevated p-6 shadow-[0_12px_40px_rgba(80,40,55,0.12)] sm:p-8">
        <div className="mb-6 text-center">
          <h1 className="font-script text-3xl text-gold">Destello</h1>
          <p className="mt-1 font-serif text-xs tracking-[0.22em] text-ink-muted uppercase">
            Acceso de vendedores
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}