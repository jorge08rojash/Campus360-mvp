export type Actividad = {
  id: string;
  slug: string;
  titulo: string;
  resumen: string;
  descripcion: string;
  tipo: 'Deporte' | 'Club' | 'Voluntariado' | 'Cultural' | 'Concurso' | 'Networking' | 'Viaje';
  emoji: string;
  fecha: string;
  hora: string;
  lugar: string;
  responsable: string;
  cupos: number;
  inscritos: number;
  puntos: number;
  compromiso: string;
  requisitos: string[];
  beneficios: string[];
  asistentes: { nombre: string; iniciales: string }[];
};

export const actividades: Actividad[] = [
  {
    id: 'a1',
    slug: 'torneo-futbol',
    titulo: 'Torneo Interfacultades de Fútbol',
    resumen: 'Competencia entre facultades. Equipos mixtos de 7 jugadores.',
    descripcion:
      'El torneo más esperado del cuatrimestre. Cada facultad arma su equipo y compite durante seis semanas. Formato de liga con eliminatorias finales. Los partidos se juegan los sábados por la mañana en la cancha del campus.',
    tipo: 'Deporte',
    emoji: '⚽',
    fecha: '2026-07-18',
    hora: '8:00 a.m.',
    lugar: 'Cancha Deportiva, Campus San Pedro',
    responsable: 'Coordinación de Deportes',
    cupos: 80,
    inscritos: 62,
    puntos: 70,
    compromiso: '6 semanas · sábados por la mañana',
    requisitos: ['Ser estudiante activo', 'Certificado médico vigente', 'Equipo deportivo propio'],
    beneficios: ['Puntos Campus360', 'Uniforme del equipo', 'Medalla para los finalistas'],
    asistentes: [
      { nombre: 'Emilio Mora', iniciales: 'EM' },
      { nombre: 'Kevin Chaves', iniciales: 'KC' },
      { nombre: 'Luis Mora', iniciales: 'LM' },
    ],
  },
  {
    id: 'a2',
    slug: 'club-programacion',
    titulo: 'Club de Programación Competitiva',
    resumen: 'Sesiones semanales de resolución de problemas y preparación para competencias.',
    descripcion:
      'Un espacio para quienes disfrutan resolver problemas algorítmicos. Nos reunimos todos los miércoles para practicar, discutir soluciones y prepararnos para competencias nacionales e internacionales como el ICPC. Abierto a todos los niveles.',
    tipo: 'Club',
    emoji: '💻',
    fecha: '2026-07-15',
    hora: '5:00 p.m.',
    lugar: 'Laboratorio C-201',
    responsable: 'Ing. Kevin Alvarado',
    cupos: 30,
    inscritos: 24,
    puntos: 50,
    compromiso: 'Semanal · miércoles 5–7 p.m.',
    requisitos: ['Conocimientos básicos de programación en cualquier lenguaje'],
    beneficios: ['Preparación para el ICPC', 'Mentoría de estudiantes avanzados', 'Puntos Campus360'],
    asistentes: [
      { nombre: 'Andrés Hidalgo', iniciales: 'AH' },
      { nombre: 'Sofía Loaiza', iniciales: 'SL' },
    ],
  },
  {
    id: 'a3',
    slug: 'voluntariado-reforestacion',
    titulo: 'Voluntariado: Reforestación en Cartago',
    resumen: 'Jornada de siembra de árboles nativos. Cuenta para horas de TCU.',
    descripcion:
      'Jornada de campo en alianza con una fundación ambiental. Sembraremos especies nativas en una zona de recarga acuífera. El transporte y la alimentación están cubiertos. Las horas cuentan como horas válidas de TCU si tu proyecto es del área ambiental.',
    tipo: 'Voluntariado',
    emoji: '🌳',
    fecha: '2026-07-26',
    hora: '6:00 a.m.',
    lugar: 'Punto de encuentro: Campus San Pedro',
    responsable: 'Coordinación de TCU',
    cupos: 40,
    inscritos: 31,
    puntos: 80,
    compromiso: 'Jornada única · 8 horas',
    requisitos: ['Ropa de campo', 'Botas o zapatos cerrados', 'Protector solar'],
    beneficios: ['8 horas válidas de TCU', 'Transporte y alimentación incluidos', 'Certificado de participación'],
    asistentes: [
      { nombre: 'Suri González', iniciales: 'SG' },
      { nombre: 'María Fernández', iniciales: 'MF' },
    ],
  },
  {
    id: 'a4',
    slug: 'festival-cultural',
    titulo: 'Festival Cultural Fidélitas',
    resumen: 'Música en vivo, danza, gastronomía y arte estudiantil. Entrada libre.',
    descripcion:
      'Una jornada completa de celebración cultural. Bandas estudiantiles, presentaciones de danza folclórica y contemporánea, exposición de arte, y una feria gastronómica con platillos típicos. Cierra con un concierto en la plaza.',
    tipo: 'Cultural',
    emoji: '🎭',
    fecha: '2026-08-08',
    hora: '2:00 p.m.',
    lugar: 'Plaza Central, Campus Heredia',
    responsable: 'Vida Estudiantil',
    cupos: 500,
    inscritos: 156,
    puntos: 30,
    compromiso: 'Jornada única · tarde y noche',
    requisitos: ['Ninguno'],
    beneficios: ['Entrada libre', 'Puntos Campus360 por asistencia', 'Networking informal'],
    asistentes: [{ nombre: 'Andrea Solís', iniciales: 'AS' }],
  },
  {
    id: 'a5',
    slug: 'concurso-innovacion',
    titulo: 'Concurso de Innovación Social',
    resumen: 'Presentá una solución a un problema social. Premio: ₡1.500.000 de capital semilla.',
    descripcion:
      'Convocatoria abierta a equipos de estudiantes que quieran resolver un problema social concreto con una propuesta viable. Los tres mejores proyectos reciben capital semilla y acompañamiento del Centro de Emprendimiento durante seis meses.',
    tipo: 'Concurso',
    emoji: '🏆',
    fecha: '2026-09-10',
    hora: '9:00 a.m.',
    lugar: 'Auditorio Principal',
    responsable: 'Centro de Emprendimiento',
    cupos: 25,
    inscritos: 12,
    puntos: 90,
    compromiso: 'Postulación + presentación final',
    requisitos: ['Equipo de 2 a 4 personas', 'Propuesta escrita (máx. 5 páginas)', 'Prototipo o mockup'],
    beneficios: ['Capital semilla', 'Acompañamiento de 6 meses', 'Visibilidad institucional'],
    asistentes: [],
  },
  {
    id: 'a6',
    slug: 'networking-egresados',
    titulo: 'Noche de Networking con Egresados',
    resumen: 'Conversá con egresados que ya están trabajando en tu área.',
    descripcion:
      'Evento informal donde estudiantes de últimos cuatrimestres conversan con egresados que ya están insertados en el mercado laboral. Formato de mesas rotativas por área profesional. Incluye refrigerio.',
    tipo: 'Networking',
    emoji: '🤝',
    fecha: '2026-08-14',
    hora: '6:30 p.m.',
    lugar: 'Sala de Innovación',
    responsable: 'Oficina de Egresados',
    cupos: 50,
    inscritos: 29,
    puntos: 45,
    compromiso: 'Jornada única · 3 horas',
    requisitos: ['Estar en los últimos cuatrimestres', 'Registro previo'],
    beneficios: ['Contactos profesionales reales', 'Refrigerio incluido', 'Posibles referencias laborales'],
    asistentes: [{ nombre: 'Andrés Hidalgo', iniciales: 'AH' }],
  },
  {
    id: 'a7',
    slug: 'viaje-academico-panama',
    titulo: 'Viaje Académico: Zona Franca de Panamá',
    resumen: 'Cuatro días conociendo operaciones logísticas y tecnológicas en Panamá.',
    descripcion:
      'Viaje de estudio a Panamá con visitas a centros de operaciones logísticas, zonas francas y empresas de tecnología. Incluye transporte, hospedaje y visitas guiadas. Cupo limitado, con selección por promedio y carta de motivación.',
    tipo: 'Viaje',
    emoji: '✈️',
    fecha: '2026-09-20',
    hora: '5:00 a.m.',
    lugar: 'Salida desde Campus San Pedro',
    responsable: 'Facultad de Ingeniería',
    cupos: 20,
    inscritos: 8,
    puntos: 100,
    compromiso: '4 días · viaje internacional',
    requisitos: ['Pasaporte vigente', 'Promedio mínimo de 85', 'Carta de motivación', 'Aporte económico parcial'],
    beneficios: ['Visitas a empresas líderes', 'Certificado internacional', 'Experiencia internacional en el CV'],
    asistentes: [],
  },
  {
    id: 'a8',
    slug: 'club-debate',
    titulo: 'Club de Debate y Oratoria',
    resumen: 'Desarrollá tu capacidad de argumentar y hablar en público.',
    descripcion:
      'Sesiones semanales de práctica de debate competitivo formato británico. Trabajamos estructura argumentativa, refutación y presencia escénica. El club participa en torneos universitarios nacionales.',
    tipo: 'Club',
    emoji: '🎤',
    fecha: '2026-07-17',
    hora: '4:00 p.m.',
    lugar: 'Aula B-105',
    responsable: 'Lic. Paola Rojas',
    cupos: 25,
    inscritos: 17,
    puntos: 50,
    compromiso: 'Semanal · viernes 4–6 p.m.',
    requisitos: ['Ganas de hablar en público'],
    beneficios: ['Participación en torneos nacionales', 'Mejora de habilidades blandas', 'Puntos Campus360'],
    asistentes: [{ nombre: 'Sofía Loaiza', iniciales: 'SL' }],
  },
];

export function getActividad(idOrSlug: string) {
  return actividades.find((a) => a.id === idOrSlug || a.slug === idOrSlug);
}

export const coloresTipo: Record<string, string> = {
  Deporte: 'bg-green-100 text-green-700',
  Club: 'bg-[#2B6477]/10 text-[#2B6477]',
  Voluntariado: 'bg-emerald-100 text-emerald-700',
  Cultural: 'bg-purple-100 text-purple-700',
  Concurso: 'bg-yellow-100 text-yellow-700',
  Networking: 'bg-blue-100 text-blue-700',
  Viaje: 'bg-[#2B6477]/10 text-[#2B6477]',
};
