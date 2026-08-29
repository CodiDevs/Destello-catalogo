export function PromoBanner() {
  return (
    <section className="mx-auto grid max-w-6xl gap-0 px-4 pb-16 sm:px-6 lg:grid-cols-2">
      <div
        className="min-h-[280px] pattern-dot"
        style={{
          backgroundColor: "#e8a0b5",
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.35) 1.5px, transparent 1.6px), linear-gradient(145deg,#f2b8c6,#c9a86c)",
          backgroundSize: "14px 14px, auto",
        }}
        aria-hidden
      />
      <div className="flex flex-col items-start justify-center gap-4 border border-border bg-surface-elevated p-8 sm:p-12">
        <p className="font-script text-3xl text-blush-deep sm:text-4xl">
          un destello especial
        </p>
        <p className="max-w-sm text-sm leading-relaxed text-ink-muted">
          Comparte esta vitrina con alguien que ame los detalles suaves.
          Nuevas piezas de carteras y termos se suman al catálogo pronto.
        </p>
        <a
          href="#catalogo"
          className="inline-flex bg-gold px-7 py-2.5 text-xs font-semibold tracking-[0.16em] text-ink uppercase transition hover:bg-gold-soft"
        >
          Shop now
        </a>
      </div>
    </section>
  );
}
