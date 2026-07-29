-- ============================================
-- Campus360 — Seed de la capa social/gamificación
-- Correr DESPUÉS de schema.sql + seed.sql + schema_social.sql
-- Agrega a Andrés Rojas (persona validada en el diseño de la app móvil,
-- Administración de Negocios) y su red de amigos/notificaciones de ejemplo.
-- Idempotente: podés correrlo varias veces.
-- ============================================

-- ============================================
-- 1. Perfiles nuevos
-- ============================================
insert into perfiles (id, nombre, correo, carrera, cuatrimestre, avance_carrera, puntos, racha_checkin, racha_objetivos)
values
  ('55555555-5555-5555-5555-555555555555', 'Andrés Rojas',    'andres.rojas@ufidelitas.ac.cr',    'Administración de Negocios', 'II', 20, 2450, 12, 4),
  ('66666666-6666-6666-6666-666666666666', 'María Fernández', 'maria.fernandez@ufidelitas.ac.cr', 'Psicología',                  'IV', 40, 0, 0, 0),
  ('77777777-7777-7777-7777-777777777777', 'Luis Mora',       'luis.mora@ufidelitas.ac.cr',       'Ingeniería Civil',            'VI', 60, 0, 0, 0),
  ('88888888-8888-8888-8888-888888888888', 'Kevin Chaves',    'kevin.chaves@ufidelitas.ac.cr',    'Ingeniería Industrial',       'V',  50, 0, 0, 0),
  ('99999999-9999-9999-9999-999999999999', 'Andrea Solís',    'andrea.solis@ufidelitas.ac.cr',    'Mercadeo',                    'III',30, 0, 0, 0),
  ('a1111111-1111-1111-1111-111111111111', 'Jorge Ureña',     'jorge.urena@ufidelitas.ac.cr',     'Administración de Negocios',  'VII',70, 0, 0, 0)
on conflict (id) do update set
  puntos = excluded.puntos,
  racha_checkin = excluded.racha_checkin,
  racha_objetivos = excluded.racha_objetivos;

-- ============================================
-- 2. TCU de Andrés Rojas (54h, etapa Ejecución)
-- ============================================
insert into tcu_proceso (usuario_id, horas_completadas, horas_requeridas, etapa_actual, periodo)
values ('55555555-5555-5555-5555-555555555555', 54, 150, 'Ejecución', 'Período 2-2026')
on conflict do nothing;

insert into tcu_etapas (usuario_id, nombre, orden, estado) values
  ('55555555-5555-5555-5555-555555555555', 'Inscripción',   1, 'completada'),
  ('55555555-5555-5555-5555-555555555555', 'Asignación',    2, 'completada'),
  ('55555555-5555-5555-5555-555555555555', 'Ejecución',     3, 'actual'),
  ('55555555-5555-5555-5555-555555555555', 'Informe final', 4, 'pendiente'),
  ('55555555-5555-5555-5555-555555555555', 'Aprobación',    5, 'pendiente')
on conflict do nothing;

insert into tcu_bitacora (usuario_id, fecha, horas, descripcion, estado) values
  ('55555555-5555-5555-5555-555555555555', '2026-07-15', 4, 'Capacitación en gestión de inventario a microempresa', 'registrada'),
  ('55555555-5555-5555-5555-555555555555', '2026-06-28', 5, 'Levantamiento de indicadores para proyecto social', 'aprobada'),
  ('55555555-5555-5555-5555-555555555555', '2026-06-12', 6, 'Apoyo administrativo en feria de emprendimiento estudiantil', 'aprobada')
on conflict do nothing;

-- ============================================
-- 3. Amistades — Sofía y Andrés Hidalgo ya son amigos de Andrés Rojas;
-- María y Luis le enviaron solicitud (pendiente, la recibe Andrés Rojas)
-- ============================================
insert into amistades (usuario_id, amigo_id, estado) values
  ('55555555-5555-5555-5555-555555555555', '33333333-3333-3333-3333-333333333333', 'aceptada'), -- Andrés -> Sofía Loaiza
  ('55555555-5555-5555-5555-555555555555', '22222222-2222-2222-2222-222222222222', 'aceptada'), -- Andrés -> Andrés Hidalgo
  ('66666666-6666-6666-6666-666666666666', '55555555-5555-5555-5555-555555555555', 'pendiente'), -- María -> Andrés (recibida)
  ('77777777-7777-7777-7777-777777777777', '55555555-5555-5555-5555-555555555555', 'pendiente')  -- Luis -> Andrés (recibida)
on conflict (usuario_id, amigo_id) do nothing;

-- ============================================
-- 4. Notificaciones de ejemplo para Andrés Rojas
-- ============================================
insert into notificaciones (usuario_id, icono, texto, sub, tipo, referencia_id, leida) values
  ('55555555-5555-5555-5555-555555555555', '🏆', 'Andrés Hidalgo alcanzó Nivel Oro', '+100 pts ganados', 'logro_amigo', null, false),
  ('55555555-5555-5555-5555-555555555555', '👋', 'María Fernández te mandó una solicitud de amistad', 'Revisá tu perfil para aceptarla', 'solicitud_amistad', null, false),
  ('55555555-5555-5555-5555-555555555555', '🎉', 'Se habilitó el Hackathon Estudiantil Fidélitas', 'Inscripciones abiertas — cupo limitado', 'evento_habilitado', 'e7', false)
on conflict do nothing;

-- ============================================
-- 5. Objetivos de la semana — estado inicial (2 de 4 hechos, como en el diseño)
-- ============================================
insert into objetivos_estado (usuario_id, objetivo_id, hecho) values
  ('55555555-5555-5555-5555-555555555555', 'ob1', false),
  ('55555555-5555-5555-5555-555555555555', 'ob2', true),
  ('55555555-5555-5555-5555-555555555555', 'ob3', true),
  ('55555555-5555-5555-5555-555555555555', 'ob4', false)
on conflict (usuario_id, objetivo_id) do update set hecho = excluded.hecho;

-- ============================================
-- 6. Tutoría ya agendada (Finanzas Corporativas) e inscripción a un evento
-- ============================================
insert into tutoria_inscripciones (usuario_id, tutoria_id, estado) values
  ('55555555-5555-5555-5555-555555555555', 't1', 'agendada')
on conflict (usuario_id, tutoria_id) do nothing;

insert into inscripciones (usuario_id, item_id, item_tipo) values
  ('55555555-5555-5555-5555-555555555555', 'e1', 'evento')
on conflict (usuario_id, item_id) do nothing;
