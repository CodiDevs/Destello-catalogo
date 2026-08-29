import { ScrollReveal } from "./ScrollReveal";

export function Welcome() {
  return (
    <section
      id="nosotros"
      className="border-y border-border bg-surface px-4 py-16 text-center sm:px-6 sm:py-20"
    >
      <ScrollReveal className="mx-auto max-w-2xl" delay={120}>
        <p className="font-serif text-sm tracking-[0.2em] text-ink-muted uppercase">
          Bienvenida a
        </p>
        <h2 className="mt-2 font-serif text-3xl text-gold sm:text-4xl">
          Destello
        </h2>
        <p className="mt-5 text-sm leading-relaxed text-ink-muted sm:text-base">
          Somos un catálogo de essentials cotidianos: carteras y termos
          pensados para acompañarte con suavidad, brillo y estilo boutique.
          Explora, enamórate y consulta disponibilidad — expandiremos colecciones
          pronto.
        </p>
        <a
          href="#contacto"
          className="mt-8 inline-flex bg-gold px-7 py-2.5 text-xs font-semibold tracking-[0.16em] text-ink uppercase transition hover:bg-gold-soft"
        >
          Leer más
        </a>
      </ScrollReveal>
    </section>
  );
}
