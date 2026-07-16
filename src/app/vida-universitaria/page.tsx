'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useUsuarioActual } from '@/lib/useUsuarioActual';
import { usePageTitle } from '@/lib/usePageTitle';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { actividades, coloresTipo } from '@/data/vidaUniversitaria';
import { leerColeccion } from '@/lib/simulatedStore';

type Inscripcion = { id: string; actividadId: string };
type Favorito = { id: string; actividadId: string };

const tipos = ['Todos', 'Deporte', 'Club', 'Voluntariado', 'Cultural', 'Concurso', 'Networking', 'Viaje'];

export default function VidaUniversitariaPage() {
  const { usuario, cargando, cerrarSesion } = useUsuarioActual();
  usePageTitle('Vida Universitaria');
  const [tipo, setTipo] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');
  const [inscripciones, setInscripciones] = useState<Inscripcion[]>([]);
  const [favoritos, setFavoritos] = useState<Favorito[]>([]);

  useEffect(() => {
    if (!usuario) return;
    setInscripciones(leerColeccion<Inscripcion>(usuario.id, 'actividades'));
    setFavoritos(leerColeccion<Favorito>(usuario.id, 'favoritos_actividades'));
  }, [usuario]);

  if (cargando || !usuario) return null;

  const lista = actividades.filter((a) => {
    const t = tipo === 'Todos' || a.tipo === tipo;
    const b = (a.titulo + a.resumen).toLowerCase().includes(busqueda.toLowerCase());
    return t && b;
  });

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#FFFFFF]">
      <Sidebar usuario={usuario} cerrarSesion={cerrarSesion} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar usuario={usuario} />
      <main className="flex-1 px-6 py-8 md:px-10 md:py-10 max-w-5xl">
        <h1 className="font-serif-brand text-3xl text-[#2B6477] mb-1">Vida universitaria</h1>
        <p className="text-gray-500 mb-6">
          Deportes, clubes, voluntariados y más · {inscripciones.length} inscripción(es) · {favoritos.length} favorito(s)
        </p>

        <input
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar actividades…"
          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-[#2B6477]/20"
        />

        <div className="flex flex-wrap gap-2 mb-6">
          {tipos.map((t) => (
            <button
              key={t}
              onClick={() => setTipo(t)}
              className={`text-xs font-medium px-3 py-1.5 rounded-full transition-all ${
                tipo === t ? 'bg-[#2B6477] text-white' : 'bg-white text-gray-500 border border-gray-200 hover:border-[#2B6477]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {lista.map((a) => {
            const inscrito = inscripciones.some((i) => i.actividadId === a.id);
            const favorito = favoritos.some((f) => f.actividadId === a.id);
            const llenado = Math.round((a.inscritos / a.cupos) * 100);
            return (
              <Link
                key={a.id}
                href={`/vida-universitaria/${a.slug}`}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">{a.emoji}</span>
                  <div className="flex gap-1">
                    {favorito && <span className="text-xs">⭐</span>}
                    {inscrito && (
                      <span className="text-[9px] font-semibold uppercase px-2 py-0.5 rounded-full bg-green-50 text-green-600 font-mono-brand">
                        Inscrito
                      </span>
                    )}
                  </div>
                </div>
                <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mb-2 font-mono-brand uppercase ${coloresTipo[a.tipo]}`}>
                  {a.tipo}
                </span>
                <h3 className="font-semibold text-gray-800 text-sm mb-1 group-hover:text-[#2B6477] leading-snug">
                  {a.titulo}
                </h3>
                <p className="text-xs text-gray-500 mb-3 line-clamp-2">{a.resumen}</p>
                <p className="text-[11px] text-gray-400 font-mono-brand mb-2">🕒 {a.compromiso}</p>
                <div className="flex justify-between text-[10px] text-gray-400 mb-1 font-mono-brand">
                  <span>{a.inscritos}/{a.cupos}</span>
                  <span className="text-[#2B6477]">+{a.puntos} pts</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1">
                  <div className="bg-[#2B6477] h-1 rounded-full" style={{ width: `${llenado}%` }} />
                </div>
              </Link>
            );
          })}
        </div>
        {lista.length === 0 && (
          <div className="text-center py-16">
            <div className="w-14 h-14 rounded-2xl bg-[#B5566B]/10 flex items-center justify-center text-2xl mx-auto mb-4">🎉</div>
            <p className="text-gray-600 font-medium mb-1">No hay actividades con ese filtro</p>
            <p className="text-gray-400 text-sm">Probá con otra categoría.</p>
          </div>
        )}
      </main>
      </div>
    </div>
  );
}
