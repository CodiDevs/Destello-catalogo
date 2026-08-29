import { AnnouncementBar } from "@/components/AnnouncementBar";
import { CategoryGrid } from "@/components/CategoryGrid";
import { Hero } from "@/components/Hero";
import { ProductCatalog } from "@/components/ProductCatalog";
import { PromoBanner } from "@/components/PromoBanner";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Welcome } from "@/components/Welcome";
import { getCategories } from "@/lib/getCategories";
import { getProducts } from "@/lib/getProducts";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  return (
    <>
      <AnnouncementBar />
      <SiteHeader categories={categories} />
      <main className="flex-1">
        <Hero />
        <CategoryGrid categories={categories} />
        <Welcome />
        <ProductCatalog products={products} categories={categories} />
        <PromoBanner />
      </main>
      <SiteFooter />
    </>
  );
}
