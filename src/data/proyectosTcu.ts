export type ProyectoTcu = {
  id: string;
  slug: string;
  nombre: string;
  organizacion: string;
  tipoOrg: 'ONG' | 'Municipalidad' | 'Fundación' | 'Institución pública' | 'Empresa privada' | 'Proyecto universitario';
  descripcion: string;
  objetivos: string[];
  actividades: string[];
  horario: string;
  modalidad: 'Presencial' | 'Virtual' | 'Híbrido';
  provincia: string;
  canton: string;
  ubicacion: string;
  cupos: number;
  inscritos: number;
  supervisor: string;
  area: string;
  competencias: string[];
  beneficios: string[];
  tiempoEstimado: string;
  horasDisponibles: number;
  carreras: string[];
  contacto: string;
};

export const proyectosTcu: ProyectoTcu[] = [
  {
    id: 'pt1', slug: 'alfabetizacion-digital-adultos-mayores', nombre: 'Alfabetización Digital para Personas Adultas Mayores',
    organizacion: 'Fundación Conexión Social', tipoOrg: 'Fundación',
    descripcion: 'Talleres de introducción al uso de celulares y computadoras para personas adultas mayores en comunidades de San José, con el fin de reducir la brecha digital.',
    objetivos: ['Enseñar uso básico de smartphones', 'Facilitar acceso a trámites digitales', 'Reducir el aislamiento social por brecha tecnológica'],
    actividades: ['Talleres presenciales semanales', 'Elaboración de material didáctico', 'Acompañamiento individual'],
    horario: 'Sábados, 9:00am–1:00pm', modalidad: 'Presencial', provincia: 'San José', canton: 'San José Centro',
    ubicacion: 'Centro Comunitario San José Centro', cupos: 8, inscritos: 5, supervisor: 'Lic. Rosa Vindas',
    area: 'Desarrollo comunitario', competencias: ['Comunicación', 'Paciencia', 'Nociones básicas de tecnología'],
    beneficios: ['Horas 100% válidas', 'Certificado de la fundación', 'Experiencia en trabajo comunitario'],
    tiempoEstimado: '4 meses', horasDisponibles: 150, carreras: ['Todas las carreras'],
    contacto: 'proyectos@conexionsocial.example',
  },
  {
    id: 'pt2', slug: 'huertas-urbanas-escolares', nombre: 'Huertas Urbanas en Escuelas Públicas',
    organizacion: 'Municipalidad de Heredia', tipoOrg: 'Municipalidad',
    descripcion: 'Diseño e implementación de huertas urbanas en tres escuelas públicas de Heredia, integrando educación ambiental con los estudiantes de primaria.',
    objetivos: ['Construir huertas funcionales en 3 escuelas', 'Capacitar a docentes en mantenimiento', 'Sensibilizar sobre seguridad alimentaria'],
    actividades: ['Diseño del espacio', 'Jornadas de siembra', 'Talleres educativos con estudiantes'],
    horario: 'Martes y jueves, 2:00pm–5:00pm', modalidad: 'Presencial', provincia: 'Heredia', canton: 'Heredia',
    ubicacion: 'Escuelas públicas de Heredia centro', cupos: 12, inscritos: 9, supervisor: 'Ing. Agr. Manuel Ureña',
    area: 'Ambiental', competencias: ['Trabajo en equipo', 'Interés en sostenibilidad'],
    beneficios: ['Horas válidas', 'Certificado municipal', 'Aporte real a comunidades educativas'],
    tiempoEstimado: '5 meses', horasDisponibles: 150, carreras: ['Todas las carreras'],
    contacto: 'ambiente@muniheredia.example',
  },
  {
    id: 'pt3', slug: 'apoyo-contable-pymes', nombre: 'Apoyo Contable a Pequeñas Empresas',
    organizacion: 'Cámara de Comercio de Cartago', tipoOrg: 'Institución pública',
    descripcion: 'Asesoría básica en formalización contable y tributaria para microempresas de Cartago que buscan regularizar su situación fiscal.',
    objetivos: ['Asesorar a 15 microempresas', 'Facilitar procesos de formalización', 'Divulgar buenas prácticas contables'],
    actividades: ['Asesorías individuales', 'Talleres grupales', 'Elaboración de guías simplificadas'],
    horario: 'Lunes y miércoles, 1:00pm–5:00pm', modalidad: 'Híbrido', provincia: 'Cartago', canton: 'Cartago',
    ubicacion: 'Cámara de Comercio de Cartago', cupos: 6, inscritos: 4, supervisor: 'Lic. Adriana Meza',
    area: 'Económico-empresarial', competencias: ['Contabilidad básica', 'Atención al público'],
    beneficios: ['Horas válidas', 'Networking con empresarios locales', 'Experiencia real en asesoría'],
    tiempoEstimado: '4 meses', horasDisponibles: 150, carreras: ['Administración de Negocios'],
    contacto: 'proyectos@camaracartago.example',
  },
  {
    id: 'pt4', slug: 'plataforma-web-ong-ambiental', nombre: 'Desarrollo de Plataforma Web para ONG Ambiental',
    organizacion: 'Fundación Bosque Vivo', tipoOrg: 'ONG',
    descripcion: 'Construcción de un sitio web informativo y de donaciones para una ONG dedicada a la conservación de bosques en la zona norte del país.',
    objetivos: ['Lanzar sitio web funcional', 'Integrar pasarela de donaciones', 'Capacitar al equipo en mantenimiento básico'],
    actividades: ['Desarrollo frontend y backend', 'Pruebas de usabilidad', 'Documentación técnica'],
    horario: 'Flexible, coordinación semanal virtual', modalidad: 'Virtual', provincia: 'Alajuela', canton: 'San Carlos',
    ubicacion: 'Remoto (coordinación con sede en San Carlos)', cupos: 3, inscritos: 2, supervisor: 'Ing. Federico Araya',
    area: 'Tecnología', competencias: ['Desarrollo web', 'Trabajo remoto', 'Autogestión'],
    beneficios: ['Horas válidas', 'Portafolio de proyecto real', 'Carta de recomendación'],
    tiempoEstimado: '3 meses', horasDisponibles: 150, carreras: ['Ingeniería de Software'],
    contacto: 'voluntariado@bosquevivo.example',
  },
  {
    id: 'pt5', slug: 'acompanamiento-psicosocial-migrantes', nombre: 'Acompañamiento Psicosocial a Población Migrante',
    organizacion: 'Fundación Puente Humano', tipoOrg: 'Fundación',
    descripcion: 'Apoyo en actividades recreativas y de orientación básica para familias migrantes en centros de acogida temporal en la zona sur.',
    objetivos: ['Brindar espacios de contención emocional', 'Apoyar en orientación de trámites básicos', 'Facilitar integración comunitaria'],
    actividades: ['Talleres recreativos para niños', 'Acompañamiento a trámites', 'Traducción básica (si aplica)'],
    horario: 'Sábados, 8:00am–12:00m', modalidad: 'Presencial', provincia: 'Puntarenas', canton: 'Golfito',
    ubicacion: 'Centro de Acogida Golfito', cupos: 10, inscritos: 3, supervisor: 'Trab. Soc. Ivonne Salas',
    area: 'Desarrollo comunitario', competencias: ['Empatía', 'Trabajo con poblaciones vulnerables'],
    beneficios: ['Horas válidas', 'Experiencia en trabajo social', 'Certificado de la fundación'],
    tiempoEstimado: '6 meses', horasDisponibles: 150, carreras: ['Todas las carreras'],
    contacto: 'voluntariado@puentehumano.example',
  },
  {
    id: 'pt6', slug: 'gestion-datos-clinica-comunitaria', nombre: 'Digitalización de Registros en Clínica Comunitaria',
    organizacion: 'CCSS — Área de Salud Desamparados', tipoOrg: 'Institución pública',
    descripcion: 'Apoyo en la digitalización y organización de registros administrativos de una clínica comunitaria para mejorar el acceso a la información.',
    objetivos: ['Digitalizar archivos físicos pendientes', 'Estandarizar nomenclatura de registros', 'Capacitar personal en el nuevo sistema'],
    actividades: ['Digitalización de documentos', 'Organización de bases de datos', 'Soporte técnico básico'],
    horario: 'Lunes a viernes, 8:00am–12:00m (parcial)', modalidad: 'Presencial', provincia: 'San José', canton: 'Desamparados',
    ubicacion: 'Área de Salud Desamparados', cupos: 4, inscritos: 4, supervisor: 'Lic. Johanna Rojas',
    area: 'Salud / Administración', competencias: ['Excel', 'Organización', 'Discreción con datos sensibles'],
    beneficios: ['Horas válidas', 'Experiencia en sector salud pública'],
    tiempoEstimado: '3 meses', horasDisponibles: 150, carreras: ['Ingeniería de Software', 'Administración de Negocios'],
    contacto: 'tcu@ccssdesamparados.example',
  },
  {
    id: 'pt7', slug: 'app-movil-cooperativa-cafetalera', nombre: 'App Móvil para Cooperativa Cafetalera',
    organizacion: 'Cooperativa de Caficultores de Pérez Zeledón', tipoOrg: 'Empresa privada',
    descripcion: 'Desarrollo de una aplicación móvil sencilla que permita a los caficultores asociados llevar registro de sus cosechas y consultar precios del grano.',
    objetivos: ['Lanzar versión beta funcional', 'Capacitar a 20 caficultores en su uso', 'Recolectar retroalimentación para mejoras'],
    actividades: ['Desarrollo de la app', 'Pruebas piloto con usuarios reales', 'Documentación y manual de usuario'],
    horario: 'Flexible, con visitas de campo mensuales', modalidad: 'Híbrido', provincia: 'San José', canton: 'Pérez Zeledón',
    ubicacion: 'Pérez Zeledón (visitas) + remoto', cupos: 4, inscritos: 1, supervisor: 'Ing. Rolando Chinchilla',
    area: 'Tecnología / Agroindustria', competencias: ['Desarrollo móvil', 'Diseño centrado en el usuario'],
    beneficios: ['Horas válidas', 'Proyecto con impacto rural real', 'Portafolio destacable'],
    tiempoEstimado: '5 meses', horasDisponibles: 150, carreras: ['Ingeniería de Software'],
    contacto: 'proyectos@coopcafeperez.example',
  },
  {
    id: 'pt8', slug: 'campana-prevencion-violencia-escolar', nombre: 'Campaña de Prevención de Violencia Escolar',
    organizacion: 'Ministerio de Educación Pública — Circuito 05', tipoOrg: 'Institución pública',
    descripcion: 'Diseño y ejecución de una campaña de sensibilización sobre convivencia y prevención del bullying en colegios públicos de Limón.',
    objetivos: ['Diseñar material de campaña', 'Realizar talleres en 3 colegios', 'Medir el impacto con encuestas'],
    actividades: ['Diseño gráfico de materiales', 'Facilitación de talleres', 'Análisis de resultados'],
    horario: 'Viernes, 8:00am–2:00pm', modalidad: 'Presencial', provincia: 'Limón', canton: 'Limón',
    ubicacion: 'Colegios públicos de Limón centro', cupos: 6, inscritos: 2, supervisor: 'MSc. Carolina Duarte',
    area: 'Educación', competencias: ['Facilitación de grupos', 'Diseño gráfico básico'],
    beneficios: ['Horas válidas', 'Certificado del MEP', 'Impacto directo en comunidad educativa'],
    tiempoEstimado: '4 meses', horasDisponibles: 150, carreras: ['Todas las carreras'],
    contacto: 'circuito05@mep.example',
  },
];

export function getProyectoTcu(idOrSlug: string) {
  return proyectosTcu.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
}

export const provinciasTcu = Array.from(new Set(proyectosTcu.map((p) => p.provincia)));
export const areasTcu = Array.from(new Set(proyectosTcu.map((p) => p.area)));
