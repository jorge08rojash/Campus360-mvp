// Capa de acceso a Supabase para las funciones sociales/gamificadas de la
// app móvil: amigos, notificaciones, historias, objetivos y tutorías.
// Usa el mismo cliente (src/lib/supabase.ts) que ya lee NEXT_PUBLIC_SUPABASE_URL
// y NEXT_PUBLIC_SUPABASE_ANON_KEY del entorno — nada de credenciales nuevas aquí.

import { supabase, Perfil, Amistad, Notificacion, ObjetivoEstado, TutoriaInscripcion, Inscripcion } from './supabase';

export type Amigo = Perfil;

export async function sumarPuntos(usuarioId: string, delta: number, puntosActuales: number) {
  const nuevos = Math.max(0, puntosActuales + delta);
  await supabase.from('perfiles').update({ puntos: nuevos }).eq('id', usuarioId);
  return nuevos;
}

export async function hacerCheckin(usuario: Perfil) {
  const hoy = new Date().toISOString().slice(0, 10);
  if (usuario.ultimo_checkin === hoy) return null;
  const racha = usuario.racha_checkin + 1;
  const puntos = usuario.puntos + 15;
  const { data } = await supabase
    .from('perfiles')
    .update({ racha_checkin: racha, ultimo_checkin: hoy, puntos })
    .eq('id', usuario.id)
    .select()
    .single();
  return data as Perfil | null;
}

// ---------- Amigos ----------

export async function listarAmigos(usuarioId: string): Promise<Amigo[]> {
  const { data } = await supabase
    .from('amistades')
    .select('usuario_id, amigo_id, perfil_usuario:usuario_id(*), perfil_amigo:amigo_id(*)')
    .eq('estado', 'aceptada')
    .or(`usuario_id.eq.${usuarioId},amigo_id.eq.${usuarioId}`);
  if (!data) return [];
  return data
    .map((row) => {
      const r = row as unknown as { usuario_id: string; perfil_usuario: Perfil; perfil_amigo: Perfil };
      return r.usuario_id === usuarioId ? r.perfil_amigo : r.perfil_usuario;
    })
    .filter(Boolean);
}

export async function listarSolicitudesRecibidas(usuarioId: string): Promise<(Amistad & { perfil: Perfil })[]> {
  const { data } = await supabase
    .from('amistades')
    .select('*, perfil:usuario_id(*)')
    .eq('estado', 'pendiente')
    .eq('amigo_id', usuarioId);
  return (data as unknown as (Amistad & { perfil: Perfil })[]) || [];
}

export async function listarSolicitudesEnviadas(usuarioId: string): Promise<(Amistad & { perfil: Perfil })[]> {
  const { data } = await supabase
    .from('amistades')
    .select('*, perfil:amigo_id(*)')
    .eq('estado', 'pendiente')
    .eq('usuario_id', usuarioId);
  return (data as unknown as (Amistad & { perfil: Perfil })[]) || [];
}

export async function enviarSolicitudAmistad(usuarioId: string, correo: string) {
  const correoNorm = correo.trim().toLowerCase();
  if (!correoNorm) return { ok: false as const, mensaje: 'Escribí un correo institucional.' };

  const { data: destino } = await supabase.from('perfiles').select('*').eq('correo', correoNorm).maybeSingle();
  if (!destino) return { ok: false as const, mensaje: 'No encontramos a nadie con ese correo institucional.' };
  if (destino.id === usuarioId) return { ok: false as const, mensaje: 'Ese sos vos 🙂' };

  const { data: existentes } = await supabase
    .from('amistades')
    .select('*')
    .or(`and(usuario_id.eq.${usuarioId},amigo_id.eq.${destino.id}),and(usuario_id.eq.${destino.id},amigo_id.eq.${usuarioId})`);

  const previa = (existentes || [])[0] as Amistad | undefined;
  if (previa?.estado === 'aceptada') return { ok: false as const, mensaje: 'Ya son amigos 🎉' };
  if (previa && previa.usuario_id === usuarioId) return { ok: false as const, mensaje: 'Ya le enviaste una solicitud — esperando respuesta.' };
  if (previa && previa.amigo_id === usuarioId) return { ok: false as const, mensaje: 'Esa persona ya te envió una solicitud — revisá "Solicitudes recibidas".' };

  await supabase.from('amistades').insert({ usuario_id: usuarioId, amigo_id: destino.id, estado: 'pendiente' });
  return { ok: true as const, mensaje: `¡Solicitud enviada a ${destino.nombre}!` };
}

export async function aceptarSolicitud(id: string) {
  await supabase.from('amistades').update({ estado: 'aceptada' }).eq('id', id);
}

export async function rechazarSolicitud(id: string) {
  await supabase.from('amistades').delete().eq('id', id);
}

// ---------- Notificaciones ----------

export async function listarNotificaciones(usuarioId: string): Promise<Notificacion[]> {
  const { data } = await supabase
    .from('notificaciones')
    .select('*')
    .eq('usuario_id', usuarioId)
    .order('creado_en', { ascending: false });
  return data || [];
}

export async function marcarNotificacionesLeidas(usuarioId: string) {
  await supabase.from('notificaciones').update({ leida: true }).eq('usuario_id', usuarioId).eq('leida', false);
}

