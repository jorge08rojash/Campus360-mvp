'use client';

import { use } from 'react';
import Link from 'next/link';
import { useUsuarioActual } from '@/lib/useUsuarioActual';
import { usePageTitle } from '@/lib/usePageTitle';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import Avatar from '@/components/Avatar';
import { getPonente } from '@/data/ponentes';
import { eventos } from '@/data/eventos';

export default function PonentePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { usuario, cargando, cerrarSesion } = useUsuarioActual();
  usePageTitle('Ponente');
  const ponente = getPonente(id);

  if (cargando || !usuario) return null;

  if (!ponente) {
    return (
      <div className="min-h-screen flex flex-col md:flex-row bg-[#FFFFFF]">
        <Sidebar usuario={usuario} cerrarSesion={cerrarSesion} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar usuario={usuario} />
        <main className="flex-1 px-6 py-10">
          <p className="text-gray-500">Ponente no encontrado.</p>
          <Link href="/eventos" className="text-[#2B6477] hover:underline text-sm">← Volver a eventos</Link>
        </main>
      </div>
      </div>
    );
  }

  const eventosDelPonente = eventos.filter((e) => e.ponenteId === ponente.id);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#FFFFFF]">
      <Sidebar usuario={usuario} cerrarSesion={cerrarSesion} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar usuario={usuario} />
      <main className="flex-1 px-6 py-8 md:px-10 md:py-10 max-w-4xl">
        <Link href="/eventos" className="text-xs text-gray-400 hover:text-[#2B6477] font-mono-brand mb-4 inline-block">
          ← Volver a eventos
        </Link>

        <div className="c360-grid-bg rounded-3xl p-8 md:p-10 text-white mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <Avatar nombre={ponente.nombre} fotoUrl={ponente.foto_url} size={80} className="text-2xl font-serif-brand" />
            <div>
              <h1 className="font-serif-brand text-3xl mb-1">{ponente.nombre}</h1>
              <p className="text-[#E8C989] text-sm font-medium">{ponente.cargo}</p>
              <p className="text-white/50 text-sm">{ponente.organizacion}</p>
              <div className="flex gap-2 mt-3">
                {ponente.redes.map((r) => (
                  <span
                    key={r.tipo}
                    className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-white/10 text-white/70 uppercase font-mono-brand"
                  >
                    {r.tipo}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 font-mono-brand">
                Biografía
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">{ponente.bio}</p>
            </section>

            <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4 font-mono-brand">
                Experiencia
              </h2>
              <div className="space-y-0">
                {ponente.experiencia.map((e, i) => (
                  <div key={i} className="flex gap-4 pb-4 last:pb-0">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full bg-[#2B6477] mt-2" />
                      {i < ponente.experiencia.length - 1 && <div className="w-0.5 flex-1 bg-gray-100 my-1" />}
                    </div>
                    <p className="text-sm text-gray-600 pb-2">{e}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 font-mono-brand">
                Conferencias impartidas
              </h2>
              <ul className="space-y-2">
                {ponente.conferencias.map((c, i) => (
                  <li key={i} className="text-sm text-gray-600 flex gap-2">
                    <span className="text-[#2B6477]">▸</span> {c}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <div className="space-y-6">
            <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 font-mono-brand">
                Especialidades
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {ponente.especialidades.map((e) => (
                  <span key={e} className="text-xs bg-[#2B6477]/5 text-[#2B6477] px-2.5 py-1 rounded-full">
                    {e}
                  </span>
                ))}
              </div>
            </section>

            <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 font-mono-brand">
                Contacto
              </h2>
              <p className="text-sm text-gray-600 break-all">{ponente.contacto}</p>
            </section>

            {eventosDelPonente.length > 0 && (
              <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 font-mono-brand">
                  Eventos en Campus360
                </h2>
                <ul className="space-y-3">
                  {eventosDelPonente.map((e) => (
                    <li key={e.id}>
                      <Link href={`/eventos/${e.slug}`} className="group block">
                        <p className="text-sm font-medium text-gray-700 group-hover:text-[#2B6477] leading-snug">
                          {e.titulo}
                        </p>
                        <p className="text-[11px] text-gray-400 font-mono-brand">
                          {new Date(e.fecha).toLocaleDateString('es-CR')}
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
