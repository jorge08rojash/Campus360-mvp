// Índice de búsqueda global — unifica todo el contenido navegable de la app.
import { tutoresEjemplo } from '@/lib/datosSimulados';
import { eventos } from '@/data/eventos';
import { documentos } from '@/data/documentos';
import { proyectosTcu } from '@/data/proyectosTcu';
import { links } from '@/components/Sidebar';

export type ResultadoBusqueda = {
  id: string;
  titulo: string;
  subtitulo: string;
  href: string;
  tipo: 'Sección' | 'Tutor' | 'Evento' | 'Documento' | 'Proyecto TCU';
  icono: string;
};

let indice: ResultadoBusqueda[] | null = null;

function construirIndice(): ResultadoBusqueda[] {
  const items: ResultadoBusqueda[] = [];

  for (const l of links) {
    items.push({ id: `sec-${l.href}`, titulo: l.label, subtitulo: 'Sección de Campus360', href: l.href, tipo: 'Sección', icono: l.icon });
  }
  for (const t of tutoresEjemplo) {
    items.push({ id: `tut-${t.id}`, titulo: t.nombre, subtitulo: `Tutoría de ${t.materia} · ${t.modalidad}`, href: '/tutorias', tipo: 'Tutor', icono: '🎓' });
  }
  for (const e of eventos) {
    items.push({ id: `ev-${e.id}`, titulo: e.titulo, subtitulo: `${e.categoria} · ${new Date(e.fecha).toLocaleDateString('es-CR', { day: 'numeric', month: 'long' })}`, href: `/eventos/${e.slug}`, tipo: 'Evento', icono: '📅' });
  }
  for (const d of documentos) {
    items.push({ id: `doc-${d.id}`, titulo: d.nombre, subtitulo: `${d.categoria} · ${d.tipo} · ${d.version}`, href: '/documentos', tipo: 'Documento', icono: '🗂️' });
  }
  for (const p of proyectosTcu) {
    items.push({ id: `pr-${p.id}`, titulo: p.nombre, subtitulo: `TCU · ${p.organizacion}`, href: `/tcu/proyectos/${p.slug}`, tipo: 'Proyecto TCU', icono: '🤝' });
  }
  return items;
}

function normalizar(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function buscarGlobal(query: string, limite = 7): ResultadoBusqueda[] {
  const q = normalizar(query.trim());
  if (q.length < 2) return [];
  if (!indice) indice = construirIndice();
  return indice
    .map((item) => {
      const texto = normalizar(item.titulo + ' ' + item.subtitulo);
      const enTitulo = normalizar(item.titulo).includes(q);
      const enTexto = texto.includes(q);
      const score = enTitulo ? 2 : enTexto ? 1 : 0;
      return { item, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limite)
    .map((r) => r.item);
}
