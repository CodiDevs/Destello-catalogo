import { ScrollReveal } from "./ScrollReveal";

export function SiteFooter() {
  return (
    <footer id="contacto" className="bg-footer text-ink">
      <ScrollReveal className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3 sm:px-6" delay={80}>
        <div>
          <p className="font-script text-3xl text-gold-ink">Destello</p>
          <p className="mt-2 text-sm text-ink/80">Everyday Essentials</p>
        </div>
        <div className="text-sm leading-relaxed text-ink/80">
          <p className="font-serif tracking-[0.12em] text-ink uppercase">
            Contacto
          </p>
          <p className="mt-2">hola@destello.shop</p>
          <p>Instagram · @destello</p>
        </div>
        <div className="text-sm leading-relaxed text-ink/80">
          <p className="font-serif tracking-[0.12em] text-ink uppercase">
            Catálogo
          </p>
          <p className="mt-2">
            Solo vitrina por ahora: consulta disponibilidad por WhatsApp o redes.
          </p>
        </div>
      </ScrollReveal>
      <div className="border-t border-ink/10 px-4 py-4 text-center text-xs tracking-wide text-ink/70">
        © {new Date().getFullYear()} Destello · Everyday Essentials
      </div>
    </footer>
  );
}
