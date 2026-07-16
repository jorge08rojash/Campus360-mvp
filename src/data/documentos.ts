export type Documento = {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: 'TCU' | 'Tesis' | 'Matrícula' | 'Becas' | 'Reglamentos' | 'Plantillas';
  tipo: 'PDF' | 'DOCX' | 'XLSX';
  tamano: string;
  version: string;
  estadoVersion: 'vigente' | 'final' | 'borrador';
  actualizado: string; // texto relativo, ej: "Hace 3 días"
  actualizadoOrden: number; // para ordenar (menor = más reciente)
  esNuevo?: boolean;
  archivo: string; // ruta del PDF real en /public/docs
};

export const categorias: { nombre: Documento['categoria']; cantidad: number; icono: string; colorFondo: string; colorTexto: string }[] = [
  { nombre: 'TCU', cantidad: 24, icono: '🤝', colorFondo: '#FCEFD1', colorTexto: '#B8862E' },
  { nombre: 'Tesis', cantidad: 12, icono: '📘', colorFondo: '#DCEEF0', colorTexto: '#2B6477' },
  { nombre: 'Matrícula', cantidad: 8, icono: '📝', colorFondo: '#E3EBDE', colorTexto: '#4E6B4A' },
  { nombre: 'Becas', cantidad: 15, icono: '🎓', colorFondo: '#F0DCE0', colorTexto: '#9E4A5C' },
  { nombre: 'Reglamentos', cantidad: 42, icono: '📜', colorFondo: '#E7E3F0', colorTexto: '#6B5B95' },
  { nombre: 'Plantillas', cantidad: 31, icono: '🗂️', colorFondo: '#DCEEF0', colorTexto: '#2B6477' },
];

export const badgeCategoria: Record<Documento['categoria'], { bg: string; text: string }> = {
  TCU: { bg: '#FCEFD1', text: '#B8862E' },
  Tesis: { bg: '#DCEEF0', text: '#2B6477' },
  Matrícula: { bg: '#E3EBDE', text: '#4E6B4A' },
  Becas: { bg: '#F0DCE0', text: '#9E4A5C' },
  Reglamentos: { bg: '#E7E3F0', text: '#6B5B95' },
  Plantillas: { bg: '#DCEEF0', text: '#2B6477' },
};

export const busquedasPopulares = ['Normas APA 7', 'Plantilla bitácora TCU', 'Formulario becas 2026'];

export const documentos: Documento[] = [
  {
    id: 'd1',
    archivo: '/docs/reglamento-tcu-2026.pdf',
    nombre: 'Reglamento de TCU 2026',
    descripcion: 'Manual de normas y horas requeridas',
    categoria: 'TCU',
    tipo: 'PDF',
    tamano: '3.1 MB',
    version: 'v3.2',
    estadoVersion: 'vigente',
    actualizado: 'Hace 3 días',
    actualizadoOrden: 3,
    esNuevo: true,
  },
  {
    id: 'd2',
    archivo: '/docs/calendario-academico-2026.pdf',
    nombre: 'Calendario académico 2026',
    descripcion: 'Fechas de matrícula y feriados',
    categoria: 'Matrícula',
    tipo: 'XLSX',
    tamano: '95 KB',
    version: 'v1.0',
    estadoVersion: 'final',
    actualizado: 'Hoy',
    actualizadoOrden: 0,
    esNuevo: true,
  },
  {
    id: 'd3',
    archivo: '/docs/guia-formato-tesis.pdf',
    nombre: 'Guía de Formato Tesis',
    descripcion: 'Estructura y normas internas',
    categoria: 'Tesis',
    tipo: 'PDF',
    tamano: '2.4 MB',
    version: 'v2.4',
    estadoVersion: 'vigente',
    actualizado: 'Hace 2 semanas',
    actualizadoOrden: 14,
  },
  {
    id: 'd4',
    archivo: '/docs/plantilla-bitacora-tcu.pdf',
    nombre: 'Plantilla Bitácora Semanal',
    descripcion: 'Documento Excel para horas TCU',
    categoria: 'Plantillas',
    tipo: 'XLSX',
    tamano: '89 KB',
    version: 'v1.2',
    estadoVersion: 'vigente',
    actualizado: 'Hace 1 mes',
    actualizadoOrden: 30,
  },
  {
    id: 'd5',
    archivo: '/docs/guia-normas-apa7.pdf',
    nombre: 'Guía Normas APA 7',
    descripcion: 'Formato de citas y referencias',
    categoria: 'Plantillas',
    tipo: 'PDF',
    tamano: '1.2 MB',
    version: 'v1.0',
    estadoVersion: 'vigente',
    actualizado: 'Hace 2 meses',
    actualizadoOrden: 60,
  },
  {
    id: 'd6',
    archivo: '/docs/formulario-becas-2026.pdf',
    nombre: 'Formulario becas 2026',
    descripcion: 'Solicitud de beca socioeconómica',
    categoria: 'Becas',
    tipo: 'PDF',
    tamano: '180 KB',
    version: 'v1.1',
    estadoVersion: 'vigente',
    actualizado: 'Hace 6 días',
    actualizadoOrden: 6,
  },
  {
    id: 'd7',
    archivo: '/docs/reglamento-estudiantil.pdf',
    nombre: 'Reglamento estudiantil vigente',
    descripcion: 'Normativa institucional general',
    categoria: 'Reglamentos',
    tipo: 'PDF',
    tamano: '3.1 MB',
    version: 'v4.0',
    estadoVersion: 'vigente',
    actualizado: 'Hace 5 meses',
    actualizadoOrden: 150,
  },
  {
    id: 'd8',
    archivo: '/docs/formulario-inscripcion-tcu.pdf',
    nombre: 'Formulario de inscripción TCU',
    descripcion: 'Alta del proyecto comunal',
    categoria: 'TCU',
    tipo: 'DOCX',
    tamano: '340 KB',
    version: 'v2.0',
    estadoVersion: 'vigente',
    actualizado: 'Hace 1 mes',
    actualizadoOrden: 30,
  },
];

export const misGuardados = [documentos[4], documentos[5], documentos[3]];

export const cambiosDelMes: { texto: string; fecha: string; color: string }[] = [
  { texto: 'Calendario 2026 subido', fecha: 'Ayer, 2:30 PM', color: '#2B6477' },
  { texto: 'Versión 3.2 de TCU', fecha: 'Hace 3 días', color: '#D9A441' },
  { texto: 'Reglamento Becas', fecha: '05 Ene 2026', color: '#9E4A5C' },
];
