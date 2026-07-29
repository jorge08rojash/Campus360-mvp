// Normaliza el contenido real (eventos, vida universitaria, oportunidades,
// beneficios, tutorías — todos en src/data/*.ts) a una sola forma que la
// ficha de detalle (bottom sheet) y la cuadrícula de Descubrir puedan pintar
// sin importar de qué catálogo viene cada item.

import { eventos, type Evento } from '@/data/eventos';
import { actividades, type Actividad } from '@/data/vidaUniversitaria';
import { practicas, becas, certificaciones } from '@/data/oportunidades';
import { recompensas } from '@/data/beneficios';
import { tutorias } from '@/data/tutorias';

export type ItemTipo = 'evento' | 'vida' | 'oportunidad' | 'beneficio' | 'tutoria';

export type Avatar = { ini: string; bg: string };

export type SheetItem = {
  id: string;
  tipo: ItemTipo;
  titulo: string;
  tag: string;
  tagBg: string;
  tagFg: string;
  when: string;
  place: string;
  summary: string;
  puntos: number;
  attendees: Avatar[];
  attendeeCount: number;
  profesor?: string;
  costo?: string;
  imagen?: string;
};

const PALETA = ['#FF6B5B', '#8FA8FF', '#3DDBB0', '#C88FFF', '#F4C93F'];
function colorPara(seed: string, i: number) {
  return PALETA[(seed.charCodeAt(0) + i) % PALETA.length];
}

const NAVY_GOLD = { bg: 'rgba(21,34,56,0.65)', fg: '#F4C93F' };
const TEAL = { bg: 'rgba(61,219,176,0.15)', fg: '#3DDBB0' };
const CORAL = { bg: 'rgba(255,107,91,0.15)', fg: '#FF6B5B' };
const BLUE = { bg: 'rgba(143,168,255,0.15)', fg: '#8FA8FF' };
const PURPLE = { bg: 'rgba(200,143,255,0.15)', fg: '#C88FFF' };
const BENEFICIO = { bg: 'rgba(21,34,56,0.65)', fg: '#F5F3EF' };

const COLOR_POR_TAG: Record<string, { bg: string; fg: string }> = {
  Conferencia: NAVY_GOLD,
  Taller: NAVY_GOLD,
  Concurso: NAVY_GOLD,
  Feria: CORAL,
  Beca: CORAL,
  Webinar: BLUE,
  Club: BLUE,
  Práctica: BLUE,
  Deporte: TEAL,
  Voluntariado: TEAL,
  Certificación: TEAL,
  Networking: PURPLE,
  Cultural: PURPLE,
  Viaje: PURPLE,
  Beneficio: BENEFICIO,
  Tutoría: NAVY_GOLD,
};

function avataresDe(nombres: { nombre: string; iniciales: string }[], seed: string): Avatar[] {
  return nombres.slice(0, 4).map((n, i) => ({ ini: n.iniciales, bg: colorPara(seed, i) }));
}

/** Fotos reales extraídas del prototipo de diseño (design-handoff/project/.image-slots.state.json),
 * guardadas en public/campus360/covers/. Cubre un subconjunto de items — el resto sigue usando el
 * degradado + inicial de CoverPhoto como fallback. */
const IMAGENES: Record<string, string> = {
  e1: '/campus360/covers/e1.webp',
  e2: '/campus360/covers/e2.webp',
  e3: '/campus360/covers/e3.webp',
  e4: '/campus360/covers/e4.webp',
  e6: '/campus360/covers/e6.webp',
  e7: '/campus360/covers/e7.webp',
  b1: '/campus360/covers/b1.webp',
  b2: '/campus360/covers/b2.webp',
  b3: '/campus360/covers/b3.webp',
  tut1: '/campus360/covers/tut1.webp',
  tut2: '/campus360/covers/tut2.webp',
  tut3: '/campus360/covers/tut3.webp',
};

function deEvento(e: Evento): SheetItem {
  return {
    id: e.id,
    tipo: 'evento',
    titulo: e.titulo,
    tag: e.categoria,
    tagBg: COLOR_POR_TAG[e.categoria]?.bg ?? NAVY_GOLD.bg,
    tagFg: COLOR_POR_TAG[e.categoria]?.fg ?? NAVY_GOLD.fg,
    when: `${new Date(e.fecha + 'T00:00:00').toLocaleDateString('es-CR', { weekday: 'long' })} · ${e.hora} – ${e.horaFin}`,
    place: e.lugar,
    summary: e.resumen,
    puntos: e.puntos,
    attendees: avataresDe(
      e.comentarios.map((c) => ({ nombre: c.autor, iniciales: c.iniciales })),
      e.id
    ),
    attendeeCount: e.inscritos,
    imagen: IMAGENES[e.id],
  };
}

