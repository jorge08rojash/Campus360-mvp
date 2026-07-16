'use client';

import { useEffect, useState } from 'react';
import { useUsuarioActual } from '@/lib/useUsuarioActual';
import { usePageTitle } from '@/lib/usePageTitle';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import DemoBadge from '@/components/DemoBadge';
import { etapasTesisEjemplo, faqTesisEjemplo } from '@/lib/datosSimulados';
import { tesisChecklistPorEtapa, tesisPlantillas, tesisEjemplos, tesisManuales, tesisReuniones, tutorTesis } from '@/data/tesisInfo';
import { leerColeccion, guardarColeccion } from '@/lib/simulatedStore';

type Mensaje = { id: string; rol: 'yo' | 'tutor'; texto: string; fecha: string };
type ChecklistState = Record<string, boolean>;

const tabs = [
  { id: 'guia', label: 'Guía y checklist' },
  { id: 'documentos', label: 'Repositorio' },
  { id: 'tutor', label: 'Tutor y mensajería' },
  { id: 'reuniones', label: 'Reuniones' },
  { id: 'recursos', label: 'Plantillas y manuales' },
  { id: 'faq', label: 'FAQ' },
] as const;

export default function TesisPage() {
  const { usuario, cargando, cerrarSesion } = useUsuarioActual();
  usePageTitle('Tesis');
  const [tab, setTab] = useState<(typeof tabs)[number]['id']>('guia');
  const [checklist, setChecklist] = useState<ChecklistState>({});
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const etapaActual = etapasTesisEjemplo.find((e) => e.estado === 'actual') ?? etapasTesisEjemplo[0];

  useEffect(() => {
    if (!usuario) return;
    setChecklist(leerColeccion<[string, boolean]>(usuario.id, 'tesis_checklist').reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {}));
    const hist = leerColeccion<Mensaje>(usuario.id, 'tesis_mensajes');
    setMensajes(
      hist.length
        ? hist
        : [{ id: 'm0', rol: 'tutor', texto: `Hola ${usuario.nombre.split(' ')[0]}, quedo atento a tus avances de la etapa de metodología. Cualquier duda, escribime por acá.`, fecha: new Date().toISOString() }]
    );
  }, [usuario]);

  if (cargando || !usuario) return null;

  function toggleCheck(item: string) {
    if (!usuario) return;
    const nuevo = { ...checklist, [item]: !checklist[item] };
    setChecklist(nuevo);
    guardarColeccion(usuario.id, 'tesis_checklist', Object.entries(nuevo));
  }

  function enviarMensaje(e: React.FormEvent) {
    e.preventDefault();
    if (!usuario || !nuevoMensaje.trim()) return;
    const propio: Mensaje = { id: `m-${Date.now()}`, rol: 'yo', texto: nuevoMensaje, fecha: new Date().toISOString() };
    const conRespuesta = [...mensajes, propio];
    setMensajes(conRespuesta);
    guardarColeccion(usuario.id, 'tesis_mensajes', conRespuesta);
    setNuevoMensaje('');
    setTimeout(() => {
      const respuesta: Mensaje = { id: `m-${Date.now()}-r`, rol: 'tutor', texto: 'Recibido, lo reviso y te comento en la próxima reunión. 👍', fecha: new Date().toISOString() };
      const final = [...conRespuesta, respuesta];
      setMensajes(final);
      guardarColeccion(usuario.id, 'tesis_mensajes', final);
    }, 900);
  }

  const checklistActual = tesisChecklistPorEtapa[etapaActual.id] ?? [];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#FFFFFF]">
      <Sidebar usuario={usuario} cerrarSesion={cerrarSesion} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar usuario={usuario} />
      <main className="flex-1 px-6 py-8 md:px-10 md:py-10 max-w-4xl">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="font-serif-brand text-3xl text-[#2B6477]">Tesis / Trabajo Final de Graduación</h1>
        </div>
        <p className="text-gray-500 mb-6">Centro de apoyo completo para tu proceso · etapa actual: {etapaActual.nombre}</p>
        <DemoBadge texto="Módulo de demostración: las etapas y avances de tesis son de ejemplo y no se guardan." />

        <div className="flex gap-1 mb-6 overflow-x-auto border-b border-gray-200">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`text-sm font-medium px-4 py-2.5 whitespace-nowrap border-b-2 transition-colors ${
                tab === t.id ? 'border-[#2B6477] text-[#2B6477]' : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'guia' && (
          <div className="space-y-6">
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4 font-mono-brand">Etapas del proceso</h2>
              <ol className="space-y-4">
                {etapasTesisEjemplo.map((etapa, i) => (
                  <li key={etapa.id} className="flex gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${etapa.estado === 'completada' ? 'bg-[#2B6477] text-white' : etapa.estado === 'actual' ? 'bg-[#2B6477] text-white ring-4 ring-[#2B6477]/20' : 'bg-gray-100 text-gray-400'}`}>
                      {etapa.estado === 'completada' ? '✓' : i + 1}
                    </div>
                    <div>
                      <p className={`font-medium ${etapa.estado === 'pendiente' ? 'text-gray-400' : 'text-gray-800'}`}>{etapa.nombre}</p>
                      <p className="text-sm text-gray-500">{etapa.descripcion}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4 font-mono-brand">
                Checklist — {etapaActual.nombre}
              </h2>
              <ul className="space-y-2">
                {checklistActual.map((item) => (
                  <li key={item}>
                    <button onClick={() => toggleCheck(item)} className="flex items-start gap-2 text-left w-full group">
                      <span className={`w-4 h-4 rounded border shrink-0 mt-0.5 flex items-center justify-center text-[9px] transition-colors ${checklist[item] ? 'bg-[#2B6477] border-[#2B6477] text-white' : 'border-gray-300 group-hover:border-[#2B6477]'}`}>
                        {checklist[item] && '✓'}
                      </span>
                      <span className={`text-sm ${checklist[item] ? 'text-gray-300 line-through' : 'text-gray-600'}`}>{item}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        )}

        {tab === 'documentos' && (
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4 font-mono-brand">Repositorio de versiones</h2>
            <div className="space-y-3">
              {[
                { v: 'v1.0', fecha: '2026-04-10', estado: 'Aprobado', comentario: 'Anteproyecto inicial aprobado por el comité.' },
                { v: 'v1.1', fecha: '2026-05-20', estado: 'Aprobado', comentario: 'Marco teórico ampliado con retroalimentación del tutor.' },
                { v: 'v1.2', fecha: '2026-07-05', estado: 'En revisión', comentario: 'Metodología en revisión — pendiente de comentarios del tutor.' },
              ].map((doc) => (
                <div key={doc.v} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-gray-800">Documento {doc.v}</p>
                    <p className="text-xs text-gray-500">{doc.comentario}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full font-mono-brand ${doc.estado === 'Aprobado' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>
                      {doc.estado}
                    </span>
                    <p className="text-[10px] text-gray-400 font-mono-brand mt-1">{new Date(doc.fecha).toLocaleDateString('es-CR')}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {tab === 'tutor' && (
          <div className="space-y-6">
            <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#1B5E7B] text-white flex items-center justify-center font-semibold">
                {tutorTesis.nombre.split(' ').map((n) => n[0]).slice(0, 2).join('')}
              </div>
              <div>
                <p className="font-medium text-gray-800 text-sm">{tutorTesis.nombre}</p>
                <p className="text-xs text-gray-400">{tutorTesis.especialidad} · {tutorTesis.correo}</p>
              </div>
            </section>

            <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4 font-mono-brand">Mensajería</h2>
              <div className="space-y-3 mb-4 max-h-80 overflow-y-auto">
                {mensajes.map((m) => (
                  <div key={m.id} className={`flex ${m.rol === 'yo' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${m.rol === 'yo' ? 'bg-[#2B6477] text-white' : 'bg-gray-50 text-gray-700'}`}>
                      {m.texto}
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={enviarMensaje} className="flex gap-2">
                <input
                  value={nuevoMensaje}
                  onChange={(e) => setNuevoMensaje(e.target.value)}
                  placeholder="Escribile a tu tutor…"
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B6477]/20"
                />
                <button type="submit" className="bg-[#2B6477] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#1F5567]">
                  Enviar
                </button>
              </form>
            </section>
          </div>
        )}

        {tab === 'reuniones' && (
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4 font-mono-brand">Reuniones agendadas</h2>
            <div className="space-y-3">
              {tesisReuniones.map((r) => (
                <div key={r.id} className="flex items-center gap-4 bg-gray-50 rounded-lg px-4 py-3">
                  <div className="w-12 text-center shrink-0">
                    <p className="font-serif-brand text-xl text-[#2B6477] leading-none">{new Date(r.fecha).getDate()}</p>
                    <p className="text-[10px] uppercase text-gray-400 font-mono-brand">{new Date(r.fecha).toLocaleDateString('es-CR', { month: 'short' })}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{r.titulo}</p>
                    <p className="text-xs text-gray-500">{r.hora} · {r.modalidad}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {tab === 'recursos' && (
          <div className="space-y-6">
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 font-mono-brand">Plantillas</h2>
              <div className="space-y-2">
                {tesisPlantillas.map((p) => (
                  <div key={p.nombre} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2.5">
                    <span className="text-sm text-gray-700">{p.nombre}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white text-gray-500 font-mono-brand">{p.tipo}</span>
                  </div>
                ))}
              </div>
            </section>
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 font-mono-brand">Ejemplos destacados</h2>
              <ul className="space-y-1.5">
                {tesisEjemplos.map((e) => <li key={e.nombre} className="text-sm text-gray-600">• {e.nombre}</li>)}
              </ul>
            </section>
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 font-mono-brand">Manuales</h2>
              <div className="space-y-2">
                {tesisManuales.map((m) => (
                  <div key={m.nombre} className="bg-gray-50 rounded-lg px-3 py-2.5">
                    <p className="text-sm text-gray-700">{m.nombre}</p>
                    <p className="text-xs text-gray-500">{m.descripcion}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {tab === 'faq' && (
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4 font-mono-brand">Preguntas frecuentes</h2>
            <div className="space-y-4">
              {faqTesisEjemplo.map((f, i) => (
                <details key={i} className="group border-b border-gray-50 pb-3 last:border-0">
                  <summary className="cursor-pointer font-medium text-gray-700 text-sm list-none flex justify-between items-center">
                    {f.pregunta}
                    <span className="text-gray-400 group-open:rotate-180 transition-transform">⌄</span>
                  </summary>
                  <p className="text-sm text-gray-500 mt-2">{f.respuesta}</p>
                </details>
              ))}
            </div>
          </section>
        )}
      </main>
      </div>
    </div>
  );
}
