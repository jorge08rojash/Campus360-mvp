'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useUsuarioActual } from '@/lib/useUsuarioActual';
import { usePageTitle } from '@/lib/usePageTitle';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import Avatar from '@/components/Avatar';
import { getEvento, eventos, dotCategoria } from '@/data/eventos';
import { getPonente } from '@/data/ponentes';
import { leerColeccion, agregarItem, quitarItem } from '@/lib/simulatedStore';

type EventoRegistrado = { id: string; eventoId: string; titulo: string; fecha: string };

export default function EventoDetallePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { usuario, cargando, cerrarSesion } = useUsuarioActual();
  usePageTitle('Evento');
  const [misEventos, setMisEventos] = useState<EventoRegistrado[]>([]);
  const [tab, setTab] = useState<'info' | 'agenda' | 'material' | 'faq' | 'comentarios'>('info');

  const evento = getEvento(slug);

  useEffect(() => {
    if (usuario) setMisEventos(leerColeccion<EventoRegistrado>(usuario.id, 'eventos'));
  }, [usuario]);

  if (cargando || !usuario) return null;

  if (!evento) {
    return (
      <div className="min-h-screen flex flex-col md:flex-row bg-[#FFFFFF]">
        <Sidebar usuario={usuario} cerrarSesion={cerrarSesion} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar usuario={usuario} />
        <main className="flex-1 px-6 py-10">
          <p className="text-gray-500">Evento no encontrado.</p>
          <Link href="/eventos" className="text-[#2B6477] hover:underline text-sm">← Volver a eventos</Link>
        </main>
      </div>
      </div>
    );
  }

  const ponente = getPonente(evento.ponenteId);
  const registrado = misEventos.some((m) => m.eventoId === evento.id);
  const llenado = Math.round((evento.inscritos / evento.cupos) * 100);
  const relacionados = evento.relacionados.map((id) => eventos.find((e) => e.id === id)).filter(Boolean);

  function toggleRegistro() {
    if (!usuario || !evento) return;
    if (registrado) {
      const item = misEventos.find((m) => m.eventoId === evento.id);
      if (item) setMisEventos(quitarItem<EventoRegistrado>(usuario.id, 'eventos', item.id));
    } else {
      const nuevo: EventoRegistrado = {
        id: `${evento.id}-${Date.now()}`,
        eventoId: evento.id,
        titulo: evento.titulo,
        fecha: evento.fecha,
      };
      setMisEventos(agregarItem<EventoRegistrado>(usuario.id, 'eventos', nuevo));
    }
  }

  const tabs = [
    { id: 'info' as const, label: 'Información' },
    { id: 'agenda' as const, label: 'Agenda' },
    { id: 'material' as const, label: 'Material' },
    { id: 'faq' as const, label: 'FAQ' },
    { id: 'comentarios' as const, label: `Comentarios (${evento.comentarios.length})` },
  ];

  const waze = `https://waze.com/ul?ll=${evento.coords.lat},${evento.coords.lng}&navigate=yes`;
  const gmaps = `https://www.google.com/maps/search/?api=1&query=${evento.coords.lat},${evento.coords.lng}`;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#FFFFFF]">
      <Sidebar usuario={usuario} cerrarSesion={cerrarSesion} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar usuario={usuario} />
      <main className="flex-1 px-6 py-8 md:px-10 md:py-10 max-w-5xl">
        <Link href="/eventos" className="text-xs text-gray-400 hover:text-[#2B6477] font-mono-brand mb-4 inline-block">
          ← Volver a eventos
        </Link>

        {/* Banner */}
        <div className="c360-grid-bg rounded-3xl p-8 md:p-10 text-white mb-6">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-white/15 text-white uppercase font-mono-brand">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: dotCategoria[evento.categoria] }} />
              {evento.categoria}
            </span>
            <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-white/10 text-white uppercase font-mono-brand">
              {evento.modalidad}
            </span>
            {evento.certificado && (
              <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-white/10 text-white uppercase font-mono-brand">
                🎓 Certificado
              </span>
            )}
          </div>
          <h1 className="font-serif-brand text-3xl md:text-4xl mb-3 leading-tight">{evento.titulo}</h1>
          <p className="text-white/70 text-sm max-w-2xl mb-6">{evento.resumen}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm">
            <div>
              <p className="text-[10px] uppercase text-white/40 font-mono-brand mb-0.5">Fecha</p>
              <p className="font-medium">
                {new Date(evento.fecha).toLocaleDateString('es-CR', { day: 'numeric', month: 'long' })}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase text-white/40 font-mono-brand mb-0.5">Hora</p>
              <p className="font-medium">{evento.hora} – {evento.horaFin}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase text-white/40 font-mono-brand mb-0.5">Lugar</p>
              <p className="font-medium">{evento.lugar}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase text-white/40 font-mono-brand mb-0.5">Puntos</p>
              <p className="font-medium text-[#E8C989]">+{evento.puntos}</p>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-[11px] text-white/50 mb-1 font-mono-brand">
              <span>{evento.inscritos} de {evento.cupos} cupos ocupados</span>
              <span>{evento.cupos - evento.inscritos} disponibles</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-1.5">
              <div className="bg-[#D9A441] h-1.5 rounded-full transition-all duration-700" style={{ width: `${llenado}%` }} />
            </div>
          </div>

          <button
            onClick={toggleRegistro}
            className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              registrado
                ? 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                : 'bg-[#2B6477] text-white hover:bg-[#1F5567] hover:scale-[1.02]'
            }`}
          >
            {registrado ? '✓ Estás registrado — cancelar' : 'Registrarme al evento'}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 overflow-x-auto border-b border-gray-200">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`text-sm font-medium px-4 py-2.5 whitespace-nowrap border-b-2 transition-colors ${
                tab === t.id
                  ? 'border-[#2B6477] text-[#2B6477]'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {tab === 'info' && (
              <>
                <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 font-mono-brand">
                    Descripción
                  </h2>
                  <p className="text-sm text-gray-600 leading-relaxed">{evento.descripcion}</p>
                </section>

                <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 font-mono-brand">
                    Objetivos
                  </h2>
                  <ul className="space-y-2">
                    {evento.objetivos.map((o, i) => (
                      <li key={i} className="text-sm text-gray-600 flex gap-2">
                        <span className="text-[#2B6477]">▸</span> {o}
                      </li>
                    ))}
                  </ul>
                </section>

                <div className="grid sm:grid-cols-2 gap-4">
                  <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 font-mono-brand">
                      Requisitos
                    </h2>
                    <ul className="space-y-1.5">
                      {evento.requisitos.map((r, i) => (
                        <li key={i} className="text-sm text-gray-600">• {r}</li>
                      ))}
                    </ul>
                  </section>
                  <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 font-mono-brand">
                      Qué llevar
                    </h2>
                    <ul className="space-y-1.5">
                      {evento.recursos.length ? (
                        evento.recursos.map((r, i) => <li key={i} className="text-sm text-gray-600">• {r}</li>)
                      ) : (
                        <li className="text-sm text-gray-400">Nada en particular.</li>
                      )}
                    </ul>
                  </section>
                </div>

                <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 font-mono-brand">
                    Beneficios por asistir
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {evento.beneficios.map((b, i) => (
                      <div key={i} className="text-sm text-gray-600 bg-[#2B6477]/5 rounded-lg px-3 py-2">
                        {b}
                      </div>
                    ))}
                  </div>
                </section>

                {(evento.galeria.length > 0 || evento.videos.length > 0) && (
                  <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 font-mono-brand">
                      Galería y videos
                    </h2>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {evento.galeria.map((g, i) => (
                        <div
                          key={i}
                          className="aspect-video c360-grid-bg rounded-lg flex items-end p-2"
                        >
                          <p className="text-[9px] text-white/70 leading-tight">{g}</p>
                        </div>
                      ))}
                    </div>
                    {evento.videos.map((v, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
                        <span>▶</span>
                        <span className="flex-1">{v.titulo}</span>
                        <span className="text-xs text-gray-400 font-mono-brand">{v.duracion}</span>
                      </div>
                    ))}
                  </section>
                )}
              </>
            )}

            {tab === 'agenda' && (
              <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4 font-mono-brand">
                  Agenda del evento
                </h2>
                <div className="space-y-0">
                  {evento.agenda.map((a, i) => (
                    <div key={i} className="flex gap-4 pb-4 last:pb-0">
                      <div className="flex flex-col items-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#2B6477] mt-1.5" />
                        {i < evento.agenda.length - 1 && <div className="w-0.5 flex-1 bg-gray-100 my-1" />}
                      </div>
                      <div className="pb-2">
                        <p className="text-xs text-[#2B6477] font-mono-brand font-semibold">{a.hora}</p>
                        <p className="text-sm text-gray-700">{a.actividad}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {tab === 'material' && (
              <>
                <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 font-mono-brand">
                    Material previo
                  </h2>
                  {evento.materialPrevio.length ? (
                    <div className="space-y-2">
                      {evento.materialPrevio.map((m, i) => (
                        <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2.5">
                          <span className="text-sm text-gray-700">{m.nombre}</span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white text-gray-500 font-mono-brand">
                            {m.tipo}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">No hay material previo para este evento.</p>
                  )}
                </section>
                <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 font-mono-brand">
                    Material posterior
                  </h2>
                  {evento.materialPosterior.length ? (
                    <div className="space-y-2">
                      {evento.materialPosterior.map((m, i) => (
                        <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2.5">
                          <span className="text-sm text-gray-700">{m.nombre}</span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white text-gray-500 font-mono-brand">
                            {m.tipo}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">Se publica después del evento.</p>
                  )}
                </section>
              </>
            )}

            {tab === 'faq' && (
              <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4 font-mono-brand">
                  Preguntas frecuentes
                </h2>
                <div className="space-y-3">
                  {evento.faq.map((f, i) => (
                    <details key={i} className="group border-b border-gray-50 pb-3 last:border-0">
                      <summary className="cursor-pointer font-medium text-gray-700 text-sm list-none flex justify-between items-center">
                        {f.pregunta}
                        <span className="text-gray-400 group-open:rotate-180 transition-transform">⌄</span>
                      </summary>
                      <p className="text-sm text-gray-500 mt-2">{f.respuesta}</p>
                    </details>
                  ))}
                </div>
              </section>
            )}

            {tab === 'comentarios' && (
              <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4 font-mono-brand">
                  Comentarios
                </h2>
                {evento.comentarios.length ? (
                  <div className="space-y-4">
                    {evento.comentarios.map((c, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#1B5E7B] text-white flex items-center justify-center text-[11px] font-semibold shrink-0">
                          {c.iniciales}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {c.autor}{' '}
                            <span className="text-[10px] text-gray-300 font-mono-brand font-normal">
                              {new Date(c.fecha).toLocaleDateString('es-CR')}
                            </span>
                          </p>
                          <p className="text-sm text-gray-600">{c.texto}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">Todavía no hay comentarios.</p>
                )}
              </section>
            )}
          </div>

          {/* Sidebar derecho */}
          <div className="space-y-6">
            {ponente && (
              <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 font-mono-brand">
                  Ponente
                </h2>
                <Link href={`/ponentes/${ponente.id}`} className="group block">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar nombre={ponente.nombre} fotoUrl={ponente.foto_url} size={48} />
                    <div className="min-w-0">
                      <p className="font-medium text-gray-800 text-sm group-hover:text-[#2B6477] truncate">
                        {ponente.nombre}
                      </p>
                      <p className="text-xs text-gray-400 truncate">{ponente.cargo}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-3 mb-2">{ponente.bio}</p>
                  <span className="text-xs font-medium text-[#2B6477] group-hover:underline">Ver perfil completo →</span>
                </Link>
              </section>
            )}

            <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 font-mono-brand">
                Organiza
              </h2>
              <p className="text-sm font-medium text-gray-800">{evento.organizador}</p>
              <p className="text-xs text-gray-400 mb-3">{evento.facultad}</p>
              <p className="text-[10px] uppercase text-gray-400 font-mono-brand mb-1">Público objetivo</p>
              <p className="text-xs text-gray-500 mb-3">{evento.publicoObjetivo}</p>
              <p className="text-[10px] uppercase text-gray-400 font-mono-brand mb-1">Carreras recomendadas</p>
              <div className="flex flex-wrap gap-1">
                {evento.carrerasRecomendadas.map((c) => (
                  <span key={c} className="text-[10px] bg-gray-50 text-gray-500 px-2 py-0.5 rounded-full">
                    {c}
                  </span>
                ))}
              </div>
            </section>

            <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 font-mono-brand">
                Cómo llegar
              </h2>
              <div className="c360-grid-bg rounded-xl h-28 mb-3 flex items-center justify-center">
                <span className="text-white/40 text-xs font-mono-brand">📍 {evento.lugar}</span>
              </div>
              <p className="text-xs text-gray-500 mb-3">{evento.direccion}</p>
              <div className="flex gap-2">
                <a
                  href={gmaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center text-xs font-medium border border-gray-200 text-gray-600 py-2 rounded-lg hover:border-[#2B6477] hover:text-[#2B6477] transition-colors"
                >
                  Google Maps
                </a>
                <a
                  href={waze}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center text-xs font-medium border border-gray-200 text-gray-600 py-2 rounded-lg hover:border-[#2B6477] hover:text-[#2B6477] transition-colors"
                >
                  Waze
                </a>
              </div>
            </section>

            {relacionados.length > 0 && (
              <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 font-mono-brand">
                  Eventos relacionados
                </h2>
                <ul className="space-y-3">
                  {relacionados.map((r) => (
                    <li key={r!.id}>
                      <Link href={`/eventos/${r!.slug}`} className="group block">
                        <p className="text-sm font-medium text-gray-700 group-hover:text-[#2B6477] leading-snug">
                          {r!.titulo}
                        </p>
                        <p className="text-[11px] text-gray-400 font-mono-brand">
                          {new Date(r!.fecha).toLocaleDateString('es-CR')}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>
      </main>
      </div>
    </div>
  );
}
