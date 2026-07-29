'use client';

import { useEffect, useState } from 'react';
import { useAppShell } from './AppShellContext';
import { supabase } from '@/lib/supabase';

export default function WrappedModal() {
  const { wrappedOpen, cerrarWrapped, usuario, tutoriaEstados } = useAppShell();
  const [eventosAsistidos, setEventosAsistidos] = useState(0);
  const [horasTcu, setHorasTcu] = useState(0);

  useEffect(() => {
    if (!wrappedOpen) return;
    (async () => {
      const [{ count }, { data: tcu }] = await Promise.all([
        supabase
          .from('inscripciones')
          .select('id', { count: 'exact', head: true })
          .eq('usuario_id', usuario.id)
          .in('item_tipo', ['evento', 'vida']),
        supabase.from('tcu_proceso').select('horas_completadas').eq('usuario_id', usuario.id).single(),
      ]);
      setEventosAsistidos(count || 0);
      setHorasTcu(tcu?.horas_completadas || 0);
    })();
  }, [wrappedOpen, usuario.id]);

  if (!wrappedOpen) return null;

  const stats = [
    { valor: eventosAsistidos, label: 'eventos asistidos' },
    { valor: `${horasTcu}h`, label: 'de TCU' },
    { valor: Object.keys(tutoriaEstados).length, label: 'tutorías' },
    { valor: usuario.racha_objetivos, label: 'semanas de racha' },
  ];

  return (
    <div className="absolute inset-0 z-[110] flex items-center justify-center p-6 box-border">
      <div onClick={cerrarWrapped} className="absolute inset-0 bg-black/70" />
      <div
        className="relative w-full rounded-[28px] p-[28px_22px] box-border"
        style={{ background: 'linear-gradient(160deg,#152238,#3d3620 60%,#152238)', animation: 'c360-pop-in 0.3s ease' }}
      >
        <button onClick={cerrarWrapped} className="absolute right-3.5 top-3.5 flex h-7 w-7 items-center justify-center rounded-full text-sm text-white" style={{ background: 'rgba(255,255,255,0.1)' }}>
          ✕
        </button>
        <div className="text-[10.5px] font-bold uppercase tracking-[0.1em]" style={{ color: 'var(--c360-accent)' }}>Campus Wrapped</div>
        <div className="c360-heading mb-5 mt-1.5 text-xl font-bold text-white">Tu cuatrimestre 🎉</div>
        <div className="mb-5 grid grid-cols-2 gap-3.5">
          {stats.map((s, i) => (
            <div key={i}>
              <div className="c360-heading text-[30px] font-bold" style={{ color: 'var(--c360-accent)' }}>{s.valor}</div>
              <div className="text-[11.5px] text-white/60">{s.label}</div>
            </div>
          ))}
        </div>
        <button
          className="w-full rounded-full py-3.5 text-[13.5px] font-bold"
          style={{ background: 'var(--c360-accent)', color: 'var(--c360-accent-fg)' }}
        >
          Compartir en Instagram
        </button>
      </div>
    </div>
  );
}
