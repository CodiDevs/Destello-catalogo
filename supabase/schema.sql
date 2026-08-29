
create table if not exists public.products (
  id text primary key,
  name text not null,
  price numeric(10, 2) not null,
  category text not null check (category in ('carteras', 'termos', 'novedades', 'ofertas')),
  badge text,
  accent text not null,
  pattern text not null check (pattern in ('quilt', 'stripe', 'dot', 'wave')),
  description text not null,
  details jsonb not null default '[]'::jsonb,
  colors jsonb,
  created_at timestamptz not null default now()
);

comment on table public.products is 'Catálogo de productos de Destello (carteras, termos, etc).';
comment on column public.products.details is 'Array de strings, ej: ["Cierre con cremallera", "Correa ajustable"].';
comment on column public.products.colors is 'Array de objetos {id, name, hex} o null si el producto no tiene variantes de color.';



alter table public.products enable row level security;

drop policy if exists "Lectura pública de productos" on public.products;
create policy "Lectura pública de productos"
  on public.products
  for select
  to anon, authenticated
  using (true);



insert into public.products (id, name, price, category, badge, accent, pattern, description, details, colors)
values
  (
    'c-aurora',
    'Cartera Aurora',
    48,
    'carteras',
    'Nuevo',
    '#e8a0b5',
    'quilt',
    'Cartera ligera con silueta suave y acabado mate. Ideal para el día a día con espacio para lo esencial.',
    '["Cierre con cremallera", "Compartimento interno", "Correa ajustable", "Forro soft-touch"]',
    '[{"id":"blush","name":"Blush","hex":"#e8a0b5"},{"id":"cream","name":"Crema","hex":"#f3e8dc"},{"id":"negro","name":"Negro soft","hex":"#2a1f24"}]'
  ),
  (
    'c-luna',
    'Cartera Luna Soft',
    42,
    'carteras',
    null,
    '#d4a5c0',
    'dot',
    'Diseño compacto con curva delicada. Perfecta para salidas cortas y looks casuales.',
    '["Asa de mano", "Bolsillo exterior", "Peso liviano"]',
    '[{"id":"lila","name":"Lila","hex":"#d4a5c0"},{"id":"rosa","name":"Rosa polvo","hex":"#f0c4ce"}]'
  ),
  (
    'c-brillo',
    'Cartera Brillo Mini',
    36,
    'carteras',
    'Best seller',
    '#c9a86c',
    'stripe',
    'Mini cartera con destello dorado. Un acento boutique para noches y eventos.',
    '["Formato mini", "Cadena desmontable", "Acabado metálico suave"]',
    '[{"id":"gold","name":"Gold","hex":"#c9a86c"},{"id":"champagne","name":"Champagne","hex":"#e0c56a"},{"id":"rose-gold","name":"Rose gold","hex":"#d4a08a"}]'
  ),
  (
    'c-perla',
    'Cartera Perla',
    52,
    'carteras',
    null,
    '#f0c4ce',
    'wave',
    'Pieza estructurada con textura perlada. Combina elegancia y practicidad.',
    '["Estructura firme", "Dos compartimentos", "Detalle de lazo"]',
    null
  ),
  (
    't-rose',
    'Termo Rose Glow',
    28,
    'termos',
    'Nuevo',
    '#f2b8c6',
    'stripe',
    'Termo de 500 ml con aislamiento térmico y tono rosa glow. Mantiene frío o calor por horas.',
    '["Capacidad 500 ml", "Acero inoxidable", "Tapa hermética", "Boca ancha"]',
    '[{"id":"rose","name":"Rose glow","hex":"#f2b8c6"},{"id":"white","name":"Blanco","hex":"#faf6f7"},{"id":"pink","name":"Pink deep","hex":"#e89aaa"}]'
  ),
  (
    't-gold',
    'Termo Destello Gold',
    32,
    'termos',
    null,
    '#c9a227',
    'dot',
    'Edición con acabado dorado suave. El companion perfecto para oficina o gym.',
    '["Capacidad 500 ml", "Acabado gold soft", "Antiderrame"]',
    '[{"id":"gold","name":"Destello gold","hex":"#c9a227"},{"id":"bronze","name":"Bronce","hex":"#b8860b"}]'
  ),
  (
    't-blush',
    'Termo Blush 500ml',
    26,
    'termos',
    'Oferta',
    '#e89aaa',
    'wave',
    'Clásico blush en oferta. Ligero, resistente y listo para el día a día.',
    '["Capacidad 500 ml", "Fácil limpieza", "Base antideslizante"]',
    '[{"id":"blush","name":"Blush","hex":"#e89aaa"},{"id":"coral","name":"Coral","hex":"#f0a090"}]'
  ),
  (
    't-night',
    'Termo Soft Night',
    30,
    'termos',
    null,
    '#9a7a88',
    'quilt',
    'Tono noche suave para looks más sobrios. Misma calidad térmica Destello.',
    '["Capacidad 500 ml", "Acero doble pared", "Asa de transporte"]',
    null
  )
on conflict (id) do nothing;
