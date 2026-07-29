-- ============================================
-- Campus360 — Capa social/gamificación (súper-app móvil)
-- Extiende schema.sql. Correr DESPUÉS de schema.sql + seed.sql.
-- ============================================

-- ============================================
-- 0. perfiles — columnas nuevas para puntos/racha
-- ============================================
alter table perfiles add column if not exists puntos int default 0;
alter table perfiles add column if not exists racha_checkin int default 0;
alter table perfiles add column if not exists ultimo_checkin date;
alter table perfiles add column if not exists racha_objetivos int default 0;
alter table perfiles add column if not exists avatar_url text;

-- ============================================
-- 1. amistades — solicitudes y amigos (fila direccional)
-- usuario_id = quien envía la solicitud, amigo_id = quien la recibe
-- ============================================
create table if not exists amistades (
  id uuid primary key default uuid_generate_v4(),
  usuario_id uuid references perfiles(id) on delete cascade not null,
  amigo_id uuid references perfiles(id) on delete cascade not null,
  estado text check (estado in ('pendiente', 'aceptada')) default 'pendiente',
  creado_en timestamp with time zone default now(),
  unique (usuario_id, amigo_id)
);
create index if not exists idx_amistades_usuario on amistades(usuario_id);
create index if not exists idx_amistades_amigo on amistades(amigo_id);

-- ============================================
-- 2. notificaciones
-- ============================================
create table if not exists notificaciones (
  id uuid primary key default uuid_generate_v4(),
  usuario_id uuid references perfiles(id) on delete cascade not null,
  icono text default '🔔',
  texto text not null,
  sub text,
  tipo text check (tipo in ('solicitud_amistad', 'logro_amigo', 'evento_habilitado', 'general')) default 'general',
  referencia_id text,
  leida boolean default false,
  creado_en timestamp with time zone default now()
);
create index if not exists idx_notificaciones_usuario on notificaciones(usuario_id);

-- ============================================
-- 3. historias — fotos de "historias de hoy" etiquetadas a una actividad
-- actividad_id referencia un id de catálogo (eventos.ts / vidaUniversitaria.ts), no una FK
-- ============================================
create table if not exists historias (
  id uuid primary key default uuid_generate_v4(),
  usuario_id uuid references perfiles(id) on delete cascade not null,
  actividad_id text not null,
  foto_url text not null,
  creado_en timestamp with time zone default now()
);
create index if not exists idx_historias_actividad on historias(actividad_id);
create index if not exists idx_historias_usuario on historias(usuario_id);

-- ============================================
-- 4. objetivos_estado — checklist semanal por usuario (el texto vive en src/data/academico.ts)
-- ============================================
create table if not exists objetivos_estado (
  id uuid primary key default uuid_generate_v4(),
  usuario_id uuid references perfiles(id) on delete cascade not null,
  objetivo_id text not null,
  hecho boolean default false,
  actualizado_en timestamp with time zone default now(),
  unique (usuario_id, objetivo_id)
);

-- ============================================
-- 5. tutoria_inscripciones — agendar / marcar contacto con un tutor
-- tutoria_id referencia src/data/tutorias.ts
-- ============================================
create table if not exists tutoria_inscripciones (
  id uuid primary key default uuid_generate_v4(),
  usuario_id uuid references perfiles(id) on delete cascade not null,
  tutoria_id text not null,
  estado text check (estado in ('agendada', 'contactado')) default 'agendada',
  creado_en timestamp with time zone default now(),
  unique (usuario_id, tutoria_id)
);

-- ============================================
-- 6. inscripciones — RSVP a eventos/vida universitaria, solicitud de oportunidades,
-- canje de beneficios. item_id referencia el catálogo correspondiente en src/data/*.ts
-- ============================================
create table if not exists inscripciones (
  id uuid primary key default uuid_generate_v4(),
  usuario_id uuid references perfiles(id) on delete cascade not null,
  item_id text not null,
  item_tipo text check (item_tipo in ('evento', 'vida', 'oportunidad', 'beneficio')) not null,
  creado_en timestamp with time zone default now(),
  unique (usuario_id, item_id)
);
create index if not exists idx_inscripciones_usuario on inscripciones(usuario_id);

-- ============================================
-- Row Level Security
-- Igual que schema.sql: MVP de 4-5 usuarios de prueba sin Supabase Auth todavía.
-- Dejamos RLS deshabilitado para simplificar el desarrollo.
-- ============================================
-- alter table amistades enable row level security;
-- alter table notificaciones enable row level security;
-- alter table historias enable row level security;
-- alter table objetivos_estado enable row level security;
-- alter table tutoria_inscripciones enable row level security;
-- alter table inscripciones enable row level security;

alter table amistades disable row level security;
alter table notificaciones disable row level security;
alter table historias disable row level security;
alter table objetivos_estado disable row level security;
alter table tutoria_inscripciones disable row level security;
alter table inscripciones disable row level security;

-- ============================================
-- Storage — buckets públicos para fotos de perfil e historias
-- (la anon key puede subir/leer porque RLS de storage.objects se deja abierta,
-- igual que el resto del MVP)
-- ============================================
insert into storage.buckets (id, name, public)
values ('avatares', 'avatares', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('historias', 'historias', true)
on conflict (id) do nothing;

drop policy if exists "avatares publico" on storage.objects;
create policy "avatares publico" on storage.objects for all
  using (bucket_id = 'avatares') with check (bucket_id = 'avatares');

drop policy if exists "historias publico" on storage.objects;
create policy "historias publico" on storage.objects for all
  using (bucket_id = 'historias') with check (bucket_id = 'historias');
