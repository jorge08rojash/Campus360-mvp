-- Desactivar RLS para el MVP (sin autenticación real de Supabase todavía)
-- Esto permite que la anon key lea y escriba libremente en estas tablas de prueba

alter table perfiles disable row level security;
alter table tcu_proceso disable row level security;
alter table tcu_etapas disable row level security;
alter table tcu_bitacora disable row level security;
alter table tcu_documentos disable row level security;
alter table recordatorios disable row level security;
