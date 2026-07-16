'use client';

import { useEffect, useState } from 'react';
import { useUsuarioActual } from '@/lib/useUsuarioActual';
import { usePageTitle } from '@/lib/usePageTitle';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { notificacionesEjemplo } from '@/lib/datosSimulados';
import {
  matriculaInfo, pagosInfo, bibliotecaInfo, carneInfo, historialAcademico,
  certificacionesOficiales, tramitesDisponibles, reglamentosInstitucionales,
} from '@/data/administrativo';
import { leerColeccion, agregarItem } from '@/lib/simulatedStore';

type Solicitud = { id: string; tramite: string; fecha: string; estado: string };

const areas = [
  { id: 'matricula', label: 'Matrícula', icon: '📝' },
  { id: 'pagos', label: 'Pagos', icon: '💳' },
  { id: 'becas', label: 'Becas', icon: '🎓' },
  { id: 'biblioteca', label: 'Biblioteca', icon: '📚' },
  { id: 'carne', label: 'Carné', icon: '🪪' },
  { id: 'historial', label: 'Historial académico', icon: '📊' },
  { id: 'certificaciones', label: 'Certificaciones', icon: '📜' },
  { id: 'tramites', label: 'Trámites', icon: '🗂️' },
  { id: 'reglamentos', label: 'Reglamentos', icon: '⚖️' },
  { id: 'solicitudes', label: 'Mis solicitudes', icon: '📋' },
] as const;

