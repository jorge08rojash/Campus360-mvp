export type Ponente = {
  id: string;
  foto_url?: string;
  nombre: string;
  iniciales: string;
  cargo: string;
  organizacion: string;
  bio: string;
  experiencia: string[];
  especialidades: string[];
  redes: { tipo: string; url: string }[];
  conferencias: string[];
  contacto: string;
};

export const ponentes: Ponente[] = [
  {
    id: 'p1',
    foto_url: '/fotos/ponentes/ponente-p1.jpg',
    nombre: 'Dr. Ricardo Solano',
    iniciales: 'RS',
    cargo: 'Director de Investigación en IA',
    organizacion: 'Instituto Tecnológico de Costa Rica',
    bio: 'Doctor en Ciencias de la Computación con más de 15 años dedicados a la investigación aplicada en inteligencia artificial y aprendizaje automático. Ha liderado proyectos de adopción de IA en el sector público y privado de Centroamérica.',
    experiencia: [
      'Director de Investigación en IA — TEC (2019–presente)',
      'Científico de datos senior — Banco Nacional (2014–2019)',
      'Investigador postdoctoral — Universidad de Barcelona (2011–2014)',
    ],
    especialidades: ['Machine Learning', 'Procesamiento de Lenguaje Natural', 'Ética en IA', 'Visión por Computadora'],
    redes: [
      { tipo: 'LinkedIn', url: '#' },
      { tipo: 'Google Scholar', url: '#' },
    ],
    conferencias: [
      'IA aplicada a los negocios (2026)',
      'El futuro del trabajo en la era de la automatización (2025)',
      'Sesgos algorítmicos: un problema latinoamericano (2024)',
    ],
    contacto: 'rsolano@ejemplo.ac.cr',
  },
  {
    id: 'p2',
    foto_url: '/fotos/ponentes/ponente-p2.jpg',
    nombre: 'Mag. Valeria Céspedes',
    iniciales: 'VC',
    cargo: 'Gerente de Talento Humano',
    organizacion: 'Grupo Empresarial Aliado',
    bio: 'Especialista en atracción de talento joven y desarrollo de carrera. Ha acompañado a más de 2.000 estudiantes en sus procesos de inserción laboral y diseña programas de prácticas profesionales para universidades del país.',
    experiencia: [
      'Gerente de Talento Humano — Grupo Empresarial Aliado (2020–presente)',
      'Consultora de reclutamiento — Firma Regional de RRHH (2015–2020)',
    ],
    especialidades: ['Reclutamiento', 'Marca personal', 'Entrevistas por competencias', 'Empleabilidad juvenil'],
    redes: [{ tipo: 'LinkedIn', url: '#' }],
    conferencias: [
      'Taller de Currículum y LinkedIn (2026)',
      'Cómo destacar en tu primera entrevista (2025)',
    ],
    contacto: 'vcespedes@ejemplo.com',
  },
  {
    id: 'p3',
    foto_url: '/fotos/ponentes/ponente-p3.jpg',
    nombre: 'Ing. Manuel Araya',
    iniciales: 'MA',
    cargo: 'Arquitecto de Soluciones Cloud',
    organizacion: 'Proveedor Global de Nube',
    bio: 'Arquitecto certificado con experiencia en migración de infraestructuras críticas a la nube. Facilita talleres prácticos de cloud computing para estudiantes y profesionales en toda la región.',
    experiencia: [
      'Arquitecto de Soluciones — Proveedor Global de Nube (2021–presente)',
      'Ingeniero DevOps — Empresa de Software CR (2017–2021)',
    ],
    especialidades: ['Cloud Computing', 'DevOps', 'Kubernetes', 'Arquitectura de sistemas'],
    redes: [
      { tipo: 'LinkedIn', url: '#' },
      { tipo: 'GitHub', url: '#' },
    ],
    conferencias: ['Introducción a Cloud Computing (2026)', 'Contenedores en producción (2025)'],
    contacto: 'maraya@ejemplo.com',
  },
  {
    id: 'p4',
    foto_url: '/fotos/ponentes/ponente-p4.jpg',
    nombre: 'Lic. Sofía Ramírez',
    iniciales: 'SR',
    cargo: 'Coordinadora de Emprendimiento',
    organizacion: 'Universidad Fidélitas',
    bio: 'Impulsora del ecosistema emprendedor universitario. Acompaña a estudiantes en la validación de ideas de negocio y en la búsqueda de financiamiento semilla.',
    experiencia: [
      'Coordinadora de Emprendimiento — Universidad Fidélitas (2022–presente)',
      'Mentora — Incubadora Nacional de Startups (2019–2022)',
    ],
    especialidades: ['Modelos de negocio', 'Lean Startup', 'Pitch a inversionistas', 'Innovación social'],
    redes: [{ tipo: 'LinkedIn', url: '#' }],
    conferencias: ['Emprendimiento Tecnológico (2026)', 'De la idea al MVP (2025)'],
    contacto: 'sramirez@ufidelitas.ac.cr',
  },
  {
    id: 'p5',
    foto_url: '/fotos/ponentes/ponente-p5.jpg',
    nombre: 'Ing. Daniel Quesada',
    iniciales: 'DQ',
    cargo: 'Especialista en Ciberseguridad',
    organizacion: 'Consultora de Seguridad Informática',
    bio: 'Analista de seguridad ofensiva y defensiva. Ha realizado auditorías de seguridad para instituciones financieras y gubernamentales, y divulga buenas prácticas de seguridad digital para el público general.',
    experiencia: [
      'Especialista en Ciberseguridad — Consultora de Seguridad (2020–presente)',
      'Analista SOC — Entidad Financiera (2016–2020)',
    ],
    especialidades: ['Pentesting', 'Seguridad de aplicaciones', 'Respuesta a incidentes', 'Concientización'],
    redes: [{ tipo: 'LinkedIn', url: '#' }],
    conferencias: ['Ciberseguridad para Todos (2026)'],
    contacto: 'dquesada@ejemplo.com',
  },
];

export function getPonente(id: string) {
  return ponentes.find((p) => p.id === id);
}
