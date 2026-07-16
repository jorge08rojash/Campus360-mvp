
// Fechas relativas: los eventos siempre caen en el futuro cercano respecto a "hoy",
// así la demo nunca caduca aunque pase el tiempo.
function enDias(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export type Evento = {
  id: string;
  slug: string;
  titulo: string;
  resumen: string;
  descripcion: string;
  objetivos: string[];
  agenda: { hora: string; actividad: string }[];
  fecha: string;
  hora: string;
  horaFin: string;
  lugar: string;
  direccion: string;
  coords: { lat: number; lng: number };
  modalidad: 'Presencial' | 'Virtual' | 'Híbrido';
  categoria: 'Conferencia' | 'Taller' | 'Feria' | 'Webinar';
  cupos: number;
  inscritos: number;
  organizador: string;
  facultad: string;
  carrerasRecomendadas: string[];
  publicoObjetivo: string;
  requisitos: string[];
  recursos: string[];
  materialPrevio: { nombre: string; tipo: string }[];
  materialPosterior: { nombre: string; tipo: string }[];
  certificado: boolean;
  beneficios: string[];
  puntos: number;
  ponenteId: string;
  faq: { pregunta: string; respuesta: string }[];
  comentarios: { autor: string; iniciales: string; texto: string; fecha: string }[];
  galeria: string[];
  videos: { titulo: string; duracion: string }[];
  relacionados: string[];
};

export const eventos: Evento[] = [
  {
    id: 'e1',
    slug: 'ia-aplicada-industria',
    titulo: 'Charla: Inteligencia Artificial en la Industria',
    resumen: 'Cómo la IA está transformando los sectores productivos de Costa Rica y qué habilidades demanda el mercado.',
    descripcion:
      'Una sesión magistral donde exploraremos casos reales de adopción de inteligencia artificial en la industria costarricense: manufactura, banca, salud y comercio. Analizaremos qué problemas resuelve la IA hoy, cuáles siguen siendo promesas y qué perfiles profesionales están contratando las empresas que ya la implementaron. La charla incluye una sección de preguntas abiertas y una demostración en vivo de modelos aplicados a datos locales.',
    objetivos: [
      'Comprender el panorama actual de adopción de IA en Costa Rica',
      'Identificar los sectores con mayor demanda de talento en IA',
      'Reconocer los errores más comunes al implementar proyectos de IA',
      'Conocer rutas de aprendizaje concretas para especializarse',
    ],
    agenda: [
      { hora: '4:00 p.m.', actividad: 'Registro y bienvenida' },
      { hora: '4:15 p.m.', actividad: 'Panorama de la IA en Centroamérica' },
      { hora: '4:45 p.m.', actividad: 'Casos de estudio: banca, salud y manufactura' },
      { hora: '5:20 p.m.', actividad: 'Demostración en vivo' },
      { hora: '5:40 p.m.', actividad: 'Preguntas del público' },
      { hora: '6:00 p.m.', actividad: 'Cierre y networking' },
    ],
    fecha: enDias(7),
    hora: '4:00 p.m.',
    horaFin: '6:00 p.m.',
    lugar: 'Auditorio Principal',
    direccion: 'Campus San Pedro, Universidad Fidélitas, San José',
    coords: { lat: 9.9333, lng: -84.0533 },
    modalidad: 'Presencial',
    categoria: 'Conferencia',
    cupos: 120,
    inscritos: 75,
    organizador: 'Escuela de Ingeniería de Software',
    facultad: 'Facultad de Ingeniería',
    carrerasRecomendadas: ['Ingeniería de Software', 'Ingeniería Industrial', 'Administración de Negocios'],
    publicoObjetivo: 'Estudiantes de cualquier nivel interesados en tecnología y su aplicación empresarial.',
    requisitos: ['Ser estudiante activo', 'Registro previo en Campus360'],
    recursos: ['Cuaderno o dispositivo para tomar notas', 'Carné estudiantil'],
    materialPrevio: [
      { nombre: 'Lectura: IA en LATAM — panorama 2026', tipo: 'PDF' },
      { nombre: 'Video introductorio (12 min)', tipo: 'Video' },
    ],
    materialPosterior: [
      { nombre: 'Presentación de la charla', tipo: 'PDF' },
      { nombre: 'Lista de recursos recomendados', tipo: 'Enlace' },
    ],
    certificado: true,
    beneficios: [
      'Certificado de participación avalado por la Facultad',
      'Acceso al material exclusivo del ponente',
      'Networking con profesionales del sector',
    ],
    puntos: 50,
    ponenteId: 'p1',
    faq: [
      { pregunta: '¿Necesito conocimientos previos de programación?', respuesta: 'No. La charla está diseñada para ser comprensible sin base técnica, aunque profundiza en aspectos que interesarán a perfiles técnicos.' },
      { pregunta: '¿Se entrega certificado?', respuesta: 'Sí, siempre que se registre asistencia al inicio y al final de la sesión.' },
      { pregunta: '¿Habrá transmisión en línea?', respuesta: 'Esta edición es únicamente presencial, pero la grabación se publicará en el material posterior.' },
    ],
    comentarios: [
      { autor: 'María Fernández', iniciales: 'MF', texto: 'Fui a la edición pasada y estuvo buenísima. Muy recomendada.', fecha: enDias(-10) },
      { autor: 'Jorge Ureña', iniciales: 'JU', texto: '¿Alguien sabe si dan puntos para el curso de Innovación?', fecha: enDias(-8) },
    ],
    galeria: ['Auditorio lleno en la edición 2025', 'Demostración en vivo', 'Sesión de networking'],
    videos: [{ titulo: 'Resumen de la edición 2025', duracion: '4:12' }],
    relacionados: ['e6', 'e4'],
  },
  {
    id: 'e2',
    slug: 'taller-curriculum-linkedin',
    titulo: 'Taller de Currículum y LinkedIn',
    resumen: 'Construí un CV que pase los filtros automáticos y un perfil de LinkedIn que atraiga reclutadores.',
    descripcion:
      'Taller práctico de trabajo individual. Cada participante sale con su currículum revisado y su perfil de LinkedIn optimizado. Trabajaremos sobre los criterios reales que usan los sistemas de seguimiento de candidatos (ATS) y sobre cómo redactar logros medibles en lugar de listas de tareas.',
    objetivos: [
      'Estructurar un CV de una página orientado a resultados',
      'Optimizar el perfil de LinkedIn para búsquedas de reclutadores',
      'Redactar logros cuantificables sin experiencia laboral formal',
      'Preparar una carta de presentación reutilizable',
    ],
    agenda: [
      { hora: '10:00 a.m.', actividad: 'Qué mira realmente un reclutador en 7 segundos' },
      { hora: '10:30 a.m.', actividad: 'Taller: reescribí tu CV' },
      { hora: '11:15 a.m.', actividad: 'Optimización de LinkedIn en vivo' },
      { hora: '11:45 a.m.', actividad: 'Revisión entre pares y cierre' },
    ],
    fecha: enDias(10),
    hora: '10:00 a.m.',
    horaFin: '12:00 m.',
    lugar: 'Sala de Innovación',
    direccion: 'Edificio B, Campus San Pedro, Universidad Fidélitas',
    coords: { lat: 9.9336, lng: -84.0529 },
    modalidad: 'Presencial',
    categoria: 'Taller',
    cupos: 20,
    inscritos: 18,
    organizador: 'Vida Estudiantil',
    facultad: 'Vicerrectoría de Vida Estudiantil',
    carrerasRecomendadas: ['Todas las carreras'],
    publicoObjetivo: 'Estudiantes de últimos cuatrimestres y próximos a graduarse.',
    requisitos: ['Traer computadora portátil', 'Tener un borrador de CV (aunque esté incompleto)'],
    recursos: ['Computadora portátil', 'Cuenta de LinkedIn activa'],
    materialPrevio: [{ nombre: 'Plantilla de CV editable', tipo: 'DOCX' }],
    materialPosterior: [{ nombre: 'Checklist de perfil LinkedIn', tipo: 'PDF' }],
    certificado: true,
    beneficios: ['CV revisado por una gerente de RRHH', 'Certificado de participación', 'Plantillas reutilizables'],
    puntos: 40,
    ponenteId: 'p2',
    faq: [
      { pregunta: '¿Sirve si no tengo experiencia laboral?', respuesta: 'Sí. Buena parte del taller se enfoca justamente en cómo construir un CV sólido a partir de proyectos académicos, TCU y voluntariados.' },
      { pregunta: '¿Los cupos son limitados?', respuesta: 'Sí, son 20 cupos porque el trabajo es individual y personalizado.' },
    ],
    comentarios: [
      { autor: 'Andrea Solís', iniciales: 'AS', texto: 'Me quedan 2 cupos según la app, corran 😅', fecha: enDias(-7) },
    ],
    galeria: ['Participantes trabajando en sus CV', 'Revisión uno a uno'],
    videos: [],
    relacionados: ['e3', 'e6'],
  },
  {
    id: 'e3',
    slug: 'feria-empleo-2026',
    titulo: 'Feria de Empleo Fidélitas 2026',
    resumen: 'Más de 30 empresas reclutando en sitio. Llevá tu CV impreso.',
    descripcion:
      'La feria de empleo más grande de la universidad. Empresas de tecnología, servicios financieros, manufactura y consultoría estarán recibiendo currículums y realizando entrevistas exprés en sitio. Incluye una zona de asesoría de CV y una zona de charlas cortas sobre empleabilidad.',
    objetivos: [
      'Conectar estudiantes con empleadores de forma directa',
      'Facilitar entrevistas exprés en sitio',
      'Dar visibilidad a programas de prácticas profesionales',
    ],
    agenda: [
      { hora: '9:00 a.m.', actividad: 'Apertura de stands' },
      { hora: '10:00 a.m.', actividad: 'Charla: cómo abordar a un reclutador' },
      { hora: '11:00 a.m.', actividad: 'Entrevistas exprés (por cita)' },
      { hora: '2:00 p.m.', actividad: 'Charla: prácticas profesionales' },
      { hora: '4:00 p.m.', actividad: 'Cierre' },
    ],
    fecha: enDias(21),
    hora: '9:00 a.m.',
    horaFin: '4:00 p.m.',
    lugar: 'Plaza Central',
    direccion: 'Campus Heredia, Universidad Fidélitas',
    coords: { lat: 9.9981, lng: -84.1197 },
    modalidad: 'Presencial',
    categoria: 'Feria',
    cupos: 400,
    inscritos: 213,
    organizador: 'Bolsa de Empleo Institucional',
    facultad: 'Vicerrectoría de Vida Estudiantil',
    carrerasRecomendadas: ['Todas las carreras'],
    publicoObjetivo: 'Estudiantes de todos los niveles y personas egresadas.',
    requisitos: ['Carné estudiantil o de egresado', 'CV impreso (recomendado: 10 copias)'],
    recursos: ['CV impreso', 'Vestimenta formal o business casual'],
    materialPrevio: [{ nombre: 'Listado de empresas participantes', tipo: 'PDF' }],
    materialPosterior: [{ nombre: 'Contactos de reclutadores', tipo: 'PDF' }],
    certificado: false,
    beneficios: ['Entrevistas exprés en sitio', 'Contacto directo con más de 30 empresas', 'Asesoría gratuita de CV'],
    puntos: 60,
    ponenteId: 'p2',
    faq: [
      { pregunta: '¿Tengo que registrarme para entrar?', respuesta: 'El registro no es obligatorio para asistir, pero sí para agendar entrevistas exprés.' },
      { pregunta: '¿Puedo ir si ya me gradué?', respuesta: 'Sí, la feria está abierta a personas egresadas de la universidad.' },
    ],
    comentarios: [
      { autor: 'Luis Mora', iniciales: 'LM', texto: 'El año pasado conseguí prácticas ahí. Vale muchísimo la pena.', fecha: enDias(-14) },
    ],
    galeria: ['Stands de empresas', 'Entrevistas en sitio', 'Zona de asesoría de CV'],
    videos: [{ titulo: 'Feria de Empleo 2025 — resumen', duracion: '2:45' }],
    relacionados: ['e2', 'e8'],
  },
  {
    id: 'e4',
    slug: 'webinar-cloud-computing',
    titulo: 'Webinar: Introducción a Cloud Computing',
    resumen: 'Los fundamentos de la nube explicados desde cero, con laboratorio guiado.',
    descripcion:
      'Sesión virtual introductoria sobre computación en la nube: qué es, por qué las empresas migraron, y cuáles son los servicios fundamentales. Incluye un laboratorio guiado donde cada participante despliega su primera aplicación en una cuenta gratuita.',
    objetivos: [
      'Entender los modelos IaaS, PaaS y SaaS',
      'Desplegar una aplicación sencilla en la nube',
      'Conocer las certificaciones cloud más valoradas',
    ],
    agenda: [
      { hora: '6:00 p.m.', actividad: '¿Qué es realmente la nube?' },
      { hora: '6:30 p.m.', actividad: 'Modelos de servicio y despliegue' },
      { hora: '7:00 p.m.', actividad: 'Laboratorio guiado' },
      { hora: '7:45 p.m.', actividad: 'Rutas de certificación y preguntas' },
    ],
    fecha: enDias(26),
    hora: '6:00 p.m.',
    horaFin: '8:00 p.m.',
    lugar: 'Virtual (Zoom)',
    direccion: 'Enlace enviado al correo institucional',
    coords: { lat: 9.9333, lng: -84.0533 },
    modalidad: 'Virtual',
    categoria: 'Webinar',
    cupos: 150,
    inscritos: 92,
    organizador: 'Escuela de Ingeniería de Software',
    facultad: 'Facultad de Ingeniería',
    carrerasRecomendadas: ['Ingeniería de Software', 'Ingeniería en Sistemas'],
    publicoObjetivo: 'Estudiantes con interés en infraestructura, DevOps o desarrollo backend.',
    requisitos: ['Conexión estable a internet', 'Cuenta gratuita del proveedor cloud (se indica al registrarse)'],
    recursos: ['Computadora con navegador', 'Auriculares'],
    materialPrevio: [{ nombre: 'Guía de creación de cuenta gratuita', tipo: 'PDF' }],
    materialPosterior: [
      { nombre: 'Grabación de la sesión', tipo: 'Video' },
      { nombre: 'Repositorio del laboratorio', tipo: 'Enlace' },
    ],
    certificado: true,
    beneficios: ['Certificado digital', 'Grabación disponible por 6 meses', 'Repositorio con el código del laboratorio'],
    puntos: 45,
    ponenteId: 'p3',
    faq: [
      { pregunta: '¿La cuenta cloud tiene costo?', respuesta: 'No. Se usa el nivel gratuito, que es suficiente para el laboratorio.' },
      { pregunta: '¿Queda grabado?', respuesta: 'Sí, la grabación se comparte con las personas registradas.' },
    ],
    comentarios: [],
    galeria: [],
    videos: [{ titulo: 'Adelanto: qué veremos en el laboratorio', duracion: '1:30' }],
    relacionados: ['e7', 'e1'],
  },
  {
    id: 'e5',
    slug: 'hackathon-estudiantil',
    titulo: 'Hackathon Estudiantil Fidélitas',
    resumen: '24 horas para construir una solución. Equipos de 3 a 5 personas. Premios reales.',
    descripcion:
      'Competencia intensiva de desarrollo donde equipos multidisciplinarios construyen una solución funcional a un reto planteado por una empresa aliada. Se evalúa viabilidad técnica, impacto y presentación. Incluye mentorías durante toda la jornada.',
    objetivos: [
      'Aplicar conocimientos técnicos bajo presión de tiempo',
      'Trabajar en equipos multidisciplinarios',
      'Presentar una solución ante un jurado profesional',
    ],
    agenda: [
      { hora: '8:00 a.m.', actividad: 'Apertura y presentación del reto' },
      { hora: '9:00 a.m.', actividad: 'Conformación de equipos e inicio' },
      { hora: '2:00 p.m.', actividad: 'Primera ronda de mentorías' },
      { hora: '8:00 p.m.', actividad: 'Segunda ronda de mentorías' },
      { hora: '8:00 a.m. (día 2)', actividad: 'Cierre de desarrollo' },
      { hora: '10:00 a.m. (día 2)', actividad: 'Presentaciones y premiación' },
    ],
    fecha: enDias(31),
    hora: '8:00 a.m.',
    horaFin: '12:00 m. (día siguiente)',
    lugar: 'Laboratorios de Cómputo',
    direccion: 'Edificio C, Campus San Pedro, Universidad Fidélitas',
    coords: { lat: 9.9330, lng: -84.0537 },
    modalidad: 'Presencial',
    categoria: 'Taller',
    cupos: 60,
    inscritos: 41,
    organizador: 'Club de Programación',
    facultad: 'Facultad de Ingeniería',
    carrerasRecomendadas: ['Ingeniería de Software', 'Diseño', 'Administración de Negocios'],
    publicoObjetivo: 'Estudiantes con ganas de construir. Se buscan perfiles técnicos, de diseño y de negocio.',
    requisitos: ['Computadora portátil', 'Equipo de 3 a 5 personas (se puede formar en sitio)'],
    recursos: ['Portátil y cargador', 'Cambio de ropa', 'Muchas ganas'],
    materialPrevio: [{ nombre: 'Reglamento del hackathon', tipo: 'PDF' }],
    materialPosterior: [{ nombre: 'Repositorios de los equipos', tipo: 'Enlace' }],
    certificado: true,
    beneficios: ['Premios en efectivo y equipo', 'Mentorías con profesionales', 'Visibilidad ante empresas aliadas'],
    puntos: 100,
    ponenteId: 'p4',
    faq: [
      { pregunta: '¿Necesito llevar equipo armado?', respuesta: 'No es obligatorio. Hay una dinámica inicial para formar equipos en sitio.' },
      { pregunta: '¿Se puede dormir ahí?', respuesta: 'Sí, hay una zona de descanso habilitada. Llevá lo necesario.' },
    ],
    comentarios: [
      { autor: 'Kevin Chaves', iniciales: 'KC', texto: 'Busco equipo, soy de diseño UX. ¿Alguien?', fecha: enDias(-6) },
    ],
    galeria: ['Equipos trabajando de madrugada', 'Presentación final', 'Premiación'],
    videos: [{ titulo: 'Hackathon 2025 — aftermovie', duracion: '3:20' }],
    relacionados: ['e1', 'e6'],
  },
  {
    id: 'e6',
    slug: 'conferencia-emprendimiento',
    titulo: 'Conferencia: Emprendimiento Tecnológico',
    resumen: 'De la idea al primer cliente: el camino real de un emprendimiento tech en Costa Rica.',
    descripcion:
      'Conferencia sobre las etapas reales de un emprendimiento tecnológico: validación, MVP, primeros clientes y financiamiento. Con casos concretos de startups nacionales que arrancaron desde la universidad.',
    objetivos: [
      'Entender el proceso de validación de una idea de negocio',
      'Conocer las fuentes de financiamiento disponibles en el país',
      'Aprender a construir un MVP con recursos limitados',
    ],
    agenda: [
      { hora: '3:00 p.m.', actividad: 'Bienvenida' },
      { hora: '3:15 p.m.', actividad: 'El mito de la idea genial' },
      { hora: '4:00 p.m.', actividad: 'Panel: startups que nacieron en la U' },
      { hora: '5:00 p.m.', actividad: 'Financiamiento en Costa Rica' },
      { hora: '5:40 p.m.', actividad: 'Preguntas y cierre' },
    ],
    fecha: enDias(36),
    hora: '3:00 p.m.',
    horaFin: '6:00 p.m.',
    lugar: 'Auditorio Principal',
    direccion: 'Campus San Pedro, Universidad Fidélitas, San José',
    coords: { lat: 9.9333, lng: -84.0533 },
    modalidad: 'Híbrido',
    categoria: 'Conferencia',
    cupos: 120,
    inscritos: 54,
    organizador: 'Centro de Emprendimiento',
    facultad: 'Facultad de Ciencias Económicas',
    carrerasRecomendadas: ['Administración de Negocios', 'Ingeniería de Software', 'Mercadeo'],
    publicoObjetivo: 'Estudiantes con una idea de negocio o con interés en emprender.',
    requisitos: ['Registro previo'],
    recursos: ['Cuaderno para notas'],
    materialPrevio: [{ nombre: 'Lienzo de modelo de negocio (plantilla)', tipo: 'PDF' }],
    materialPosterior: [{ nombre: 'Guía de fondos y programas de apoyo', tipo: 'PDF' }],
    certificado: true,
    beneficios: ['Certificado', 'Acceso a mentoría del Centro de Emprendimiento', 'Contacto con el ecosistema'],
    puntos: 50,
    ponenteId: 'p4',
    faq: [
      { pregunta: '¿Puedo asistir virtualmente?', respuesta: 'Sí, es un evento híbrido. Al registrarte elegís la modalidad.' },
    ],
    comentarios: [],
    galeria: ['Panel de emprendedores'],
    videos: [],
    relacionados: ['e5', 'e1'],
  },
  {
    id: 'e7',
    slug: 'webinar-ciberseguridad',
    titulo: 'Webinar: Ciberseguridad para Todos',
    resumen: 'Protegé tus cuentas, tus datos y tu futuro profesional. Sin tecnicismos.',
    descripcion:
      'Sesión abierta sobre higiene digital y fundamentos de ciberseguridad. Dirigida a cualquier persona, sin importar su carrera. Cubrimos gestión de contraseñas, phishing, redes públicas y protección de la identidad digital.',
    objetivos: [
      'Reconocer intentos de phishing y estafas digitales',
      'Configurar autenticación en dos pasos correctamente',
      'Entender qué carreras existen en ciberseguridad',
    ],
    agenda: [
      { hora: '5:00 p.m.', actividad: 'Las amenazas que sí te van a tocar' },
      { hora: '5:30 p.m.', actividad: 'Contraseñas, 2FA y gestores' },
      { hora: '6:00 p.m.', actividad: 'Demostración: cómo se ve un ataque real' },
      { hora: '6:30 p.m.', actividad: 'Carreras en ciberseguridad y preguntas' },
    ],
    fecha: enDias(43),
    hora: '5:00 p.m.',
    horaFin: '7:00 p.m.',
    lugar: 'Virtual (Teams)',
    direccion: 'Enlace enviado al correo institucional',
    coords: { lat: 9.9333, lng: -84.0533 },
    modalidad: 'Virtual',
    categoria: 'Webinar',
    cupos: 200,
    inscritos: 118,
    organizador: 'Escuela de Ingeniería de Software',
    facultad: 'Facultad de Ingeniería',
    carrerasRecomendadas: ['Todas las carreras'],
    publicoObjetivo: 'Cualquier estudiante. No requiere conocimientos técnicos.',
    requisitos: ['Conexión a internet'],
    recursos: ['Computadora o celular'],
    materialPrevio: [],
    materialPosterior: [
      { nombre: 'Checklist de seguridad personal', tipo: 'PDF' },
      { nombre: 'Grabación de la sesión', tipo: 'Video' },
    ],
    certificado: true,
    beneficios: ['Certificado digital', 'Checklist de seguridad aplicable de inmediato'],
    puntos: 35,
    ponenteId: 'p5',
    faq: [
      { pregunta: '¿Es muy técnico?', respuesta: 'No. Está diseñado explícitamente para audiencia general.' },
    ],
    comentarios: [],
    galeria: [],
    videos: [],
    relacionados: ['e4', 'e1'],
  },
  {
    id: 'e8',
    slug: 'feria-emprendimiento',
    titulo: 'Feria de Emprendimiento Estudiantil',
    resumen: 'Los proyectos de estudiantes salen a la luz. Vení a ver, comprar y conectar.',
    descripcion:
      'Espacio donde estudiantes emprendedores exhiben sus productos y servicios. Hay stands de comida, tecnología, diseño, moda y servicios. Incluye una ronda de pitch ante inversionistas ángeles del ecosistema local.',
    objetivos: [
      'Dar visibilidad a los emprendimientos estudiantiles',
      'Conectar emprendedores con posibles inversionistas',
      'Fomentar la cultura emprendedora en el campus',
    ],
    agenda: [
      { hora: '10:00 a.m.', actividad: 'Apertura de stands' },
      { hora: '1:00 p.m.', actividad: 'Ronda de pitch' },
      { hora: '3:00 p.m.', actividad: 'Premiación al mejor emprendimiento' },
      { hora: '4:00 p.m.', actividad: 'Cierre' },
    ],
    fecha: enDias(49),
    hora: '10:00 a.m.',
    horaFin: '4:00 p.m.',
    lugar: 'Plaza Central',
    direccion: 'Campus Heredia, Universidad Fidélitas',
    coords: { lat: 9.9981, lng: -84.1197 },
    modalidad: 'Presencial',
    categoria: 'Feria',
    cupos: 300,
    inscritos: 87,
    organizador: 'Centro de Emprendimiento',
    facultad: 'Facultad de Ciencias Económicas',
    carrerasRecomendadas: ['Todas las carreras'],
    publicoObjetivo: 'Toda la comunidad universitaria y público general.',
    requisitos: ['Ninguno para asistir. Para exponer: postulación previa.'],
    recursos: [],
    materialPrevio: [{ nombre: 'Formulario para exponer', tipo: 'Enlace' }],
    materialPosterior: [],
    certificado: false,
    beneficios: ['Contacto con inversionistas ángeles', 'Visibilidad para tu emprendimiento', 'Premio al mejor proyecto'],
    puntos: 40,
    ponenteId: 'p4',
    faq: [
      { pregunta: '¿Puedo poner un stand?', respuesta: 'Sí, mediante postulación previa. El formulario está en el material previo.' },
    ],
    comentarios: [],
    galeria: ['Stands estudiantiles', 'Ronda de pitch'],
    videos: [],
    relacionados: ['e6', 'e3'],
  },
];

export function getEvento(idOrSlug: string) {
  return eventos.find((e) => e.id === idOrSlug || e.slug === idOrSlug);
}

export const coloresCategoria: Record<string, string> = {
  Conferencia: 'bg-[#2B6477]/10 text-[#2B6477]',
  Taller: 'bg-[#5B8C9E]/15 text-[#3d5f6b]',
  Feria: 'bg-[#D9A441]/15 text-[#8a6417]',
  Webinar: 'bg-[#7FB3C7]/20 text-[#3d6b7d]',
};

export const dotCategoria: Record<string, string> = {
  Conferencia: '#2B6477',
  Taller: '#5B8C9E',
  Feria: '#D9A441',
  Webinar: '#7FB3C7',
};

export const asesoresProyecto = [
  { nombre: 'Ricardo Solano', rol: 'Asesor de TCU', iniciales: 'RS' },
  { nombre: 'Marta López', rol: 'Asesora de Tesis', iniciales: 'ML' },
];
