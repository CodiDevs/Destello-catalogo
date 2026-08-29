import { AnnouncementBar } from "@/components/AnnouncementBar";
import { CategoryGrid } from "@/components/CategoryGrid";
import { Hero } from "@/components/Hero";
import { ProductCatalog } from "@/components/ProductCatalog";
import { PromoBanner } from "@/components/PromoBanner";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Welcome } from "@/components/Welcome";
import { getProducts } from "@/lib/getProducts";

// Server Component: la lectura a Supabase corre en el servidor, así que las
// credenciales nunca viajan al navegador. Ver src/lib/getProducts.ts.
export default async function Home() {
  const products = await getProducts();

  return (
    <>
      <AnnouncementBar />
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <CategoryGrid />
        <Welcome />
        <ProductCatalog products={products} />
        <PromoBanner />
      </main>
      <SiteFooter />
    </>
  );
}
