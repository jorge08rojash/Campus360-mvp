export const matriculaInfo = {
  periodoActual: 'III Cuatrimestre 2026', fechaApertura: '2026-08-10', fechaCierre: '2026-08-24',
  creditosMatriculados: 12, estado: 'Al día',
  pasos: ['Verificar prerrequisitos aprobados', 'Seleccionar materias en el sistema', 'Confirmar horarios sin cruces', 'Realizar el pago o aplicar beca', 'Descargar comprobante de matrícula'],
};

export const pagosInfo = {
  saldoPendiente: 0, ultimoPago: { monto: '₡485.000', fecha: '2026-06-15', concepto: 'Matrícula II Cuatrimestre 2026' },
  metodosDisponibles: ['Tarjeta de crédito/débito', 'Transferencia bancaria', 'Pago en ventanilla', 'Convenio con empresa'],
  historial: [
    { concepto: 'Matrícula II Cuatrimestre 2026', monto: '₡485.000', fecha: '2026-06-15', estado: 'Pagado' },
    { concepto: 'Matrícula I Cuatrimestre 2026', monto: '₡485.000', fecha: '2026-02-10', estado: 'Pagado' },
    { concepto: 'Carné estudiantil', monto: '₡5.000', fecha: '2026-01-15', estado: 'Pagado' },
  ],
};

export const bibliotecaInfo = {
  librosPrestados: 2, limitePrestamos: 5,
  prestamos: [
    { titulo: 'Clean Architecture', autor: 'Robert C. Martin', vence: '2026-07-20' },
    { titulo: 'Fundamentos de Bases de Datos', autor: 'Silberschatz', vence: '2026-07-25' },
  ],
  recursos: ['Bases de datos académicas (EBSCO, IEEE)', 'Salas de estudio grupal', 'Préstamo de laptops', 'Servicio de impresión'],
};

export const carneInfo = { numero: 'FID-2024-08432', estado: 'Vigente', vence: '2026-12-31', tipo: 'Estudiante regular' };

export const historialAcademico = [
  { cuatrimestre: 'I 2025', creditos: 15, promedio: 89.2 },
  { cuatrimestre: 'II 2025', creditos: 15, promedio: 90.5 },
  { cuatrimestre: 'I 2026', creditos: 12, promedio: 93.1 },
  { cuatrimestre: 'II 2026', creditos: 12, promedio: 91.6 },
];

export const certificacionesOficiales = [
  { nombre: 'Constancia de estudiante activo', tiempo: 'Inmediata (digital)' },
  { nombre: 'Historial académico oficial', tiempo: '2 días hábiles' },
  { nombre: 'Certificación de créditos aprobados', tiempo: '2 días hábiles' },
  { nombre: 'Carta de buena conducta', tiempo: '3 días hábiles' },
];

export const tramitesDisponibles = [
  { nombre: 'Solicitud de constancia', area: 'Registro' },
  { nombre: 'Cambio de carrera', area: 'Registro' },
  { nombre: 'Retiro justificado de materia', area: 'Registro' },
  { nombre: 'Solicitud de beca socioeconómica', area: 'Bienestar Estudiantil' },
  { nombre: 'Reposición de carné', area: 'Servicios Generales' },
  { nombre: 'Convalidación de materias', area: 'Registro' },
];

export const reglamentosInstitucionales = [
  { nombre: 'Reglamento Estudiantil General' },
  { nombre: 'Reglamento de Trabajos Finales de Graduación' },
  { nombre: 'Reglamento de Trabajo Comunal Universitario' },
  { nombre: 'Reglamento de Becas y Ayudas Económicas' },
  { nombre: 'Código de Ética Institucional' },
];
