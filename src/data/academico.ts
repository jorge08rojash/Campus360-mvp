export type Materia = {
  id: string;
  nombre: string;
  codigo: string;
  profesor: string;
  horario: string;
  nota: number | null;
  progreso: number;
};

export const materiasActuales: Materia[] = [
  { id: 'm1', nombre: 'Ingeniería de Software II', codigo: 'IS-401', profesor: 'Ing. K. Alvarado', horario: 'Lun/Mié 6:00–8:00 p.m.', nota: 92, progreso: 70 },
  { id: 'm2', nombre: 'Bases de Datos Avanzadas', codigo: 'BD-350', profesor: 'Ing. C. Vargas', horario: 'Mar/Jue 6:00–8:00 p.m.', nota: 88, progreso: 65 },
  { id: 'm3', nombre: 'Fundamentos de Adm. de Proyectos', codigo: 'AN-405', profesor: 'Prof. C. Ricketts', horario: 'Sáb 8:00–12:00 m.', nota: 95, progreso: 75 },
  { id: 'm4', nombre: 'Arquitectura de Software', codigo: 'AS-420', profesor: 'Ing. D. Fernández', horario: 'Vie 6:00–9:00 p.m.', nota: null, progreso: 60 },
];

export const noticias = [
  { id: 'no1', titulo: 'Fidélitas inaugura nuevo laboratorio de innovación', fecha: '2026-07-09', categoria: 'Institucional' },
  { id: 'no2', titulo: 'Convocatoria abierta: becas de excelencia académica 2027', fecha: '2026-07-08', categoria: 'Becas' },
  { id: 'no3', titulo: 'Equipo de la U clasifica a competencia regional de robótica', fecha: '2026-07-06', categoria: 'Logros' },
  { id: 'no4', titulo: 'Nuevo convenio de intercambio con universidad española', fecha: '2026-07-03', categoria: 'Internacional' },
];

export const objetivosSemana = [
  { id: 'ob1', texto: 'Registrar 6 horas de TCU', hecho: false },
  { id: 'ob2', texto: 'Entregar avance de Arquitectura de Software', hecho: true },
  { id: 'ob3', texto: 'Agendar tutoría de Bases de Datos', hecho: false },
  { id: 'ob4', texto: 'Registrarse a la Feria de Empleo', hecho: false },
];

export const cuatrimestre = {
  nombre: 'II Cuatrimestre 2026',
  semanaActual: 9,
  semanasTotales: 15,
  creditosInscritos: 12,
  creditosAprobados: 96,
  creditosTotales: 148,
  promedio: 91.6,
};
