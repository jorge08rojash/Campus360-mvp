'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useUsuarioActual } from '@/lib/useUsuarioActual';
import { usePageTitle } from '@/lib/usePageTitle';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { ToastStack, useToast } from '@/components/Toast';
import { eventos, dotCategoria, asesoresProyecto } from '@/data/eventos';
import { leerColeccion } from '@/lib/simulatedStore';

type EventoRegistrado = { id: string; eventoId: string };

const categorias = ['Todos', 'Conferencia', 'Taller', 'Webinar', 'Feria'];
const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const nombresMes = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

function claveDia(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function EventosPage() {
  const { usuario, cargando, cerrarSesion } = useUsuarioActual();
  usePageTitle('Eventos');
  const [vista, setVista] = useState<'lista' | 'calendario'>('calendario');
  const [categoria, setCategoria] = useState('Todos');
  const [soloCarrera, setSoloCarrera] = useState(false);
  const [proponerAbierto, setProponerAbierto] = useState(false);
  const [nuevoTitulo, setNuevoTitulo] = useState('');
  const [nuevaCategoria, setNuevaCategoria] = useState('Conferencia');
  const [nuevaDescripcion, setNuevaDescripcion] = useState('');
  const { toasts, mostrarToast } = useToast();
  const [busqueda, setBusqueda] = useState('');
  const [misEventos, setMisEventos] = useState<EventoRegistrado[]>([]);
  const [mesRef, setMesRef] = useState(() => {
    const hoy = new Date();
    return new Date(hoy.getFullYear(), hoy.getMonth(), 1);
  });
  const [diaSeleccionado, setDiaSeleccionado] = useState<string | null>(null);

  useEffect(() => {
    if (usuario) setMisEventos(leerColeccion<EventoRegistrado>(usuario.id, 'eventos'));
  }, [usuario]);

  const eventosPorDia = useMemo(() => {
    const mapa: Record<string, typeof eventos> = {};
    for (const e of eventos) {
      if (categoria !== 'Todos' && e.categoria !== categoria) continue;
      if (soloCarrera && !e.carrerasRecomendadas.includes(usuario?.carrera ?? '')) continue;
      const key = e.fecha;
      if (!mapa[key]) mapa[key] = [];
      mapa[key].push(e);
    }
    return mapa;
  }, [categoria, soloCarrera, usuario?.carrera]);

  const proximoEvento = useMemo(() => {
    const hoyStr = claveDia(new Date());
    return [...eventos].filter((e) => e.fecha >= hoyStr).sort((a, b) => a.fecha.localeCompare(b.fecha))[0];
  }, []);

  const registradosDelMes = useMemo(() => {
    const prefijo = `${mesRef.getFullYear()}-${String(mesRef.getMonth() + 1).padStart(2, '0')}`;
    return misEventos.filter((m) => {
      const ev = eventos.find((e) => e.id === m.eventoId);
      return ev && ev.fecha.startsWith(prefijo);
    }).length;
  }, [misEventos, mesRef]);

  if (cargando || !usuario) return null;

  const lista = eventos.filter((e) => {
    const c = categoria === 'Todos' || e.categoria === categoria;
    const b = (e.titulo + e.resumen + e.organizador).toLowerCase().includes(busqueda.toLowerCase());
    const carr = !soloCarrera || e.carrerasRecomendadas.includes(usuario.carrera ?? '');
    return c && b && carr;
  });

  // --- construir grilla del mes ---
  const primerDiaMes = new Date(mesRef.getFullYear(), mesRef.getMonth(), 1);
  const ultimoDiaMes = new Date(mesRef.getFullYear(), mesRef.getMonth() + 1, 0);
  const offsetInicio = (primerDiaMes.getDay() + 6) % 7; // lunes=0
  const totalCeldas = Math.ceil((offsetInicio + ultimoDiaMes.getDate()) / 7) * 7;
  const celdas: (Date | null)[] = [];
  for (let i = 0; i < totalCeldas; i++) {
    const diaNum = i - offsetInicio + 1;
    celdas.push(diaNum >= 1 && diaNum <= ultimoDiaMes.getDate() ? new Date(mesRef.getFullYear(), mesRef.getMonth(), diaNum) : null);
  }
  const hoyKey = claveDia(new Date());

  function cambiarMes(delta: number) {
    setMesRef(new Date(mesRef.getFullYear(), mesRef.getMonth() + delta, 1));
    setDiaSeleccionado(null);
  }

  const eventosDelDiaSeleccionado = diaSeleccionado ? eventosPorDia[diaSeleccionado] || [] : [];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#FFFFFF]">
      <Sidebar usuario={usuario} cerrarSesion={cerrarSesion} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar usuario={usuario} />
        <main className="flex-1 px-6 py-8 md:px-10 md:py-10 max-w-6xl">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-1">
            <div>
              <h1 className="font-serif-brand text-3xl text-[#2B6477]">Eventos universitarios</h1>
              <p className="text-gray-500 text-sm mt-1">
                {nombresMes[mesRef.getMonth()]} {mesRef.getFullYear()} · {eventos.length} eventos esta temporada para tu carrera
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex bg-gray-100 rounded-full p-1 text-sm">
                <button
                  onClick={() => setVista('lista')}
                  className={`px-4 py-1.5 rounded-full font-medium transition-colors ${vista === 'lista' ? 'bg-white shadow-sm text-[#2B6477]' : 'text-gray-500'}`}
                >
                  Lista
                </button>
                <button
                  onClick={() => setVista('calendario')}
                  className={`px-4 py-1.5 rounded-full font-medium transition-colors ${vista === 'calendario' ? 'bg-[#2B6477] text-white' : 'text-gray-500'}`}
                >
                  Calendario
                </button>
              </div>
              <button
                onClick={() => setProponerAbierto(true)}
                className="text-sm font-medium bg-[#2B6477] text-white px-4 py-2 rounded-lg hover:bg-[#1F5567] transition-colors whitespace-nowrap"
              >
                Proponer evento +
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 my-5">
            {categorias.map((c) => (
              <button
                key={c}
                onClick={() => setCategoria(c)}
                className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full transition-all ${
                  categoria === c ? 'bg-[#2B6477] text-white' : 'bg-white text-gray-500 border border-gray-200 hover:border-[#2B6477]'
                }`}
              >
                {c !== 'Todos' && <span className="w-1.5 h-1.5 rounded-full" style={{ background: categoria === c ? '#fff' : dotCategoria[c] }} />}
                {c === 'Conferencia' ? 'Conferencias' : c === 'Taller' ? 'Talleres' : c === 'Webinar' ? 'Webinars' : c === 'Feria' ? 'Ferias' : c}
              </button>
            ))}
            <button
              onClick={() => setSoloCarrera((v) => !v)}
              className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                soloCarrera ? 'bg-[#D9A441] text-white border-[#D9A441]' : 'bg-[#D9A441]/15 text-[#8a6417] border-[#D9A441]/30'
              }`}
            >
              ✦ Para tu carrera
            </button>
          </div>

          {vista === 'lista' && (
            <>
              <input
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar eventos, organizadores…"
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm mb-5 focus:outline-none focus:ring-2 focus:ring-[#2B6477]/20 transition-shadow"
              />
              <div className="grid sm:grid-cols-2 gap-4">
                {lista.map((e) => {
                  const registrado = misEventos.some((m) => m.eventoId === e.id);
                  const llenado = Math.round((e.inscritos / e.cupos) * 100);
                  return (
                    <Link
                      key={e.id}
                      href={`/eventos/${e.slug}`}
                      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all group"
                    >
                      <div className="c360-grid-bg h-24 flex items-end p-4">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/90 text-[#2B6477] font-mono-brand uppercase">
                          {e.categoria}
                        </span>
                      </div>
                      <div className="p-5">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="font-semibold text-gray-800 text-sm leading-snug group-hover:text-[#2B6477]">
                            {e.titulo}
                          </h3>
                          {registrado && (
                            <span className="text-[9px] font-semibold uppercase px-2 py-0.5 rounded-full bg-green-50 text-green-600 shrink-0 font-mono-brand">
                              Inscrito
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mb-3 line-clamp-2">{e.resumen}</p>
                        <div className="text-xs text-gray-400 space-y-1 font-mono-brand">
                          <p>📅 {new Date(e.fecha).toLocaleDateString('es-CR', { day: 'numeric', month: 'long' })} · {e.hora}</p>
                          <p>📍 {e.lugar} · {e.modalidad}</p>
                        </div>
                        <div className="mt-3">
                          <div className="flex justify-between text-[10px] text-gray-400 mb-1 font-mono-brand">
                            <span>{e.inscritos}/{e.cupos} inscritos</span>
                            <span className="text-[#2B6477]">+{e.puntos} pts</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-1">
                            <div className="h-1 rounded-full bg-[#2B6477]" style={{ width: `${llenado}%` }} />
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
              {lista.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-14 h-14 rounded-2xl bg-[#D9A441]/15 flex items-center justify-center text-2xl mx-auto mb-4">📅</div>
                  <p className="text-gray-600 font-medium mb-1">No hay eventos con esos filtros</p>
                  <p className="text-gray-400 text-sm">Probá con otra categoría o quitá el filtro de carrera.</p>
                </div>
              )}
            </>
          )}

          {vista === 'calendario' && (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
              {/* Calendario principal */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-[#2B6477]">{nombresMes[mesRef.getMonth()]} {mesRef.getFullYear()}</h2>
                  <div className="flex items-center gap-1">
                    <button onClick={() => cambiarMes(-1)} className="w-7 h-7 rounded-lg hover:bg-gray-100 text-gray-500 flex items-center justify-center">‹</button>
                    <button onClick={() => cambiarMes(1)} className="w-7 h-7 rounded-lg hover:bg-gray-100 text-gray-500 flex items-center justify-center">›</button>
                  </div>
                </div>
                <div className="grid grid-cols-7 text-center text-[11px] font-medium text-gray-400 mb-2">
                  {diasSemana.map((d) => <div key={d}>{d}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {celdas.map((d, i) => {
                    if (!d) return <div key={i} className="aspect-square" />;
                    const key = claveDia(d);
                    const evs = eventosPorDia[key] || [];
                    const esHoy = key === hoyKey;
                    const seleccionado = key === diaSeleccionado;
                    return (
                      <button
                        key={i}
                        onClick={() => setDiaSeleccionado(seleccionado ? null : key)}
                        className={`aspect-square rounded-lg flex flex-col items-center justify-center gap-0.5 text-sm relative transition-colors ${
                          seleccionado ? 'bg-[#2B6477] text-white' : esHoy ? 'bg-[#2B6477]/10 text-[#2B6477] font-semibold' : 'hover:bg-gray-50 text-gray-600'
                        }`}
                      >
                        {d.getDate()}
                        {evs.length > 0 && (
                          <span className="flex gap-0.5">
                            {evs.slice(0, 3).map((e, j) => (
                              <span
                                key={j}
                                className="w-1 h-1 rounded-full"
                                style={{ background: seleccionado ? '#fff' : dotCategoria[e.categoria] }}
                              />
                            ))}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {diaSeleccionado && (
                  <div className="mt-5 border-t border-gray-100 pt-4">
                    <p className="text-xs font-medium text-gray-400 mb-2">
                      {new Date(diaSeleccionado).toLocaleDateString('es-CR', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </p>
                    {eventosDelDiaSeleccionado.length === 0 && <p className="text-sm text-gray-400">Sin eventos este día.</p>}
                    <div className="space-y-2">
                      {eventosDelDiaSeleccionado.map((e) => (
                        <Link key={e.id} href={`/eventos/${e.slug}`} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 transition-colors">
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: dotCategoria[e.categoria] }} />
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">{e.titulo}</p>
                            <p className="text-xs text-gray-400">{e.hora} · {e.lugar}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Columna lateral */}
              <div className="space-y-5">
                {proximoEvento && (
                  <div className="bg-[#2B6477] text-white rounded-2xl p-5 relative overflow-hidden">
                    <p className="text-[10px] uppercase tracking-wide text-white/60 font-mono-brand mb-2 flex items-center gap-1">
                      ✦ Tu próximo evento
                    </p>
                    <h3 className="font-semibold mb-3 leading-snug">{proximoEvento.titulo}</h3>
                    <p className="text-xs text-white/70 mb-1">
                      📅 {new Date(proximoEvento.fecha).toLocaleDateString('es-CR', { day: 'numeric', month: 'long' })}
                    </p>
                    <p className="text-xs text-white/70 mb-4">🕓 {proximoEvento.hora}</p>
                    <Link
                      href={`/eventos/${proximoEvento.slug}`}
                      className="block text-center bg-white text-[#2B6477] text-sm font-medium py-2 rounded-lg hover:bg-white/90 transition-colors"
                    >
                      Ver detalles
                    </Link>
                  </div>
                )}

                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <h3 className="font-semibold text-[#2B6477] text-sm mb-3">Asesores de Proyecto</h3>
                  <div className="space-y-3">
                    {asesoresProyecto.map((a) => (
                      <div key={a.nombre} className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#2B6477]/10 text-[#2B6477] flex items-center justify-center text-xs font-semibold shrink-0">
                          {a.iniciales}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-800 truncate">{a.nombre}</p>
                          <p className="text-xs text-gray-400 truncate">{a.rol}</p>
                        </div>
                        <button
                          onClick={() => mostrarToast(`Le enviamos tu consulta a ${a.nombre}. Te responde en menos de 48h.`, 'exito')}
                          className="text-xs font-medium text-[#2B6477] border border-[#2B6477]/30 px-2.5 py-1 rounded-lg hover:bg-[#2B6477] hover:text-white transition-colors shrink-0"
                        >
                          Contactar
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <h3 className="font-semibold text-[#2B6477] text-sm mb-3">Estadísticas del mes</h3>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Registrados</span>
                    <span className="font-semibold text-gray-800">{registradosDelMes}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {proponerAbierto && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 px-4" onClick={() => setProponerAbierto(false)}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!nuevoTitulo.trim()) return;
              mostrarToast(`Propuesta "${nuevoTitulo}" enviada a Vida Estudiantil para revisión.`, 'exito');
              setNuevoTitulo('');
              setNuevaDescripcion('');
              setProponerAbierto(false);
            }}
            className="bg-white rounded-2xl p-6 w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Proponer un evento</h3>
              <button type="button" onClick={() => setProponerAbierto(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Título del evento</label>
            <input
              value={nuevoTitulo}
              onChange={(e) => setNuevoTitulo(e.target.value)}
              required
              placeholder="Ej. Taller de oratoria para estudiantes"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-[#2B6477]/20"
            />
            <label className="text-xs font-medium text-gray-500 mb-1 block">Categoría</label>
            <select
              value={nuevaCategoria}
              onChange={(e) => setNuevaCategoria(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-[#2B6477]/20"
            >
              <option>Conferencia</option>
              <option>Taller</option>
              <option>Webinar</option>
              <option>Feria</option>
            </select>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Descripción</label>
            <textarea
              value={nuevaDescripcion}
              onChange={(e) => setNuevaDescripcion(e.target.value)}
              rows={3}
              placeholder="Contanos de qué se trata y a quién le serviría"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-[#2B6477]/20 resize-none"
            />
            <button type="submit" className="w-full bg-[#2B6477] text-white text-sm font-medium py-2.5 rounded-lg hover:bg-[#1F5567] transition-colors">
              Enviar propuesta
            </button>
          </form>
        </div>
      )}

      <ToastStack toasts={toasts} />
    </div>
  );
}