export default function AdministrativoPage() {
  const { usuario, cargando, cerrarSesion } = useUsuarioActual();
  usePageTitle('Centro Administrativo');
  const [area, setArea] = useState<(typeof areas)[number]['id']>('matricula');
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);

  useEffect(() => {
    if (usuario) setSolicitudes(leerColeccion<Solicitud>(usuario.id, 'solicitudes'));
  }, [usuario]);

  if (cargando || !usuario) return null;

  function crearSolicitud(tramite: string) {
    if (!usuario) return;
    const nueva: Solicitud = { id: `sol-${Date.now()}`, tramite, fecha: new Date().toISOString(), estado: 'En trámite' };
    setSolicitudes(agregarItem<Solicitud>(usuario.id, 'solicitudes', nueva));
    setArea('solicitudes');
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#FFFFFF]">
      <Sidebar usuario={usuario} cerrarSesion={cerrarSesion} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar usuario={usuario} />
      <main className="flex-1 px-6 py-8 md:px-10 md:py-10 max-w-4xl">
        <h1 className="font-serif-brand text-3xl text-[#2B6477] mb-1">Centro administrativo</h1>
        <p className="text-gray-500 mb-6">Matrícula, pagos, becas, trámites y más en un solo portal</p>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {areas.map((a) => (
            <button
              key={a.id}
              onClick={() => setArea(a.id)}
              className={`text-xs font-medium px-3 py-1.5 rounded-full whitespace-nowrap transition-colors flex items-center gap-1 ${
                area === a.id ? 'bg-[#2B6477] text-white' : 'bg-white text-gray-500 border border-gray-200 hover:border-[#2B6477]'
              }`}
            >
              <span>{a.icon}</span> {a.label}
            </button>
          ))}
        </div>

        {area === 'matricula' && (
          <div className="space-y-4">
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xs text-gray-400 font-mono-brand uppercase">Periodo</p>
                  <p className="font-serif-brand text-xl text-[#2B6477]">{matriculaInfo.periodoActual}</p>
                </div>
                <span className="text-xs font-semibold uppercase px-2 py-0.5 rounded-full bg-green-50 text-green-600 font-mono-brand">{matriculaInfo.estado}</span>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Apertura: {new Date(matriculaInfo.fechaApertura).toLocaleDateString('es-CR')} · Cierre: {new Date(matriculaInfo.fechaCierre).toLocaleDateString('es-CR')} · {matriculaInfo.creditosMatriculados} créditos
              </p>
              <p className="text-[10px] uppercase text-gray-400 font-mono-brand mb-2">Proceso</p>
              <ol className="space-y-1.5 text-sm text-gray-600 list-decimal list-inside">
                {matriculaInfo.pasos.map((p, i) => <li key={i}>{p}</li>)}
              </ol>
            </section>
          </div>
        )}

        {area === 'pagos' && (
          <div className="space-y-4">
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <p className="text-xs text-gray-400 font-mono-brand uppercase mb-1">Saldo pendiente</p>
              <p className="font-serif-brand text-3xl text-[#2B6477]">₡{pagosInfo.saldoPendiente.toLocaleString('es-CR')}</p>
              <p className="text-xs text-green-600 mt-1">Estás al día con tus pagos ✓</p>
            </section>
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 font-mono-brand">Métodos de pago disponibles</h2>
              <div className="flex flex-wrap gap-1.5">
                {pagosInfo.metodosDisponibles.map((m) => <span key={m} className="text-xs bg-gray-50 text-gray-600 px-2.5 py-1 rounded-full">{m}</span>)}
              </div>
            </section>
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 font-mono-brand">Historial de pagos</h2>
              <div className="space-y-2">
                {pagosInfo.historial.map((h, i) => (
                  <div key={i} className="flex justify-between items-center bg-gray-50 rounded-lg px-3 py-2.5 text-sm">
                    <div><p className="text-gray-700">{h.concepto}</p><p className="text-xs text-gray-400">{new Date(h.fecha).toLocaleDateString('es-CR')}</p></div>
                    <div className="text-right"><p className="font-medium text-gray-800">{h.monto}</p><span className="text-[10px] text-green-600 font-mono-brand">{h.estado}</span></div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {area === 'becas' && (
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-600 mb-4">Consultá el catálogo completo de becas nacionales e internacionales en el Centro de Oportunidades.</p>
            <a href="/oportunidades/becas" className="inline-block text-sm font-medium bg-[#2B6477] text-white px-4 py-2 rounded-lg hover:bg-[#1F5567]">
              Ver becas disponibles →
            </a>
          </section>
        )}

        {area === 'biblioteca' && (
          <div className="space-y-4">
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <p className="text-xs text-gray-400 font-mono-brand uppercase mb-1">Préstamos activos</p>
              <p className="font-serif-brand text-2xl text-[#2B6477]">{bibliotecaInfo.librosPrestados} / {bibliotecaInfo.limitePrestamos}</p>
            </section>
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 font-mono-brand">Libros prestados</h2>
              <div className="space-y-2">
                {bibliotecaInfo.prestamos.map((p, i) => (
                  <div key={i} className="flex justify-between bg-gray-50 rounded-lg px-3 py-2.5 text-sm">
                    <div><p className="text-gray-700">{p.titulo}</p><p className="text-xs text-gray-400">{p.autor}</p></div>
                    <span className="text-xs text-[#2B6477] font-mono-brand">Vence {new Date(p.vence).toLocaleDateString('es-CR')}</span>
                  </div>
                ))}
              </div>
            </section>
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 font-mono-brand">Recursos disponibles</h2>
              <ul className="text-sm text-gray-600 space-y-1">{bibliotecaInfo.recursos.map((r) => <li key={r}>• {r}</li>)}</ul>
            </section>
          </div>
        )}

        {area === 'carne' && (
          <section className="c360-grid-bg rounded-2xl p-6 text-white">
            <p className="text-[10px] uppercase text-white/40 font-mono-brand mb-1">Carné estudiantil</p>
            <p className="font-serif-brand text-2xl mb-3">{usuario.nombre}</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-[10px] uppercase text-white/40 font-mono-brand">Número</p><p>{carneInfo.numero}</p></div>
              <div><p className="text-[10px] uppercase text-white/40 font-mono-brand">Estado</p><p className="text-[#E8C989] font-medium">{carneInfo.estado}</p></div>
              <div><p className="text-[10px] uppercase text-white/40 font-mono-brand">Vence</p><p>{new Date(carneInfo.vence).toLocaleDateString('es-CR')}</p></div>
              <div><p className="text-[10px] uppercase text-white/40 font-mono-brand">Tipo</p><p>{carneInfo.tipo}</p></div>
            </div>
          </section>
        )}

        {area === 'historial' && (
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4 font-mono-brand">Historial académico</h2>
            <div className="space-y-2">
              {historialAcademico.map((h, i) => (
                <div key={i} className="flex justify-between items-center bg-gray-50 rounded-lg px-4 py-3 text-sm">
                  <span className="text-gray-700 font-medium">{h.cuatrimestre}</span>
                  <span className="text-gray-500">{h.creditos} créditos</span>
                  <span className="font-serif-brand text-lg text-[#2B6477]">{h.promedio}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {area === 'certificaciones' && (
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4 font-mono-brand">Certificaciones oficiales</h2>
            <div className="space-y-2">
              {certificacionesOficiales.map((c) => (
                <div key={c.nombre} className="flex justify-between items-center bg-gray-50 rounded-lg px-4 py-3">
                  <div><p className="text-sm text-gray-700">{c.nombre}</p><p className="text-xs text-gray-400">{c.tiempo}</p></div>
                  <button onClick={() => crearSolicitud(c.nombre)} className="text-xs font-medium bg-[#2B6477] text-white px-3 py-1.5 rounded-lg hover:bg-[#1F5567]">
                    Solicitar
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {area === 'tramites' && (
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4 font-mono-brand">Trámites disponibles</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {tramitesDisponibles.map((t) => (
                <div key={t.nombre} className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-800">{t.nombre}</p>
                  <p className="text-xs text-gray-400 mb-2">{t.area}</p>
                  <button onClick={() => crearSolicitud(t.nombre)} className="text-xs font-medium text-[#2B6477] hover:underline">
                    Iniciar solicitud →
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {area === 'reglamentos' && (
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4 font-mono-brand">Reglamentos institucionales</h2>
            <ul className="space-y-2">
              {reglamentosInstitucionales.map((r) => (
                <li key={r.nombre} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2.5 text-sm text-gray-700">
                  {r.nombre}
                  <span className="text-xs text-gray-400">PDF</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {area === 'solicitudes' && (
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4 font-mono-brand">Mis solicitudes</h2>
            {solicitudes.length === 0 ? (
              <p className="text-sm text-gray-400">No tenés solicitudes activas. Iniciá una desde Trámites o Certificaciones.</p>
            ) : (
              <div className="space-y-2">
                {solicitudes.map((s) => (
                  <div key={s.id} className="flex justify-between items-center bg-gray-50 rounded-lg px-4 py-3 text-sm">
                    <div><p className="text-gray-800">{s.tramite}</p><p className="text-xs text-gray-400">{new Date(s.fecha).toLocaleDateString('es-CR')}</p></div>
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-600 font-mono-brand">{s.estado}</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mt-6">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 font-mono-brand">Comunicados institucionales</h2>
          <div className="space-y-2">
            {notificacionesEjemplo.map((n) => (
              <div key={n.id} className="flex justify-between items-center text-sm bg-gray-50 rounded-lg px-3 py-2">
                <span className="text-gray-700">{n.titulo}</span>
                <span className="text-xs text-gray-400 font-mono-brand">{new Date(n.fecha).toLocaleDateString('es-CR')}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
      </div>
    </div>
  );
}
