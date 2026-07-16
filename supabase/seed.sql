-- ============================================
-- Campus360 MVP — Seed de datos de prueba
-- 4 usuarios: distintos estados del proceso de TCU
-- Ejecutar DESPUÉS de schema.sql
-- ============================================

-- Limpiar datos previos (útil si corrés el seed varias veces)
delete from recordatorios;
delete from tcu_documentos;
delete from tcu_bitacora;
delete from tcu_etapas;
delete from tcu_proceso;
delete from perfiles;

-- ============================================
-- 1. PERFILES
-- ============================================
insert into perfiles (id, nombre, correo, carrera, cuatrimestre, avance_carrera) values
  ('11111111-1111-1111-1111-111111111111', 'Emilio Mora',    'emilio.mora@ufidelitas.ac.cr',    'Ingeniería de Software', 'V',    55),
  ('22222222-2222-2222-2222-222222222222', 'Andrés Hidalgo', 'andres.hidalgo@ufidelitas.ac.cr', 'Ingeniería de Software', 'VII',  75),
  ('33333333-3333-3333-3333-333333333333', 'Sofía Loaiza',   'sofia.loaiza@ufidelitas.ac.cr',   'Ingeniería de Software', 'III',  30),
  ('44444444-4444-4444-4444-444444444444', 'Suri González',  'suri.gonzalez@ufidelitas.ac.cr',  'Ingeniería de Software', 'IX',   95);

-- ============================================
-- 2. TCU_PROCESO
-- Emilio: a medias | Andrés: avanzado | Sofía: recién arrancando | Suri: completado
-- ============================================
insert into tcu_proceso (usuario_id, horas_completadas, horas_requeridas, etapa_actual, periodo) values
  ('11111111-1111-1111-1111-111111111111', 45,  150, 'Ejecución de horas', 'Período 2-2026'),
  ('22222222-2222-2222-2222-222222222222', 120, 150, 'Ejecución de horas', 'Período 2-2026'),
  ('33333333-3333-3333-3333-333333333333', 0,   150, 'Inscripción',        'Período 2-2026'),
  ('44444444-4444-4444-4444-444444444444', 150, 150, 'Aprobación',         'Período 1-2026');

-- ============================================
-- 3. TCU_ETAPAS (5 por usuario)
-- ============================================
-- Emilio (a medias, en ejecución)
insert into tcu_etapas (usuario_id, nombre, orden, estado) values
  ('11111111-1111-1111-1111-111111111111', 'Inscripción',    1, 'completada'),
  ('11111111-1111-1111-1111-111111111111', 'Asignación',     2, 'completada'),
  ('11111111-1111-1111-1111-111111111111', 'Ejecución',      3, 'actual'),
  ('11111111-1111-1111-1111-111111111111', 'Informe final',  4, 'pendiente'),
  ('11111111-1111-1111-1111-111111111111', 'Aprobación',     5, 'pendiente');

-- Andrés (avanzado)
insert into tcu_etapas (usuario_id, nombre, orden, estado) values
  ('22222222-2222-2222-2222-222222222222', 'Inscripción',    1, 'completada'),
  ('22222222-2222-2222-2222-222222222222', 'Asignación',     2, 'completada'),
  ('22222222-2222-2222-2222-222222222222', 'Ejecución',      3, 'actual'),
  ('22222222-2222-2222-2222-222222222222', 'Informe final',  4, 'pendiente'),
  ('22222222-2222-2222-2222-222222222222', 'Aprobación',     5, 'pendiente');

-- Sofía (recién empieza)
insert into tcu_etapas (usuario_id, nombre, orden, estado) values
  ('33333333-3333-3333-3333-333333333333', 'Inscripción',    1, 'actual'),
  ('33333333-3333-3333-3333-333333333333', 'Asignación',     2, 'pendiente'),
  ('33333333-3333-3333-3333-333333333333', 'Ejecución',      3, 'pendiente'),
  ('33333333-3333-3333-3333-333333333333', 'Informe final',  4, 'pendiente'),
  ('33333333-3333-3333-3333-333333333333', 'Aprobación',     5, 'pendiente');

-- Suri (completado)
insert into tcu_etapas (usuario_id, nombre, orden, estado) values
  ('44444444-4444-4444-4444-444444444444', 'Inscripción',    1, 'completada'),
  ('44444444-4444-4444-4444-444444444444', 'Asignación',     2, 'completada'),
  ('44444444-4444-4444-4444-444444444444', 'Ejecución',      3, 'completada'),
  ('44444444-4444-4444-4444-444444444444', 'Informe final',  4, 'completada'),
  ('44444444-4444-4444-4444-444444444444', 'Aprobación',     5, 'completada');

