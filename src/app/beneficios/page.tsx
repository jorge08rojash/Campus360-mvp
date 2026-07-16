'use client';

import { useEffect, useMemo, useState } from 'react';
import { useUsuarioActual } from '@/lib/useUsuarioActual';
import { usePageTitle } from '@/lib/usePageTitle';
import { supabase, TcuProceso } from '@/lib/supabase';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { ToastStack, useToast } from '@/components/Toast';
import { leerColeccion } from '@/lib/simulatedStore';
import {
  accionesParaGanar,
  recompensas,
  umbralesNivel,
  nivelActual,
  siguienteNivel,
  CategoriaRecompensa,
} from '@/data/beneficios';

type TutoriaAgendada = { id: string };
type EventoRegistrado = { id: string };

const tabsCategoria: (CategoriaRecompensa | 'Todos')[] = ['Todos', 'Académicos', 'Transporte', 'Alimentación'];

export default function BeneficiosPage() {
  const { usuario, cargando, cerrarSesion } = useUsuarioActual();
  usePageTitle('Beneficios y Recompensas');
  const [proceso, setProceso] = useState<TcuProceso | null>(null);
  const [tutorias, setTutorias] = useState<TutoriaAgendada[]>([]);
  const [misEventos, setMisEventos] = useState<EventoRegistrado[]>([]);
  const [canjeado, setCanjeado] = useState<string | null>(null);
  const [tab, setTab] = useState<CategoriaRecompensa | 'Todos'>('Todos');
  const [verHistorial, setVerHistorial] = useState(false);
  const { toasts, mostrarToast } = useToast();

  useEffect(() => {
    if (!usuario) return;
    supabase.from('tcu_proceso').select('*').eq('usuario_id', usuario.id).single().then(({ data }) => setProceso(data));
    setTutorias(leerColeccion<TutoriaAgendada>(usuario.id, 'tutorias'));
    setMisEventos(leerColeccion<EventoRegistrado>(usuario.id, 'eventos'));
  }, [usuario]);

  const puntos = useMemo(
    () => misEventos.length * 45 + tutorias.length * 20 + (proceso?.horas_completadas ?? 0) * 2,
    [misEventos, tutorias, proceso]
  );

  const historial = useMemo(() => {
    const items: { texto: string; puntos: number; fecha: string }[] = [];
    tutorias.forEach((_, i) => items.push({ texto: 'Tutoría completada', puntos: 20, fecha: `Hace ${i + 1} semana(s)` }));
    misEventos.forEach((_, i) => items.push({ texto: 'Asistencia a evento académico', puntos: 45, fecha: `Hace ${i + 2} día(s)` }));
    if (proceso?.horas_completadas) items.push({ texto: `${proceso.horas_completadas}h de TCU acumuladas`, puntos: proceso.horas_completadas * 2, fecha: 'Acumulado' });
    return items;
  }, [tutorias, misEventos, proceso]);

  if (cargando || !usuario) return null;

  const nivel = nivelActual(puntos);
  const siguiente = siguienteNivel(nivel);
  const faltan = siguiente ? umbralesNivel[siguiente] - puntos : 0;
  const colonesEquivalentes = puntos * 2;
  const pctNivel = siguiente
    ? Math.min(100, Math.round(((puntos - umbralesNivel[nivel]) / (umbralesNivel[siguiente] - umbralesNivel[nivel])) * 100))
    : 100;

  const recompensasFiltradas = tab === 'Todos' ? recompensas : recompensas.filter((r) => r.categoria === tab);

  function canjear(id: string, costo: number, nombre: string) {
    if (puntos < costo) return;
    setCanjeado(id);
    mostrarToast(`Canjeaste "${nombre}". Revisá tu correo institucional para el código.`, 'exito');
    setTimeout(() => setCanjeado(null), 2500);
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#FFFFFF]">
      <Sidebar usuario={usuario} cerrarSesion={cerrarSesion} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar usuario={usuario} />
        <main className="flex-1 px-6 py-8 md:px-10 md:py-10 max-w-6xl">
          <div className="flex items-center justify-between mb-1">
            <h1 className="font-serif-brand text-3xl text-[#2B6477]">Beneficios y Recompensas</h1>
            <button
              onClick={() => setVerHistorial(true)}
              className="flex items-center gap-1.5 text-sm font-medium border border-gray-200 px-4 py-2 rounded-lg hover:border-[#2B6477] hover:text-[#2B6477] transition-colors"
            >
              ⟲ Historial de puntos
            </button>
          </div>
          <p className="text-gray-500 text-sm mb-8">
            Ganá puntos por participar activamente en tu vida universitaria y canjealos por beneficios reales.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            {/* Balance actual */}
            <div className="md:col-span-1 bg-[#2B6477] text-white rounded-2xl p-6 relative overflow-hidden">
              <div className="flex items-start justify-between mb-2">
                <p className="text-[10px] uppercase tracking-wide text-white/50 font-mono-brand">Balance actual</p>
                <span className="text-[10px] font-medium bg-white/10 px-2.5 py-1 rounded-full whitespace-nowrap">
                  Equivalente a ₡{colonesEquivalentes.toLocaleString('es-CR')}
                </span>
              </div>
              <p className="text-4xl font-serif-brand mb-4">{puntos.toLocaleString('es-CR')} <span className="text-lg font-sans">pts</span></p>

              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/15 flex items-center gap-1">
                  🏅 Nivel {nivel}
                </span>
                {siguiente && <span className="text-xs text-white/50">Faltan {faltan.toLocaleString('es-CR')} pts para {siguiente}</span>}
              </div>
              {siguiente && (
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-[#D9A441] rounded-full transition-all" style={{ width: `${pctNivel}%` }} />
                </div>
              )}
            </div>

            {/* Acciones para ganar */}
            <div className="md:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-semibold text-[#2B6477] mb-4 flex items-center gap-1.5">⚡ Acciones para ganar</h2>
              <div className="space-y-3">
                {accionesParaGanar.slice(0, 3).map((a) => (
                  <div key={a.id} className="flex items-center justify-between border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-[#2B6477]/8 flex items-center justify-center text-sm">{a.icono}</span>
                      <span className="text-sm text-gray-700">{a.texto}</span>
                    </div>
                    <span className="text-sm text-[#2B6477] font-semibold shrink-0 bg-[#2B6477]/8 px-2.5 py-1 rounded-full">+{a.puntos} pts</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recompensas disponibles */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-[#2B6477]">Canjeá tus puntos</h2>
            <div className="flex bg-gray-100 rounded-full p-1 text-xs">
              {tabsCategoria.map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-3.5 py-1.5 rounded-full font-medium transition-colors whitespace-nowrap ${
                    tab === t ? 'bg-white shadow-sm text-[#2B6477]' : 'text-gray-500'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recompensasFiltradas.map((r) => {
              const puedeCanjear = puntos >= r.costo && r.disponible;
              return (
                <div key={r.id} className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col relative">
                  <span
                    className="absolute top-4 right-4 text-[9px] font-semibold uppercase px-2 py-0.5 rounded-full"
                    style={{
                      background: r.limitado ? '#FCE4E1' : r.colorFondo,
                      color: r.limitado ? '#C0392B' : r.colorTexto,
                    }}
                  >
                    {r.limitado ? 'Limitado' : r.categoria}
                  </span>
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-4"
                    style={{ background: r.colorFondo, color: r.colorTexto }}
                  >
                    {r.icono}
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-1 text-sm leading-snug">{r.nombre}</h3>
                  <p className="text-xs text-gray-500 flex-1 mb-4 leading-relaxed">{r.descripcion}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                      🪙 {r.costo.toLocaleString('es-CR')} <span className="font-normal text-gray-400">pts</span>
                    </span>
                    <button
                      disabled={!puedeCanjear}
                      onClick={() => canjear(r.id, r.costo, r.nombre)}
                      className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                        puedeCanjear
                          ? 'bg-[#2B6477] text-white hover:bg-[#1F5567]'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {!r.disponible ? 'Próximamente' : canjeado === r.id ? '¡Canjeado! ✓' : 'Canjear'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {verHistorial && (
            <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 px-4" onClick={() => setVerHistorial(false)}>
              <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[70vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-[#2B6477]">Historial de puntos</h3>
                  <button onClick={() => setVerHistorial(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                </div>
                {historial.length === 0 && <p className="text-sm text-gray-400">Todavía no tenés movimientos de puntos.</p>}
                <div className="space-y-3">
                  {historial.map((h, i) => (
                    <div key={i} className="flex items-center justify-between border-b border-gray-50 pb-2 last:border-0">
                      <div>
                        <p className="text-sm text-gray-700">{h.texto}</p>
                        <p className="text-xs text-gray-400">{h.fecha}</p>
                      </div>
                      <span className="text-sm font-semibold text-[#2B6477]">+{h.puntos} pts</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
      <ToastStack toasts={toasts} />
    </div>
  );
}
