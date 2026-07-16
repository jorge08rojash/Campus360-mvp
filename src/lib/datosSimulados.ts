// Datos de ejemplo fijos para las pantallas SIMULADAS del MVP.
// No vienen de Supabase — sirven para que la app se sienta completa y navegable.

export const tutoresEjemplo = [
  { id: 't1', foto_url: '/fotos/tutores/tutor-t1.jpg', nombre: 'Prof. Laura Jiménez', materia: 'Estructuras de Datos', modalidad: 'Virtual', horario: 'Lunes y Miércoles, 3:00pm - 5:00pm', rating: 4.8, reseñas: 32, foto: 'LJ', tipo: 'Institucional' },
  { id: 't2', foto_url: '/fotos/tutores/tutor-t2.jpg', nombre: 'Ing. Carlos Vargas', materia: 'Bases de Datos', modalidad: 'Presencial (San Pedro)', horario: 'Martes y Jueves, 10:00am - 12:00pm', rating: 4.6, reseñas: 21, foto: 'CV', tipo: 'Gratuita' },
  { id: 't3', foto_url: '/fotos/tutores/tutor-t3.jpg', nombre: 'Lic. Mariana Solano', materia: 'Cálculo Diferencial', modalidad: 'Virtual', horario: 'Viernes, 2:00pm - 6:00pm', rating: 4.9, reseñas: 47, foto: 'MS', tipo: 'Institucional' },
  { id: 't4', foto_url: '/fotos/tutores/tutor-t4.jpg', nombre: 'Ing. Diego Fernández', materia: 'Programación Orientada a Objetos', modalidad: 'Presencial (Heredia)', horario: 'Lunes a Viernes, 8:00am - 9:00am', rating: 4.7, reseñas: 18, foto: 'DF', tipo: 'Gratuita' },
  { id: 't5', foto_url: '/fotos/tutores/tutor-t5.jpg', nombre: 'Lic. Ana Gómez', materia: 'Estadística', modalidad: 'Virtual', horario: 'Miércoles, 4:00pm - 7:00pm', rating: 4.5, reseñas: 15, foto: 'AG', tipo: 'Premium' },
  { id: 't6', foto_url: '/fotos/tutores/tutor-t6.jpg', nombre: 'Ing. Roberto Castro', materia: 'Redes de Computadoras', modalidad: 'Presencial (San Pedro)', horario: 'Sábados, 8:00am - 12:00m', rating: 4.4, reseñas: 12, foto: 'RC', tipo: 'Institucional' },
  { id: 't7', foto_url: '/fotos/tutores/tutor-t7.jpg', nombre: 'Lic. Paola Rojas', materia: 'Inglés Técnico', modalidad: 'Virtual', horario: 'Martes y Jueves, 6:00pm - 8:00pm', rating: 4.9, reseñas: 54, foto: 'PR', tipo: 'Gratuita' },
  { id: 't8', foto_url: '/fotos/tutores/tutor-t8.jpg', nombre: 'Ing. Kevin Alvarado', materia: 'Ingeniería de Software', modalidad: 'Virtual', horario: 'Lunes, 9:00am - 12:00m', rating: 4.6, reseñas: 27, foto: 'KA', tipo: 'Premium' },
];

export const eventosEjemplo = [
  { id: 'e1', titulo: 'Charla: Inteligencia Artificial en la Industria', fecha: '2026-07-22', hora: '4:00pm', lugar: 'Auditorio Principal, San Pedro', categoria: 'Conferencia', cupos: 45 },
  { id: 'e2', titulo: 'Taller de Currículum y LinkedIn', fecha: '2026-07-25', hora: '10:00am', lugar: 'Sala de Innovación', categoria: 'Taller', cupos: 20 },
  { id: 'e3', titulo: 'Feria de Empleo Fidélitas 2026', fecha: '2026-08-05', hora: '9:00am', lugar: 'Plaza Central, Campus Heredia', categoria: 'Feria', cupos: 200 },
  { id: 'e4', titulo: 'Webinar: Introducción a Cloud Computing', fecha: '2026-08-10', hora: '6:00pm', lugar: 'Virtual (Zoom)', categoria: 'Webinar', cupos: 100 },
  { id: 'e5', titulo: 'Hackathon Estudiantil Fidélitas', fecha: '2026-08-15', hora: '8:00am', lugar: 'Campus San Pedro', categoria: 'Taller', cupos: 60 },
  { id: 'e6', titulo: 'Conferencia: Emprendimiento Tecnológico', fecha: '2026-08-20', hora: '3:00pm', lugar: 'Auditorio Principal', categoria: 'Conferencia', cupos: 80 },
  { id: 'e7', titulo: 'Webinar: Ciberseguridad para Todos', fecha: '2026-08-27', hora: '5:00pm', lugar: 'Virtual (Teams)', categoria: 'Webinar', cupos: 150 },
  { id: 'e8', titulo: 'Feria de Emprendimiento Estudiantil', fecha: '2026-09-02', hora: '10:00am', lugar: 'Plaza Central, Campus Heredia', categoria: 'Feria', cupos: 120 },
];