-- ============================================
-- 4. TCU_BITACORA (algunas entradas de horas por usuario)
-- ============================================
insert into tcu_bitacora (usuario_id, fecha, horas, descripcion, estado) values
  ('11111111-1111-1111-1111-111111111111', '2026-05-10', 8, 'Apoyo en taller comunitario de tecnología', 'aprobada'),
  ('11111111-1111-1111-1111-111111111111', '2026-05-24', 6, 'Capacitación básica en herramientas digitales', 'aprobada'),
  ('11111111-1111-1111-1111-111111111111', '2026-06-07', 4, 'Seguimiento a beneficiarios del proyecto', 'registrada'),

  ('22222222-2222-2222-2222-222222222222', '2026-04-15', 10, 'Diseño de material educativo comunitario', 'aprobada'),
  ('22222222-2222-2222-2222-222222222222', '2026-05-02', 8,  'Sesión de capacitación a adultos mayores', 'aprobada'),
  ('22222222-2222-2222-2222-222222222222', '2026-06-01', 6,  'Documentación de resultados del proyecto', 'registrada'),

  ('44444444-4444-4444-4444-444444444444', '2026-02-10', 12, 'Inicio de proyecto comunitario', 'aprobada'),
  ('44444444-4444-4444-4444-444444444444', '2026-03-20', 10, 'Ejecución de actividades planificadas', 'aprobada'),
  ('44444444-4444-4444-4444-444444444444', '2026-04-30', 8,  'Cierre y entrega de informe final', 'aprobada');

-- ============================================
-- 5. TCU_DOCUMENTOS
-- ============================================
insert into tcu_documentos (usuario_id, nombre, estado, fecha_limite) values
  ('11111111-1111-1111-1111-111111111111', 'Carta de inicio',   'entregado', '2026-04-01'),
  ('11111111-1111-1111-1111-111111111111', 'Bitácora',          'pendiente', '2026-07-20'),
  ('11111111-1111-1111-1111-111111111111', 'Informe parcial',   'pendiente', '2026-08-01'),

  ('22222222-2222-2222-2222-222222222222', 'Carta de inicio',   'entregado', '2026-03-01'),
  ('22222222-2222-2222-2222-222222222222', 'Bitácora',          'entregado', '2026-06-01'),
  ('22222222-2222-2222-2222-222222222222', 'Informe parcial',   'pendiente', '2026-07-25'),

  ('33333333-3333-3333-3333-333333333333', 'Carta de inicio',   'pendiente', '2026-07-31'),
  ('33333333-3333-3333-3333-333333333333', 'Bitácora',          'pendiente', '2026-09-01'),
  ('33333333-3333-3333-3333-333333333333', 'Informe parcial',   'pendiente', '2026-10-01'),

  ('44444444-4444-4444-4444-444444444444', 'Carta de inicio',   'entregado', '2026-02-01'),
  ('44444444-4444-4444-4444-444444444444', 'Bitácora',          'entregado', '2026-04-01'),
  ('44444444-4444-4444-4444-444444444444', 'Informe parcial',   'entregado', '2026-05-01'),
  ('44444444-4444-4444-4444-444444444444', 'Informe final',     'entregado', '2026-05-15');

-- ============================================
-- 6. RECORDATORIOS
-- ============================================
insert into recordatorios (usuario_id, tipo, titulo, fecha_limite, prioridad, estado) values
  ('11111111-1111-1111-1111-111111111111', 'tcu', 'Entrega de bitácora TCU', '2026-07-20', 'alta',  'pendiente'),
  ('11111111-1111-1111-1111-111111111111', 'tcu', 'Registrar horas de junio', '2026-07-15', 'media', 'pendiente'),

  ('22222222-2222-2222-2222-222222222222', 'tcu', 'Entrega de informe parcial', '2026-07-25', 'alta', 'pendiente'),

  ('33333333-3333-3333-3333-333333333333', 'tcu', 'Entregar carta de inicio', '2026-07-31', 'alta', 'pendiente'),
  ('33333333-3333-3333-3333-333333333333', 'tcu', 'Reunión de asignación de proyecto', '2026-07-18', 'media', 'pendiente'),

  ('44444444-4444-4444-4444-444444444444', 'tcu', 'TCU completado — sin pendientes', null, 'baja', 'listo');
