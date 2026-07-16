'use client';

import Link from 'next/link';
import { useUsuarioActual } from '@/lib/useUsuarioActual';
import { usePageTitle } from '@/lib/usePageTitle';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { intercambios } from '@/data/oportunidades';

export default function IntercambiosPage() {
  const { usuario, cargando, cerrarSesion } = useUsuarioActual();
  usePageTitle('Intercambios');
  if (cargando || !usuario) return null;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#FFFFFF]">
      <Sidebar usuario={usuario} cerrarSesion={cerrarSesion} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar usuario={usuario} />
      <main className="flex-1 px-6 py-8 md:px-10 md:py-10 max-w-4xl">
        <Link href="/oportunidades" className="text-xs text-gray-400 hover:text-[#2B6477] font-mono-brand mb-2 inline-block">
          ← Centro de Oportunidades
        </Link>
        <h1 className="font-serif-brand text-3xl text-[#2B6477] mb-1">Intercambios académicos</h1>
        <p className="text-gray-500 mb-6">{intercambios.length} programas de movilidad internacional</p>

        <div className="space-y-5">
          {intercambios.map((i) => (
            <div key={i.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <div className="c360-grid-bg p-5 text-white">
                <h3 className="font-serif-brand text-xl">{i.universidad}</h3>
                <p className="text-[#E8C989] text-sm">{i.pais}</p>
              </div>
              <div className="p-5">
                <p className="text-sm text-gray-600 mb-3">{i.convenios}</p>
                <div className="grid sm:grid-cols-2 gap-4 mb-4 text-xs">
                  <div>
                    <p className="uppercase text-gray-400 font-mono-brand mb-1">Carreras elegibles</p>
                    <p className="text-gray-600">{i.carreras.join(', ')}</p>
                  </div>
                  <div>
                    <p className="uppercase text-gray-400 font-mono-brand mb-1">Calendario</p>
                    <p className="text-gray-600">{i.calendario}</p>
                  </div>
                  <div>
                    <p className="uppercase text-gray-400 font-mono-brand mb-1">Costos</p>
                    <p className="text-gray-600">{i.costos}</p>
                  </div>
                  <div>
                    <p className="uppercase text-gray-400 font-mono-brand mb-1">Becas disponibles</p>
                    <p className="text-gray-600">{i.becasDisponibles}</p>
                  </div>
                </div>
                <p className="text-[10px] uppercase text-gray-400 font-mono-brand mb-1">Requisitos</p>
                <ul className="text-xs text-gray-600 space-y-0.5 mb-4">
                  {i.requisitos.map((r, idx) => <li key={idx}>• {r}</li>)}
                </ul>
                <blockquote className="text-xs italic text-gray-500 border-l-2 border-[#2B6477] pl-3">
                  {i.testimonio}
                </blockquote>
              </div>
            </div>
          ))}
        </div>
      </main>
      </div>
    </div>
  );
}
