'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useUsuarioActual } from '@/lib/useUsuarioActual';
import { usePageTitle } from '@/lib/usePageTitle';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { becas } from '@/data/oportunidades';

const paises = ['Todos', ...Array.from(new Set(becas.map((b) => b.pais)))];
const niveles = ['Todos', 'Pregrado', 'Posgrado'];

export default function BecasPage() {
  const { usuario, cargando, cerrarSesion } = useUsuarioActual();
  usePageTitle('Becas');
  const [pais, setPais] = useState('Todos');
  const [nivel, setNivel] = useState('Todos');

  if (cargando || !usuario) return null;

  const lista = becas.filter((b) => {
    const p = pais === 'Todos' || b.pais === pais;
    const n = nivel === 'Todos' || b.nivel === nivel;
    return p && n;
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
        <h1 className="font-serif-brand text-3xl text-[#2B6477] mb-1">Becas</h1>
        <p className="text-gray-500 mb-6">{becas.length} becas nacionales e internacionales</p>

        <div className="flex flex-wrap gap-2 mb-2">
          {paises.map((p) => (
            <button key={p} onClick={() => setPais(p)} className={`text-xs font-medium px-3 py-1.5 rounded-full transition-all ${pais === p ? 'bg-[#2B6477] text-white' : 'bg-white text-gray-500 border border-gray-200 hover:border-[#2B6477]'}`}>
              {p}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mb-6">
          {niveles.map((n) => (
            <button key={n} onClick={() => setNivel(n)} className={`text-xs font-medium px-3 py-1.5 rounded-full transition-all ${nivel === n ? 'bg-[#2B6477] text-white' : 'bg-white text-gray-400 border border-gray-200 hover:border-[#2B6477]'}`}>
              {n}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {lista.map((b) => (
            <div key={b.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex justify-between items-start gap-3 mb-2">
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm">{b.nombre}</h3>
                  <p className="text-xs text-gray-500">{b.organizacion} · {b.pais}</p>
                </div>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-[#2B6477]/10 text-[#2B6477] font-mono-brand whitespace-nowrap">
                  {b.nivel}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                <span className="font-medium">Cobertura:</span> {b.cobertura}
              </p>
              <div className="grid sm:grid-cols-2 gap-4 mb-3">
                <div>
                  <p className="text-[10px] uppercase text-gray-400 font-mono-brand mb-1">Requisitos</p>
                  <ul className="text-xs text-gray-600 space-y-0.5">
                    {b.requisitos.map((r, i) => <li key={i}>• {r}</li>)}
                  </ul>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-gray-400 font-mono-brand mb-1">Proceso</p>
                  <ol className="text-xs text-gray-600 space-y-0.5 list-decimal list-inside">
                    {b.proceso.map((p, i) => <li key={i}>{p}</li>)}
                  </ol>
                </div>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400 font-mono-brand">Idioma: {b.idioma}</span>
                <span className="text-[#2B6477] font-mono-brand font-semibold">
                  Cierra {new Date(b.fechaLimite).toLocaleDateString('es-CR')}
                </span>
              </div>
            </div>
          ))}
        </div>
        {lista.length === 0 && (
          <div className="text-center py-16">
            <div className="w-14 h-14 rounded-2xl bg-[#7A6FA6]/15 flex items-center justify-center text-2xl mx-auto mb-4">🎓</div>
            <p className="text-gray-600 font-medium mb-1">No hay becas con ese filtro</p>
            <p className="text-gray-400 text-sm">Probá con otro país o nivel.</p>
          </div>
        )}
      </main>
      </div>
    </div>
  );
}
