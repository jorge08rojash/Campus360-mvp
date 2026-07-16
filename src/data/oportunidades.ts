export type Practica = {
  id: string; empresa: string; logo: string; area: string; requisitos: string[];
  horario: string; duracion: string; beneficios: string[]; tutorEmpresarial: string;
  tutorUniversitario: string; modalidad: string; plazas: number;
};

export const practicas: Practica[] = [
  { id: 'pr1', empresa: 'NimbusTech', logo: 'NT', area: 'Desarrollo de Software', requisitos: ['Cursando últimos 2 cuatrimestres', 'Conocimientos de programación web'], horario: 'Lun–Vie, 8am–1pm', duracion: '4 meses', beneficios: ['Viáticos de transporte', 'Certificado oficial', 'Posible contratación'], tutorEmpresarial: 'Ing. Laura Chaves', tutorUniversitario: 'Ing. K. Alvarado', modalidad: 'Híbrido', plazas: 3 },
  { id: 'pr2', empresa: 'Grupo Financiero Aliado', logo: 'GF', area: 'Análisis de Datos', requisitos: ['Cursando carreras de Ingeniería o Economía', 'Excel intermedio'], horario: 'Lun–Vie, 1pm–6pm', duracion: '6 meses', beneficios: ['Almuerzo incluido', 'Aguinaldo proporcional'], tutorEmpresarial: 'Lic. Marco Salas', tutorUniversitario: 'Ing. C. Vargas', modalidad: 'Presencial', plazas: 2 },
  { id: 'pr3', empresa: 'CloudWorks CR', logo: 'CW', area: 'Infraestructura Cloud', requisitos: ['Conocimientos básicos de Linux', 'Inglés intermedio'], horario: 'Flexible', duracion: '3 meses', beneficios: ['Pago en dólares', '100% remoto'], tutorEmpresarial: 'Ing. Pablo Rojas', tutorUniversitario: 'Ing. D. Fernández', modalidad: 'Remoto', plazas: 4 },
  { id: 'pr4', empresa: 'Estudio Creativo Norte', logo: 'CN', area: 'Diseño y Marketing', requisitos: ['Portafolio básico de diseño'], horario: 'Lun–Vie, 9am–1pm', duracion: '4 meses', beneficios: ['Certificado', 'Mentoría de diseño'], tutorEmpresarial: 'Dis. Valeria Núñez', tutorUniversitario: 'Lic. P. Rojas', modalidad: 'Remoto', plazas: 2 },
];

export type Beca = {
  id: string; nombre: string; organizacion: string; pais: string; cobertura: string;
  requisitos: string[]; fechaLimite: string; proceso: string[]; documentos: string[];
  beneficios: string[]; carreras: string[]; nivel: string; idioma: string;
};

export const becas: Beca[] = [
  { id: 'b1', nombre: 'Beca de Excelencia Académica Fidélitas', organizacion: 'Universidad Fidélitas', pais: 'Costa Rica', cobertura: '50% de matrícula', requisitos: ['Promedio mínimo 90', 'Ser estudiante activo'], fechaLimite: '2026-07-31', proceso: ['Solicitud en línea', 'Revisión de expediente', 'Notificación de resultados'], documentos: ['Constancia de notas', 'Carta de motivación'], beneficios: ['Descuento en matrícula', 'Reconocimiento institucional'], carreras: ['Todas las carreras'], nivel: 'Pregrado', idioma: 'Español' },
  { id: 'b2', nombre: 'Beca Fulbright Costa Rica', organizacion: 'Comisión Fulbright', pais: 'Estados Unidos', cobertura: 'Completa (matrícula, vuelos, manutención)', requisitos: ['Promedio mínimo 85', 'Nivel de inglés avanzado (TOEFL)', 'Ser costarricense'], fechaLimite: '2026-09-15', proceso: ['Postulación en línea', 'Entrevista', 'Examen TOEFL', 'Comité de selección'], documentos: ['Ensayo personal', 'Cartas de recomendación', 'Certificado TOEFL'], beneficios: ['Estudios de posgrado en EE.UU.', 'Red de exalumnos global'], carreras: ['Todas las carreras'], nivel: 'Posgrado', idioma: 'Inglés' },
  { id: 'b3', nombre: 'Beca DAAD Alemania', organizacion: 'Servicio Alemán de Intercambio Académico', pais: 'Alemania', cobertura: 'Matrícula + estipendio mensual', requisitos: ['Promedio mínimo 80', 'Nivel de alemán o inglés certificado'], fechaLimite: '2026-10-01', proceso: ['Postulación en línea', 'Carta de aceptación de universidad alemana', 'Entrevista'], documentos: ['CV académico', 'Carta de motivación', 'Certificado de idioma'], beneficios: ['Estudios en Alemania', 'Seguro médico incluido'], carreras: ['Ingeniería de Software', 'Ingeniería Industrial'], nivel: 'Posgrado', idioma: 'Inglés / Alemán' },
  { id: 'b4', nombre: 'Beca Santander Universidades', organizacion: 'Banco Santander', pais: 'España', cobertura: '€3.000 de apoyo económico', requisitos: ['Ser estudiante activo de últimos cuatrimestres', 'Promedio mínimo 80'], fechaLimite: '2026-08-20', proceso: ['Registro en plataforma Santander', 'Postulación', 'Selección'], documentos: ['Constancia de notas', 'CV'], beneficios: ['Apoyo económico', 'Certificado internacional'], carreras: ['Todas las carreras'], nivel: 'Pregrado', idioma: 'Español' },
];

