-- ============================================
-- Campus360 MVP — Esquema de base de datos
-- Capa real: TCU (perfiles, proceso, etapas, bitácora, documentos, recordatorios)
-- ============================================

-- Extensión para generar UUIDs
create extension if not exists "uuid-ossp";

-- ============================================
-- 1. perfiles — datos del estudiante (1 por usuario)
-- ============================================
create table if not exists perfiles (
  id uuid primary key default uuid_generate_v4(),
  nombre text not null,
  correo text unique not null,
  carrera text,
  cuatrimestre text,
  avance_carrera int default 0,
  creado_en timestamp with time zone default now()
);

-- ============================================
-- 2. tcu_proceso — estado general del TCU (1 por usuario)
-- ============================================
create table if not exists tcu_proceso (
  id uuid primary key default uuid_generate_v4(),
  usuario_id uuid references perfiles(id) on delete cascade not null,
  horas_completadas int default 0,
  horas_requeridas int default 150,
  etapa_actual text,
  periodo text,
  creado_en timestamp with time zone default now()
);

-- ============================================
-- 3. tcu_etapas — las 5 etapas del proceso (5 filas por usuario)
-- ============================================
create table if not exists tcu_etapas (
  id uuid primary key default uuid_generate_v4(),
  usuario_id uuid references perfiles(id) on delete cascade not null,
  nombre text not null,
  orden int not null,
  estado text check (estado in ('completada', 'actual', 'pendiente')) default 'pendiente'
);

-- ============================================
-- 4. tcu_bitacora — registros de horas (varias filas por usuario)
-- ============================================
create table if not exists tcu_bitacora (
  id uuid primary key default uuid_generate_v4(),
  usuario_id uuid references perfiles(id) on delete cascade not null,
  fecha date not null,
  horas numeric not null,
  descripcion text,
  estado text check (estado in ('registrada', 'aprobada', 'pendiente')) default 'registrada',
  creado_en timestamp with time zone default now()
);

-- ============================================
-- 5. tcu_documentos — entregables (varias filas por usuario)
-- ============================================
create table if not exists tcu_documentos (
  id uuid primary key default uuid_generate_v4(),
  usuario_id uuid references perfiles(id) on delete cascade not null,
  nombre text not null,
  estado text check (estado in ('entregado', 'pendiente')) default 'pendiente',
  fecha_limite date
);

-- ============================================
-- 6. recordatorios — alertas del usuario (varias filas por usuario)
-- ============================================
create table if not exists recordatorios (
  id uuid primary key default uuid_generate_v4(),
  usuario_id uuid references perfiles(id) on delete cascade not null,
  tipo text check (tipo in ('tcu', 'tesis')) default 'tcu',
  titulo text not null,
  fecha_limite date,
  prioridad text check (prioridad in ('alta', 'media', 'baja')) default 'media',
  estado text check (estado in ('pendiente', 'listo')) default 'pendiente'
);

-- ============================================
-- Índices para acelerar consultas por usuario
-- ============================================
create index if not exists idx_tcu_proceso_usuario on tcu_proceso(usuario_id);
create index if not exists idx_tcu_etapas_usuario on tcu_etapas(usuario_id);
create index if not exists idx_tcu_bitacora_usuario on tcu_bitacora(usuario_id);
create index if not exists idx_tcu_documentos_usuario on tcu_documentos(usuario_id);
create index if not exists idx_recordatorios_usuario on recordatorios(usuario_id);

-- ============================================
-- Row Level Security (RLS)
-- Para el MVP con 4 usuarios de prueba (sin Supabase Auth todavía),
-- dejamos RLS deshabilitado en esta fase para simplificar el desarrollo.
-- Si más adelante conectás Supabase Auth, activá RLS y agregá políticas
-- del tipo: usuario_id = auth.uid()
-- ============================================
-- alter table perfiles enable row level security;
-- alter table tcu_proceso enable row level security;
-- alter table tcu_etapas enable row level security;
-- alter table tcu_bitacora enable row level security;
-- alter table tcu_documentos enable row level security;
-- alter table recordatorios enable row level security;
