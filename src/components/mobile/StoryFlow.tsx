'use client';

import { useRef, useState } from 'react';
import { useAppShell } from './AppShellContext';
import { actividadesDeHoy } from '@/lib/catalogo';
import { subirHistoria } from '@/lib/social';

function CerrarBtn({ onClick, style }: { onClick: () => void; style?: React.CSSProperties }) {
  return (
    <button
      onClick={onClick}
      aria-label="Cerrar"
      className="flex h-8 w-8 items-center justify-center rounded-full"
      style={{ background: 'rgba(0,0,0,0.45)', ...style }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24"><path d="M5 5l14 14M19 5L5 19" stroke="#fff" strokeWidth="2" strokeLinecap="round" /></svg>
    </button>
  );
}

export default function StoryFlow() {
  const { storyFlow, cerrarFlujoHistoria, irAPreview, irATagStep, fotoCapturadaUrl, archivoCapturado, etiquetarActividad, usuario, marcarHistoriaPublicada, dispararConfetti } = useAppShell();
  const inputRef = useRef<HTMLInputElement>(null);
  const [publicando, setPublicando] = useState<string | null>(null);

  if (!storyFlow) return null;

  function elegirFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const archivo = e.target.files?.[0];
    if (archivo) irAPreview(archivo);
    e.target.value = '';
  }

  async function publicar(actividadId: string) {
    if (!archivoCapturado || publicando) return;
    setPublicando(actividadId);
    etiquetarActividad(actividadId);
    const resultado = await subirHistoria(usuario.id, actividadId, archivoCapturado);
    setPublicando(null);
    if (resultado.ok) {
      marcarHistoriaPublicada();
      dispararConfetti();
      cerrarFlujoHistoria();
    }
  }

  if (storyFlow === 'capture') {
    return (
      <div className="absolute inset-0 z-[120] bg-black">
        <div
          className="flex h-full w-full flex-col items-center justify-center text-center text-sm text-white/60"
          style={{ background: 'linear-gradient(160deg,#1D2E4A,#0D1420)' }}
        >
          Tomá o soltá una foto
        </div>

        <div className="absolute left-4 right-4 top-[54px] flex items-center justify-between">
          <CerrarBtn onClick={cerrarFlujoHistoria} />
          <svg width="20" height="20" viewBox="0 0 24 24" style={{ opacity: 0.85 }}>
            <path d="M3 3l18 18M17 8.5A7 7 0 006 17M7.5 6A7 7 0 0121 12" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          </svg>
          <div className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background: 'rgba(0,0,0,0.4)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="3.2" stroke="#fff" strokeWidth="1.7" fill="none" />
              <path d="M4 8.5l1.5-2.5h13l1.5 2.5" stroke="#fff" strokeWidth="1.7" fill="none" strokeLinecap="round" />
              <path d="M4 8.5h16v10.5a1 1 0 01-1 1H5a1 1 0 01-1-1V8.5z" stroke="#fff" strokeWidth="1.7" fill="none" />
            </svg>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-[38px] flex items-center justify-center gap-5">
          <div className="h-[34px] w-[34px] rounded-full opacity-85" style={{ background: 'linear-gradient(135deg,#FF6B5B,#C88FFF)' }} />
          <div className="h-[34px] w-[34px] rounded-full opacity-85" style={{ background: 'linear-gradient(135deg,#8FA8FF,#3DDBB0)' }} />
          <button
            onClick={() => inputRef.current?.click()}
            className="flex h-[68px] w-[68px] shrink-0 items-center justify-center rounded-full border-4 border-white"
          >
            <div className="h-[54px] w-[54px] rounded-full" style={{ background: 'var(--c360-accent)' }} />
          </button>
          <div className="h-[34px] w-[34px] rounded-full opacity-85" style={{ background: 'linear-gradient(135deg,#F4C93F,#FF6B5B)' }} />
          <div className="h-[34px] w-[34px] rounded-full opacity-85" style={{ background: 'linear-gradient(135deg,#3DDBB0,#8FA8FF)' }} />
        </div>

        <input ref={inputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={elegirFoto} />
      </div>
    );
  }

  if (storyFlow === 'preview') {
    return (
      <div className="absolute inset-0 z-[120] bg-black">
        {fotoCapturadaUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={fotoCapturadaUrl} alt="Tu foto" className="h-full w-full object-cover" />
        )}
        <CerrarBtn onClick={cerrarFlujoHistoria} style={{ position: 'absolute', top: 54, left: 16 }} />

        <div className="absolute right-4 top-[54px] flex flex-col items-end gap-5 text-white">
          {[
            { label: 'Texto', icon: 'Aa' },
            { label: 'Stickers' },
            { label: 'Audio' },
            { label: 'Restyle' },
          ].map((it) => (
            <div key={it.label} className="flex items-center gap-2.5">
              <span className="text-[12.5px] font-semibold">{it.label}</span>
              <div className="flex h-[38px] w-[38px] items-center justify-center rounded-full" style={{ background: 'rgba(0,0,0,0.5)' }}>
                {it.icon || '•'}
              </div>
            </div>
          ))}
        </div>

        <div className="absolute inset-x-4 bottom-6 flex items-center gap-2">
          <div className="h-[34px] w-[34px] shrink-0 overflow-hidden rounded-full">
            {usuario.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={usuario.avatar_url} alt={usuario.nombre} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-white/20 text-[11px] text-white">{usuario.nombre[0]}</div>
            )}
          </div>
          <div className="shrink-0 rounded-full px-3.5 py-2.5 text-xs font-bold text-white" style={{ background: 'rgba(0,0,0,0.55)' }}>
            Subir Historia
          </div>
          <button onClick={irATagStep} className="flex-1 rounded-full px-3.5 py-2.5 text-xs font-bold text-white" style={{ background: 'rgba(0,0,0,0.55)' }}>
            Escoger Actividad
          </button>
          <button
            onClick={irATagStep}
            className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full"
            style={{ background: 'var(--c360-accent)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" stroke="#152238" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>
          </button>
        </div>
      </div>
    );
  }

  // storyFlow === 'tag'
  return (
    <div className="c360-scroll-page absolute inset-0 z-[120] overflow-y-auto box-border" style={{ background: 'var(--c360-bg)', padding: '54px 20px 30px' }}>
      <button
        onClick={cerrarFlujoHistoria}
        className="absolute right-4 top-[54px] z-[5] flex h-[30px] w-[30px] items-center justify-center rounded-full text-sm"
        style={{ background: 'var(--c360-surface2)', color: 'var(--c360-text)' }}
      >
        ✕
      </button>
      {fotoCapturadaUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={fotoCapturadaUrl} alt="Tu foto" className="mb-4.5 w-full rounded-[18px] object-cover" style={{ height: 180 }} />
      )}
      <div className="c360-heading mb-1.5 text-lg font-bold">¿Qué estás viviendo?</div>
      <div className="mb-4 text-[12.5px]" style={{ color: 'var(--c360-text2)' }}>Etiquetá tu historia con lo que pasa hoy en campus</div>
      <div className="flex flex-col gap-2.5">
        {actividadesDeHoy().map((a) => (
          <button
            key={a.id}
            onClick={() => publicar(a.id)}
            disabled={!!publicando}
            className="flex items-center gap-3 rounded-2xl px-3.5 py-3 text-left"
            style={{ background: 'var(--c360-surface)' }}
          >
            <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full text-xs font-bold" style={{ background: a.tagBg, color: a.tagFg }}>
              {a.tag[0]}
            </div>
            <span className="text-[13.5px] font-semibold">{publicando === a.id ? 'Publicando…' : a.titulo}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
