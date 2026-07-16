'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useUsuarioActual } from '@/lib/useUsuarioActual';
import { usePageTitle } from '@/lib/usePageTitle';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { certificaciones } from '@/data/oportunidades';
import { leerColeccion, agregarItem, quitarItem } from '@/lib/simulatedStore';

type CertObtenida = { id: string; certId: string; nombre: string };

const niveles = ['Todos', 'Fundamentos', 'Intermedio', 'Avanzado'];

export default function CertificacionesPage() {
  const { usuario, cargando, cerrarSesion } = useUsuarioActual();
  usePageTitle('Certificaciones');
  const [nivel, setNivel] = useState('Todos');
  const [obtenidas, setObtenidas] = useState<CertObtenida[]>([]);

  useEffect(() => {
    if (usuario) setObtenidas(leerColeccion<CertObtenida>(usuario.id, 'certificaciones_obtenidas'));
  }, [usuario]);

  if (cargando || !usuario) return null;

  function toggle(c: (typeof certificaciones)[number]) {
    if (!usuario) return;
    const existente = obtenidas.find((o) => o.certId === c.id);
    if (existente) {
      setObtenidas(quitarItem<CertObtenida>(usuario.id, 'certificaciones_obtenidas', existente.id));
    } else {
      setObtenidas(agregarItem<CertObtenida>(usuario.id, 'certificaciones_obtenidas', { id: `co-${c.id}`, certId: c.id, nombre: c.nombre }));
    }
  }

  const lista = certificaciones.filter((c) => nivel === 'Todos' || c.nivel === nivel);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#FFFFFF]">
      <Sidebar usuario={usuario} cerrarSesion={cerrarSesion} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar usuario={usuario} />
      <main className="flex-1 px-6 py-8 md:px-10 md:py-10 max-w-4xl">
        <Link href="/oportunidades" className="text-xs text-gray-400 hover:text-[#2B6477] font-mono-brand mb-2 inline-block">
          ← Centro de Oportunidades
        </Link>
        <h1 className="font-serif-brand text-3xl text-[#2B6477] mb-1">Certificaciones recomendadas</h1>
        <p className="text-gray-500 mb-6">
          {certificaciones.length} certificaciones · {obtenidas.length} marcada(s) como obtenida(s)
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {niveles.map((n) => (
            <button key={n} onClick={() => setNivel(n)} className={`text-xs font-medium px-3 py-1.5 rounded-full transition-all ${nivel === n ? 'bg-[#2B6477] text-white' : 'bg-white text-gray-500 border border-gray-200 hover:border-[#2B6477]'}`}>
              {n}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {lista.map((c) => {
            const obtenida = obtenidas.some((o) => o.certId === c.id);
            return (
              <div key={c.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-800 text-sm">{c.nombre}</h3>
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-mono-brand whitespace-nowrap">
                    {c.nivel}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-3">{c.proveedor} · {c.modalidad}</p>
                <div className="flex gap-3 text-xs text-gray-500 mb-3 font-mono-brand">
                  <span>⏱ {c.tiempo}</span>
                  <span>💰 {c.costo}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {c.competencias.map((comp) => (
                    <span key={comp} className="text-[10px] bg-[#2B6477]/5 text-[#2B6477] px-2 py-0.5 rounded-full">{comp}</span>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mb-3 italic">{c.valorMercado}</p>
                <button
                  onClick={() => toggle(c)}
                  className={`w-full text-xs font-medium py-2 rounded-lg transition-colors ${
                    obtenida ? 'bg-[#2B6477]/30 text-[#2B6477]' : 'bg-[#2B6477] text-white hover:bg-[#1F5567]'
                  }`}
                >
                  {obtenida ? '✓ Marcada como obtenida' : 'Marcar como obtenida'}
                </button>
              </div>
            );
          })}
        </div>
      </main>
      </div>
    </div>
  );
}
