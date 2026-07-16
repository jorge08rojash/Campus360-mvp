'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useUsuarioActual } from '@/lib/useUsuarioActual';
import { usePageTitle } from '@/lib/usePageTitle';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { empleos } from '@/data/empleos';
import { leerColeccion } from '@/lib/simulatedStore';

type Postulacion = { id: string; empleoId: string; estado: string };
type Guardado = { id: string; empleoId: string };

const modalidades = ['Todas', 'Presencial', 'Híbrido', 'Remoto'];

export default function EmpleoPage() {
  const { usuario, cargando, cerrarSesion } = useUsuarioActual();
  usePageTitle('Bolsa de Empleo');
  const [modalidad, setModalidad] = useState('Todas');
  const [busqueda, setBusqueda] = useState('');
  const [postulaciones, setPostulaciones] = useState<Postulacion[]>([]);
  const [guardados, setGuardados] = useState<Guardado[]>([]);

  useEffect(() => {
    if (!usuario) return;
    setPostulaciones(leerColeccion<Postulacion>(usuario.id, 'postulaciones'));
    setGuardados(leerColeccion<Guardado>(usuario.id, 'empleos_guardados'));
  }, [usuario]);

  if (cargando || !usuario) return null;

  const lista = empleos.filter((e) => {
    const m = modalidad === 'Todas' || e.modalidad === modalidad;
    const b = (e.cargo + e.empresa).toLowerCase().includes(busqueda.toLowerCase());
    return m && b;
  });

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#FFFFFF]">
      <Sidebar usuario={usuario} cerrarSesion={cerrarSesion} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar usuario={usuario} />
      <main className="flex-1 px-6 py-8 md:px-10 md:py-10 max-w-4xl">
        <Link href="/oportunidades" className="text-xs text-gray-400 hover:text-[#2B6477] font-mono-brand mb-2 inline-block">
          ← Centro de Oportunidades
        </Link>
        <h1 className="font-serif-brand text-3xl text-[#2B6477] mb-1">Bolsa de empleo</h1>
        <p className="text-gray-500 mb-6">
          {empleos.length} vacantes · {postulaciones.length} postulación(es) · {guardados.length} guardada(s)
        </p>

        <input
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar cargo o empresa…"
          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-[#2B6477]/20"
        />

        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {modalidades.map((m) => (
            <button
              key={m}
              onClick={() => setModalidad(m)}
              className={`text-xs font-medium px-3 py-1.5 rounded-full whitespace-nowrap transition-colors ${
                modalidad === m ? 'bg-[#2B6477] text-white' : 'bg-white text-gray-500 border border-gray-200 hover:border-[#2B6477]'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {lista.map((e) => {
            const postulacion = postulaciones.find((p) => p.empleoId === e.id);
            const guardado = guardados.some((g) => g.empleoId === e.id);
            return (
              <Link
                key={e.id}
                href={`/oportunidades/empleo/${e.slug}`}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all flex gap-4 items-center"
              >
                <div className="w-12 h-12 rounded-xl bg-[#2B6477] text-white flex items-center justify-center font-semibold shrink-0">
                  {e.logo}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-gray-800 text-sm">{e.cargo}</h3>
                    {postulacion && (
                      <span className="text-[9px] font-semibold uppercase px-2 py-0.5 rounded-full bg-[#2B6477]/30 text-[#2B6477] font-mono-brand">
                        {postulacion.estado}
                      </span>
                    )}
                    {guardado && <span className="text-xs">⭐</span>}
                  </div>
                  <p className="text-xs text-gray-500">{e.empresa} · {e.ubicacion}</p>
                  <div className="flex gap-3 mt-1 text-[11px] text-gray-400 font-mono-brand">
                    <span>{e.modalidad}</span>
                    <span>{e.tipo}</span>
                    {e.salario && <span className="text-[#2B6477]">{e.salario}</span>}
                  </div>
                </div>
                <span className="text-xs text-gray-300 font-mono-brand shrink-0">
                  Vence {new Date(e.fechaLimite).toLocaleDateString('es-CR', { day: 'numeric', month: 'short' })}
                </span>
              </Link>
            );
          })}
        </div>
        {lista.length === 0 && (
          <div className="text-center py-16">
            <div className="w-14 h-14 rounded-2xl bg-[#6B8F71]/15 flex items-center justify-center text-2xl mx-auto mb-4">💼</div>
            <p className="text-gray-600 font-medium mb-1">No hay vacantes con ese filtro</p>
            <p className="text-gray-400 text-sm">Probá con otra modalidad.</p>
          </div>
        )}
      </main>
      </div>
    </div>
  );
}
