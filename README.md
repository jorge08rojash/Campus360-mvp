# Campus360 — súper-app móvil (Universidad Fidélitas)

App móvil-first (Next.js 16 + React 19 + Tailwind + Supabase) implementada a partir
del prototipo de diseño en `design-handoff/` (Claude Design). Reemplaza el portal de
trámites de escritorio que tenía este repo por la experiencia tipo Instagram/Duolingo
de 5 pestañas: **Inicio, Descubrir, Asistente IA (Rasta), Mi Camino, Perfil**.

## Getting Started

```bash
npm install
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000). El flujo es: splash (`/`) →
login (`/login`, correo institucional + contraseña demo `campus360`) → app (`/inicio`).

## Variables de entorno

Usa las que ya existían en este proyecto — no hace falta (ni se debe) inventar otras:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

Estas viven en `.env.local` (ya committeado en este repo desde antes — ver nota de
seguridad más abajo).

## Base de datos (Supabase)

El esquema original (`supabase/schema.sql` + `supabase/seed.sql`) cubre perfiles y TCU.
Para las funciones nuevas de la app móvil (amigos, notificaciones, historias, objetivos,
tutorías, inscripciones, y las columnas de puntos/racha en `perfiles`), corré **en este
orden** en el SQL Editor de tu proyecto Supabase:

1. `supabase/schema.sql` (si no lo corriste antes)
2. `supabase/seed.sql`
3. `supabase/schema_social.sql` — tablas nuevas + buckets de Storage (`avatares`, `historias`)
4. `supabase/seed_social.sql` — agrega el perfil demo "Andrés Rojas" (persona validada
   en el diseño) con su red de amigos/notificaciones de ejemplo

No pude ejecutar ni verificar estos scripts contra una base real durante esta sesión
(no hay conexión a Supabase disponible acá) — probalos vos y avisame si algo falla.

## Qué es real vs. contenido de catálogo

- **Real, en Supabase**: perfil, TCU (horas/etapas/bitácora), puntos, racha de check-in,
  amigos/solicitudes, notificaciones, objetivos de la semana, inscripciones a
  tutorías/eventos/oportunidades/beneficios, e historias (fotos subidas a Storage).
- **Catálogo de contenido** (`src/data/*.ts`, igual que en el resto del proyecto):
  eventos, vida universitaria, oportunidades, becas, certificaciones, beneficios y
  tutorías. No tienen fotos reales todavía, así que las portadas usan un degradado +
  el nombre de la categoría en vez de inventar URLs de imágenes.

## ⚠️ Nota de seguridad

`.env.local` ya estaba versionado en este repo (con URL y anon key reales de Supabase)
antes de este cambio — no lo toqué, pero vale la pena que lo saques del historial de
git y regeneres la anon key si el repo es público o el acceso no es de confianza total.