export type Intercambio = {
  id: string; universidad: string; pais: string; convenios: string; carreras: string[];
  requisitos: string[]; costos: string; becasDisponibles: string; calendario: string;
  testimonio: string;
};

export const intercambios: Intercambio[] = [
  { id: 'i1', universidad: 'Universidad Complutense de Madrid', pais: 'España', convenios: 'Convenio marco de doble titulación', carreras: ['Administración de Negocios', 'Ingeniería de Software'], requisitos: ['Promedio mínimo 80', 'Cursando al menos el V cuatrimestre'], costos: 'Solo matrícula en Fidélitas; hospedaje por cuenta propia', becasDisponibles: 'Beca Santander (parcial)', calendario: 'Aplicación: marzo · Movilidad: agosto–diciembre', testimonio: '"Fue la mejor decisión académica que tomé. Volví con una visión totalmente distinta de mi carrera." — Egresada 2025' },
  { id: 'i2', universidad: 'Tecnológico de Monterrey', pais: 'México', convenios: 'Convenio de movilidad estudiantil', carreras: ['Todas las carreras'], requisitos: ['Promedio mínimo 82', 'Carta de motivación'], costos: 'Matrícula equivalente en Fidélitas', becasDisponibles: 'Beca parcial institucional', calendario: 'Aplicación: enero y julio · Movilidad: 1 cuatrimestre', testimonio: '"El nivel académico es altísimo, pero el acompañamiento de ambas universidades hace la diferencia." — Estudiante de intercambio 2025' },
  { id: 'i3', universidad: 'Universidad de Bolonia', pais: 'Italia', convenios: 'Convenio Erasmus+', carreras: ['Administración de Negocios'], requisitos: ['Nivel de inglés o italiano intermedio', 'Promedio mínimo 85'], costos: 'Cubierto por fondo Erasmus+', becasDisponibles: 'Beca Erasmus+ completa', calendario: 'Aplicación: febrero · Movilidad: septiembre–enero', testimonio: '"Estudiar en la universidad más antigua de Europa fue surreal." — Egresado 2024' },
];

export type Certificacion = {
  id: string; nombre: string; proveedor: string; nivel: string; tiempo: string;
  costo: string; modalidad: string; competencias: string[]; valorMercado: string;
};

