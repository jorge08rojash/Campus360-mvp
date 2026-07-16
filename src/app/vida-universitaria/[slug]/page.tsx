'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useUsuarioActual } from '@/lib/useUsuarioActual';
import { usePageTitle } from '@/lib/usePageTitle';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { getActividad, coloresTipo } from '@/data/vidaUniversitaria';
import { leerColeccion, agregarItem, quitarItem } from '@/lib/simulatedStore';

type Inscripcion = { id: string; actividadId: string; titulo: string; fecha: string };
type Favorito = { id: string; actividadId: string; titulo: string };
type NotaPersonal = { id: string; titulo: string; fecha: string };

export default function ActividadDetallePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { usuario, cargando, cerrarSesion } = useUsuarioActual();
  usePageTitle('Actividad');
  const [inscripciones, setInscripciones] = useState<Inscripcion[]>([]);
  const [favoritos, setFavoritos] = useState<Favorito[]>([]);
  const [aviso, setAviso] = useState<string | null>(null);

  const actividad = getActividad(slug);

  useEffect(() => {
    if (!usuario) return;
    setInscripciones(leerColeccion<Inscripcion>(usuario.id, 'actividades'));
    setFavoritos(leerColeccion<Favorito>(usuario.id, 'favoritos_actividades'));
  }, [usuario]);

  if (cargando || !usuario) return null;

  if (!actividad) {
    return (
      <div className="min-h-screen flex flex-col md:flex-row bg-[#FFFFFF]">
        <Sidebar usuario={usuario} cerrarSesion={cerrarSesion} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar usuario={usuario} />
        <main className="flex-1 px-6 py-10">
          <p className="text-gray-500">Actividad no encontrada.</p>
          <Link href="/vida-universitaria" className="text-[#2B6477] hover:underline text-sm">← Volver</Link>
        </main>
      </div>
      </div>
    );
  }

  const inscrito = inscripciones.some((i) => i.actividadId === actividad.id);
  const favorito = favoritos.some((f) => f.actividadId === actividad.id);
  const llenado = Math.round((actividad.inscritos / actividad.cupos) * 100);

  function mostrarAviso(texto: string) {
    setAviso(texto);
    setTimeout(() => setAviso(null), 2500);
  }

  function toggleInscripcion() {
    if (!usuario || !actividad) return;
    if (inscrito) {
      const item = inscripciones.find((i) => i.actividadId === actividad.id);
      if (item) setInscripciones(quitarItem<Inscripcion>(usuario.id, 'actividades', item.id));
      mostrarAviso('Inscripción cancelada');
    } else {
      const nueva: Inscripcion = {
        id: `${actividad.id}-${Date.now()}`,
        actividadId: actividad.id,
        titulo: actividad.titulo,
        fecha: actividad.fecha,
      };
      setInscripciones(agregarItem<Inscripcion>(usuario.id, 'actividades', nueva));
      mostrarAviso(`¡Inscrito! Ganaste ${actividad.puntos} puntos Campus360`);
    }
  }

  function toggleFavorito() {
    if (!usuario || !actividad) return;
    if (favorito) {
      const item = favoritos.find((f) => f.actividadId === actividad.id);
      if (item) setFavoritos(quitarItem<Favorito>(usuario.id, 'favoritos_actividades', item.id));
    } else {
      const nuevo: Favorito = { id: `fav-${actividad.id}`, actividadId: actividad.id, titulo: actividad.titulo };
      setFavoritos(agregarItem<Favorito>(usuario.id, 'favoritos_actividades', nuevo));
      mostrarAviso('Guardada en favoritos');
    }
  }

  function agregarAgenda() {
    if (!usuario || !actividad) return;
    const nota: NotaPersonal = {
      id: `act-${actividad.id}-${Date.now()}`,
      titulo: actividad.titulo,
      fecha: actividad.fecha,
    };
    agregarItem<NotaPersonal>(usuario.id, 'notas_agenda', nota);
    mostrarAviso('Agregada a tu agenda');
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#FFFFFF]">
      <Sidebar usuario={usuario} cerrarSesion={cerrarSesion} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar usuario={usuario} />
      <main className="flex-1 px-6 py-8 md:px-10 md:py-10 max-w-4xl">
        <Link href="/vida-universitaria" className="text-xs text-gray-400 hover:text-[#2B6477] font-mono-brand mb-4 inline-block">
          ← Volver a vida universitaria
        </Link>

        {aviso && (
          <div className="bg-[#2B6477]/20 border border-[#2B6477] text-[#2B6477] text-sm px-4 py-2.5 rounded-xl mb-4">
            ✓ {aviso}
          </div>
        )}

        <div className="c360-grid-bg rounded-3xl p-8 md:p-10 text-white mb-6">
          <div className="text-5xl mb-4">{actividad.emoji}</div>
          <span className="inline-block text-[10px] font-semibold px-2.5 py-1 rounded-full bg-[#2B6477] text-white uppercase font-mono-brand mb-3">
            {actividad.tipo}
          </span>
          <h1 className="font-serif-brand text-3xl md:text-4xl mb-2 leading-tight">{actividad.titulo}</h1>
          <p className="text-white/70 text-sm max-w-2xl mb-6">{actividad.resumen}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm">
            <div>
              <p className="text-[10px] uppercase text-white/40 font-mono-brand mb-0.5">Inicia</p>
              <p className="font-medium">
                {new Date(actividad.fecha).toLocaleDateString('es-CR', { day: 'numeric', month: 'short' })}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase text-white/40 font-mono-brand mb-0.5">Hora</p>
              <p className="font-medium">{actividad.hora}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase text-white/40 font-mono-brand mb-0.5">Compromiso</p>
              <p className="font-medium text-xs">{actividad.compromiso}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase text-white/40 font-mono-brand mb-0.5">Puntos</p>
              <p className="font-medium text-[#E8C989]">+{actividad.puntos}</p>
            </div>
          </div>

          <div className="mb-5">
            <div className="flex justify-between text-[11px] text-white/50 mb-1 font-mono-brand">
              <span>{actividad.inscritos} de {actividad.cupos} cupos</span>
              <span>{actividad.cupos - actividad.inscritos} disponibles</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-1.5">
              <div className="bg-[#2B6477] h-1.5 rounded-full transition-all duration-700" style={{ width: `${llenado}%` }} />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={toggleInscripcion}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                inscrito
                  ? 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                  : 'bg-[#2B6477] text-white hover:bg-[#1F5567] hover:scale-[1.02]'
              }`}
            >
              {inscrito ? '✓ Inscrito — cancelar' : 'Registrarme'}
            </button>
            <button
              onClick={toggleFavorito}
              className="px-4 py-2.5 rounded-xl text-sm font-medium bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-colors"
            >
              {favorito ? '⭐ Guardada' : '☆ Guardar'}
            </button>
            <button
              onClick={agregarAgenda}
              className="px-4 py-2.5 rounded-xl text-sm font-medium bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-colors"
            >
              🗓️ Agregar a agenda
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 font-mono-brand">
                Sobre la actividad
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">{actividad.descripcion}</p>
            </section>

            <div className="grid sm:grid-cols-2 gap-4">
              <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 font-mono-brand">
                  Requisitos
                </h2>
                <ul className="space-y-1.5">
                  {actividad.requisitos.map((r, i) => (
                    <li key={i} className="text-sm text-gray-600">• {r}</li>
                  ))}
                </ul>
              </section>
              <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 font-mono-brand">
                  Beneficios
                </h2>
                <ul className="space-y-1.5">
                  {actividad.beneficios.map((b, i) => (
                    <li key={i} className="text-sm text-gray-600">• {b}</li>
                  ))}
                </ul>
              </section>
            </div>
          </div>

          <div className="space-y-6">
            <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 font-mono-brand">
                Detalles
              </h2>
              <dl className="space-y-2 text-sm">
                <div>
                  <dt className="text-[10px] uppercase text-gray-400 font-mono-brand">Lugar</dt>
                  <dd className="text-gray-700">{actividad.lugar}</dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase text-gray-400 font-mono-brand">Responsable</dt>
                  <dd className="text-gray-700">{actividad.responsable}</dd>
                </div>
              </dl>
            </section>

            <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 font-mono-brand">
                Quiénes van ({actividad.asistentes.length + (inscrito ? 1 : 0)})
              </h2>
              {actividad.asistentes.length === 0 && !inscrito ? (
                <p className="text-sm text-gray-400">Sé la primera persona en inscribirte.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {inscrito && (
                    <div
                      title="Vos"
                      className="w-9 h-9 rounded-full bg-[#2B6477] text-white flex items-center justify-center text-[11px] font-semibold ring-2 ring-[#2B6477]"
                    >
                      {usuario.nombre.charAt(0)}
                    </div>
                  )}
                  {actividad.asistentes.map((a) => (
                    <div
                      key={a.nombre}
                      title={a.nombre}
                      className="w-9 h-9 rounded-full bg-[#1B5E7B] text-white flex items-center justify-center text-[11px] font-semibold"
                    >
                      {a.iniciales}
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
      </div>
    </div>
  );
}
