export type CategoryId = "carteras" | "termos" | "novedades" | "ofertas";

export type ProductColor = {
  id: string;
  name: string;
  hex: string;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  category: CategoryId;
  badge?: string;
  accent: string;
  pattern: "quilt" | "stripe" | "dot" | "wave";
  description: string;
  details: string[];
  colors?: ProductColor[];
};

export const categories: {
  id: CategoryId;
  label: string;
  href: string;
}[] = [
  { id: "novedades", label: "novedades", href: "#catalogo" },
  { id: "carteras", label: "carteras", href: "#carteras" },
  { id: "termos", label: "termos", href: "#termos" },
  { id: "ofertas", label: "ofertas", href: "#ofertas" },
];

export const categoryLabels: Record<CategoryId, string> = {
  carteras: "Carteras",
  termos: "Termos",
  novedades: "Novedades",
  ofertas: "Ofertas",
};

export const products: Product[] = [
  {
    id: "c-aurora",
    name: "Cartera Aurora",
    price: 48,
    category: "carteras",
    badge: "Nuevo",
    accent: "#e8a0b5",
    pattern: "quilt",
    description:
      "Cartera ligera con silueta suave y acabado mate. Ideal para el día a día con espacio para lo esencial.",
    details: [
      "Cierre con cremallera",
      "Compartimento interno",
      "Correa ajustable",
      "Forro soft-touch",
    ],
    colors: [
      { id: "blush", name: "Blush", hex: "#e8a0b5" },
      { id: "cream", name: "Crema", hex: "#f3e8dc" },
      { id: "negro", name: "Negro soft", hex: "#2a1f24" },
    ],
  },
  {
    id: "c-luna",
    name: "Cartera Luna Soft",
    price: 42,
    category: "carteras",
    accent: "#d4a5c0",
    pattern: "dot",
    description:
      "Diseño compacto con curva delicada. Perfecta para salidas cortas y looks casuales.",
    details: ["Asa de mano", "Bolsillo exterior", "Peso liviano"],
    colors: [
      { id: "lila", name: "Lila", hex: "#d4a5c0" },
      { id: "rosa", name: "Rosa polvo", hex: "#f0c4ce" },
    ],
  },
  {
    id: "c-brillo",
    name: "Cartera Brillo Mini",
    price: 36,
    category: "carteras",
    badge: "Best seller",
    accent: "#c9a86c",
    pattern: "stripe",
    description:
      "Mini cartera con destello dorado. Un acento boutique para noches y eventos.",
    details: ["Formato mini", "Cadena desmontable", "Acabado metálico suave"],
    colors: [
      { id: "gold", name: "Gold", hex: "#c9a86c" },
      { id: "champagne", name: "Champagne", hex: "#e0c56a" },
      { id: "rose-gold", name: "Rose gold", hex: "#d4a08a" },
    ],
  },
  {
    id: "c-perla",
    name: "Cartera Perla",
    price: 52,
    category: "carteras",
    accent: "#f0c4ce",
    pattern: "wave",
    description:
      "Pieza estructurada con textura perlada. Combina elegancia y practicidad.",
    details: [
      "Estructura firme",
      "Dos compartimentos",
      "Detalle de lazo",
    ],
  },
  {
    id: "t-rose",
    name: "Termo Rose Glow",
    price: 28,
    category: "termos",
    badge: "Nuevo",
    accent: "#f2b8c6",
    pattern: "stripe",
    description:
      "Termo de 500 ml con aislamiento térmico y tono rosa glow. Mantiene frío o calor por horas.",
    details: [
      "Capacidad 500 ml",
      "Acero inoxidable",
      "Tapa hermética",
      "Boca ancha",
    ],
    colors: [
      { id: "rose", name: "Rose glow", hex: "#f2b8c6" },
      { id: "white", name: "Blanco", hex: "#faf6f7" },
      { id: "pink", name: "Pink deep", hex: "#e89aaa" },
    ],
  },
  {
    id: "t-gold",
    name: "Termo Destello Gold",
    price: 32,
    category: "termos",
    accent: "#c9a227",
    pattern: "dot",
    description:
      "Edición con acabado dorado suave. El companion perfecto para oficina o gym.",
    details: ["Capacidad 500 ml", "Acabado gold soft", "Antiderrame"],
    colors: [
      { id: "gold", name: "Destello gold", hex: "#c9a227" },
      { id: "bronze", name: "Bronce", hex: "#b8860b" },
    ],
  },
  {
    id: "t-blush",
    name: "Termo Blush 500ml",
    price: 26,
    category: "termos",
    badge: "Oferta",
    accent: "#e89aaa",
    pattern: "wave",
    description:
      "Clásico blush en oferta. Ligero, resistente y listo para el día a día.",
    details: ["Capacidad 500 ml", "Fácil limpieza", "Base antideslizante"],
    colors: [
      { id: "blush", name: "Blush", hex: "#e89aaa" },
      { id: "coral", name: "Coral", hex: "#f0a090" },
    ],
  },
  {
    id: "t-night",
    name: "Termo Soft Night",
    price: 30,
    category: "termos",
    accent: "#9a7a88",
    pattern: "quilt",
    description:
      "Tono noche suave para looks más sobrios. Misma calidad térmica Destello.",
    details: ["Capacidad 500 ml", "Acero doble pared", "Asa de transporte"],
  },
];

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-EC", {
    style: "currency",
    currency: "USD",
  }).format(price);
}
