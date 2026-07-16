'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useUsuarioActual } from '@/lib/useUsuarioActual';
import { usePageTitle } from '@/lib/usePageTitle';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { getProyectoTcu } from '@/data/proyectosTcu';
import { leerColeccion, agregarItem } from '@/lib/simulatedStore';

type Postulacion = { id: string; proyectoId: string; nombre: string; fecha: string };

export default function ProyectoTcuDetallePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { usuario, cargando, cerrarSesion } = useUsuarioActual();
  usePageTitle('Proyecto TCU');
  const [postulaciones, setPostulaciones] = useState<Postulacion[]>([]);
  const [aviso, setAviso] = useState<string | null>(null);

  const proyecto = getProyectoTcu(slug);

  useEffect(() => {
    if (usuario) setPostulaciones(leerColeccion<Postulacion>(usuario.id, 'tcu_postulaciones'));
  }, [usuario]);

  if (cargando || !usuario) return null;
  if (!proyecto) {
    return (
      <div className="min-h-screen flex flex-col md:flex-row bg-[#FFFFFF]">
        <Sidebar usuario={usuario} cerrarSesion={cerrarSesion} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar usuario={usuario} />
        <main className="flex-1 px-6 py-10">
          <p className="text-gray-500">Proyecto no encontrado.</p>
          <Link href="/tcu/proyectos" className="text-[#2B6477] hover:underline text-sm">← Volver</Link>
        </main>
      </div>
      </div>
    );
  }

  const yaPostulado = postulaciones.some((p) => p.proyectoId === proyecto.id);

  function postularme() {
    if (!usuario || !proyecto || yaPostulado) return;
    const nueva: Postulacion = { id: `${proyecto.id}-${Date.now()}`, proyectoId: proyecto.id, nombre: proyecto.nombre, fecha: new Date().toISOString() };
    setPostulaciones(agregarItem<Postulacion>(usuario.id, 'tcu_postulaciones', nueva));
    setAviso('¡Postulación enviada! La organización revisará tu perfil.');
    setTimeout(() => setAviso(null), 3000);
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#FFFFFF]">
      <Sidebar usuario={usuario} cerrarSesion={cerrarSesion} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar usuario={usuario} />
      <main className="flex-1 px-6 py-8 md:px-10 md:py-10 max-w-4xl">
        <Link href="/tcu/proyectos" className="text-xs text-gray-400 hover:text-[#2B6477] font-mono-brand mb-4 inline-block">
          ← Volver al banco de proyectos
        </Link>

        {aviso && (
          <div className="bg-[#2B6477]/20 border border-[#2B6477] text-[#2B6477] text-sm px-4 py-2.5 rounded-xl mb-4">
            ✓ {aviso}
          </div>
        )}

        <div className="c360-grid-bg rounded-3xl p-8 md:p-10 text-white mb-6">
          <span className="inline-block text-[10px] font-semibold px-2.5 py-1 rounded-full bg-white/15 text-white uppercase font-mono-brand mb-3">
            {proyecto.tipoOrg}
          </span>
          <h1 className="font-serif-brand text-3xl mb-1 leading-tight">{proyecto.nombre}</h1>
          <p className="text-white/60 text-sm mb-6">{proyecto.organizacion}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm">
            <div><p className="text-[10px] uppercase text-white/40 font-mono-brand mb-0.5">Modalidad</p><p className="font-medium">{proyecto.modalidad}</p></div>
            <div><p className="text-[10px] uppercase text-white/40 font-mono-brand mb-0.5">Ubicación</p><p className="font-medium">{proyecto.canton}, {proyecto.provincia}</p></div>
            <div><p className="text-[10px] uppercase text-white/40 font-mono-brand mb-0.5">Duración</p><p className="font-medium">{proyecto.tiempoEstimado}</p></div>
            <div><p className="text-[10px] uppercase text-white/40 font-mono-brand mb-0.5">Cupos</p><p className="font-medium">{proyecto.inscritos}/{proyecto.cupos}</p></div>
          </div>
          <button
            onClick={postularme}
            disabled={yaPostulado}
            className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              yaPostulado ? 'bg-white/10 text-white border border-white/20 cursor-default' : 'bg-[#2B6477] text-white hover:bg-[#1F5567] hover:scale-[1.02]'
            }`}
          >
            {yaPostulado ? '✓ Ya te postulaste' : 'Postularme a este proyecto'}
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 font-mono-brand">Descripción</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{proyecto.descripcion}</p>
            </section>
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 font-mono-brand">Objetivos</h2>
              <ul className="space-y-2">
                {proyecto.objetivos.map((o, i) => <li key={i} className="text-sm text-gray-600 flex gap-2"><span className="text-[#2B6477]">▸</span> {o}</li>)}
              </ul>
            </section>
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 font-mono-brand">Actividades</h2>
              <ul className="space-y-1.5">
                {proyecto.actividades.map((a, i) => <li key={i} className="text-sm text-gray-600">• {a}</li>)}
              </ul>
            </section>
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 font-mono-brand">Beneficios</h2>
              <div className="grid sm:grid-cols-2 gap-2">
                {proyecto.beneficios.map((b, i) => <div key={i} className="text-sm text-gray-600 bg-[#2B6477]/5 rounded-lg px-3 py-2">{b}</div>)}
              </div>
            </section>
          </div>
          <div className="space-y-6">
            <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 font-mono-brand">Detalles</h2>
              <dl className="space-y-2 text-sm">
                <div><dt className="text-[10px] uppercase text-gray-400 font-mono-brand">Supervisor</dt><dd className="text-gray-700">{proyecto.supervisor}</dd></div>
                <div><dt className="text-[10px] uppercase text-gray-400 font-mono-brand">Área</dt><dd className="text-gray-700">{proyecto.area}</dd></div>
                <div><dt className="text-[10px] uppercase text-gray-400 font-mono-brand">Horario</dt><dd className="text-gray-700">{proyecto.horario}</dd></div>
                <div><dt className="text-[10px] uppercase text-gray-400 font-mono-brand">Ubicación exacta</dt><dd className="text-gray-700">{proyecto.ubicacion}</dd></div>
              </dl>
            </section>
            <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 font-mono-brand">Competencias necesarias</h2>
              <div className="flex flex-wrap gap-1.5">
                {proyecto.competencias.map((c) => <span key={c} className="text-xs bg-[#2B6477]/5 text-[#2B6477] px-2.5 py-1 rounded-full">{c}</span>)}
              </div>
            </section>
            <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 font-mono-brand">Contacto</h2>
              <p className="text-sm text-gray-600 break-all">{proyecto.contacto}</p>
            </section>
          </div>
        </div>
      </main>
      </div>
    </div>
  );
}
