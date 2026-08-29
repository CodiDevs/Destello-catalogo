import { AnnouncementBar } from "@/components/AnnouncementBar";
import { CategoryGrid } from "@/components/CategoryGrid";
import { Hero } from "@/components/Hero";
import { ProductCatalog } from "@/components/ProductCatalog";
import { PromoBanner } from "@/components/PromoBanner";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Welcome } from "@/components/Welcome";

export default function Home() {
  return (
    <>
      <AnnouncementBar />
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <CategoryGrid />
        <Welcome />
        <ProductCatalog />
        <PromoBanner />
      </main>
      <SiteFooter />
    </>
  );
}
