'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useUsuarioActual } from '@/lib/useUsuarioActual';
import { usePageTitle } from '@/lib/usePageTitle';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { empleos } from '@/data/empleos';
import { practicas, becas, intercambios, certificaciones, personasNetworking } from '@/data/oportunidades';
import { leerColeccion } from '@/lib/simulatedStore';

type Postulacion = { id: string; empleoId: string };

const secciones = [
  { href: '/oportunidades/empleo', icon: '💼', titulo: 'Bolsa de empleo', desc: 'Vacantes para estudiantes y recién graduados', count: empleos.length },
  { href: '/oportunidades/practicas', icon: '🎯', titulo: 'Prácticas profesionales', desc: 'Programas con empresas aliadas', count: practicas.length },
  { href: '/oportunidades/becas', icon: '🎓', titulo: 'Becas', desc: 'Nacionales e internacionales', count: becas.length },
  { href: '/oportunidades/intercambios', icon: '✈️', titulo: 'Intercambios académicos', desc: 'Movilidad estudiantil internacional', count: intercambios.length },
  { href: '/oportunidades/certificaciones', icon: '📜', titulo: 'Certificaciones', desc: 'Catálogo recomendado por carrera', count: certificaciones.length },
  { href: '/oportunidades/networking', icon: '🤝', titulo: 'Networking', desc: 'Conectá con tu comunidad universitaria', count: personasNetworking.length },
  { href: '/oportunidades/panel', icon: '📊', titulo: 'Mi panel de crecimiento', desc: 'Tu Índice de Desarrollo Universitario', count: null },
];

export default function OportunidadesPage() {
  const { usuario, cargando, cerrarSesion } = useUsuarioActual();
  usePageTitle('Oportunidades');
  const [postulaciones, setPostulaciones] = useState<Postulacion[]>([]);

  useEffect(() => {
    if (usuario) setPostulaciones(leerColeccion<Postulacion>(usuario.id, 'postulaciones'));
  }, [usuario]);

  if (cargando || !usuario) return null;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#FFFFFF]">
      <Sidebar usuario={usuario} cerrarSesion={cerrarSesion} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar usuario={usuario} />
      <main className="flex-1 px-6 py-8 md:px-10 md:py-10 max-w-5xl">
        <div className="c360-grid-bg rounded-3xl p-8 md:p-10 text-white mb-6">
          <p className="font-mono-brand text-[10px] uppercase tracking-widest text-[#E8C989] mb-2">
            Nuevo módulo
          </p>
          <h1 className="font-serif-brand text-3xl md:text-4xl mb-2">Centro de Oportunidades</h1>
          <p className="text-white/60 text-sm max-w-xl">
            Empleo, prácticas, becas, intercambios y certificaciones — todo lo que acompaña tu crecimiento
            académico, profesional y personal, en un solo lugar.
          </p>
          {postulaciones.length > 0 && (
            <p className="text-xs text-[#E8C989] mt-4 font-mono-brand">
              Tenés {postulaciones.length} postulación(es) activa(s)
            </p>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {secciones.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all flex items-start gap-4"
            >
              <span className="text-3xl">{s.icon}</span>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-semibold text-gray-800 text-sm">{s.titulo}</h2>
                  {s.count !== null && (
                    <span className="text-[10px] font-mono-brand bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">
                      {s.count}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{s.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
      </div>
    </div>
  );
}
