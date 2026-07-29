'use client';

import { useEffect, useState } from 'react';
import { useAppShell } from '@/components/mobile/AppShellContext';
import { supabase, TcuProceso, TcuEtapa, TcuBitacora } from '@/lib/supabase';
import { sumarPuntos } from '@/lib/social';
import { tutorias } from '@/data/tutorias';
import { objetivosSemana, cuatrimestre } from '@/data/academico';

const CIRCUNFERENCIA = 301.6;
const FILTROS_TUTORIA = ['Todas', 'Virtual', 'Presencial', 'Premium'] as const;
const DIAS_SEMANA = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

export default function CaminoPage() {
  const { usuario, refrescarUsuario, tutoriaEstados, alternarAgendar, objetivosEstado, alternarObjetivo, dispararConfetti } = useAppShell();
  const [proceso, setProceso] = useState<TcuProceso | null>(null);
  const [etapas, setEtapas] = useState<TcuEtapa[]>([]);
  const [bitacora, setBitacora] = useState<TcuBitacora[]>([]);
  const [filtroTutoria, setFiltroTutoria] = useState<(typeof FILTROS_TUTORIA)[number]>('Todas');
  const [nuevaHora, setNuevaHora] = useState({ fecha: '', horas: '', desc: '' });

  async function cargarTcu() {
    const [{ data: p }, { data: e }, { data: b }] = await Promise.all([
      supabase.from('tcu_proceso').select('*').eq('usuario_id', usuario.id).single(),
      supabase.from('tcu_etapas').select('*').eq('usuario_id', usuario.id).order('orden'),
      supabase.from('tcu_bitacora').select('*').eq('usuario_id', usuario.id).order('fecha', { ascending: false }),
    ]);
    setProceso(p);
    setEtapas(e || []);
    setBitacora(b || []);
  }

  useEffect(() => {
    cargarTcu();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuario.id]);

  async function registrarHoras() {
    if (!proceso) return;
    const horas = parseFloat(nuevaHora.horas) || 2;
    const fecha = nuevaHora.fecha.trim() || new Date().toISOString().slice(0, 10);
    const descripcion = nuevaHora.desc.trim() || 'Actividad registrada';

    await supabase.from('tcu_bitacora').insert({ usuario_id: usuario.id, fecha, horas, descripcion, estado: 'registrada' });
    const nuevasHoras = Math.min(proceso.horas_requeridas, proceso.horas_completadas + horas);
    await supabase.from('tcu_proceso').update({ horas_completadas: nuevasHoras }).eq('id', proceso.id);
    await sumarPuntos(usuario.id, horas * 5, usuario.puntos);
    await Promise.all([cargarTcu(), refrescarUsuario()]);
    setNuevaHora({ fecha: '', horas: '', desc: '' });
    dispararConfetti();
  }

  const horas = proceso?.horas_completadas ?? 0;
  const requeridas = proceso?.horas_requeridas ?? 150;
  const offset = Math.round(CIRCUNFERENCIA * (1 - Math.min(1, horas / requeridas)));
  const etapaActual = etapas.find((e) => e.estado === 'actual')?.nombre ?? proceso?.etapa_actual ?? '';

  const tutoriasFiltradas = tutorias.filter((t) => {
    if (filtroTutoria === 'Todas') return true;
    if (filtroTutoria === 'Virtual') return t.modalidad === 'Virtual';
    if (filtroTutoria === 'Presencial') return t.modalidad === 'Presencial';
    return t.tipo === 'Premium';
  });

  const hoyIdx = (new Date().getDay() + 6) % 7; // lunes=0

  const agendaItems = tutorias
    .filter((t) => tutoriaEstados[t.id])
    .map((t) => ({ titulo: `Tutoría de ${t.materia}`, cuando: t.when }));

  return (
    <div className="c360-scroll-page h-full overflow-y-auto box-border" style={{ padding: '54px 16px 110px' }}>
      <div className="c360-heading mb-1 text-[23px] font-bold">Mi Camino</div>
      <div className="mb-[18px] text-[12.5px]" style={{ color: 'var(--c360-text2)' }}>
        {cuatrimestre.nombre} · Semana {cuatrimestre.semanaActual} de {cuatrimestre.semanasTotales}
      </div>

      <div className="mb-[18px] rounded-3xl p-[18px]" style={{ background: 'var(--c360-surface)' }}>
        <div className="flex items-center gap-[18px]">
          <div className="relative h-[104px] w-[104px] shrink-0">
            <svg width="104" height="104" viewBox="0 0 110 110" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="55" cy="55" r="48" stroke="var(--c360-surface2)" strokeWidth="10" fill="none" />
              <circle cx="55" cy="55" r="48" stroke="var(--c360-accent)" strokeWidth="10" fill="none" strokeLinecap="round" strokeDasharray={CIRCUNFERENCIA} strokeDashoffset={offset} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="c360-heading text-[21px] font-bold">{horas}</div>
              <div className="text-[9.5px]" style={{ color: 'var(--c360-text2)' }}>de {requeridas}h</div>
            </div>
          </div>
          <div className="flex-1">
            <div className="text-[13px] font-bold">TCU — Trabajo Comunal</div>
            <div className="mt-1 text-[11.5px]" style={{ color: 'var(--c360-text2)' }}>Etapa actual: {etapaActual}</div>
            <div className="mt-0.5 text-[11.5px]" style={{ color: 'var(--c360-text2)' }}>{proceso?.periodo}</div>
          </div>
        </div>
        <div className="relative mt-5 flex justify-between">
          <div className="absolute left-[8%] right-[8%] top-[13px] z-0 h-0.5" style={{ background: 'var(--c360-surface2)' }} />
          {etapas.map((e) => {
            const done = e.estado === 'completada';
            const current = e.estado === 'actual';
            return (
              <div key={e.id} className="relative z-[1] flex flex-1 flex-col items-center gap-1.5">
                <div
                  className="flex h-[25px] w-[25px] items-center justify-center rounded-full text-[11px] font-bold"
                  style={{ background: done || current ? 'var(--c360-accent)' : 'var(--c360-surface2)', color: done || current ? 'var(--c360-accent-fg)' : 'var(--c360-text3)' }}
                >
                  {done ? '✓' : e.orden}
                </div>
                <span className="text-center text-[9px] leading-tight" style={{ color: 'var(--c360-text2)' }}>{e.nombre}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mb-[18px] rounded-3xl p-[18px]" style={{ background: 'var(--c360-surface)' }}>
        <div className="mb-3 text-[13.5px] font-bold">Bitácora rápida</div>
        <div className="mb-2.5 flex gap-2">
          <input
            type="date"
            value={nuevaHora.fecha}
            onChange={(e) => setNuevaHora((v) => ({ ...v, fecha: e.target.value }))}
            className="min-w-0 flex-1 rounded-xl border px-3 py-2.5 text-[12.5px]"
            style={{ borderColor: 'var(--c360-border)', background: 'var(--c360-bg)', color: 'var(--c360-text)' }}
          />
          <input
            value={nuevaHora.horas}
            onChange={(e) => setNuevaHora((v) => ({ ...v, horas: e.target.value }))}
            placeholder="Horas"
            className="w-16 rounded-xl border px-3 py-2.5 text-[12.5px]"
            style={{ borderColor: 'var(--c360-border)', background: 'var(--c360-bg)', color: 'var(--c360-text)' }}
          />
        </div>
        <input
          value={nuevaHora.desc}
          onChange={(e) => setNuevaHora((v) => ({ ...v, desc: e.target.value }))}
          placeholder="Descripción de la actividad"
          className="mb-3 w-full rounded-xl border px-3 py-2.5 text-[12.5px] box-border"
          style={{ borderColor: 'var(--c360-border)', background: 'var(--c360-bg)', color: 'var(--c360-text)' }}
        />
        <button onClick={registrarHoras} className="w-full rounded-full py-3 text-[13.5px] font-bold" style={{ background: 'var(--c360-accent)', color: 'var(--c360-accent-fg)' }}>
          Registrar horas
        </button>
        <div className="mt-3.5 flex flex-col gap-2.5">
          {bitacora.map((b) => (
            <div key={b.id} className="flex items-center justify-between border-b pb-2.5" style={{ borderColor: 'var(--c360-border)' }}>
              <div>
                <div className="text-[12.5px] font-semibold">{b.descripcion}</div>
                <div className="mt-0.5 text-[10.5px]" style={{ color: 'var(--c360-text2)' }}>{b.fecha} · {b.horas}h</div>
              </div>
              <span className="text-[10.5px] font-bold" style={{ color: b.estado === 'aprobada' ? '#3DDBB0' : 'var(--c360-text2)' }}>{b.estado}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-2.5 text-[13.5px] font-bold">Tutorías</div>
      <div className="relative mb-3">
        <div className="c360-no-scrollbar flex gap-2 overflow-x-auto pb-2">
          {FILTROS_TUTORIA.map((f) => {
            const activo = filtroTutoria === f;
            return (
              <button
                key={f}
                onClick={() => setFiltroTutoria(f)}
                className="shrink-0 rounded-full border px-3.5 py-2 text-xs font-semibold"
                style={{ borderColor: 'var(--c360-border)', background: activo ? 'var(--c360-accent)' : 'var(--c360-surface)', color: activo ? 'var(--c360-accent-fg)' : 'var(--c360-text)' }}
              >
                {f}
              </button>
            );
          })}
        </div>
      </div>
      <div className="mb-5 flex flex-col gap-3">
        {tutoriasFiltradas.map((t) => {
          const agendada = !!tutoriaEstados[t.id];
          return (
            <div key={t.id} className="flex items-center justify-between gap-2.5 rounded-2xl p-3.5" style={{ background: 'var(--c360-surface)' }}>
              <div className="flex-1">
                <div className="text-[13px] font-bold">{t.materia}</div>
                <div className="mt-0.5 text-[11px]" style={{ color: 'var(--c360-text2)' }}>{t.profesor} · {t.modalidad}</div>
                <div className="mt-px text-[11px]" style={{ color: 'var(--c360-text2)' }}>⭐ {t.rating} · {t.when}</div>
              </div>
              <button
                onClick={() => alternarAgendar(t.id)}
                className="whitespace-nowrap rounded-full px-3.5 py-2.5 text-[11.5px] font-bold"
                style={{ background: agendada ? 'var(--c360-surface2)' : 'var(--c360-accent)', color: agendada ? 'var(--c360-text2)' : 'var(--c360-accent-fg)' }}
              >
                {agendada ? 'Agendada ✅' : 'Agendar'}
              </button>
            </div>
          );
        })}
      </div>

      <div className="mb-2.5 text-[13.5px] font-bold">Agenda de la semana</div>
      <div className="mb-3.5 flex gap-1.5">
        {DIAS_SEMANA.map((d, i) => (
          <div
            key={d}
            className="flex-1 rounded-2xl py-2.5 text-center text-[11px] font-bold"
            style={{ background: i === hoyIdx ? 'var(--c360-accent)' : 'var(--c360-surface)', color: i === hoyIdx ? 'var(--c360-accent-fg)' : 'var(--c360-text2)' }}
          >
            {d}
          </div>
        ))}
      </div>
      <div className="mb-5 flex flex-col gap-2.5">
        {agendaItems.length === 0 && <p className="text-[12.5px]" style={{ color: 'var(--c360-text2)' }}>Todavía no agendaste nada esta semana.</p>}
        {agendaItems.map((a, i) => (
          <div key={i} className="flex items-center gap-3 rounded-2xl p-3.5" style={{ background: 'var(--c360-surface)' }}>
            <div className="flex-1">
              <div className="text-[12.5px] font-semibold">{a.titulo}</div>
              <div className="mt-px text-[10.5px]" style={{ color: 'var(--c360-text2)' }}>{a.cuando}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-3xl p-[18px]" style={{ background: 'var(--c360-surface)' }}>
        <div className="mb-3 flex items-center justify-between">
          <div className="text-[13.5px] font-bold">Objetivos de la semana</div>
          <div className="flex items-center gap-1 text-[12.5px] font-bold" style={{ color: 'var(--c360-accent)' }}>🔥 {usuario.racha_objetivos} sem.</div>
        </div>
        <div className="flex flex-col gap-2.5">
          {objetivosSemana.map((o) => {
            const hecho = objetivosEstado[o.id] ?? o.hecho;
            return (
              <button key={o.id} onClick={() => alternarObjetivo(o.id, 10)} className="flex w-full items-center gap-2.5 text-left">
                <div
                  className="flex h-[21px] w-[21px] shrink-0 items-center justify-center rounded-lg border-2 text-[11px] font-bold"
                  style={{ borderColor: hecho ? 'var(--c360-accent)' : 'var(--c360-border)', background: hecho ? 'var(--c360-accent)' : 'transparent', color: 'var(--c360-accent-fg)' }}
                >
                  {hecho ? '✓' : ''}
                </div>
                <span className="text-[12.5px]" style={{ color: hecho ? 'var(--c360-text2)' : 'var(--c360-text)', textDecoration: hecho ? 'line-through' : 'none' }}>{o.texto}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
