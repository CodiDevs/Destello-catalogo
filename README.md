# Destello

Catálogo web de **Destello · Everyday Essentials**: carteras, termos y expansión futura. El catálogo de productos vive en **Supabase** (Postgres); el resto del sitio sigue siendo estático.

## Stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS 4
- TypeScript
- Supabase (Postgres + `@supabase/supabase-js`)
- Bun

## Desarrollo

```bash
bun install
bun run dev
```

Copia `.env.local.example` a `.env.local` y completa tus credenciales de Supabase antes de levantar el servidor (sin ellas, el catálogo se muestra vacío).

Abre [http://localhost:3000](http://localhost:3000).

## Scripts

| Comando | Descripción |
|---------|-------------|
| `bun run dev` | Servidor de desarrollo |
| `bun run build` | Build de producción |
| `bun run start` | Servir build |
| `bun run lint` | ESLint |

## Contenido

- Productos en Supabase (tabla `products`, ver `supabase/schema.sql`); tipos y categorías en `src/data/products.ts`
- Logotipo ilustrado (`BrandMark`) en el header y el hero; `public/logo-destello.png` se usa como favicon
- Animaciones de aparición al hacer scroll (`ScrollReveal`) en secciones y tarjetas de producto
- Tema claro / oscuro con `data-theme` (toggle en el header)
- CTA de producto: consulta por WhatsApp (catálogo, sin checkout)

## Diseño

Paleta blush / oro / blanco inspirada en boutique soft-feminine, tipografía Cormorant + Great Vibes + Outfit, motivos sparkle alineados a la marca Destello.
