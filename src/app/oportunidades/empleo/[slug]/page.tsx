'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useUsuarioActual } from '@/lib/useUsuarioActual';
import { usePageTitle } from '@/lib/usePageTitle';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { getEmpleo } from '@/data/empleos';
import { leerColeccion, agregarItem, quitarItem } from '@/lib/simulatedStore';

type Postulacion = { id: string; empleoId: string; cargo: string; empresa: string; estado: string; fecha: string };
type Guardado = { id: string; empleoId: string };

export default function EmpleoDetallePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { usuario, cargando, cerrarSesion } = useUsuarioActual();
  usePageTitle('Empleo');
  const [postulaciones, setPostulaciones] = useState<Postulacion[]>([]);
  const [guardados, setGuardados] = useState<Guardado[]>([]);
  const [aviso, setAviso] = useState<string | null>(null);

  const empleo = getEmpleo(slug);

  useEffect(() => {
    if (!usuario) return;
    setPostulaciones(leerColeccion<Postulacion>(usuario.id, 'postulaciones'));
    setGuardados(leerColeccion<Guardado>(usuario.id, 'empleos_guardados'));
  }, [usuario]);

  if (cargando || !usuario) return null;
  if (!empleo) {
    return (
      <div className="min-h-screen flex flex-col md:flex-row bg-[#FFFFFF]">
        <Sidebar usuario={usuario} cerrarSesion={cerrarSesion} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar usuario={usuario} />
        <main className="flex-1 px-6 py-10">
          <p className="text-gray-500">Vacante no encontrada.</p>
          <Link href="/oportunidades/empleo" className="text-[#2B6477] hover:underline text-sm">← Volver</Link>
        </main>
      </div>
      </div>
    );
  }

  const postulacion = postulaciones.find((p) => p.empleoId === empleo.id);
  const guardado = guardados.some((g) => g.empleoId === empleo.id);

  function mostrarAviso(t: string) {
    setAviso(t);
    setTimeout(() => setAviso(null), 2500);
  }

  function aplicar() {
    if (!usuario || !empleo || postulacion) return;
    const nueva: Postulacion = {
      id: `post-${empleo.id}-${Date.now()}`,
      empleoId: empleo.id,
      cargo: empleo.cargo,
      empresa: empleo.empresa,
      estado: 'Enviada',
      fecha: new Date().toISOString(),
    };
    setPostulaciones(agregarItem<Postulacion>(usuario.id, 'postulaciones', nueva));
    mostrarAviso('¡Postulación enviada! La empresa recibirá tu perfil.');
  }

  function toggleGuardado() {
    if (!usuario || !empleo) return;
    if (guardado) {
      const item = guardados.find((g) => g.empleoId === empleo.id);
      if (item) setGuardados(quitarItem<Guardado>(usuario.id, 'empleos_guardados', item.id));
    } else {
      setGuardados(agregarItem<Guardado>(usuario.id, 'empleos_guardados', { id: `g-${empleo.id}`, empleoId: empleo.id }));
      mostrarAviso('Guardada en tus ofertas');
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#FFFFFF]">
      <Sidebar usuario={usuario} cerrarSesion={cerrarSesion} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar usuario={usuario} />
      <main className="flex-1 px-6 py-8 md:px-10 md:py-10 max-w-3xl">
        <Link href="/oportunidades/empleo" className="text-xs text-gray-400 hover:text-[#2B6477] font-mono-brand mb-4 inline-block">
          ← Volver a bolsa de empleo
        </Link>

        {aviso && (
          <div className="bg-[#2B6477]/20 border border-[#2B6477] text-[#2B6477] text-sm px-4 py-2.5 rounded-xl mb-4">
            ✓ {aviso}
          </div>
        )}

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl bg-[#2B6477] text-white flex items-center justify-center text-lg font-semibold shrink-0">
              {empleo.logo}
            </div>
            <div>
              <h1 className="font-serif-brand text-2xl text-[#2B6477]">{empleo.cargo}</h1>
              <p className="text-sm text-gray-500">{empleo.empresa} · {empleo.ubicacion}</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-4">{empleo.descripcionEmpresa}</p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="text-xs bg-gray-50 text-gray-600 px-2.5 py-1 rounded-full">{empleo.modalidad}</span>
            <span className="text-xs bg-gray-50 text-gray-600 px-2.5 py-1 rounded-full">{empleo.tipo}</span>
            {empleo.salario && <span className="text-xs bg-[#2B6477]/10 text-[#2B6477] px-2.5 py-1 rounded-full">{empleo.salario}</span>}
            <span className="text-xs bg-[#2B6477]/10 text-[#2B6477] px-2.5 py-1 rounded-full">
              Vence {new Date(empleo.fechaLimite).toLocaleDateString('es-CR')}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={aplicar}
              disabled={!!postulacion}
              className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                postulacion
                  ? 'bg-[#2B6477]/30 text-[#2B6477] cursor-default'
                  : 'bg-[#2B6477] text-white hover:bg-[#1F5567] hover:scale-[1.02]'
              }`}
            >
              {postulacion ? `✓ ${postulacion.estado}` : 'Aplicar ahora'}
            </button>
            <button
              onClick={toggleGuardado}
              className="px-4 py-2.5 rounded-xl text-sm font-medium border border-gray-200 text-gray-600 hover:border-[#2B6477] hover:text-[#2B6477] transition-colors"
            >
              {guardado ? '⭐ Guardada' : '☆ Guardar'}
            </button>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 font-mono-brand">Requisitos</h2>
            <ul className="space-y-1.5">
              {empleo.requisitos.map((r, i) => <li key={i} className="text-sm text-gray-600">• {r}</li>)}
            </ul>
          </section>
          <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 font-mono-brand">Competencias</h2>
            <div className="flex flex-wrap gap-1.5">
              {empleo.competencias.map((c) => (
                <span key={c} className="text-xs bg-[#2B6477]/5 text-[#2B6477] px-2.5 py-1 rounded-full">{c}</span>
              ))}
            </div>
          </section>
        </div>

        <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 font-mono-brand">Beneficios</h2>
          <div className="grid sm:grid-cols-2 gap-2">
            {empleo.beneficios.map((b, i) => (
              <div key={i} className="text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">{b}</div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 font-mono-brand">Contacto</h2>
          <p className="text-sm text-gray-600">{empleo.contacto}</p>
        </section>
      </main>
      </div>
    </div>
  );
}