export const etapasTesisEjemplo = [
  { id: 'et1', nombre: 'Selección de tema y anteproyecto', estado: 'completada', descripcion: 'Definición del tema de investigación y aprobación del anteproyecto por el comité académico.' },
  { id: 'et2', nombre: 'Marco teórico', estado: 'completada', descripcion: 'Investigación bibliográfica y redacción del marco teórico que sustenta el trabajo.' },
  { id: 'et3', nombre: 'Metodología', estado: 'actual', descripcion: 'Definición del enfoque metodológico, instrumentos de recolección de datos y plan de análisis.' },
  { id: 'et4', nombre: 'Desarrollo y resultados', estado: 'pendiente', descripcion: 'Ejecución del proyecto, recolección y análisis de resultados.' },
  { id: 'et5', nombre: 'Defensa final', estado: 'pendiente', descripcion: 'Presentación y defensa del trabajo final de graduación ante el tribunal evaluador.' },
];

export const faqTesisEjemplo = [
  { pregunta: '¿Cuándo debo inscribir el anteproyecto de tesis?', respuesta: 'Se recomienda inscribirlo al iniciar el penúltimo cuatrimestre de la carrera, según el reglamento de TFG.' },
  { pregunta: '¿Puedo cambiar de tutor de tesis?', respuesta: 'Sí, mediante solicitud formal a la coordinación de TFG, justificando el motivo del cambio.' },
  { pregunta: '¿Cuántas revisiones tiene el documento final?', respuesta: 'El proceso contempla hasta 3 rondas de revisión con el tutor antes de la entrega final.' },
  { pregunta: '¿Qué pasa si no defiendo en el periodo inscrito?', respuesta: 'Se reprograma para el siguiente periodo, sin costo adicional si la causa está justificada.' },
];

export const notificacionesEjemplo = [
  { id: 'n1', titulo: 'Nueva fecha límite para becas socioeconómicas', fecha: '2026-07-12', categoria: 'Administrativo' },
  { id: 'n2', titulo: 'Cambio de aula: Programación II ahora en B-204', fecha: '2026-07-11', categoria: 'Académico' },
  { id: 'n3', titulo: 'Abren inscripciones para intercambio 2027', fecha: '2026-07-10', categoria: 'Oportunidad' },
  { id: 'n4', titulo: 'Mantenimiento de plataforma académica este fin de semana', fecha: '2026-07-09', categoria: 'Sistema' },
];

export const materiasEjemplo = [
  'Cálculo III', 'Bases de Datos', 'Estructuras de Datos', 'Programación Orientada a Objetos',
  'Redes de Computadoras', 'Estadística', 'Inglés Técnico', 'Ingeniería de Software',
];

export const centroAdminEjemplo = [
  { id: 'ca1', titulo: 'Becas socioeconómicas 2026-III', tipo: 'Becas', fechaLimite: '2026-07-31' },
  { id: 'ca2', titulo: 'Proceso de matrícula ordinaria', tipo: 'Matrícula', fechaLimite: '2026-08-10' },
  { id: 'ca3', titulo: 'Solicitud de constancias y certificados', tipo: 'Trámites', fechaLimite: null },
  { id: 'ca4', titulo: 'Horario de atención: Tesorería y Financiero', tipo: 'Horarios', fechaLimite: null },
];
