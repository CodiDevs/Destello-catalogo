import Image from "next/image";
import { SparkleIcon } from "./SparkleIcon";

function Polaroid({
  label,
  tilt,
  delay,
  side,
}: {
  label: string;
  tilt: string;
  delay: string;
  side: "left" | "right";
}) {
  return (
    <div
      className={`animate-float absolute ${side === "left" ? "left-[4%] sm:left-[8%]" : "right-[4%] sm:right-[8%]"} top-[18%] hidden w-[28%] max-w-[200px] sm:block lg:max-w-[240px]`}
      style={{ animationDelay: delay, ["--tilt" as string]: tilt }}
    >
      <div
        className="relative rotate-[var(--tilt)] bg-surface-elevated p-2 pb-8 shadow-[0_18px_40px_rgba(80,40,55,0.18)]"
      >
        <div className="washi-tape absolute -top-2 left-1/2 h-4 w-16 -translate-x-1/2 rotate-[-2deg]" />
        <div
          className="aspect-square overflow-hidden"
          style={{
            background: side === "left"
              ? "linear-gradient(145deg,#f2b8c6,#e8a0b5 40%,#c9a86c)"
              : "linear-gradient(145deg,#e0c56a,#f0c4ce 55%,#d4a5c0)",
          }}
        >
          <div className="flex h-full items-end justify-center p-3">
            <span className="rounded bg-white/70 px-2 py-1 font-serif text-[0.65rem] tracking-wide text-ink">
              {label}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section
      id="inicio"
      className="hero-wash sparkle-field relative overflow-hidden border-b border-border"
    >
      <div className="relative mx-auto flex min-h-[78vh] max-w-6xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6 sm:py-20">
        <Polaroid label="Carteras" tilt="-7deg" delay="0s" side="left" />
        <Polaroid label="Termos" tilt="6deg" delay="0.6s" side="right" />

        <div className="animate-fade-up relative z-10 flex max-w-xl flex-col items-center gap-5">
          <Image
            src="/logo-destello.png"
            alt="Destello Everyday Essentials"
            width={360}
            height={150}
            priority
            className="h-24 w-auto object-contain drop-shadow-sm sm:h-32"
          />
          <p className="font-serif text-lg text-ink-muted sm:text-xl">
            es hora de{" "}
            <span className="font-script text-3xl text-gold sm:text-4xl">
              brillar
            </span>
          </p>
          <p className="max-w-md text-sm leading-relaxed text-ink-muted sm:text-base">
            Catálogo boutique de carteras y termos. Piezas cotidianas con un
            toque de destello.
          </p>
          <a
            href="#catalogo"
            className="mt-1 inline-flex items-center gap-2 bg-gold px-8 py-3 text-sm font-semibold tracking-[0.14em] text-ink uppercase transition hover:bg-gold-soft"
          >
            Ver catálogo
            <SparkleIcon className="h-3.5 w-3.5 animate-twinkle" />
          </a>
        </div>

        <div
          className="pointer-events-none absolute bottom-8 left-1/2 h-16 w-16 -translate-x-1/2 rounded-full border-2 border-dashed border-blush-deep/70 bg-blush/40"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute bottom-6 right-[18%] h-10 w-14 rounded-[40%_60%_55%_45%] bg-gold/25"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute bottom-10 left-[16%] h-8 w-8 rounded-full bg-blush-deep/50"
          aria-hidden
        />
      </div>
    </section>
  );
}
