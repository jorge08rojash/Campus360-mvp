export type Empleo = {
  id: string;
  slug: string;
  cargo: string;
  empresa: string;
  logo: string;
  descripcionEmpresa: string;
  modalidad: 'Presencial' | 'Híbrido' | 'Remoto';
  tipo: 'Tiempo completo' | 'Medio tiempo' | 'Freelance';
  salario: string | null;
  ubicacion: string;
  fechaLimite: string;
  requisitos: string[];
  competencias: string[];
  beneficios: string[];
  contacto: string;
  carreras: string[];
};

export const empleos: Empleo[] = [
  {
    id: 'j1', slug: 'desarrollador-frontend-jr', cargo: 'Desarrollador Frontend Jr.', empresa: 'NimbusTech', logo: 'NT',
    descripcionEmpresa: 'Empresa de software especializada en productos SaaS para el sector financiero.',
    modalidad: 'Híbrido', tipo: 'Tiempo completo', salario: '₡650.000 – ₡850.000',
    ubicacion: 'San José, Costa Rica', fechaLimite: '2026-08-15',
    requisitos: ['Estudiante avanzado o recién graduado en Ingeniería de Software', 'Conocimientos de React'],
    competencias: ['React', 'TypeScript', 'CSS', 'Git'],
    beneficios: ['Seguro médico privado', 'Horario flexible', 'Presupuesto de aprendizaje'],
    contacto: 'talento@nimbustech.example', carreras: ['Ingeniería de Software'],
  },
  {
    id: 'j2', slug: 'analista-datos-junior', cargo: 'Analista de Datos Jr.', empresa: 'Grupo Financiero Aliado', logo: 'GF',
    descripcionEmpresa: 'Institución financiera con operaciones en Centroamérica.',
    modalidad: 'Presencial', tipo: 'Tiempo completo', salario: '₡700.000 – ₡900.000',
    ubicacion: 'San José, Costa Rica', fechaLimite: '2026-08-01',
    requisitos: ['Cursando o graduado de carreras afines a Estadística, Ingeniería o Economía', 'SQL básico'],
    competencias: ['SQL', 'Excel avanzado', 'Power BI'],
    beneficios: ['Aguinaldo doble el primer año', 'Plan de carrera estructurado'],
    contacto: 'reclutamiento@gfaliado.example', carreras: ['Ingeniería de Software', 'Administración de Negocios'],
  },
  {
    id: 'j3', slug: 'pasante-marketing-digital', cargo: 'Pasante de Marketing Digital', empresa: 'Estudio Creativo Norte', logo: 'CN',
    descripcionEmpresa: 'Agencia de marketing digital enfocada en marcas latinoamericanas.',
    modalidad: 'Remoto', tipo: 'Medio tiempo', salario: '₡250.000',
    ubicacion: '100% remoto', fechaLimite: '2026-07-30',
    requisitos: ['Estudiante activo de Mercadeo o afines', 'Manejo de redes sociales'],
    competencias: ['Redes sociales', 'Canva', 'Copywriting'],
    beneficios: ['Horario 100% flexible', 'Certificado de pasantía'],
    contacto: 'pasantias@estudionorte.example', carreras: ['Mercadeo', 'Administración de Negocios'],
  },
  {
    id: 'j4', slug: 'desarrollador-backend-jr', cargo: 'Desarrollador Backend Jr.', empresa: 'CloudWorks CR', logo: 'CW',
    descripcionEmpresa: 'Proveedor de servicios de infraestructura cloud para startups regionales.',
    modalidad: 'Remoto', tipo: 'Tiempo completo', salario: '₡800.000 – ₡1.000.000',
    ubicacion: '100% remoto (LATAM)', fechaLimite: '2026-08-20',
    requisitos: ['Conocimientos de Node.js o Python', 'Bases de datos relacionales'],
    competencias: ['Node.js', 'PostgreSQL', 'Docker'],
    beneficios: ['Pago en dólares', 'Equipo de trabajo incluido', '100% remoto'],
    contacto: 'jobs@cloudworks.example', carreras: ['Ingeniería de Software'],
  },
  {
    id: 'j5', slug: 'asistente-contable', cargo: 'Asistente Contable', empresa: 'Consultora Financiera del Este', logo: 'CF',
    descripcionEmpresa: 'Firma de consultoría contable y tributaria para pymes.',
    modalidad: 'Presencial', tipo: 'Medio tiempo', salario: '₡350.000',
    ubicacion: 'Heredia, Costa Rica', fechaLimite: '2026-07-28',
    requisitos: ['Estudiante de Contaduría o Administración', 'Manejo de Excel'],
    competencias: ['Excel', 'Registros contables', 'Atención al cliente'],
    beneficios: ['Horario compatible con estudios', 'Posibilidad de contrato completo al graduarse'],
    contacto: 'rrhh@cfeste.example', carreras: ['Administración de Negocios'],
  },
];

export function getEmpleo(idOrSlug: string) {
  return empleos.find((e) => e.id === idOrSlug || e.slug === idOrSlug);
}
