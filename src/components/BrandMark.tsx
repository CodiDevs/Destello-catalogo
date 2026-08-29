type BrandMarkProps = {
  compact?: boolean;
};

function StarAccent({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={
        compact
          ? "absolute -right-2 top-0 rotate-12 text-[#d8a3bb] sm:-right-3"
          : "absolute -right-4 top-0 rotate-12 text-[#d8a3bb] sm:-right-6"
      }
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 64 64"
        className={compact ? "h-5 w-5 sm:h-6 sm:w-6" : "h-7 w-7 sm:h-9 sm:w-9"}
        fill="currentColor"
      >
        <path d="M32 4.5 38.4 22l17.6 6.5-17.6 6.5L32 59l-6.4-23.5L8 28.5 25.6 22 32 4.5Z" />
      </svg>
    </div>
  );
}

export function BrandMark({ compact = false }: BrandMarkProps) {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative">
        <div className="absolute -left-4 top-5 -rotate-12 text-[#f1a6bd] sm:-left-6 sm:top-6">
          <svg viewBox="0 0 64 64" className={compact ? "h-6 w-6 sm:h-7 sm:w-7" : "h-8 w-8 sm:h-10 sm:w-10"} aria-hidden="true">
            <path
              d="M18 28c5-16 26-18 35 2-8 1-15 0-18 8-7-5-13-7-17-10Z"
              fill="currentColor"
              opacity="0.9"
            />
            <path d="M32 16v18" stroke="#f4c8d6" strokeWidth="3" strokeLinecap="round" />
            <path d="M24 24c3 7 2 19 8 28M40 24c-3 7-2 19-8 28" stroke="#f4c8d6" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
        <StarAccent compact={compact} />
        <span
          className={
            compact
              ? "font-script block text-[2.2rem] leading-none tracking-[-0.04em] text-ink sm:text-[2.8rem]"
              : "font-script block text-[4.2rem] leading-none tracking-[-0.04em] text-ink sm:text-[6.2rem] md:text-[7.5rem]"
          }
        >
          Destello
        </span>
      </div>
      {!compact ? (
        <span className="mt-2 font-serif text-[0.68rem] tracking-[0.38em] text-ink uppercase sm:text-sm sm:tracking-[0.45em]">
          Everyday Essentials
        </span>
      ) : null}
    </div>
  );
}
