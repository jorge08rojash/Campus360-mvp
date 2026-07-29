'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppShell } from '@/components/mobile/AppShellContext';
import AvatarSlot from '@/components/mobile/AvatarSlot';
import CoverPhoto from '@/components/mobile/CoverPhoto';
import HScroll from '@/components/mobile/HScroll';
import { subirAvatar, listarAmigos } from '@/lib/social';
import { actividadesDeHoy, type SheetItem } from '@/lib/catalogo';
import { eventos } from '@/data/eventos';
import { tutorias } from '@/data/tutorias';
import { noticias } from '@/data/academico';
import { supabase } from '@/lib/supabase';

type Logro = { nombre: string; ini: string; horas: number };

export default function InicioPage() {
  const { usuario, refrescarUsuario, hayNoLeidas, abrirNotif, abrirFicha, doCheckin, abrirCaptura, haPublicadoHistoria, objetivosEstado } = useAppShell();
  const router = useRouter();
  const [logro, setLogro] = useState<Logro | null>(null);

  useEffect(() => {
    (async () => {
      const amigos = await listarAmigos(usuario.id);
      for (const a of amigos) {
        const { data } = await supabase.from('tcu_proceso').select('horas_completadas').eq('usuario_id', a.id).maybeSingle();
        if (data && data.horas_completadas >= 150) {
          setLogro({ nombre: a.nombre, ini: a.nombre.split(' ').slice(0, 2).map((n) => n[0]).join(''), horas: data.horas_completadas });
          break;
        }
      }
    })();
  }, [usuario.id]);

  const hoy = actividadesDeHoy();
  const hoyIso = new Date().toISOString().slice(0, 10);
  const eventosHoyCount = eventos.filter((e) => e.fecha === hoyIso).length;
  const tutoriaHoyCount = tutorias.filter((t) => t.when.startsWith('Hoy')).length;

  async function subirFotoPerfil(archivo: File) {
    const r = await subirAvatar(usuario.id, archivo);
    if (r.ok) await refrescarUsuario();
  }

  const tutoriaDeHoy = tutorias.find((t) => t.when.startsWith('Hoy'));
  const feedItems: { tipo: 'evento' | 'logro' | 'recordatorio' | 'noticia'; item?: SheetItem; titulo?: string }[] = [];
  if (hoy[0]) feedItems.push({ tipo: 'evento', item: hoy[0] });
  if (logro) feedItems.push({ tipo: 'logro' });
  if (tutoriaDeHoy) feedItems.push({ tipo: 'recordatorio', titulo: `Tu tutoría de ${tutoriaDeHoy.materia} es hoy` });
  if (hoy[1]) feedItems.push({ tipo: 'evento', item: hoy[1] });
  if (noticias[0]) feedItems.push({ tipo: 'noticia', titulo: noticias[0].titulo });
  if (hoy[2]) feedItems.push({ tipo: 'evento', item: hoy[2] });

  const yaHizoCheckin = usuario.ultimo_checkin === hoyIso;

  return (
    <div className="c360-scroll-page h-full overflow-y-auto box-border" style={{ padding: '54px 16px 110px' }}>
      <div className="mb-4 flex items-start justify-between">
        <div>
          <div className="c360-heading text-[23px] font-bold">¡Pura vida, {usuario.nombre.split(' ')[0]}!</div>
          <div className="mt-1 text-[12.5px]" style={{ color: 'var(--c360-text2)' }}>
            {new Date().toLocaleDateString('es-CR', { weekday: 'long' })} · Campus San Pedro
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={abrirNotif}
            className="relative flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full"
            style={{ background: 'var(--c360-surface)' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 3a6 6 0 00-6 6v3.5c0 .7-.25 1.38-.7 1.9L4 16h16l-1.3-1.6a2.7 2.7 0 01-.7-1.9V9a6 6 0 00-6-6z" stroke="var(--c360-text2)" strokeWidth="1.7" strokeLinejoin="round" />
              <path d="M9.5 19a2.5 2.5 0 005 0" stroke="var(--c360-text2)" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
            {hayNoLeidas && (
              <div className="absolute right-[9px] top-2 h-2 w-2 rounded-full border-2" style={{ background: 'var(--c360-accent)', borderColor: 'var(--c360-surface)' }} />
            )}
          </button>
          <AvatarSlot url={usuario.avatar_url} nombre={usuario.nombre} size={42} onUpload={subirFotoPerfil} />
        </div>
      </div>

      <div
        className="mb-[18px] flex items-center gap-2 rounded-full text-[12.5px]"
        style={{ background: 'rgba(244,201,63,0.12)', border: '1px solid rgba(244,201,63,0.25)', padding: '8px 16px 8px 8px', color: 'var(--c360-text2)' }}
      >
        <div className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full text-xs font-bold" style={{ background: 'var(--c360-accent)', color: 'var(--c360-accent-fg)' }}>+</div>
        <span className="font-bold" style={{ color: 'var(--c360-accent)' }}>Hoy</span>
        <span className="h-[3px] w-[3px] shrink-0 rounded-full" style={{ background: 'var(--c360-text3)' }} />
        <span>{eventosHoyCount} evento{eventosHoyCount === 1 ? '' : 's'} · {tutoriaHoyCount} tutoría{tutoriaHoyCount === 1 ? '' : 's'} · {Object.values(objetivosEstado).filter((v) => !v).length} pendientes</span>
      </div>

      <div className="relative mb-[18px]">
        <HScroll>
          <button onClick={abrirCaptura} className="flex w-[62px] shrink-0 flex-col items-center gap-1.5">
            <div
              className="relative h-[58px] w-[58px] rounded-full p-[2.5px] box-border"
              style={{ background: haPublicadoHistoria ? 'linear-gradient(135deg,#C88FFF,#FF6B9D)' : 'transparent' }}
            >
              <AvatarSlot url={usuario.avatar_url} nombre={usuario.nombre} size={53} />
              <div
                className="absolute bottom-[-2px] right-[-2px] flex h-[22px] w-[22px] items-center justify-center rounded-full border-[2.5px]"
                style={{ background: 'var(--c360-accent)', borderColor: 'var(--c360-bg)' }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 011 1v9a1 1 0 01-1 1H4a1 1 0 01-1-1V9a1 1 0 011-1z" stroke="#152238" strokeWidth="1.8" strokeLinejoin="round" />
                  <circle cx="12" cy="13.5" r="3.2" stroke="#152238" strokeWidth="1.8" />
                </svg>
              </div>
            </div>
          </button>
          {hoy.map((s) => (
            <button key={s.id} onClick={() => abrirFicha('evento', s.id)} className="flex w-[62px] shrink-0 flex-col items-center gap-1.5">
              <div className="h-[58px] w-[58px] overflow-hidden rounded-full p-[2.5px]" style={{ background: `linear-gradient(135deg, ${s.tagFg}, var(--c360-accent))` }}>
                {s.imagen ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={s.imagen} alt={s.titulo} className="h-full w-full rounded-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-full" style={{ background: 'var(--c360-bg)' }}>
                    <span className="text-[10px] font-bold" style={{ color: s.tagFg }}>{s.tag[0]}</span>
                  </div>
                )}
              </div>
              <span className="text-center text-[10.5px] font-semibold leading-tight" style={{ color: 'var(--c360-text2)' }}>{s.titulo.split(' ').slice(0, 2).join(' ')}</span>
            </button>
          ))}
        </HScroll>
      </div>

      <div
        className="mb-[18px] flex items-center justify-between gap-3 rounded-[22px] p-4"
        style={{ background: 'linear-gradient(135deg, var(--c360-surface), var(--c360-surface2))', border: '1px solid var(--c360-border)' }}
      >
        <div className="text-[13.5px] font-bold">Check-in de campus</div>
        <div className="flex flex-col items-end gap-1.5">
          <button
            onClick={doCheckin}
            className="whitespace-nowrap rounded-full px-4 py-2.5 text-[12.5px] font-bold"
            style={{ background: yaHizoCheckin ? '#3DDBB0' : 'var(--c360-accent)', color: yaHizoCheckin ? '#0F3D33' : 'var(--c360-accent-fg)' }}
          >
            {yaHizoCheckin ? 'Check-in listo' : 'Marcar asistencia hoy (+15 pts)'}
          </button>
          <span className="text-[11px]" style={{ color: 'var(--c360-text2)' }}>🔥 {usuario.racha_checkin} días seguidos</span>
        </div>
      </div>

      {feedItems.map((f, i) => (
        <div key={i} className="mb-3.5 rounded-3xl p-4" style={{ background: 'var(--c360-surface)' }}>
          {f.tipo === 'evento' && f.item && (
            <>
              <CoverPhoto tag={f.item.tag} colorFg={f.item.tagFg} imagenUrl={f.item.imagen} className="mb-3" />
              <div className="mb-2 flex items-center gap-2">
                <span className="inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold" style={{ background: f.item.tagBg, color: f.item.tagFg }}>{f.item.tag}</span>
                <span className="text-[11.5px]" style={{ color: 'var(--c360-text2)' }}>{f.item.when}</span>
              </div>
              <div className="mb-2.5 text-[15.5px] font-bold leading-tight">{f.item.titulo}</div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {f.item.attendees.map((av, j) => (
                    <div key={j} className="flex h-[25px] w-[25px] items-center justify-center rounded-full border-2 text-[8.5px] font-bold" style={{ background: av.bg, borderColor: 'var(--c360-surface)', color: '#152238', marginLeft: j === 0 ? 0 : -8 }}>{av.ini}</div>
                  ))}
                  <span className="ml-2.5 text-[11.5px]" style={{ color: 'var(--c360-text2)' }}>+{f.item.attendeeCount} van</span>
                </div>
                <button onClick={() => abrirFicha('evento', f.item!.id)} className="rounded-full border px-3.5 py-2 text-[11.5px] font-bold" style={{ borderColor: 'var(--c360-border)' }}>Ver evento</button>
              </div>
            </>
          )}
          {f.tipo === 'logro' && logro && (
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[13px] font-bold" style={{ background: '#3DDBB0', color: '#152238' }}>{logro.ini}</div>
              <div className="flex-1">
                <div className="text-[13.5px] font-semibold leading-snug">{logro.nombre} completó sus {logro.horas} horas de TCU 🎉</div>
              </div>
              <div className="text-xl">🎉</div>
            </div>
          )}
          {f.tipo === 'recordatorio' && (
            <button onClick={() => router.push('/camino')} className="flex w-full items-center gap-3 text-left">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl" style={{ background: 'var(--c360-surface2)' }}>
                <svg width="19" height="19" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" stroke="var(--c360-accent)" strokeWidth="1.8" fill="none" /><path d="M12 7v5l3.5 2" stroke="var(--c360-accent)" strokeWidth="1.8" strokeLinecap="round" fill="none" /></svg>
              </div>
              <div className="flex-1 text-[13.5px] font-semibold leading-snug">{f.titulo}</div>
              <span className="text-[11.5px] font-bold" style={{ color: 'var(--c360-accent)' }}>Ver</span>
            </button>
          )}
          {f.tipo === 'noticia' && (
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-[17px]" style={{ background: 'var(--c360-surface2)' }}>📰</div>
              <div className="flex-1">
                <div className="text-[10.5px] font-bold uppercase tracking-wide" style={{ color: 'var(--c360-text3)' }}>Institucional</div>
                <div className="mt-0.5 text-[13.5px] font-semibold leading-snug">{f.titulo}</div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
