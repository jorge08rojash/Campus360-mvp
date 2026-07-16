export type Nivel = 'Bronce' | 'Plata' | 'Oro';

export const umbralesNivel: Record<Nivel, number> = {
  Bronce: 0,
  Plata: 3000,
  Oro: 7000,
};

export const accionesParaGanar = [
  { id: 'a1', texto: 'Completar 5h TCU', puntos: 50, icono: '🎗️' },
  { id: 'a2', texto: 'Asistir a evento académico', puntos: 30, icono: '📅' },
  { id: 'a3', texto: 'Dar tutoría certificada', puntos: 80, icono: '🎓' },
  { id: 'a4', texto: 'Entregar un avance de tesis a tiempo', puntos: 60, icono: '📘' },
  { id: 'a5', texto: 'Completar tu perfil académico', puntos: 15, icono: '👤' },
];

export type CategoriaRecompensa = 'Académicos' | 'Transporte' | 'Alimentación';

export type Recompensa = {
  id: string;
  nombre: string;
  descripcion: string;
  costo: number;
  categoria: CategoriaRecompensa;
  icono: string;
  colorFondo: string;
  colorTexto: string;
  limitado?: boolean;
  disponible: boolean;
};

export const recompensas: Recompensa[] = [
  {
    id: 'r1',
    nombre: '3% descuento en matrícula',
    descripcion: 'Válido para el próximo cuatrimestre 2026. No acumulable.',
    costo: 5000,
    categoria: 'Académicos',
    icono: '%',
    colorFondo: '#FCEFD1',
    colorTexto: '#B8862E',
    disponible: true,
  },
  {
    id: 'r2',
    nombre: '₡5.000 en Cafetería',
    descripcion: 'Consumible en cualquier sede del Campus Central. Vence en 30 días.',
    costo: 5000,
    categoria: 'Alimentación',
    icono: '🍴',
    colorFondo: '#DCEEF0',
    colorTexto: '#2B6477',
    disponible: true,
  },
  {
    id: 'r3',
    nombre: 'Voucher Uber ₡2.000',
    descripcion: 'Código digital para tu próximo viaje. Aplicable a UberX y Flash.',
    costo: 2000,
    categoria: 'Transporte',
    icono: '🚗',
    colorFondo: '#DCEEF0',
    colorTexto: '#2B6477',
    disponible: true,
  },
  {
    id: 'r4',
    nombre: '3 puntos en nota final',
    descripcion: 'Aplicable a una materia de carrera por cuatrimestre. Sujeto a aprobación.',
    costo: 8000,
    categoria: 'Académicos',
    icono: '★',
    colorFondo: '#EDEDED',
    colorTexto: '#6B7280',
    limitado: true,
    disponible: true,
  },
  {
    id: 'r5',
    nombre: 'Mentoría 1:1 con egresado destacado',
    descripcion: 'Sesión de 45 minutos con un egresado de tu carrera.',
    costo: 2500,
    categoria: 'Académicos',
    icono: '🎯',
    colorFondo: '#FCEFD1',
    colorTexto: '#B8862E',
    disponible: true,
  },
  {
    id: 'r6',
    nombre: 'Combo transporte Uber Flash',
    descripcion: 'Dos viajes cortos dentro del GAM, válidos por 15 días.',
    costo: 3200,
    categoria: 'Transporte',
    icono: '🛵',
    colorFondo: '#DCEEF0',
    colorTexto: '#2B6477',
    disponible: false,
  },
];

export function nivelActual(puntos: number): Nivel {
  if (puntos >= umbralesNivel.Oro) return 'Oro';
  if (puntos >= umbralesNivel.Plata) return 'Plata';
  return 'Bronce';
}

export function siguienteNivel(nivel: Nivel): Nivel | null {
  if (nivel === 'Bronce') return 'Plata';
  if (nivel === 'Plata') return 'Oro';
  return null;
}
