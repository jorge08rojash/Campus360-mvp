repo: jorge08rojash/Campus360-mvp
branch: main

## Last sync
date: 2026-07-28T03:40:04Z
commit: 43573f768891

### Updated in this project
- Built Campus360.dc.html, a dark-mode iOS-style interactive prototype (5 tabs: Inicio, Descubrir, Asistente IA "Rasta", Mi Camino, Perfil)
- Content grounded in real MVP data: TCU stages/hours, eventos, vida universitaria, oportunidades, becas, certificaciones, beneficios
- Used repo only as content/domain reference — UI designed fresh, not copied from MVP's actual screens

## Screen map
| Screen | Repo source |
| --- | --- |
| Inicio (feed, check-in, stories) | src/data/eventos.ts, src/data/vidaUniversitaria.ts |
| Descubrir (grid + filters) | src/data/eventos.ts, vidaUniversitaria.ts, oportunidades.ts, beneficios.ts |
| Mi Camino (TCU ring, bitácora, tutorías, agenda, objetivos) | supabase/seed.sql (tcu_proceso, tcu_etapas, tcu_bitacora), src/data/academico.ts |
| Perfil (insignias, nivel, Wrapped) | src/data/beneficios.ts (niveles/puntos) |
