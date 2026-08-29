import { getProducts } from "@/lib/getProducts";
import { getCategories } from "@/lib/getCategories";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { DeleteCategoryForm } from "@/components/admin/DeleteCategoryForm";

export default async function AdminCategoriasPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  const productCountFor = (id: string) =>
    products.filter((product) => product.category === id).length;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6">
      <h1 className="font-serif text-2xl text-ink sm:text-3xl">Categorías</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted">
        Las categorías aparecen como secciones en la tienda y como catálogos en{" "}
        <code className="rounded bg-surface-elevated px-1">/catalogo/&lt;categoria&gt;</code>.
        Se inicia con Carteras y Termos; puedes agregar más. No se pueden borrar categorías que tengan
        productos.
      </p>

      <div className="mt-8 rounded-2xl border border-border bg-surface-elevated p-5">
        <p className="mb-3 font-serif text-xs tracking-[0.14em] text-ink-muted uppercase">
          Agregar categoría
        </p>
        <CategoryForm />
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-surface-elevated p-4"
          >
            <div className="min-w-36 flex-1">
              <p className="font-serif text-base text-ink">{category.label}</p>
              <p className="text-xs text-ink-muted">
                /catalogo/{category.id} · {productCountFor(category.id)} producto(s)
              </p>
            </div>
            <div className="w-full sm:w-64">
              <CategoryForm category={{ id: category.id, label: category.label }} />
            </div>
            <DeleteCategoryForm categoryId={category.id} label={category.label} />
          </div>
        ))}
      </div>
    </div>
  );
}