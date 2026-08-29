-- ============================================================
-- Migración · Vista de administrador
-- Para bases existentes: categorías configurables, descuentos
-- con temporizador, contadores de vistas/ventas e imágenes.
-- Idempotente: se puede correr más de una vez sin romper nada.
-- ============================================================

-- ------------------------------------------------------------
-- 1) Tabla de categorías configurables
-- ------------------------------------------------------------
create table if not exists public.categories (
  id text primary key,
  label text not null,
  position int not null default 0,
  active boolean not null default true
);

alter table public.categories enable row level security;

drop policy if exists "Lectura pública de categorías" on public.categories;
create policy "Lectura pública de categorías"
  on public.categories
  for select
  to anon, authenticated
  using (true);

-- Seed por defecto (carteras y termos). Idempotente.
insert into public.categories (id, label, position, active) values
  ('carteras', 'Carteras', 0, true),
  ('termos', 'Termos', 1, true)
on conflict (id) do nothing;

-- Guardia: si hay productos con una categoría que no existe como
-- categoría, la creamos para poder aplicar la FK sin perder datos.
insert into public.categories (id, label, position, active)
select distinct p.category, p.category, 10, true
from public.products p
where not exists (select 1 from public.categories c where c.id = p.category)
on conflict (id) do nothing;

-- ------------------------------------------------------------
-- 2) Columnas nuevas en products
-- ------------------------------------------------------------
alter table public.products add column if not exists discount_percent numeric(5, 2)
  check (discount_percent >= 0 and discount_percent <= 100);
alter table public.products add column if not exists discount_ends_at timestamptz;
alter table public.products add column if not exists views integer not null default 0;
alter table public.products add column if not exists sales integer not null default 0;
alter table public.products add column if not exists image_url text;

-- ------------------------------------------------------------
-- 3) category: del CHECK fijo a FK de categories
-- ------------------------------------------------------------
alter table public.products drop constraint if exists products_category_check;

do $$
begin
  if not exists (
    select 1 from pg_constraint c
    join pg_class t on t.oid = c.conrelid
    where t.relname = 'products' and c.conname = 'products_category_fkey'
  ) then
    alter table public.products
      add constraint products_category_fkey
      foreign key (category) references public.categories(id);
  end if;
end $$;

-- ------------------------------------------------------------
-- 4) Contador de vistas: el anon solo ejecuta la función
-- ------------------------------------------------------------
create or replace function public.increment_product_views(p_id text)
returns void
language sql
security definer
set search_path = public
as $$
  update public.products set views = views + 1 where id = p_id;
$$;

revoke execute on function public.increment_product_views(text) from public;
grant execute on function public.increment_product_views(text) to anon, authenticated;

-- ------------------------------------------------------------
-- 5) Bucket público para imágenes de producto (Storage)
-- ------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('productos', 'productos', true)
on conflict (id) do nothing;