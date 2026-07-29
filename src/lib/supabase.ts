import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos básicos del modelo de datos (capa real: TCU)
export type Perfil = {
  id: string;
  nombre: string;
  correo: string;
  carrera: string | null;
  cuatrimestre: string | null;
  avance_carrera: number;
  puntos: number;
  racha_checkin: number;
  ultimo_checkin: string | null;
  racha_objetivos: number;
  avatar_url: string | null;
};

export type Amistad = {
  id: string;
  usuario_id: string;
  amigo_id: string;
  estado: 'pendiente' | 'aceptada';
  creado_en: string;
};

export type Notificacion = {
  id: string;
  usuario_id: string;
  icono: string;
  texto: string;
  sub: string | null;
  tipo: 'solicitud_amistad' | 'logro_amigo' | 'evento_habilitado' | 'general';
  referencia_id: string | null;
  leida: boolean;
  creado_en: string;
};

export type Historia = {
  id: string;
  usuario_id: string;
  actividad_id: string;
  foto_url: string;
  creado_en: string;
};

export type ObjetivoEstado = {
  id: string;
  usuario_id: string;
  objetivo_id: string;
  hecho: boolean;
};

export type TutoriaInscripcion = {
  id: string;
  usuario_id: string;
  tutoria_id: string;
  estado: 'agendada' | 'contactado';
};

export type Inscripcion = {
  id: string;
  usuario_id: string;
  item_id: string;
  item_tipo: 'evento' | 'vida' | 'oportunidad' | 'beneficio';
  creado_en: string;
};

export type TcuProceso = {
  id: string;
  usuario_id: string;
  horas_completadas: number;
  horas_requeridas: number;
  etapa_actual: string;
  periodo: string;
};

export type TcuEtapa = {
  id: string;
  usuario_id: string;
  nombre: string;
  orden: number;
  estado: 'completada' | 'actual' | 'pendiente';
};

export type TcuBitacora = {
  id: string;
  usuario_id: string;
  fecha: string;
  horas: number;
  descripcion: string;
  estado: 'registrada' | 'aprobada' | 'pendiente';
};

export type TcuDocumento = {
  id: string;
  usuario_id: string;
  nombre: string;
  estado: 'entregado' | 'pendiente';
  fecha_limite: string;
};

export type Recordatorio = {
  id: string;
  usuario_id: string;
  tipo: 'tcu' | 'tesis';
  titulo: string;
  fecha_limite: string | null;
  prioridad: 'alta' | 'media' | 'baja';
  estado: 'pendiente' | 'listo';
};
