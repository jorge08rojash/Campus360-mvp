'use client';

import { useRouter } from 'next/navigation';
import { useAppShell } from './AppShellContext';

export default function NotifPanel() {
  const { notifOpen, cerrarNotif, notificaciones, abrirFicha } = useAppShell();
  const router = useRouter();
  if (!notifOpen) return null;

  function abrir(n: (typeof notificaciones)[number]) {
    cerrarNotif();
    if (n.tipo === 'solicitud_amistad') {
      router.push('/perfil');
    } else if (n.tipo === 'evento_habilitado' && n.referencia_id) {
      abrirFicha('evento', n.referencia_id);
    }
  }

  return (
    <div className="absolute inset-0 z-[105]">
      <div onClick={cerrarNotif} className="absolute inset-0 bg-black/50" style={{ animation: 'c360-fade-in 0.2s ease' }} />
      <div
        className="c360-scroll-page absolute inset-x-0 bottom-0 box-border overflow-y-auto rounded-t-[28px]"
        style={{ background: 'var(--c360-surface)', padding: '20px 20px 30px', maxHeight: '70%', animation: 'c360-slide-up 0.28s cubic-bezier(.32,.72,0,1)' }}
      >
        <div className="mx-auto mb-4 h-1 w-9 rounded-full" style={{ background: 'var(--c360-border)' }} />
        <button
          onClick={cerrarNotif}
          className="absolute right-4 top-4 flex h-[30px] w-[30px] items-center justify-center rounded-full text-sm"
          style={{ background: 'var(--c360-surface2)', color: 'var(--c360-text)' }}
        >
          ✕
        </button>
        <div className="c360-heading mb-3.5 text-lg font-bold">Notificaciones</div>
        <div className="flex flex-col gap-3.5">
          {notificaciones.length === 0 && (
            <p className="text-[13px]" style={{ color: 'var(--c360-text2)' }}>No tenés notificaciones todavía.</p>
          )}
          {notificaciones.map((n) => {
            const clickable = n.tipo === 'solicitud_amistad' || (n.tipo === 'evento_habilitado' && n.referencia_id);
            return (
              <button
                key={n.id}
                onClick={clickable ? () => abrir(n) : undefined}
                className="flex w-full items-start gap-3 text-left"
                style={{ cursor: clickable ? 'pointer' : 'default' }}
              >
                <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-xl text-[17px]" style={{ background: 'var(--c360-surface2)' }}>
                  {n.icono}
                </div>
                <div>
                  <div className="text-[13px] font-semibold leading-snug" style={{ color: 'var(--c360-text)' }}>{n.texto}</div>
                  {n.sub && <div className="mt-0.5 text-[11px]" style={{ color: 'var(--c360-text2)' }}>{n.sub}</div>}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
