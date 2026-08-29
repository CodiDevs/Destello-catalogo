import { notFound } from "next/navigation";
import { getProducts } from "@/lib/getProducts";
import { getCategories } from "@/lib/getCategories";
import { isDerivedCatalogSlug } from "@/data/products";
import { SiteHeader } from "@/components/SiteHeader";
import { CatalogNav } from "@/components/CatalogNav";
import { ProductCatalog } from "@/components/ProductCatalog";
import { SiteFooter } from "@/components/SiteFooter";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ categoria: string }> }) {
  const { categoria } = await params;
  const categories = await getCategories();
  const title =
    categoria === "novedades"
      ? "Shop New"
      : categoria === "ofertas"
        ? "Ofertas"
        : (categories.find((c) => c.id === categoria)?.label ?? "Catálogo");
  return { title: `${title} · Destello` };
}

export default async function CatalogPage({
  params,
}: {
  params: Promise<{ categoria: string }>;
}) {
  const { categoria } = await params;
  const categories = await getCategories();

  if (!isDerivedCatalogSlug(categoria) && !categories.some((c) => c.id === categoria)) {
    notFound();
  }

  const products = await getProducts();

  return (
    <>
      <SiteHeader categories={categories} />
      <CatalogNav categories={categories} activeSlug={categoria} />
      <main className="flex-1">
        <ProductCatalog products={products} categories={categories} slug={categoria} />
      </main>
      <SiteFooter />
    </>
  );
}