function deActividad(a: Actividad): SheetItem {
  return {
    id: a.id,
    tipo: 'vida',
    titulo: a.titulo,
    tag: a.tipo,
    tagBg: COLOR_POR_TAG[a.tipo]?.bg ?? BLUE.bg,
    tagFg: COLOR_POR_TAG[a.tipo]?.fg ?? BLUE.fg,
    when: `${new Date(a.fecha + 'T00:00:00').toLocaleDateString('es-CR', { weekday: 'long' })} · ${a.hora}`,
    place: a.lugar,
    summary: a.resumen,
    puntos: a.puntos,
    attendees: avataresDe(a.asistentes, a.id),
    attendeeCount: a.inscritos,
  };
}

function deOportunidad(): SheetItem[] {
  const p = practicas.map((x) => ({
    id: x.id,
    tipo: 'oportunidad' as const,
    titulo: `Práctica en ${x.empresa}`,
    tag: 'Práctica',
    tagBg: COLOR_POR_TAG.Práctica.bg,
    tagFg: COLOR_POR_TAG.Práctica.fg,
    when: `${x.duracion} · ${x.horario}`,
    place: x.modalidad,
    summary: `${x.area} · ${x.beneficios.join(', ')}. Tutor: ${x.tutorEmpresarial}.`,
    puntos: 0,
    attendees: [],
    attendeeCount: 0,
  }));
  const b = becas.map((x) => ({
    id: x.id,
    tipo: 'oportunidad' as const,
    titulo: x.nombre,
    tag: 'Beca',
    tagBg: COLOR_POR_TAG.Beca.bg,
    tagFg: COLOR_POR_TAG.Beca.fg,
    when: `Cierra ${new Date(x.fechaLimite + 'T00:00:00').toLocaleDateString('es-CR')} · ${x.cobertura}`,
    place: x.pais,
    summary: `Para: ${x.carreras.join(', ')}. ${x.requisitos.join('. ')}.`,
    puntos: 0,
    attendees: [],
    attendeeCount: 0,
    imagen: IMAGENES[x.id],
  }));
  const c = certificaciones.map((x) => ({
    id: x.id,
    tipo: 'oportunidad' as const,
    titulo: x.nombre,
    tag: 'Certificación',
    tagBg: COLOR_POR_TAG.Certificación.bg,
    tagFg: COLOR_POR_TAG.Certificación.fg,
    when: `${x.tiempo} · ${x.costo}`,
    place: x.modalidad,
    summary: `${x.proveedor}. ${x.valorMercado}`,
    puntos: 0,
    attendees: [],
    attendeeCount: 0,
  }));
  return [...p, ...b, ...c];
}

function deBeneficio(): SheetItem[] {
  return recompensas.map((r) => ({
    id: r.id,
    tipo: 'beneficio',
    titulo: r.nombre,
    tag: 'Beneficio',
    tagBg: COLOR_POR_TAG.Beneficio.bg,
    tagFg: COLOR_POR_TAG.Beneficio.fg,
    when: `${r.costo.toLocaleString('es-CR')} pts`,
    place: 'Universidad Fidélitas',
    summary: r.descripcion,
    puntos: 0,
    attendees: [],
    attendeeCount: 0,
  }));
}

function deTutoria(): SheetItem[] {
  return tutorias.map((t) => ({
    id: t.id,
    tipo: 'tutoria',
    titulo: `Tutoría 1:1 de ${t.materia}`,
    tag: 'Tutoría',
    tagBg: COLOR_POR_TAG.Tutoría.bg,
    tagFg: COLOR_POR_TAG.Tutoría.fg,
    when: t.when,
    place: t.modalidad,
    summary: t.descripcion,
    puntos: 0,
    attendees: [],
    attendeeCount: 0,
    profesor: t.profesor,
    costo: t.costo,
    imagen: IMAGENES[t.id],
  }));
}

let INDICE: SheetItem[] | null = null;

export function catalogoCompleto(): SheetItem[] {
  if (!INDICE) {
    INDICE = [
      ...eventos.map(deEvento),
      ...actividades.map(deActividad),
      ...deOportunidad(),
      ...deBeneficio(),
      ...deTutoria(),
    ];
  }
  return INDICE;
}

export function buscarItem(id: string): SheetItem | undefined {
  return catalogoCompleto().find((i) => i.id === id);
}

export function itemsPorTipo(tipo: ItemTipo | 'todo'): SheetItem[] {
  const todos = catalogoCompleto();
  return tipo === 'todo' ? todos : todos.filter((i) => i.tipo === tipo);
}

/** Actividades destacadas de "hoy en campus" para historias y el feed — los 5 eventos más próximos. */
export function actividadesDeHoy(): SheetItem[] {
  return eventos
    .slice()
    .sort((a, b) => a.fecha.localeCompare(b.fecha))
    .slice(0, 5)
    .map(deEvento);
}