// ---------- Objetivos de la semana ----------

export async function listarObjetivosEstado(usuarioId: string): Promise<Record<string, boolean>> {
  const { data } = await supabase.from('objetivos_estado').select('*').eq('usuario_id', usuarioId);
  const mapa: Record<string, boolean> = {};
  (data as ObjetivoEstado[] | null)?.forEach((o) => (mapa[o.objetivo_id] = o.hecho));
  return mapa;
}

export async function alternarObjetivo(usuarioId: string, objetivoId: string, hechoActual: boolean) {
  await supabase
    .from('objetivos_estado')
    .upsert({ usuario_id: usuarioId, objetivo_id: objetivoId, hecho: !hechoActual }, { onConflict: 'usuario_id,objetivo_id' });
  return !hechoActual;
}

// ---------- Tutorías ----------

export async function listarTutoriaInscripciones(usuarioId: string): Promise<Record<string, TutoriaInscripcion['estado']>> {
  const { data } = await supabase.from('tutoria_inscripciones').select('*').eq('usuario_id', usuarioId);
  const mapa: Record<string, TutoriaInscripcion['estado']> = {};
  (data as TutoriaInscripcion[] | null)?.forEach((t) => (mapa[t.tutoria_id] = t.estado));
  return mapa;
}

export async function agendarTutoria(usuarioId: string, tutoriaId: string) {
  await supabase.from('tutoria_inscripciones').upsert(
    { usuario_id: usuarioId, tutoria_id: tutoriaId, estado: 'agendada' },
    { onConflict: 'usuario_id,tutoria_id' }
  );
}

export async function cancelarTutoria(usuarioId: string, tutoriaId: string) {
  await supabase.from('tutoria_inscripciones').delete().eq('usuario_id', usuarioId).eq('tutoria_id', tutoriaId);
}

export async function marcarContactoTutor(usuarioId: string, tutoriaId: string) {
  await supabase
    .from('tutoria_inscripciones')
    .upsert({ usuario_id: usuarioId, tutoria_id: tutoriaId, estado: 'contactado' }, { onConflict: 'usuario_id,tutoria_id' });
}

// ---------- Inscripciones (eventos / vida universitaria / oportunidades / beneficios) ----------

export async function listarInscripciones(usuarioId: string): Promise<string[]> {
  const { data } = await supabase.from('inscripciones').select('item_id').eq('usuario_id', usuarioId);
  return (data as Pick<Inscripcion, 'item_id'>[] | null)?.map((i) => i.item_id) || [];
}

export async function inscribirse(usuarioId: string, itemId: string, itemTipo: Inscripcion['item_tipo']) {
  await supabase.from('inscripciones').insert({ usuario_id: usuarioId, item_id: itemId, item_tipo: itemTipo });
}

export async function desinscribirse(usuarioId: string, itemId: string) {
  await supabase.from('inscripciones').delete().eq('usuario_id', usuarioId).eq('item_id', itemId);
}

// ---------- Historias ----------

export type HistoriaConAutor = {
  id: string;
  actividad_id: string;
  foto_url: string;
  usuario_id: string;
  nombre: string;
};

export async function listarHistorias(actividadId: string): Promise<HistoriaConAutor[]> {
  const { data } = await supabase
    .from('historias')
    .select('id, actividad_id, foto_url, usuario_id, perfil:usuario_id(nombre)')
    .eq('actividad_id', actividadId)
    .order('creado_en', { ascending: true });
  if (!data) return [];
  return data.map((row) => {
    const r = row as unknown as { id: string; actividad_id: string; foto_url: string; usuario_id: string; perfil: { nombre: string } };
    return { id: r.id, actividad_id: r.actividad_id, foto_url: r.foto_url, usuario_id: r.usuario_id, nombre: r.perfil?.nombre ?? '' };
  });
}

export async function subirHistoria(usuarioId: string, actividadId: string, archivo: File) {
  const ruta = `${usuarioId}/${Date.now()}-${archivo.name}`;
  const { error: errorSubida } = await supabase.storage.from('historias').upload(ruta, archivo, { upsert: true });
  if (errorSubida) return { ok: false as const, mensaje: errorSubida.message };

  const { data: publica } = supabase.storage.from('historias').getPublicUrl(ruta);
  const { error: errorInsert } = await supabase
    .from('historias')
    .insert({ usuario_id: usuarioId, actividad_id: actividadId, foto_url: publica.publicUrl });
  if (errorInsert) return { ok: false as const, mensaje: errorInsert.message };
  return { ok: true as const, fotoUrl: publica.publicUrl };
}

export async function subirAvatar(usuarioId: string, archivo: File) {
  const ruta = `${usuarioId}/${Date.now()}-${archivo.name}`;
  const { error: errorSubida } = await supabase.storage.from('avatares').upload(ruta, archivo, { upsert: true });
  if (errorSubida) return { ok: false as const, mensaje: errorSubida.message };

  const { data: publica } = supabase.storage.from('avatares').getPublicUrl(ruta);
  await supabase.from('perfiles').update({ avatar_url: publica.publicUrl }).eq('id', usuarioId);
  return { ok: true as const, fotoUrl: publica.publicUrl };
}
