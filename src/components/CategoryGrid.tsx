import { categories } from "@/data/products";
import { SparkleIcon } from "./SparkleIcon";

export function CategoryGrid() {
  return (
    <section className="mx-auto max-w-6xl px-3 py-8 sm:px-6 sm:py-16" aria-label="Categorías">
      <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-4 lg:grid-cols-4">
        {categories.map((category) => (
          <a
            key={category.id}
            href={category.href}
            className="group flex aspect-square flex-col items-center justify-center border-2 border-blush-deep bg-surface-elevated p-2 text-center transition hover:-translate-y-1 hover:border-gold hover:shadow-[0_12px_30px_rgba(80,40,55,0.12)] sm:border-[3px] sm:p-4 md:p-6"
          >
            <SparkleIcon className="mb-1 h-3 w-3 text-gold transition group-hover:scale-110 sm:mb-3 sm:h-4 sm:w-4" />
            <span className="font-script text-lg leading-tight text-gold capitalize sm:text-3xl md:text-4xl">
              {category.label}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
