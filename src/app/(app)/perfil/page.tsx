'use client';

import { useEffect, useState } from 'react';
import { useAppShell } from '@/components/mobile/AppShellContext';
import AvatarSlot from '@/components/mobile/AvatarSlot';
import { nivelInfo } from '@/lib/nivel';
import { subirAvatar, listarAmigos, listarSolicitudesRecibidas, listarSolicitudesEnviadas, enviarSolicitudAmistad, aceptarSolicitud, rechazarSolicitud, type Amigo } from '@/lib/social';
import { supabase, Perfil, Amistad, Inscripcion } from '@/lib/supabase';
import { buscarItem } from '@/lib/catalogo';
import { actividades } from '@/data/vidaUniversitaria';
import { cuatrimestre } from '@/data/academico';

type Insignia = { id: string; nombre: string; desbloqueada: boolean; icono: 'tutoria' | 'tcu' | 'asistente' | 'racha' | 'voluntario' };

function IconoInsignia({ tipo, desbloqueada }: { tipo: Insignia['icono']; desbloqueada: boolean }) {
  const trazo = desbloqueada ? '#152238' : 'var(--c360-text3)';
  const relleno = desbloqueada ? 'var(--c360-accent)' : 'transparent';
  const borde = desbloqueada ? 'var(--c360-accent)' : 'var(--c360-text3)';
  if (tipo === 'tutoria') return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M2 8l10-4 10 4-10 4-10-4z" fill={relleno} stroke={borde} strokeWidth="1.3" strokeLinejoin="round" /><path d="M6 10.5V15c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5v-4.5" stroke={trazo} strokeWidth="1.3" fill="none" strokeLinecap="round" /></svg>;
  if (tipo === 'tcu') return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="5" fill={relleno} stroke={borde} strokeWidth="1.3" /><path d="M9 12.5L7 21l5-2.5 5 2.5-2-8.5" stroke={trazo} strokeWidth="1.3" fill="none" strokeLinejoin="round" /></svg>;
  if (tipo === 'asistente') return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="16" rx="3" fill={relleno} stroke={borde} strokeWidth="1.3" /><path d="M3 10h18M8 3v4M16 3v4" stroke={trazo} strokeWidth="1.3" strokeLinecap="round" /><path d="M8.5 14.5l2.3 2.3 4.7-4.8" stroke={trazo} strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>;
  if (tipo === 'racha') return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2c1 3-3 4-3 7.5a3 3 0 006 0c0-1.2-.6-2-1-2.7.9.4 2 1.8 2 4a5 5 0 01-10 0C6 6.5 10 6 12 2z" fill={relleno} stroke={borde} strokeWidth="1.2" strokeLinejoin="round" /></svg>;
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 20s-8-4.5-8-10.5A4.5 4.5 0 0112 6.2 4.5 4.5 0 0120 9.5C20 15.5 12 20 12 20z" fill={relleno} stroke={borde} strokeWidth="1.3" strokeLinejoin="round" /></svg>;
}

