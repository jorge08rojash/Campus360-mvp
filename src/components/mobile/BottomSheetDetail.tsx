'use client';

import { useEffect, useState } from 'react';
import { useAppShell } from './AppShellContext';
import { buscarItem } from '@/lib/catalogo';
import { listarHistorias, type HistoriaConAutor } from '@/lib/social';
import CoverPhoto from './CoverPhoto';

export default function BottomSheetDetail() {
  const { sheet, cerrarFicha, inscripciones, alternarInscripcion, tutoriaEstados, alternarAgendar, marcarContacto } = useAppShell();
  const [historias, setHistorias] = useState<HistoriaConAutor[]>([]);

  const item = sheet ? buscarItem(sheet.id) : null;

  useEffect(() => {
    if (!sheet || (sheet.tipo !== 'evento' && sheet.tipo !== 'vida')) {
      setHistorias([]);
      return;
    }
    listarHistorias(sheet.id).then(setHistorias);
  }, [sheet]);

  if (!sheet || !item) return null;

  const inscrito = inscripciones.has(item.id);
  const esTutoria = item.tipo === 'tutoria';
  const estadoTutoria = tutoriaEstados[item.id];

  let ctaLabel = '';
  let ctaBg = 'var(--c360-accent)';
  let ctaFg = 'var(--c360-accent-fg)';
  let onClickCta = () => {};

  if (item.tipo === 'oportunidad') {
    ctaLabel = inscrito ? 'Solicitud enviada ✅' : 'Solicitar';
    if (inscrito) { ctaBg = 'var(--c360-surface2)'; ctaFg = 'var(--c360-text2)'; }
    onClickCta = () => alternarInscripcion(item.id, 'oportunidad', 0);
  } else if (item.tipo === 'beneficio') {
    ctaLabel = inscrito ? 'Canjeado ✅' : 'Canjear con puntos';
    if (inscrito) { ctaBg = 'var(--c360-surface2)'; ctaFg = 'var(--c360-text2)'; }
    onClickCta = () => alternarInscripcion(item.id, 'beneficio', 0);
  } else if (esTutoria) {
    if (estadoTutoria) {
      ctaLabel = 'Comunicarme';
      ctaBg = '#3DDBB0';
      ctaFg = '#0F3D33';
      onClickCta = () => marcarContacto(item.id);
    } else {
      ctaLabel = 'Inscribirme';
      onClickCta = () => alternarAgendar(item.id);
    }
  } else {
    ctaLabel = inscrito ? 'Ya estás inscrito ✅' : `Inscribirme${item.puntos ? ` (+${item.puntos} pts)` : ''}`;
    if (inscrito) { ctaBg = 'var(--c360-surface2)'; ctaFg = 'var(--c360-text2)'; }
    onClickCta = () => alternarInscripcion(item.id, item.tipo as 'evento' | 'vida', item.puntos);
  }

  return (
    <div className="absolute inset-0 z-[100]">
      <div onClick={cerrarFicha} className="absolute inset-0 bg-black/50" style={{ animation: 'c360-fade-in 0.2s ease' }} />
      <div
        className="c360-scroll-page absolute inset-x-0 bottom-0 box-border overflow-y-auto rounded-t-[28px]"
        style={{
          background: 'var(--c360-surface)',
          padding: '20px 20px 30px',
          maxHeight: '82%',
          animation: 'c360-slide-up 0.28s cubic-bezier(.32,.72,0,1)',
        }}
      >
        <div className="mx-auto mb-4 h-1 w-9 rounded-full" style={{ background: 'var(--c360-border)' }} />
        <button
          onClick={cerrarFicha}
          className="absolute right-4 top-4 z-[2] flex h-[30px] w-[30px] items-center justify-center rounded-full text-sm"
          style={{ background: 'var(--c360-surface2)', color: 'var(--c360-text)' }}
        >
          ✕
        </button>

        <CoverPhoto tag={item.tag} colorFg={item.tagFg} height={150} className="mb-3.5" />

        <span
          className="mb-2.5 inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold"
          style={{ background: item.tagBg, color: item.tagFg }}
        >
          {item.tag}
        </span>
        <div className="c360-heading mb-2 text-[19px] font-bold leading-tight">{item.titulo}</div>

        {esTutoria ? (
          <>
            <div className="mb-2 text-[12.5px] font-semibold" style={{ color: 'var(--c360-accent)' }}>{item.profesor}</div>
            <div className="mb-0.5 text-[12.5px]" style={{ color: 'var(--c360-text2)' }}>🗓️ {item.when}</div>
            <div className="mb-3.5 text-[12.5px]" style={{ color: 'var(--c360-text2)' }}>💰 {item.costo}</div>
          </>
        ) : (
          <>
            <div className="mb-0.5 text-[12.5px]" style={{ color: 'var(--c360-text2)' }}>🗓️ {item.when}</div>
            <div className="mb-3.5 text-[12.5px]" style={{ color: 'var(--c360-text2)' }}>📍 {item.place}</div>
          </>
        )}

        <div className="mb-4.5 text-[13.5px] leading-[1.55]" style={{ color: 'var(--c360-text2)' }}>{item.summary}</div>

        {item.attendees.length > 0 && (
          <div className="mb-5 flex items-center">
            {item.attendees.map((av, i) => (
              <div
                key={i}
                className="flex h-[29px] w-[29px] items-center justify-center rounded-full border-2 text-[9.5px] font-bold"
                style={{ background: av.bg, borderColor: 'var(--c360-surface)', color: '#152238', marginLeft: i === 0 ? 0 : -8 }}
              >
                {av.ini}
              </div>
            ))}
            <span className="ml-2.5 text-xs" style={{ color: 'var(--c360-text2)' }}>+{item.attendeeCount} confirmados</span>
          </div>
        )}

        {historias.length > 0 && (
          <div className="mb-4.5">
            <div className="mb-2 text-[11px] font-bold uppercase tracking-wide" style={{ color: 'var(--c360-text2)' }}>Historias de hoy</div>
            <div className="flex gap-2.5">
              {historias.map((h) => (
                <div key={h.id} className="h-[38px] w-[38px] shrink-0 rounded-full p-0.5" style={{ background: 'linear-gradient(135deg,#C88FFF,var(--c360-accent))' }}>
                  <div className="h-full w-full overflow-hidden rounded-full border-2 box-border" style={{ borderColor: 'var(--c360-surface)' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={h.foto_url} alt={h.nombre} className="h-full w-full object-cover" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={onClickCta}
          className="w-full rounded-full py-[15px] text-[14.5px] font-bold"
          style={{ background: ctaBg, color: ctaFg }}
        >
          {ctaLabel}
        </button>
      </div>
    </div>
  );
}
