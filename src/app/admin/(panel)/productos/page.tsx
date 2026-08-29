import Link from "next/link";
import { getProducts } from "@/lib/getProducts";
import { getCategories } from "@/lib/getCategories";
import { ProductForm } from "@/components/admin/ProductForm";
import { DeleteProductForm } from "@/components/admin/DeleteProductForm";
import { SalesForm } from "@/components/admin/SalesForm";

export default async function AdminProductosPage({
  searchParams,
}: {
  searchParams: Promise<{ nuevo?: string; editar?: string }>;
}) {
  const [{ nuevo, editar }, products, categories] = await Promise.all([
    searchParams,
    getProducts(),
    getCategories(),
  ]);

  const editing = editar ? products.find((product) => product.id === editar) : undefined;
  const labelFor = (id: string) => categories.find((c) => c.id === id)?.label ?? id;

  if (nuevo === "1" || editing) {
    return (
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-6 flex items-center justify-between gap-3">
          <h1 className="font-serif text-2xl text-ink sm:text-3xl">
            {editing ? `Editar · ${editing.name}` : "Nuevo producto"}
          </h1>
          <Link href="/admin/productos" className="text-sm text-gold hover:underline">
            ← Volver
          </Link>
        </div>
        <ProductForm initial={editing} categories={categories} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif text-2xl text-ink sm:text-3xl">Productos</h1>
        <Link
          href="/admin/productos?nuevo=1"
          className="rounded-lg bg-gold px-3 py-2 text-xs font-semibold tracking-[0.12em] text-ink uppercase transition hover:bg-gold-soft"
        >
          + Nuevo producto
        </Link>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        {products.length === 0 ? (
          <p className="rounded-2xl border border-border bg-surface-elevated p-6 text-sm text-ink-muted">
            Todavía no hay productos. Crea el primero.
          </p>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              className="flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-surface-elevated p-4"
            >
              <div className="w-16">
                {product.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="aspect-square w-16 rounded-lg object-cover"
                  />
                ) : (
                  <div
                    className={`aspect-square w-16 rounded-lg pattern-${product.pattern}`}
                    style={{ backgroundColor: product.accent }}
                  />
                )}
              </div>

              <div className="min-w-40 flex-1">
                <p className="font-serif text-base text-ink">{product.name}</p>
                <p className="text-xs text-ink-muted">
                  {labelFor(product.category)} · {product.views} vistas
                </p>
              </div>

              <div className="flex items-center gap-2 text-sm text-ink-muted">
                <span className="text-xs tracking-wide uppercase">Vendidas</span>
                <SalesForm productId={product.id} sales={product.sales} />
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/productos?editar=${product.id}`}
                  className="rounded-lg bg-blush px-3 py-2 text-xs font-semibold text-ink transition hover:bg-blush-deep"
                >
                  Editar
                </Link>
                <DeleteProductForm productId={product.id} name={product.name} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}