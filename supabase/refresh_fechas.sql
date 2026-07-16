-- ============================================================
-- REFRESCAR FECHAS DE LA DEMO
-- Corré este script en el SQL Editor de Supabase cada vez que
-- quieras que los recordatorios y documentos vuelvan a caer
-- en el futuro cercano (así la demo nunca se ve "vencida").
-- Es idempotente: podés correrlo las veces que quieras.
-- ============================================================

-- Recordatorios pendientes: repartirlos entre 3 y 16 días a futuro
with numerados as (
  select id, row_number() over (partition by usuario_id order by id) as n
  from recordatorios
  where estado = 'pendiente'
)
update recordatorios r
set fecha_limite = current_date + (2 + n.n * 4)
from numerados n
where r.id = n.id;

-- Documentos de TCU con fecha límite: 5 a 20 días a futuro
with numerados as (
  select id, row_number() over (partition by usuario_id order by id) as n
  from tcu_documentos
  where fecha_limite is not null
)
update tcu_documentos t
set fecha_limite = current_date + (4 + n.n * 5)
from numerados n
where t.id = n.id;

-- Verificación rápida
select 'recordatorios' as tabla, titulo, fecha_limite from recordatorios where estado = 'pendiente'
union all
select 'tcu_documentos', nombre, fecha_limite from tcu_documentos where fecha_limite is not null
order by fecha_limite;
