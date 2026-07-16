export const tesisChecklistPorEtapa: Record<string, string[]> = {
  et1: ['Definir tema tentativo', 'Revisar antecedentes similares', 'Redactar planteamiento del problema', 'Presentar anteproyecto al comité'],
  et2: ['Recopilar al menos 25 fuentes académicas', 'Organizar por categorías temáticas', 'Redactar primer borrador', 'Revisión de citas APA 7'],
  et3: ['Definir enfoque (cualitativo/cuantitativo/mixto)', 'Diseñar instrumentos de recolección', 'Validar instrumentos con el tutor', 'Definir plan de análisis'],
  et4: ['Ejecutar recolección de datos', 'Procesar y analizar resultados', 'Redactar capítulo de resultados', 'Redactar conclusiones y recomendaciones'],
  et5: ['Entregar documento final al tribunal', 'Preparar presentación de defensa', 'Ensayo de defensa con el tutor', 'Defensa formal'],
};

export const tesisPlantillas = [
  { nombre: 'Plantilla de anteproyecto', tipo: 'DOCX' },
  { nombre: 'Plantilla de documento final (formato institucional)', tipo: 'DOCX' },
  { nombre: 'Plantilla de presentación de defensa', tipo: 'PPTX' },
  { nombre: 'Guía de Normas APA 7 resumida', tipo: 'PDF' },
];

export const tesisEjemplos = [
  { nombre: 'Tesis destacada — Ingeniería de Software (2025)', area: 'Ingeniería de Software' },
  { nombre: 'Tesis destacada — Administración de Negocios (2025)', area: 'Administración de Negocios' },
  { nombre: 'Tesis destacada — Mercadeo (2024)', area: 'Mercadeo' },
];

export const tesisManuales = [
  { nombre: 'Manual de Trabajos Finales de Graduación', descripcion: 'Documento oficial con los lineamientos completos del proceso de TFG.' },
  { nombre: 'Guía de citación y referencias APA 7', descripcion: 'Estandarización de citas, tablas, figuras y bibliografía.' },
  { nombre: 'Guía de redacción académica', descripcion: 'Recomendaciones de estilo y claridad para el documento final.' },
];

export const tesisFaq = [
  { pregunta: '¿Cuándo debo inscribir el anteproyecto de tesis?', respuesta: 'Se recomienda inscribirlo al iniciar el penúltimo cuatrimestre de la carrera, según el reglamento de TFG.' },
  { pregunta: '¿Puedo cambiar de tutor de tesis?', respuesta: 'Sí, mediante solicitud formal a la coordinación de TFG, justificando el motivo del cambio.' },
  { pregunta: '¿Cuántas revisiones tiene el documento final?', respuesta: 'El proceso contempla hasta 3 rondas de revisión con el tutor antes de la entrega final.' },
  { pregunta: '¿Qué pasa si no defiendo en el periodo inscrito?', respuesta: 'Se reprograma para el siguiente periodo, sin costo adicional si la causa está justificada.' },
];

export const tesisReuniones = [
  { id: 're1', titulo: 'Revisión de metodología', fecha: '2026-07-18', hora: '3:00pm', modalidad: 'Virtual' },
  { id: 're2', titulo: 'Avance de instrumentos de recolección', fecha: '2026-08-01', hora: '2:00pm', modalidad: 'Presencial' },
];

export const tutorTesis = { nombre: 'Ing. Kevin Alvarado', correo: 'kalvarado@ufidelitas.ac.cr', especialidad: 'Ingeniería de Software' };
