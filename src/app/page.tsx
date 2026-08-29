import { AnnouncementBar } from "@/components/AnnouncementBar";
import { CategoryGrid } from "@/components/CategoryGrid";
import { Hero } from "@/components/Hero";
import { ProductCatalog } from "@/components/ProductCatalog";
import { PromoBanner } from "@/components/PromoBanner";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Welcome } from "@/components/Welcome";
import { getProducts } from "@/lib/getProducts";
<<<<<<< HEAD

// Server Component: la lectura a Supabase corre en el servidor, así que las
// credenciales nunca viajan al navegador. Ver src/lib/getProducts.ts.
export default async function Home() {
  const products = await getProducts();
=======
import { getCategories } from "@/lib/getCategories";

export const dynamic = "force-dynamic";

// Server Component: las lecturas a Supabase corren en el servidor, así que
// las credenciales nunca viajan al navegador. Ver src/lib/getProducts.ts.
export default async function Home() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
>>>>>>> 88bb355 (Agrega modo admin, descuentos y productos)

  return (
    <>
      <AnnouncementBar />
<<<<<<< HEAD
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <CategoryGrid />
        <Welcome />
        <ProductCatalog products={products} />
=======
      <SiteHeader categories={categories} />
      <main className="flex-1">
        <Hero />
        <CategoryGrid categories={categories} />
        <Welcome />
        <ProductCatalog products={products} categories={categories} />
>>>>>>> 88bb355 (Agrega modo admin, descuentos y productos)
        <PromoBanner />
      </main>
      <SiteFooter />
    </>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 88bb355 (Agrega modo admin, descuentos y productos)