export const certificaciones: Certificacion[] = [
  { id: 'c1', nombre: 'AWS Certified Cloud Practitioner', proveedor: 'Amazon Web Services', nivel: 'Fundamentos', tiempo: '4–6 semanas', costo: '$100 USD', modalidad: 'Virtual', competencias: ['Fundamentos de cloud', 'Modelos de precios AWS', 'Seguridad básica'], valorMercado: 'Alta demanda en roles de infraestructura y DevOps junior.' },
  { id: 'c2', nombre: 'Google Data Analytics', proveedor: 'Google', nivel: 'Fundamentos', tiempo: '3–6 meses', costo: '$49 USD/mes', modalidad: 'Virtual', competencias: ['SQL', 'Visualización de datos', 'Análisis exploratorio'], valorMercado: 'Muy valorada para posiciones de analista de datos junior.' },
  { id: 'c3', nombre: 'Scrum Master Certified (SMC)', proveedor: 'SCRUMstudy', nivel: 'Intermedio', tiempo: '2–3 semanas', costo: '$300 USD', modalidad: 'Virtual', competencias: ['Metodologías ágiles', 'Gestión de equipos', 'Scrum'], valorMercado: 'Requerida en roles de coordinación de proyectos de TI.' },
  { id: 'c4', nombre: 'Microsoft Certified: Azure Fundamentals', proveedor: 'Microsoft', nivel: 'Fundamentos', tiempo: '3–4 semanas', costo: '$99 USD', modalidad: 'Virtual', competencias: ['Servicios cloud de Azure', 'Seguridad y cumplimiento'], valorMercado: 'Buen punto de entrada a roles cloud en empresas que usan Microsoft.' },
  { id: 'c5', nombre: 'PMP — Project Management Professional', proveedor: 'PMI', nivel: 'Avanzado', tiempo: '4–6 meses', costo: '$555 USD', modalidad: 'Virtual/Presencial', competencias: ['Gestión de proyectos', 'PMBOK', 'Liderazgo de equipos'], valorMercado: 'Certificación de alto prestigio para roles de gerencia de proyectos.' },
  { id: 'c6', nombre: 'Meta Front-End Developer', proveedor: 'Meta', nivel: 'Intermedio', tiempo: '5–7 meses', costo: '$49 USD/mes', modalidad: 'Virtual', competencias: ['React', 'JavaScript', 'UX/UI básico'], valorMercado: 'Muy reconocida para posiciones de desarrollo frontend junior.' },
];

export type Persona = {
  id: string; nombre: string; iniciales: string; rol: 'Estudiante' | 'Profesor' | 'Egresado' | 'Investigador' | 'Empresa';
  carreraOArea: string; bio: string; intereses: string[];
};

export const personasNetworking: Persona[] = [
  { id: 'n1', nombre: 'Camila Rodríguez', iniciales: 'CR', rol: 'Estudiante', carreraOArea: 'Ingeniería de Software · VII cuatrimestre', bio: 'Interesada en desarrollo frontend y diseño de producto.', intereses: ['React', 'UX/UI', 'Hackathons'] },
  { id: 'n2', nombre: 'Ing. Fernanda Ulloa', iniciales: 'FU', rol: 'Profesor', carreraOArea: 'Escuela de Ingeniería de Software', bio: 'Docente de Arquitectura de Software, investigadora en sistemas distribuidos.', intereses: ['Arquitectura de software', 'Cloud', 'Investigación aplicada'] },
  { id: 'n3', nombre: 'Gabriel Monge', iniciales: 'GM', rol: 'Egresado', carreraOArea: 'Ingeniería de Software · Clase 2023', bio: 'Actualmente Senior Developer en una fintech regional. Abierto a mentorías.', intereses: ['Mentoría', 'Fintech', 'Backend'] },
  { id: 'n4', nombre: 'Dra. Patricia Solano', iniciales: 'PS', rol: 'Investigador', carreraOArea: 'Centro de Investigación en IA', bio: 'Investigadora en procesamiento de lenguaje natural aplicado a español latinoamericano.', intereses: ['NLP', 'IA aplicada', 'Publicaciones académicas'] },
  { id: 'n5', nombre: 'NimbusTech', iniciales: 'NT', rol: 'Empresa', carreraOArea: 'Software · SaaS financiero', bio: 'Buscamos activamente talento junior en frontend y backend.', intereses: ['Reclutamiento', 'Prácticas profesionales', 'React'] },
  { id: 'n6', nombre: 'Valeria Méndez', iniciales: 'VM', rol: 'Estudiante', carreraOArea: 'Administración de Negocios · V cuatrimestre', bio: 'Enfocada en emprendimiento y marketing digital.', intereses: ['Emprendimiento', 'Marketing', 'Redes sociales'] },
];
