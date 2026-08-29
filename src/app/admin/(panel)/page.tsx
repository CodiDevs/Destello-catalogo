import Link from "next/link";
import {
  discountedPrice,
  formatPrice,
  isDiscountActive,
} from "@/data/products";
import { getProducts } from "@/lib/getProducts";
import { getCategories } from "@/lib/getCategories";
import { SalesForm } from "@/components/admin/SalesForm";

export default async function AdminDashboardPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  const totalViews = products.reduce((sum, product) => sum + product.views, 0);
  const totalSales = products.reduce((sum, product) => sum + product.sales, 0);
  const activeDiscounts = products.filter(isDiscountActive).length;
  const labelFor = (id: string) => categories.find((c) => c.id === id)?.label ?? id;

  const stats = [
    { label: "Productos", value: products.length },
    { label: "Vistas totales", value: totalViews.toLocaleString("es-EC") },
    { label: "Unidades vendidas", value: totalSales.toLocaleString("es-EC") },
    { label: "Ofertas activas", value: activeDiscounts },
  ];

  const sorted = [...products].sort((a, b) => b.views - a.views);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <h1 className="font-serif text-2xl text-ink sm:text-3xl">Panel</h1>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-border bg-surface-elevated p-4">
            <p className="text-2xl font-semibold text-gold-ink">{stat.value}</p>
            <p className="mt-1 text-xs tracking-[0.1em] text-ink-muted uppercase">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-serif text-lg text-ink">Productos</h2>
        <Link
          href="/admin/productos?nuevo=1"
          className="rounded-lg bg-gold px-3 py-2 text-xs font-semibold tracking-[0.12em] text-ink uppercase transition hover:bg-gold-soft"
        >
          + Nuevo producto
        </Link>
      </div>

      <div className="mt-4 overflow-x-auto rounded-2xl border border-border bg-surface-elevated">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-border font-serif text-xs tracking-[0.14em] text-ink-muted uppercase">
              <th className="px-4 py-3">Producto</th>
              <th className="px-4 py-3">Categoría</th>
              <th className="px-4 py-3">Precio</th>
              <th className="px-4 py-3">Vistas</th>
              <th className="px-4 py-3">Vendidas</th>
              <th className="px-4 py-3">Oferta</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {sorted.map((product) => (
              <tr key={product.id} className="border-b border-border/50 last:border-none">
                <td className="px-4 py-3 font-medium text-ink">{product.name}</td>
                <td className="px-4 py-3 text-ink-muted">{labelFor(product.category)}</td>
                <td className="px-4 py-3 text-ink">
                  {isDiscountActive(product) ? (
                    <>
                      {formatPrice(discountedPrice(product))}{" "}
                      <span className="text-xs text-ink-muted line-through">
                        {formatPrice(product.price)}
                      </span>
                    </>
                  ) : (
                    formatPrice(product.price)
                  )}
                </td>
                <td className="px-4 py-3 tabular-nums text-ink-muted">{product.views}</td>
                <td className="px-4 py-3">
                  <SalesForm productId={product.id} sales={product.sales} />
                </td>
                <td className="px-4 py-3 text-ink-muted">
                  {product.discountPercent && isDiscountActive(product)
                    ? `${product.discountPercent}%`
                    : "—"}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/productos?editar=${product.id}`}
                    className="text-xs text-gold hover:underline"
                  >
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}