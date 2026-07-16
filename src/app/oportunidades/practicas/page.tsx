'use client';

import Link from 'next/link';
import { useUsuarioActual } from '@/lib/useUsuarioActual';
import { usePageTitle } from '@/lib/usePageTitle';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { practicas } from '@/data/oportunidades';

export default function PracticasPage() {
  const { usuario, cargando, cerrarSesion } = useUsuarioActual();
  usePageTitle('Prácticas Profesionales');
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
        <h1 className="font-serif-brand text-3xl text-[#2B6477] mb-1">Prácticas profesionales</h1>
        <p className="text-gray-500 mb-6">{practicas.length} programas con empresas aliadas</p>

        <div className="grid sm:grid-cols-2 gap-4">
          {practicas.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#2B6477] text-white flex items-center justify-center text-xs font-semibold">
                  {p.logo}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm">{p.empresa}</h3>
                  <p className="text-xs text-[#2B6477]">{p.area}</p>
                </div>
              </div>
              <div className="space-y-1 text-xs text-gray-500 mb-3">
                <p>🕒 {p.horario} · {p.duracion}</p>
                <p>📍 {p.modalidad} · {p.plazas} plazas</p>
                <p>👤 Tutor empresarial: {p.tutorEmpresarial}</p>
                <p>🎓 Tutor universitario: {p.tutorUniversitario}</p>
              </div>
              <p className="text-[10px] uppercase text-gray-400 font-mono-brand mb-1">Requisitos</p>
              <ul className="text-xs text-gray-600 mb-3 space-y-0.5">
                {p.requisitos.map((r, i) => <li key={i}>• {r}</li>)}
              </ul>
              <div className="flex flex-wrap gap-1.5">
                {p.beneficios.map((b) => (
                  <span key={b} className="text-[10px] bg-[#2B6477]/20 text-[#2B6477] px-2 py-0.5 rounded-full">{b}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
      </div>
    </div>
  );
}
