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
