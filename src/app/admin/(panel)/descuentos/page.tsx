import { getProducts } from "@/lib/getProducts";
import { getCategories } from "@/lib/getCategories";
import { isDiscountActive, isDiscountExpired } from "@/data/products";
import { DiscountEditor } from "@/components/admin/DiscountEditor";

export default async function AdminDescuentosPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  const labelFor = (id: string) => categories.find((c) => c.id === id)?.label ?? id;

  const active = products.filter(isDiscountActive);
  const missed = products.filter(isDiscountExpired);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <h1 className="font-serif text-2xl text-ink sm:text-3xl">Descuentos</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted">
        Define el porcentaje y cuándo termina la oferta. En la tienda se muestra el precio
        rebajado con el precio original tachado y un temporizador de cuenta regresiva. Marca con
        esta previsualización cómo se verá antes de guardar.
      </p>

      <section className="mt-8" aria-label="Ofertas activas">
        <h2 className="mb-4 font-serif text-lg text-ink">
          En oferta ahora ({active.length})
        </h2>
        <div className="flex flex-col gap-6">
          {[...active, ...missed].map((product) => (
            <div
              key={product.id}
              className="rounded-2xl border border-border bg-surface-elevated p-5"
            >
              <p className="mb-1 font-serif text-base text-ink">
                {product.name}
                <span className="ml-2 text-xs text-ink-muted">
                  {labelFor(product.category)}
                </span>
              </p>
              {!isDiscountActive(product) ? (
                <p className="mb-3 text-xs text-ink-muted">
                  Esta oferta ya venció.
                </p>
              ) : null}
              <DiscountEditor product={product} />
            </div>
          ))}
          {active.length === 0 && missed.length === 0 ? (
            <p className="rounded-2xl border border-border bg-surface-elevated p-6 text-sm text-ink-muted">
              No hay descuentos. Establece uno en «Productos» o desde aquí en cualquier producto.
            </p>
          ) : null}
        </div>
      </section>

      <section className="mt-10" aria-label="Productos sin oferta">
        <h2 className="mb-4 font-serif text-lg text-ink">Productos sin oferta</h2>
        <div className="flex flex-col gap-6">
          {products
            .filter((product) => !product.discountPercent)
            .map((product) => (
              <div
                key={product.id}
                className="rounded-2xl border border-border bg-surface-elevated p-5"
              >
                <p className="mb-1 font-serif text-base text-ink">
                  {product.name}
                  <span className="ml-2 text-xs text-ink-muted">{labelFor(product.category)}</span>
                </p>
                <DiscountEditor product={product} />
              </div>
            ))}
        </div>
      </section>
    </div>
  );
}