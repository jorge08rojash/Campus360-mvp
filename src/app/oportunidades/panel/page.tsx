'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useUsuarioActual } from '@/lib/useUsuarioActual';
import { usePageTitle } from '@/lib/usePageTitle';
import { supabase, TcuProceso } from '@/lib/supabase';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { leerColeccion } from '@/lib/simulatedStore';

export default function PanelPage() {
  const { usuario, cargando, cerrarSesion } = useUsuarioActual();
  usePageTitle('Panel de Oportunidades');
  const [proceso, setProceso] = useState<TcuProceso | null>(null);
  const [conteos, setConteos] = useState({
    tutorias: 0, eventos: 0, actividades: 0, postulaciones: 0, certificaciones: 0, conexiones: 0, favoritos: 0,
  });

  useEffect(() => {
    if (!usuario) return;
    supabase.from('tcu_proceso').select('*').eq('usuario_id', usuario.id).single().then(({ data }) => setProceso(data));
    setConteos({
      tutorias: leerColeccion(usuario.id, 'tutorias').length,
      eventos: leerColeccion(usuario.id, 'eventos').length,
      actividades: leerColeccion(usuario.id, 'actividades').length,
      postulaciones: leerColeccion(usuario.id, 'postulaciones').length,
      certificaciones: leerColeccion(usuario.id, 'certificaciones_obtenidas').length,
      conexiones: leerColeccion(usuario.id, 'conexiones').length,
      favoritos: leerColeccion(usuario.id, 'favoritos_actividades').length,
    });
  }, [usuario]);

  if (cargando || !usuario) return null;

  const pctTcu = proceso ? Math.min(100, Math.round((proceso.horas_completadas / proceso.horas_requeridas) * 100)) : 0;

  // Cálculo del Índice de Desarrollo Universitario (IDU) — ponderado, ficticio con fines de demo
  const indicadores = [
    { label: 'Horas de TCU', valor: pctTcu, peso: 0.2, detalle: `${proceso?.horas_completadas ?? 0}/${proceso?.horas_requeridas ?? 150} horas` },
    { label: 'Tutorías realizadas', valor: Math.min(100, conteos.tutorias * 25), peso: 0.1, detalle: `${conteos.tutorias} sesión(es)` },
    { label: 'Eventos asistidos', valor: Math.min(100, conteos.eventos * 20), peso: 0.15, detalle: `${conteos.eventos} evento(s)` },
    { label: 'Vida universitaria', valor: Math.min(100, conteos.actividades * 20), peso: 0.15, detalle: `${conteos.actividades} actividad(es)` },
    { label: 'Certificaciones', valor: Math.min(100, conteos.certificaciones * 30), peso: 0.15, detalle: `${conteos.certificaciones} obtenida(s)` },
    { label: 'Postulaciones laborales', valor: Math.min(100, conteos.postulaciones * 30), peso: 0.15, detalle: `${conteos.postulaciones} activa(s)` },
    { label: 'Networking', valor: Math.min(100, conteos.conexiones * 20), peso: 0.1, detalle: `${conteos.conexiones} conexión(es)` },
  ];

  const idu = Math.round(indicadores.reduce((acc, i) => acc + i.valor * i.peso, 0));

  const puntosCampus360 = conteos.eventos * 45 + conteos.tutorias * 20 + conteos.actividades * 60 + (proceso?.horas_completadas ?? 0) * 2;

  const nivel = idu >= 80 ? 'Excepcional' : idu >= 60 ? 'Avanzado' : idu >= 35 ? 'En desarrollo' : 'Inicial';
  const colorNivel = idu >= 80 ? 'text-[#E8C989]' : idu >= 60 ? 'text-green-400' : idu >= 35 ? 'text-yellow-400' : 'text-gray-400';

  const insignias = [
    { nombre: 'Primer TCU registrado', obtenida: (proceso?.horas_completadas ?? 0) > 0, emoji: '📋' },
    { nombre: 'Explorador de eventos', obtenida: conteos.eventos >= 1, emoji: '🎟️' },
    { nombre: 'Networker', obtenida: conteos.conexiones >= 3, emoji: '🤝' },
    { nombre: 'Certificado profesional', obtenida: conteos.certificaciones >= 1, emoji: '📜' },
    { nombre: 'Vida universitaria activa', obtenida: conteos.actividades >= 2, emoji: '🎉' },
    { nombre: 'En búsqueda laboral', obtenida: conteos.postulaciones >= 1, emoji: '💼' },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#FFFFFF]">
      <Sidebar usuario={usuario} cerrarSesion={cerrarSesion} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar usuario={usuario} />
      <main className="flex-1 px-6 py-8 md:px-10 md:py-10 max-w-5xl">
        <Link href="/oportunidades" className="text-xs text-gray-400 hover:text-[#2B6477] font-mono-brand mb-2 inline-block">
          ← Centro de Oportunidades
        </Link>

        <div className="c360-grid-bg rounded-3xl p-8 md:p-10 text-white mb-6">
          <p className="font-mono-brand text-[10px] uppercase tracking-widest text-[#E8C989] mb-2">
            Índice de Desarrollo Universitario
          </p>
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-2">
            <span className="font-serif-brand text-6xl">{idu}</span>
            <div className="pb-2">
              <p className={`text-sm font-semibold ${colorNivel}`}>{nivel}</p>
              <p className="text-white/50 text-xs">de 100 puntos posibles</p>
            </div>
          </div>
          <p className="text-white/60 text-sm max-w-xl">
            Tu IDU combina TCU, tutorías, eventos, vida universitaria, certificaciones, postulaciones laborales
            y networking en un solo número que representa tu crecimiento integral, más allá de las notas.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4 font-mono-brand">
                Indicadores
              </h2>
              <div className="space-y-4">
                {indicadores.map((i) => (
                  <div key={i.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600 font-medium">{i.label}</span>
                      <span className="text-gray-400 font-mono-brand">{i.detalle}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-[#2B6477] h-2 rounded-full transition-all duration-700"
                        style={{ width: `${i.valor}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <span>✨</span>
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide font-mono-brand">
                  Recomendaciones para mejorar tu IDU
                </h2>
              </div>
              <ul className="space-y-2">
                {conteos.certificaciones === 0 && (
                  <li className="text-sm text-gray-600 flex gap-2">
                    <span className="text-[#2B6477]">▸</span>
                    <span>
                      No tenés certificaciones registradas.{' '}
                      <Link href="/oportunidades/certificaciones" className="text-[#2B6477] hover:underline">
                        Explorá el catálogo
                      </Link>{' '}
                      — AWS Cloud Practitioner es un buen punto de partida.
                    </span>
                  </li>
                )}
                {conteos.conexiones < 3 && (
                  <li className="text-sm text-gray-600 flex gap-2">
                    <span className="text-[#2B6477]">▸</span>
                    <span>
                      Ampliá tu red:{' '}
                      <Link href="/oportunidades/networking" className="text-[#2B6477] hover:underline">
                        conectá con al menos 3 personas
                      </Link>{' '}
                      de tu área de interés.
                    </span>
                  </li>
                )}
                {pctTcu < 100 && (
                  <li className="text-sm text-gray-600 flex gap-2">
                    <span className="text-[#2B6477]">▸</span>
                    <span>
                      Seguís con TCU pendiente.{' '}
                      <Link href="/vida-universitaria/voluntariado-reforestacion" className="text-[#2B6477] hover:underline">
                        El voluntariado de reforestación
                      </Link>{' '}
                      otorga horas válidas.
                    </span>
                  </li>
                )}
                {conteos.eventos === 0 && (
                  <li className="text-sm text-gray-600 flex gap-2">
                    <span className="text-[#2B6477]">▸</span>
                    <span>
                      Todavía no asististe a eventos este cuatrimestre.{' '}
                      <Link href="/eventos" className="text-[#2B6477] hover:underline">
                        Revisá la agenda
                      </Link>
                      .
                    </span>
                  </li>
                )}
              </ul>
            </section>
          </div>

          <div className="space-y-6">
            <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 font-mono-brand">
                Puntos Campus360
              </h2>
              <p className="font-serif-brand text-3xl text-[#2B6477]">{puntosCampus360}</p>
              <p className="text-xs text-gray-400 mt-1">Acumulados este cuatrimestre</p>
            </section>

            <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 font-mono-brand">
                Insignias
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {insignias.map((ins) => (
                  <div
                    key={ins.nombre}
                    title={ins.nombre}
                    className={`aspect-square rounded-xl flex flex-col items-center justify-center gap-1 border ${
                      ins.obtenida ? 'bg-[#2B6477]/15 border-[#2B6477]' : 'bg-gray-50 border-gray-100 opacity-40'
                    }`}
                  >
                    <span className="text-xl">{ins.emoji}</span>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-gray-400 mt-3">
                {insignias.filter((i) => i.obtenida).length} de {insignias.length} insignias obtenidas
              </p>
            </section>

            <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 font-mono-brand">
                Resumen de actividad
              </h2>
              <dl className="space-y-2 text-sm">
                {[
                  ['Tutorías realizadas', conteos.tutorias],
                  ['Eventos asistidos', conteos.eventos],
                  ['Actividades de vida U', conteos.actividades],
                  ['Certificaciones', conteos.certificaciones],
                  ['Postulaciones', conteos.postulaciones],
                  ['Conexiones', conteos.conexiones],
                ].map(([label, val]) => (
                  <div key={label as string} className="flex justify-between border-b border-gray-50 pb-1.5 last:border-0">
                    <dt className="text-gray-500">{label}</dt>
                    <dd className="font-medium text-gray-800">{val}</dd>
                  </div>
                ))}
              </dl>
            </section>
          </div>
        </div>
      </main>
      </div>
    </div>
  );
}
