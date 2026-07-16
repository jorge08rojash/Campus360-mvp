'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useUsuarioActual } from '@/lib/useUsuarioActual';
import { usePageTitle } from '@/lib/usePageTitle';
import { supabase, TcuProceso, Recordatorio } from '@/lib/supabase';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { eventos } from '@/data/eventos';
import { actividades } from '@/data/vidaUniversitaria';
import { materiasActuales, noticias, objetivosSemana, cuatrimestre } from '@/data/academico';
import { leerColeccion, guardarColeccion } from '@/lib/simulatedStore';

type TutoriaAgendada = { id: string; nombre: string; materia: string };
type EventoRegistrado = { id: string; eventoId: string; titulo: string; fecha: string };
type Objetivo = { id: string; texto: string; hecho: boolean };

export default function InicioPage() {
  const { usuario, cargando, cerrarSesion } = useUsuarioActual();
  usePageTitle('Inicio');
  const [proceso, setProceso] = useState<TcuProceso | null>(null);
  const [recordatorios, setRecordatorios] = useState<Recordatorio[]>([]);
  const [tutorias, setTutorias] = useState<TutoriaAgendada[]>([]);
  const [misEventos, setMisEventos] = useState<EventoRegistrado[]>([]);
  const [objetivos, setObjetivos] = useState<Objetivo[]>([]);
  const [errorRed, setErrorRed] = useState(false);

  useEffect(() => {
    if (!usuario) return;
    setErrorRed(false);
    supabase
      .from('tcu_proceso')
      .select('*')
      .eq('usuario_id', usuario.id)
      .single()
      .then(({ data, error }) => {
        if (error) setErrorRed(true);
        else setProceso(data);
      });
    supabase
      .from('recordatorios')
      .select('*')
      .eq('usuario_id', usuario.id)
      .eq('estado', 'pendiente')
      .order('fecha_limite', { ascending: true })
      .then(({ data, error }) => {
        if (error) setErrorRed(true);
        else setRecordatorios(data || []);
      });
    setTutorias(leerColeccion<TutoriaAgendada>(usuario.id, 'tutorias'));
    setMisEventos(leerColeccion<EventoRegistrado>(usuario.id, 'eventos'));
    const obj = leerColeccion<Objetivo>(usuario.id, 'objetivos');
    setObjetivos(obj.length ? obj : objetivosSemana);
  }, [usuario]);

  if (cargando || !usuario) return null;

  const pct = proceso ? Math.round((proceso.horas_completadas / proceso.horas_requeridas) * 100) : 0;
  const pctCuatri = Math.round((cuatrimestre.semanaActual / cuatrimestre.semanasTotales) * 100);
  const pctCarrera = Math.round((cuatrimestre.creditosAprobados / cuatrimestre.creditosTotales) * 100);
  const puntos = misEventos.length * 45 + tutorias.length * 20 + (proceso?.horas_completadas ?? 0) * 2;

  function toggleObjetivo(id: string) {
    const nuevos = objetivos.map((o) => (o.id === id ? { ...o, hecho: !o.hecho } : o));
    setObjetivos(nuevos);
    guardarColeccion(usuario!.id, 'objetivos', nuevos);
  }

  const recomendaciones = [
    proceso && proceso.horas_completadas < proceso.horas_requeridas
      ? `Te faltan ${proceso.horas_requeridas - proceso.horas_completadas} horas de TCU. El voluntariado de reforestación otorga 8 horas válidas.`
      : 'Ya completaste tu TCU. Es buen momento para enfocarte en tu tesis.',
    tutorias.length === 0
      ? 'No tenés tutorías agendadas. Con tu carga de Bases de Datos, una sesión con el Ing. Vargas podría ayudarte.'
      : `Tenés ${tutorias.length} tutoría(s) agendada(s). Buen ritmo.`,
    'La Feria de Empleo del 5 de agosto es la actividad con mayor retorno para tu perfil este cuatrimestre.',
  ];

  const proximosEventos = [...eventos].sort((a, b) => a.fecha.localeCompare(b.fecha)).slice(0, 3);
  const actividadesDestacadas = actividades.slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#FFFFFF]">
      <Sidebar usuario={usuario} cerrarSesion={cerrarSesion} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar usuario={usuario} />
      <main className="flex-1 px-6 py-8 md:px-10 md:py-10 max-w-6xl">
        {errorRed && (
          <div className="bg-[#B5566B]/10 border border-[#B5566B]/30 text-[#9E4A5C] rounded-xl px-4 py-3 mb-6 flex items-center gap-2 text-sm">
            <span>⚠️</span>
            No pudimos cargar algunos datos. Revisá tu conexión y recargá la página.
          </div>
        )}
        {/* Hero */}
        <div className="c360-grid-bg relative overflow-hidden rounded-3xl p-7 md:p-9 text-white mb-6" style={{ backgroundImage: 'linear-gradient(135deg, #2B6477 0%, #1F5567 100%)' }}>
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-[#D9A441]/20 blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 right-16 w-24 h-24 rounded-full bg-white/5 blur-xl pointer-events-none" />
          <p className="relative font-mono-brand text-[10px] uppercase tracking-widest text-[#E8C989] mb-2">
            {cuatrimestre.nombre} · Semana {cuatrimestre.semanaActual} de {cuatrimestre.semanasTotales}
          </p>
          <h1 className="relative font-serif-brand text-3xl md:text-4xl mb-2">
            ¡Hola, {usuario.nombre.split(' ')[0]}! <span className="italic text-[#E8C989]">Vas bien.</span>
          </h1>
          <p className="relative text-white/60 text-sm mb-6">
            {usuario.carrera} · Cuatrimestre {usuario.cuatrimestre} · {recordatorios.length} pendiente(s) esta semana
          </p>
          <div className="relative mb-2 flex justify-between text-xs text-white/50 font-mono-brand">
            <span>Progreso del cuatrimestre</span>
            <span>{pctCuatri}%</span>
          </div>
          <div className="relative w-full bg-white/10 rounded-full h-2">
            <div className="bg-[#D9A441] h-2 rounded-full transition-all duration-700" style={{ width: `${pctCuatri}%` }} />
          </div>
        </div>

        {/* Widgets de estado */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Progreso TCU', valor: `${pct}%`, sub: `${proceso?.horas_completadas ?? 0}/${proceso?.horas_requeridas ?? 150} h`, color: 'text-[#2B6477]', href: '/tcu' },
            { label: 'Avance de carrera', valor: `${pctCarrera}%`, sub: `${cuatrimestre.creditosAprobados}/${cuatrimestre.creditosTotales} créditos`, color: 'text-[#1B5E7B]', href: '/perfil' },
            { label: 'Promedio', valor: `${cuatrimestre.promedio}`, sub: 'Acumulado', color: 'text-purple-600', href: '/perfil' },
            { label: 'Puntos Campus360', valor: `${puntos}`, sub: 'Este cuatrimestre', color: 'text-[#2B6477]', href: '/perfil' },
          ].map((w) => (
            <Link
              key={w.label}
              href={w.href}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1 font-mono-brand">{w.label}</p>
              <p className={`font-serif-brand text-2xl ${w.color}`}>{w.valor}</p>
              <p className="text-[11px] text-gray-400">{w.sub}</p>
            </Link>
          ))}
        </div>

        {/* Recomendaciones IA */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span>✨</span>
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide font-mono-brand">
              Recomendado para vos
            </h2>
          </div>
          <ul className="space-y-2">
            {recomendaciones.map((r, i) => (
              <li key={i} className="text-sm text-gray-600 flex gap-2">
                <span className="text-[#2B6477] mt-0.5">▸</span>
                {r}
              </li>
            ))}
          </ul>
          <Link href="/asistente" className="text-xs font-medium text-[#2B6477] hover:underline mt-3 inline-block">
            Hablar con el asistente →
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Columna izquierda */}
          <div className="lg:col-span-2 space-y-6">
            {/* Próximas entregas */}
            <section>
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 font-mono-brand">
                Próximas entregas y fechas
              </h2>
              <div className="space-y-2">
                {recordatorios.length === 0 && (
                  <div className="bg-white rounded-xl p-4 border border-gray-100 text-sm text-gray-400">
                    Sin entregas pendientes 🎉
                  </div>
                )}
                {recordatorios.map((r) => (
                  <div
                    key={r.id}
                    className={`bg-white rounded-xl p-4 shadow-sm border-l-4 flex justify-between items-center hover:shadow-md transition-shadow ${
                      r.prioridad === 'alta' ? 'border-l-[#2B6477]' : r.prioridad === 'media' ? 'border-l-yellow-400' : 'border-l-gray-200'
                    }`}
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-800">{r.titulo}</p>
                      {r.fecha_limite && (
                        <p className="text-xs text-gray-400 font-mono-brand">
                          Vence {new Date(r.fecha_limite).toLocaleDateString('es-CR')}
                        </p>
                      )}
                    </div>
                    <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-gray-50 text-gray-500 font-mono-brand">
                      {r.tipo}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Materias actuales */}
            <section>
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 font-mono-brand">
                Materias de este cuatrimestre
              </h2>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-50">
                {materiasActuales.map((m) => (
                  <div key={m.id} className="p-4 flex items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{m.nombre}</p>
                      <p className="text-xs text-gray-400 font-mono-brand">
                        {m.codigo} · {m.profesor}
                      </p>
                      <div className="w-32 bg-gray-100 rounded-full h-1 mt-2">
                        <div className="bg-[#2B6477] h-1 rounded-full" style={{ width: `${m.progreso}%` }} />
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      {m.nota !== null ? (
                        <p className="font-serif-brand text-xl text-[#2B6477]">{m.nota}</p>
                      ) : (
                        <p className="text-xs text-gray-300 font-mono-brand">Sin nota</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Próximos eventos */}
            <section>
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide font-mono-brand">
                  Eventos destacados
                </h2>
                <Link href="/eventos" className="text-xs text-[#2B6477] hover:underline">
                  Ver todos →
                </Link>
              </div>
              <div className="space-y-3">
                {proximosEventos.map((e) => (
                  <Link
                    key={e.id}
                    href={`/eventos/${e.slug}`}
                    className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all"
                  >
                    <div className="w-12 text-center shrink-0">
                      <p className="text-[10px] uppercase text-[#2B6477] font-semibold font-mono-brand">
                        {new Date(e.fecha).toLocaleDateString('es-CR', { month: 'short' }).replace('.', '')}
                      </p>
                      <p className="font-serif-brand text-xl text-[#2B6477] leading-none">{new Date(e.fecha).getDate()}</p>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-800 text-sm">{e.titulo}</p>
                      <p className="text-xs text-gray-400">{e.lugar} · {e.hora}</p>
                      <p className="text-[11px] text-gray-400 mt-1 font-mono-brand">
                        {e.inscritos}/{e.cupos} inscritos · +{e.puntos} pts
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          {/* Columna derecha */}
          <div className="space-y-6">
            {/* Objetivos de la semana */}
            <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 font-mono-brand">
                Objetivos de la semana
              </h2>
              <ul className="space-y-2">
                {objetivos.map((o) => (
                  <li key={o.id}>
                    <button
                      onClick={() => toggleObjetivo(o.id)}
                      className="flex items-start gap-2 text-left w-full group"
                    >
                      <span
                        className={`w-4 h-4 rounded border shrink-0 mt-0.5 flex items-center justify-center text-[9px] transition-colors ${
                          o.hecho ? 'bg-[#2B6477] border-[#2B6477] text-white' : 'border-gray-300 group-hover:border-[#2B6477]'
                        }`}
                      >
                        {o.hecho && '✓'}
                      </span>
                      <span className={`text-sm ${o.hecho ? 'text-gray-300 line-through' : 'text-gray-600'}`}>
                        {o.texto}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>

            {/* Próximas tutorías */}
            <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 font-mono-brand">
                Tus tutorías
              </h2>
              {tutorias.length === 0 ? (
                <p className="text-sm text-gray-400">
                  Sin tutorías agendadas.{' '}
                  <Link href="/tutorias" className="text-[#2B6477] hover:underline">
                    Buscar tutor
                  </Link>
                </p>
              ) : (
                <ul className="space-y-2">
                  {tutorias.slice(0, 3).map((t) => (
                    <li key={t.id} className="text-sm">
                      <p className="font-medium text-gray-800">{t.materia}</p>
                      <p className="text-xs text-gray-400">{t.nombre}</p>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* Vida universitaria */}
            <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide font-mono-brand">
                  Vida universitaria
                </h2>
                <Link href="/vida-universitaria" className="text-xs text-[#2B6477] hover:underline">
                  Ver →
                </Link>
              </div>
              <ul className="space-y-3">
                {actividadesDestacadas.map((a) => (
                  <li key={a.id}>
                    <Link href={`/vida-universitaria/${a.slug}`} className="flex gap-3 group">
                      <span className="text-lg">{a.emoji}</span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800 group-hover:text-[#2B6477] truncate">{a.titulo}</p>
                        <p className="text-[11px] text-gray-400 font-mono-brand">+{a.puntos} pts</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            {/* Noticias */}
            <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 font-mono-brand">
                Noticias de la U
              </h2>
              <ul className="space-y-3">
                {noticias.map((n) => (
                  <li key={n.id} className="border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                    <span className="text-[9px] uppercase font-semibold text-[#2B6477] font-mono-brand">{n.categoria}</span>
                    <p className="text-sm text-gray-700 leading-snug">{n.titulo}</p>
                    <p className="text-[10px] text-gray-300 font-mono-brand">
                      {new Date(n.fecha).toLocaleDateString('es-CR')}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </main>
      </div>
    </div>
  );
}
