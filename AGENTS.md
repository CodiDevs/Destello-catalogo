<<<<<<< HEAD
<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
=======
# Destello-catalogo (con vista admin)

Código de la app Destello (catálogo de carteras y termos). Esta carpeta **no es un repo git**: ahora tiene los configs raíz copiados desde `C:\Users\Cesar\Downloads\Destello-catalogo-main` y su propio `.env.local` creado a partir de `.env.local.example`.

- El repo canónico vive en `C:\Users\Cesar\Downloads\Destello-catalogo-main` (git, rama `master`, remote `CodiDevs/Destello-catalogo`). Está **divergido**: introduce la vista admin y cambios de esquema que el repo canónico no tiene. No sincronices a ciegas entre carpetas.

## Estado del fuente

- Base libre del bloque `<!-- BEGIN/END:nextjs-agent-rules -->`: `next dev` lo re-inserta automáticamente; si el fold reaparece, déjalo.

## Stack (verificado en `node_modules`)

- Next.js 16.3.2 (App Router) + React 19.2.8 + Tailwind 4.3.3 + TypeScript 5.9.3 + `@supabase/supabase-js` 2.112.4 (Bun 1.4.0 local).
- Alias `@/*` → `src/*`. Bun como package manager; scripts: `dev`, `build`, `start`, `lint`.

## Arquitectura

- Productos y categorías en Supabase (tablas `public.products` y `public.categories`), ver `supabase/schema.sql` y la migración `supabase/migrations/20260829_vista-admin.sql`.
- `src/data/products.ts` define tipos, metadatos y helpers de descuento (`isDiscountActive`, `isDiscountExpired`, etc.) — no hardcodear productos ahí. `src/lib/getProducts.ts` y `src/lib/getCategories.ts` hacen la lectura en el servidor; **sin las tablas/columnas migradas o sin env vars devuelven `[]` y la app degrada sin romper** (los logs `[supabase] Error…` son esperables mientras la base no esté migrada).
- Flujo tienda: `src/app/page.tsx` → `getProducts()`/`getCategories()` → `src/components/ProductCatalog` (secciones dinámicas por categoría). Páginas de catálogo: `/catalogo/[categoria]` (ids de categoría + slugs reservados `novedades` y `ofertas`).
- **Vista admin**: `/admin` (panel), `/admin/productos`, `/admin/categorias`, `/admin/descuentos`, `/admin/login`. Acceso solo vendedores: credenciales `ADMIN_CREDENTIALS` (formato `usuario:clave`, separadas por coma); sesión en cookie `destello_admin_session` firmada con HMAC-SHA256 (WebCrypto) y TTL 12 h (`src/lib/admin/session.ts`). `src/middleware.ts` protege `/admin/*` (Next 16 depreca el nombre `middleware` → `proxy`, aún funcional).
- Escrituras admin vía Server Actions (`src/app/admin/actions.ts`) usando la Service Role Key **solo en el servidor** (`src/lib/admin/server.ts`); RLS permite lectura pública y el RPC `increment_product_views(p_id)` suma vistas.
- Métricas: `products.views` = +1 por cada clic que abre el modal del producto (`src/components/ProductCatalog.tsx` → `src/lib/trackView.ts`); `products.sales` = ventas reales, se ingresan a mano desde el admin (formularios `SalesForm`/…).
- Descuentos: columnas `discount_percent` y `discount_ends_at`; en tienda se muestran con precio tachado y cuenta regresiva (`src/components/DiscountCountdown.tsx`), previsualización en `src/components/admin/PreviewCard.tsx`.
- Imágenes: bucket público `productos`, ruta `productos/{productId}/imagen.{ext}` (ver `src/lib/admin/server.ts` → `adminImageUrl`).

## Env vars (`.env.local`, ver `.env.local.example`)

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (lectura tienda + RPC).
- `SUPABASE_SERVICE_ROLE_KEY` (solo servidor, **llenar real**), `ADMIN_CREDENTIALS`, `SESSION_SECRET`.

## Convenciones

- Comentarios, logs y textos de UI en español; mantener eso en el código nuevo.
- Precios numéricos `numeric(10,2)`, formateados con `formatPrice` (es-EC, USD) en `src/data/products.ts`.
- Implementación admin usa Server Actions con patrón `ActionResult` (`{ ok, error? }`).
>>>>>>> 88bb355 (Agrega modo admin, descuentos y productos)
