-- ============================================================
-- Migración · Imágenes por color
-- Cada producto puede tener una imagen por color de variante
-- más una imagen general. Se guardan en la columna jsonb `images`
-- con formato: [{ "colorId": "blush", "url": "https://..." }].
-- `colorId` null = imagen general. La primera es la miniatura.
-- Idempotente: se puede correr más de una vez sin romper nada.
-- ============================================================

-- ------------------------------------------------------------
-- 1) Columna images en products
-- ------------------------------------------------------------
alter table public.products add column if not exists images jsonb not null default '[]'::jsonb;

comment on column public.products.images is 'Array de objetos {colorId, url}: una imagen por color de variante y/o una general (colorId null). La primera es la miniatura principal.';

-- ------------------------------------------------------------
-- 2) Backfill desde image_url (imagen única heredada)
-- ------------------------------------------------------------
update public.products
set images = jsonb_build_array(jsonb_build_object('colorId', null, 'url', image_url))
where image_url is not null
  and images = '[]'::jsonb;