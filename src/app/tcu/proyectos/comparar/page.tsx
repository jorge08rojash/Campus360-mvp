'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useUsuarioActual } from '@/lib/useUsuarioActual';
import { usePageTitle } from '@/lib/usePageTitle';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { proyectosTcu } from '@/data/proyectosTcu';
import { leerColeccion, guardarColeccion } from '@/lib/simulatedStore';

export default function CompararProyectosPage() {
  const { usuario, cargando, cerrarSesion } = useUsuarioActual();
  usePageTitle('Comparar Proyectos TCU');
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    if (usuario) setIds(leerColeccion<string>(usuario.id, 'tcu_comparacion'));
  }, [usuario]);

  if (cargando || !usuario) return null;

  const proyectos = ids.map((id) => proyectosTcu.find((p) => p.id === id)).filter(Boolean) as typeof proyectosTcu;

  function quitar(id: string) {
    if (!usuario) return;
    const nueva = ids.filter((i) => i !== id);
    setIds(nueva);
    guardarColeccion(usuario.id, 'tcu_comparacion', nueva);
  }

  const filas = [
    { label: 'Organización', get: (p: (typeof proyectosTcu)[number]) => p.organizacion },
    { label: 'Tipo', get: (p: (typeof proyectosTcu)[number]) => p.tipoOrg },
    { label: 'Modalidad', get: (p: (typeof proyectosTcu)[number]) => p.modalidad },
    { label: 'Ubicación', get: (p: (typeof proyectosTcu)[number]) => `${p.canton}, ${p.provincia}` },
    { label: 'Horario', get: (p: (typeof proyectosTcu)[number]) => p.horario },
    { label: 'Duración', get: (p: (typeof proyectosTcu)[number]) => p.tiempoEstimado },
    { label: 'Cupos', get: (p: (typeof proyectosTcu)[number]) => `${p.inscritos}/${p.cupos}` },
    { label: 'Área', get: (p: (typeof proyectosTcu)[number]) => p.area },
    { label: 'Supervisor', get: (p: (typeof proyectosTcu)[number]) => p.supervisor },
    { label: 'Carreras', get: (p: (typeof proyectosTcu)[number]) => p.carreras.join(', ') },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#FFFFFF]">
      <Sidebar usuario={usuario} cerrarSesion={cerrarSesion} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar usuario={usuario} />
      <main className="flex-1 px-6 py-8 md:px-10 md:py-10 max-w-5xl">
        <Link href="/tcu/proyectos" className="text-xs text-gray-400 hover:text-[#2B6477] font-mono-brand mb-2 inline-block">
          ← Volver al banco de proyectos
        </Link>
        <h1 className="font-serif-brand text-3xl text-[#2B6477] mb-6">Comparar proyectos</h1>

        {proyectos.length === 0 ? (
          <p className="text-gray-400 text-sm">
            No seleccionaste proyectos para comparar.{' '}
            <Link href="/tcu/proyectos" className="text-[#2B6477] hover:underline">Volvé al banco de proyectos</Link>.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden text-sm">
              <thead>
                <tr className="bg-[#2B6477]/5">
                  <th className="text-left p-3 text-xs uppercase text-gray-400 font-mono-brand w-32"> </th>
                  {proyectos.map((p) => (
                    <th key={p.id} className="text-left p-3 min-w-[200px]">
                      <p className="font-semibold text-gray-800 text-sm leading-snug">{p.nombre}</p>
                      <button onClick={() => quitar(p.id)} className="text-[10px] text-[#2B6477] hover:underline mt-1">Quitar</button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filas.map((f) => (
                  <tr key={f.label} className="border-t border-gray-50">
                    <td className="p-3 text-xs uppercase text-gray-400 font-mono-brand">{f.label}</td>
                    {proyectos.map((p) => (
                      <td key={p.id} className="p-3 text-gray-600">{f.get(p)}</td>
                    ))}
                  </tr>
                ))}
                <tr className="border-t border-gray-50">
                  <td className="p-3 text-xs uppercase text-gray-400 font-mono-brand">Acción</td>
                  {proyectos.map((p) => (
                    <td key={p.id} className="p-3">
                      <Link href={`/tcu/proyectos/${p.slug}`} className="text-xs font-medium text-white bg-[#2B6477] px-3 py-1.5 rounded-lg hover:bg-[#1F5567] inline-block">
                        Ver y postularme →
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </main>
      </div>
    </div>
  );
}