export default function PerfilPage() {
  const { usuario, refrescarUsuario, tutoriaEstados, abrirWrapped, tema, setTema } = useAppShell();
  const [horasTcu, setHorasTcu] = useState(0);
  const [asistenciaCount, setAsistenciaCount] = useState(0);
  const [voluntarioCount, setVoluntarioCount] = useState(0);
  const [badgesExpandido, setBadgesExpandido] = useState(false);

  const [correoAmigo, setCorreoAmigo] = useState('');
  const [mensajeAmigo, setMensajeAmigo] = useState('');
  const [amigos, setAmigos] = useState<Amigo[]>([]);
  const [recibidas, setRecibidas] = useState<(Amistad & { perfil: Perfil })[]>([]);
  const [enviadas, setEnviadas] = useState<(Amistad & { perfil: Perfil })[]>([]);

  const [historial, setHistorial] = useState<(Inscripcion & { titulo: string })[]>([]);

  async function cargarAmigos() {
    const [a, r, e] = await Promise.all([listarAmigos(usuario.id), listarSolicitudesRecibidas(usuario.id), listarSolicitudesEnviadas(usuario.id)]);
    setAmigos(a);
    setRecibidas(r);
    setEnviadas(e);
  }

  useEffect(() => {
    cargarAmigos();
    supabase.from('tcu_proceso').select('horas_completadas').eq('usuario_id', usuario.id).maybeSingle().then(({ data }) => setHorasTcu(data?.horas_completadas || 0));
    supabase
      .from('inscripciones')
      .select('*')
      .eq('usuario_id', usuario.id)
      .order('creado_en', { ascending: false })
      .then(({ data }) => {
        const filas = (data as Inscripcion[]) || [];
        setAsistenciaCount(filas.filter((f) => f.item_tipo === 'evento' || f.item_tipo === 'vida').length);
        setVoluntarioCount(filas.filter((f) => f.item_tipo === 'vida' && actividades.find((a) => a.id === f.item_id)?.tipo === 'Voluntariado').length);
        setHistorial(
          filas
            .filter((f) => f.item_tipo === 'evento' || f.item_tipo === 'vida')
            .map((f) => ({ ...f, titulo: buscarItem(f.item_id)?.titulo ?? f.item_id }))
        );
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuario.id]);

  async function subirFoto(archivo: File) {
    const r = await subirAvatar(usuario.id, archivo);
    if (r.ok) await refrescarUsuario();
  }

  async function enviarSolicitud() {
    const r = await enviarSolicitudAmistad(usuario.id, correoAmigo);
    setMensajeAmigo(r.mensaje);
    if (r.ok) {
      setCorreoAmigo('');
      cargarAmigos();
    }
  }

  const nivel = nivelInfo(usuario.puntos);
  const insignias: Insignia[] = [
    { id: 'tutoria', nombre: 'Primera tutoría', desbloqueada: Object.keys(tutoriaEstados).length >= 1, icono: 'tutoria' },
    { id: 'tcu', nombre: '50h de TCU', desbloqueada: horasTcu >= 50, icono: 'tcu' },
    { id: 'asistente', nombre: 'Asistente frecuente', desbloqueada: asistenciaCount >= 3, icono: 'asistente' },
    { id: 'racha', nombre: `Racha de ${usuario.racha_objetivos} semanas`, desbloqueada: usuario.racha_objetivos >= 4, icono: 'racha' },
    { id: 'voluntario', nombre: 'Voluntario del mes', desbloqueada: voluntarioCount >= 1, icono: 'voluntario' },
  ];
  const visibles = badgesExpandido ? insignias : insignias.slice(0, 4);

  return (
    <div className="c360-scroll-page h-full overflow-y-auto box-border" style={{ padding: '54px 16px 110px' }}>
      <div className="mb-5 flex flex-col items-center text-center">
        <div className="mb-2.5">
          <AvatarSlot url={usuario.avatar_url} nombre={usuario.nombre} size={82} onUpload={subirFoto} />
        </div>
        <div className="c360-heading text-[19px] font-bold">{usuario.nombre}</div>
        <div className="mt-0.5 text-[12.5px]" style={{ color: 'var(--c360-text2)' }}>{usuario.carrera}</div>
      </div>

      <div className="mb-5 rounded-[20px] p-4" style={{ background: 'var(--c360-surface)' }}>
        <div className="mb-2 flex items-baseline justify-between">
          <span className="text-[13.5px] font-bold">Nivel {nivel.actual}</span>
          <span className="text-[11.5px]" style={{ color: 'var(--c360-text2)' }}>{usuario.puntos.toLocaleString('es-CR')} pts</span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full" style={{ background: 'var(--c360-surface2)' }}>
          <div className="h-full rounded-full" style={{ width: `${nivel.pct}%`, background: 'var(--c360-accent)' }} />
        </div>
        <div className="mb-4 mt-1.5 text-[11px]" style={{ color: 'var(--c360-text2)' }}>{nivel.restante}</div>

        <div className="mb-3.5 h-px" style={{ background: 'var(--c360-border)' }} />

        <div className="mb-2.5 text-[11px] font-bold uppercase tracking-wide" style={{ color: 'var(--c360-text2)' }}>Insignias</div>
        <div className="flex flex-wrap gap-2">
          {visibles.map((ins) => (
            <div key={ins.id} className="inline-flex items-center gap-1.5 rounded-full py-[7px] pl-2 pr-3" style={{ background: ins.desbloqueada ? 'rgba(244,201,63,0.14)' : 'var(--c360-surface2)' }}>
              <IconoInsignia tipo={ins.icono} desbloqueada={ins.desbloqueada} />
              <span className="text-[11px] font-semibold" style={{ color: ins.desbloqueada ? 'var(--c360-text)' : 'var(--c360-text3)' }}>{ins.nombre}</span>
            </div>
          ))}
        </div>
        {insignias.length > 4 && (
          <button onClick={() => setBadgesExpandido((v) => !v)} className="mt-2.5 text-[11.5px] font-bold" style={{ color: 'var(--c360-accent)' }}>
            {badgesExpandido ? 'Ver menos' : `Ver todas (${insignias.length})`}
          </button>
        )}
      </div>

      <div className="mb-5 rounded-[20px] p-4" style={{ background: 'var(--c360-surface)' }}>
        <div className="mb-3 text-[13.5px] font-bold">Amigos</div>
        <div className="mb-2 flex gap-2">
          <input
            value={correoAmigo}
            onChange={(e) => { setCorreoAmigo(e.target.value); setMensajeAmigo(''); }}
            placeholder="correo@ufidelitas.ac.cr"
            className="min-w-0 flex-1 rounded-xl border px-3 py-2.5 text-[12.5px]"
            style={{ borderColor: 'var(--c360-border)', background: 'var(--c360-bg)', color: 'var(--c360-text)' }}
          />
          <button onClick={enviarSolicitud} className="shrink-0 rounded-xl px-4 text-[12.5px] font-bold" style={{ background: 'var(--c360-accent)', color: 'var(--c360-accent-fg)' }}>Enviar</button>
        </div>
        {mensajeAmigo && <div className="mb-3 text-[11.5px]" style={{ color: 'var(--c360-accent)' }}>{mensajeAmigo}</div>}

        {recibidas.length > 0 && (
          <>
            <div className="mb-2 text-[11px] font-bold uppercase tracking-wide" style={{ color: 'var(--c360-text2)' }}>Solicitudes recibidas</div>
            <div className="mb-4 flex flex-col gap-2">
              {recibidas.map((r) => (
                <div key={r.id} className="flex items-center gap-2.5">
                  <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full text-[11px] font-bold" style={{ background: 'var(--c360-surface2)' }}>
                    {r.perfil.nombre.split(' ').slice(0, 2).map((n) => n[0]).join('')}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[12.5px] font-semibold">{r.perfil.nombre}</div>
                    <div className="text-[10.5px]" style={{ color: 'var(--c360-text2)' }}>{r.perfil.carrera}</div>
                  </div>
                  <button onClick={async () => { await aceptarSolicitud(r.id); cargarAmigos(); }} className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full text-[13px]" style={{ background: 'var(--c360-accent)', color: 'var(--c360-accent-fg)' }}>✓</button>
                  <button onClick={async () => { await rechazarSolicitud(r.id); cargarAmigos(); }} className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full text-xs" style={{ background: 'var(--c360-surface2)', color: 'var(--c360-text2)' }}>✕</button>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="mb-2 text-[11px] font-bold uppercase tracking-wide" style={{ color: 'var(--c360-text2)' }}>Mis amigos</div>
        <div className="flex flex-col gap-2">
          {amigos.map((fr) => (
            <div key={fr.id} className="flex items-center gap-2.5">
              <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full text-[11px] font-bold" style={{ background: 'var(--c360-surface2)' }}>
                {fr.nombre.split(' ').slice(0, 2).map((n) => n[0]).join('')}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[12.5px] font-semibold">{fr.nombre}</div>
                <div className="text-[10.5px]" style={{ color: 'var(--c360-text2)' }}>{fr.carrera}</div>
              </div>
              <button className="shrink-0 rounded-full px-3 py-[7px] text-[9.5px] font-bold" style={{ background: 'var(--c360-accent)', color: 'var(--c360-accent-fg)' }}>Enviar Mensaje</button>
            </div>
          ))}
          {amigos.length === 0 && <p className="text-[12px]" style={{ color: 'var(--c360-text2)' }}>Todavía no tenés amigos agregados.</p>}
        </div>

        {enviadas.length > 0 && (
          <>
            <div className="mb-2 mt-3.5 text-[11px] font-bold uppercase tracking-wide" style={{ color: 'var(--c360-text2)' }}>Solicitudes enviadas</div>
            <div className="flex flex-col gap-2">
              {enviadas.map((sr) => (
                <div key={sr.id} className="flex items-center gap-2.5">
                  <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full text-[11px] font-bold" style={{ background: 'var(--c360-surface2)' }}>
                    {sr.perfil.nombre.split(' ').slice(0, 2).map((n) => n[0]).join('')}
                  </div>
                  <div className="flex-1 text-[12.5px] font-semibold">{sr.perfil.nombre}</div>
                  <span className="text-[10.5px]" style={{ color: 'var(--c360-text3)' }}>Pendiente</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <button onClick={abrirWrapped} className="mb-5 w-full rounded-3xl p-5 text-left box-border" style={{ background: 'linear-gradient(135deg,#152238,#3d3620)' }}>
        <div className="text-[10.5px] font-bold uppercase tracking-wide" style={{ color: 'var(--c360-accent)' }}>Campus Wrapped</div>
        <div className="c360-heading mt-1.5 text-lg font-bold text-white">Tu {cuatrimestre.nombre} 🎉</div>
        <div className="mt-1.5 text-xs text-white/65">Mirá tu resumen del cuatri y compartilo</div>
      </button>

      <div className="mb-2.5 text-[13.5px] font-bold">Eventos asistidos</div>
      <div className="mb-5 flex flex-col gap-2.5">
        {historial.length === 0 && <p className="text-[12.5px]" style={{ color: 'var(--c360-text2)' }}>Todavía no asististe a ningún evento.</p>}
        {historial.map((h) => (
          <div key={h.id} className="flex justify-between rounded-2xl px-3.5 py-3" style={{ background: 'var(--c360-surface)' }}>
            <span className="text-[12.5px] font-semibold">{h.titulo}</span>
            <span className="text-[11px]" style={{ color: 'var(--c360-text2)' }}>{new Date(h.creado_en).toLocaleDateString('es-CR')}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between rounded-2xl px-4 py-3.5" style={{ background: 'var(--c360-surface)' }}>
        <span className="text-[13px] font-semibold">Modo claro</span>
        <div className="flex rounded-full p-[3px]" style={{ background: 'var(--c360-surface2)' }}>
          <button onClick={() => setTema('light')} className="flex h-[26px] w-8 items-center justify-center rounded-full text-xs" style={{ background: tema === 'light' ? 'var(--c360-accent)' : 'transparent' }}>☀️</button>
          <button onClick={() => setTema('dark')} className="flex h-[26px] w-8 items-center justify-center rounded-full text-xs" style={{ background: tema === 'dark' ? 'var(--c360-accent)' : 'transparent' }}>🌙</button>
        </div>
      </div>
    </div>
  );
}
