export type Tutoria = {
  id: string;
  materia: string;
  profesor: string;
  modalidad: 'Virtual' | 'Presencial';
  tipo: 'Institucional' | 'Gratuita' | 'Premium';
  rating: number;
  when: string;
  costo: string;
  descripcion: string;
};

export const tutorias: Tutoria[] = [
  {
    id: 't1',
    materia: 'Finanzas Corporativas',
    profesor: 'Prof. R. Salas',
    modalidad: 'Presencial',
    tipo: 'Institucional',
    rating: 4.8,
    when: 'Hoy · 4:00 p.m.',
    costo: 'Incluida en la matrícula',
    descripcion: 'Repaso de valor del dinero en el tiempo, estructura de capital y evaluación de proyectos, según tu curso actual.',
  },
  {
    id: 't2',
    materia: 'Mercadeo Estratégico',
    profesor: 'Lic. Karol Jiménez',
    modalidad: 'Virtual',
    tipo: 'Gratuita',
    rating: 4.6,
    when: 'Mañana · 10:00 a.m.',
    costo: 'Gratuita',
    descripcion: 'Análisis de mercado, segmentación y posicionamiento, con casos reales de empresas costarricenses.',
  },
  {
    id: 't3',
    materia: 'Excel Avanzado para Negocios',
    profesor: 'Lic. Fabián Rojas',
    modalidad: 'Virtual',
    tipo: 'Premium',
    rating: 4.9,
    when: 'Jueves · 6:00 p.m.',
    costo: '₡10.000 / hora',
    descripcion: 'Tablas dinámicas, funciones financieras y dashboards para análisis de negocio.',
  },
  {
    id: 't4',
    materia: 'Fundamentos de Adm. de Proyectos',
    profesor: 'Prof. C. Ricketts',
    modalidad: 'Presencial',
    tipo: 'Institucional',
    rating: 4.7,
    when: 'Sábado · 8:00 a.m.',
    costo: 'Incluida en la matrícula',
    descripcion: 'Ciclo de vida de proyectos, cronogramas y gestión de riesgos, alineado con tu curso de AN-405.',
  },
  {
    id: 'tut1',
    materia: 'Álgebra Lineal',
    profesor: 'Andrés Morales — Profesor',
    modalidad: 'Presencial',
    tipo: 'Premium',
    rating: 4.7,
    when: 'Martes · 4:00 p.m. – 5:00 p.m.',
    costo: '₡8.000 / hora',
    descripcion: 'Repaso de vectores, matrices y transformaciones lineales, con ejercicios guiados según tu curso actual.',
  },
  {
    id: 'tut2',
    materia: 'Programación en Python',
    profesor: 'Sofía Ramírez — Estudiante avanzada',
    modalidad: 'Virtual',
    tipo: 'Gratuita',
    rating: 4.8,
    when: 'Jueves · 6:00 p.m. – 7:00 p.m.',
    costo: 'Gratuita',
    descripcion: 'Fundamentos de programación: variables, condicionales, ciclos y funciones, con ejercicios prácticos.',
  },
  {
    id: 'tut3',
    materia: 'Contabilidad Financiera',
    profesor: 'Prof. Marco Salas',
    modalidad: 'Presencial',
    tipo: 'Institucional',
    rating: 4.6,
    when: 'Sábado · 9:00 a.m. – 10:00 a.m.',
    costo: '₡6.000 / hora',
    descripcion: 'Estados financieros, asientos contables y análisis de razones — enfocado en preparar tus exámenes parciales.',
  },
];

export function getTutoria(id: string) {
  return tutorias.find((t) => t.id === id);
}
