'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useAppShell } from '@/components/mobile/AppShellContext';
import HScroll from '@/components/mobile/HScroll';
import { supabase, TcuProceso, TcuEtapa } from '@/lib/supabase';
import { eventos } from '@/data/eventos';
import { tutorias } from '@/data/tutorias';

type Mensaje = { deUsuario: boolean; texto: string };

export default function AsistentePage() {
  const { usuario, alternarAgendar, dispararConfetti } = useAppShell();
  const [tcu, setTcu] = useState<TcuProceso | null>(null);
  const [etapas, setEtapas] = useState<TcuEtapa[]>([]);
  const [mensajes, setMensajes] = useState<Mensaje[]>([
    { deUsuario: false, texto: `¡Pura vida, ${usuario.nombre.split(' ')[0]}! Soy Rasta 🌊 tu compa en Campus360. ¿En qué te ayudo hoy?` },
  ]);
  const [borrador, setBorrador] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.from('tcu_proceso').select('*').eq('usuario_id', usuario.id).single().then(({ data }) => setTcu(data));
    supabase.from('tcu_etapas').select('*').eq('usuario_id', usuario.id).order('orden').then(({ data }) => setEtapas(data || []));
  }, [usuario.id]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [mensajes]);

  function decir(usuarioTexto: string, aiTexto: string) {
    setMensajes((m) => [...m, { deUsuario: true, texto: usuarioTexto }]);
    setTimeout(() => setMensajes((m) => [...m, { deUsuario: false, texto: aiTexto }]), 450);
  }

  function chipTcu() {
    const horas = tcu?.horas_completadas ?? 0;
    const requeridas = tcu?.horas_requeridas ?? 150;
    const etapaActual = etapas.find((e) => e.estado === 'actual')?.nombre ?? tcu?.etapa_actual ?? 'sin iniciar';
    decir(
      '¿Cuántas horas de TCU me faltan?',
      `Vas en ${horas} de ${requeridas} horas de TCU (${Math.round((horas / requeridas) * 100)}%) 💪 Te faltan ${Math.max(0, requeridas - horas)} horas. Estás en la etapa de ${etapaActual} — ¡seguí así!`
    );
  }

  function chipHoy() {
    const hoyIso = new Date().toISOString().slice(0, 10);
    const eventoHoy = eventos.find((e) => e.fecha === hoyIso);
    const tutoriaHoy = tutorias.find((t) => t.when.startsWith('Hoy'));
    const partes: string[] = [];
    if (eventoHoy) partes.push(`🎤 ${eventoHoy.titulo} a las ${eventoHoy.hora} en ${eventoHoy.lugar}`);
    if (tutoriaHoy) partes.push(`tu tutoría de ${tutoriaHoy.materia} a las ${tutoriaHoy.when.split('· ')[1] ?? tutoriaHoy.when}`);
    decir('¿Qué hay hoy en campus?', partes.length ? `Hoy tenés: ${partes.join(', y ')}. ¿Te ayudo a elegir?` : 'Hoy no tenés eventos ni tutorías agendadas — buen momento para explorar Descubrir 👀');
  }

  function chipTutoria() {
    const tutoriaHoy = tutorias.find((t) => t.when.startsWith('Hoy')) ?? tutorias[0];
    alternarAgendar(tutoriaHoy.id);
    decir('Agendame una tutoría', `¡Listo! Te agendé la tutoría de ${tutoriaHoy.materia} para ${tutoriaHoy.when} con ${tutoriaHoy.profesor} 📅✅`);
    dispararConfetti();
  }

  function chipEvento() {
    const recomendado = eventos.find((e) => e.carrerasRecomendadas.includes(usuario.carrera ?? '')) ?? eventos[0];
    decir('Recomendame un evento', `Por tu carrera (${usuario.carrera}) te recomiendo "${recomendado.titulo}" — ${recomendado.resumen}`);
  }

  function enviarLibre() {
    const texto = borrador.trim();
    if (!texto) return;
    setBorrador('');
    decir(texto, '¡Buena pregunta! Por ahora puedo ayudarte mejor con TCU, tutorías y eventos — probá uno de los accesos rápidos 👇');
  }

  return (
    <div className="flex h-full flex-col box-border" style={{ paddingTop: 54 }}>
      <div className="flex shrink-0 items-center gap-2.5 border-b px-4 pb-3.5" style={{ borderColor: 'var(--c360-border)' }}>
        <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full" style={{ background: 'var(--c360-accent)' }}>
          <Image src="/campus360/rasta-mascot.png" alt="Rasta" width={36} height={36} className="h-full w-full object-contain" />
        </div>
        <div>
          <div className="text-[14.5px] font-bold">Rasta</div>
          <div className="text-[10.5px] text-[#3DDBB0]">● en línea</div>
        </div>
      </div>

      <div ref={scrollRef} className="c360-scroll-gold flex-1 overflow-y-auto p-4" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {mensajes.map((m, i) => (
          <div
            key={i}
            className="max-w-[78%] text-[13.5px] leading-snug"
            style={{
              alignSelf: m.deUsuario ? 'flex-end' : 'flex-start',
              background: m.deUsuario ? 'var(--c360-accent)' : 'var(--c360-surface)',
              color: m.deUsuario ? 'var(--c360-accent-fg)' : 'var(--c360-text)',
              padding: '10px 14px',
              borderRadius: m.deUsuario ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
            }}
          >
            {m.texto}
          </div>
        ))}
      </div>

      <div className="relative shrink-0 px-4 pb-3">
        <HScroll>
          <button onClick={chipTcu} className="shrink-0 whitespace-nowrap rounded-full border px-3.5 py-[9px] text-xs font-semibold" style={{ borderColor: 'var(--c360-border)', background: 'var(--c360-surface)' }}>¿Cuántas horas de TCU me faltan?</button>
          <button onClick={chipHoy} className="shrink-0 whitespace-nowrap rounded-full border px-3.5 py-[9px] text-xs font-semibold" style={{ borderColor: 'var(--c360-border)', background: 'var(--c360-surface)' }}>¿Qué hay hoy en campus?</button>
          <button onClick={chipTutoria} className="shrink-0 whitespace-nowrap rounded-full border px-3.5 py-[9px] text-xs font-semibold" style={{ borderColor: 'var(--c360-border)', background: 'var(--c360-surface)' }}>Agendame una tutoría</button>
          <button onClick={chipEvento} className="shrink-0 whitespace-nowrap rounded-full border px-3.5 py-[9px] text-xs font-semibold" style={{ borderColor: 'var(--c360-border)', background: 'var(--c360-surface)' }}>Recomendame un evento</button>
        </HScroll>
      </div>

      <div className="flex shrink-0 gap-2 border-t px-4 pb-[18px] pt-2.5" style={{ borderColor: 'var(--c360-border)' }}>
        <input
          value={borrador}
          onChange={(e) => setBorrador(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && enviarLibre()}
          placeholder="Escribile a Rasta..."
          className="min-w-0 flex-1 rounded-full border px-4 py-3 text-[13.5px] outline-none"
          style={{ borderColor: 'var(--c360-border)', background: 'var(--c360-surface)', color: 'var(--c360-text)' }}
        />
        <button onClick={enviarLibre} className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full" style={{ background: 'var(--c360-accent)' }}>
          <svg width="17" height="17" viewBox="0 0 24 24"><path d="M3 11l18-8-8 18-2-8-8-2z" fill="#152238" /></svg>
        </button>
      </div>
    </div>
  );
}
