'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useUsuarioActual } from '@/lib/useUsuarioActual';
import { usePageTitle } from '@/lib/usePageTitle';
import { supabase, TcuProceso, TcuEtapa, TcuBitacora, TcuDocumento } from '@/lib/supabase';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { faqTcuEjemplo } from '@/lib/faqTcu';
import { tcuQueEs, tcuComoFunciona, tcuRequisitos, tcuReglamento, tcuFechasImportantes, tcuDocumentacion } from '@/data/tcuInfo';
import { leerColeccion, guardarColeccion } from '@/lib/simulatedStore';

type ExtraBitacora = { empresa: string; supervisor: string; observaciones: string };

const tabs = [
  { id: 'resumen', label: 'Mi progreso' },
  { id: 'que-es', label: 'Qué es el TCU' },
  { id: 'reglamento', label: 'Reglamento' },
  { id: 'fechas', label: 'Fechas importantes' },
  { id: 'documentos', label: 'Documentación' },
  { id: 'faq', label: 'Preguntas frecuentes' },
] as const;

export default function TcuPage() {
  const { usuario, cargando, cerrarSesion } = useUsuarioActual();
  usePageTitle('TCU');
  const [proceso, setProceso] = useState<TcuProceso | null>(null);
  const [etapas, setEtapas] = useState<TcuEtapa[]>([]);
  const [bitacora, setBitacora] = useState<TcuBitacora[]>([]);
  const [documentos, setDocumentos] = useState<TcuDocumento[]>([]);
  const [extras, setExtras] = useState<Record<string, ExtraBitacora>>({});
  const [mostrarForm, setMostrarForm] = useState(false);
  const [nuevaHora, setNuevaHora] = useState({ fecha: '', horas: '', descripcion: '', empresa: '', supervisor: '', observaciones: '' });
  const [guardando, setGuardando] = useState(false);
  const [tab, setTab] = useState<(typeof tabs)[number]['id']>('resumen');

  async function cargarTodo(usuarioId: string) {
    const [procesoRes, etapasRes, bitacoraRes, documentosRes] = await Promise.all([
      supabase.from('tcu_proceso').select('*').eq('usuario_id', usuarioId).single(),
      supabase.from('tcu_etapas').select('*').eq('usuario_id', usuarioId).order('orden'),
      supabase.from('tcu_bitacora').select('*').eq('usuario_id', usuarioId).order('fecha', { ascending: false }),
      supabase.from('tcu_documentos').select('*').eq('usuario_id', usuarioId),
    ]);
    setProceso(procesoRes.data);
    setEtapas(etapasRes.data || []);
    setBitacora(bitacoraRes.data || []);
    setDocumentos(documentosRes.data || []);
    setExtras(leerColeccion<[string, ExtraBitacora]>(usuarioId, 'tcu_bitacora_extra').reduce((acc, [id, v]) => ({ ...acc, [id]: v }), {}));
  }

  useEffect(() => {
    if (!usuario) return;
    cargarTodo(usuario.id);
  }, [usuario]);

  async function registrarHoras(e: React.FormEvent) {
    e.preventDefault();
    if (!usuario || !proceso) return;
    setGuardando(true);
    const horasNum = parseFloat(nuevaHora.horas);

    const { data: insertado } = await supabase
      .from('tcu_bitacora')
      .insert({
        usuario_id: usuario.id,
        fecha: nuevaHora.fecha,
        horas: horasNum,
        descripcion: nuevaHora.descripcion,
        estado: 'registrada',
      })
      .select()
      .single();

    if (insertado) {
      const nuevosExtras = { ...extras, [insertado.id]: { empresa: nuevaHora.empresa, supervisor: nuevaHora.supervisor, observaciones: nuevaHora.observaciones } };
      setExtras(nuevosExtras);
      guardarColeccion(usuario.id, 'tcu_bitacora_extra', Object.entries(nuevosExtras));
    }

    await supabase
      .from('tcu_proceso')
      .update({ horas_completadas: proceso.horas_completadas + horasNum })
      .eq('id', proceso.id);

    await cargarTodo(usuario.id);
    setNuevaHora({ fecha: '', horas: '', descripcion: '', empresa: '', supervisor: '', observaciones: '' });
    setMostrarForm(false);
    setGuardando(false);
  }

  function exportarPdf() {
    window.print();
  }

  if (cargando || !usuario) return null;

  const porcentaje = proceso ? Math.round((proceso.horas_completadas / proceso.horas_requeridas) * 100) : 0;
  const empresasUnicas = Array.from(new Set(Object.values(extras).map((e) => e.empresa).filter(Boolean)));

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#FFFFFF]">
      <Sidebar usuario={usuario} cerrarSesion={cerrarSesion} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar usuario={usuario} />
      <main className="flex-1 px-6 py-8 md:px-10 md:py-10 max-w-4xl print:max-w-none">
        <h1 className="font-serif-brand text-3xl text-[#2B6477] mb-1">Trabajo Comunal Universitario</h1>
        <p className="text-gray-500 mb-6 font-mono-brand text-sm">{proceso?.periodo}</p>

        <Link
          href="/tcu/proyectos"
          className="print:hidden c360-grid-bg rounded-2xl p-5 text-white flex items-center justify-between mb-6 hover:opacity-95 transition-opacity"
        >
          <div>
            <p className="font-mono-brand text-[10px] uppercase tracking-widest text-[#E8C989] mb-1">Banco de proyectos</p>
            <p className="text-sm">Encontrá tu organización, comparalos y postulate</p>
          </div>
          <span className="text-xl">→</span>
        </Link>

        <div className="print:hidden flex gap-1 mb-6 overflow-x-auto border-b border-gray-200">
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

        {tab === 'resumen' && (
          <>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
              <div className="flex justify-between items-end mb-3">
                <div>
                  <span className="font-serif-brand text-4xl text-[#2B6477]">{proceso?.horas_completadas ?? 0}</span>
                  <span className="text-gray-400"> / {proceso?.horas_requeridas ?? 150} horas</span>
                </div>
                <span className="text-sm font-medium text-gray-500 font-mono-brand">{porcentaje}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3">
                <div className="bg-[#2B6477] h-3 rounded-full transition-all" style={{ width: `${Math.min(porcentaje, 100)}%` }} />
              </div>
              {empresasUnicas.length > 0 && (
                <p className="text-xs text-gray-400 mt-2 font-mono-brand">
                  Horas distribuidas en: {empresasUnicas.join(', ')}
                </p>
              )}
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6 print:hidden">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4 font-mono-brand">Etapas del proceso</h2>
              <div className="flex justify-between items-center relative">
                <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-100 -z-0" />
                {etapas.map((etapa) => (
                  <div key={etapa.id} className="flex flex-col items-center gap-2 z-10 flex-1">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        etapa.estado === 'completada' ? 'bg-[#2B6477] text-white' : etapa.estado === 'actual' ? 'bg-[#2B6477] text-white ring-4 ring-[#2B6477]/20' : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {etapa.estado === 'completada' ? '✓' : etapa.orden}
                    </div>
                    <span className="text-[10px] text-center text-gray-500 max-w-[70px]">{etapa.nombre}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 mb-6 print:grid-cols-1">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-4 print:hidden">
                  <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide font-mono-brand">Bitácora de horas</h2>
                  <div className="flex gap-2">
                    <button onClick={exportarPdf} className="text-xs font-medium text-[#2B6477] border border-[#2B6477] px-3 py-1.5 rounded-lg hover:bg-[#2B6477] hover:text-white">
                      Exportar PDF
                    </button>
                    <button onClick={() => setMostrarForm(!mostrarForm)} className="text-xs font-medium text-white bg-[#2B6477] px-3 py-1.5 rounded-lg hover:bg-[#1F5567]">
                      + Registrar
                    </button>
                  </div>
                </div>
                <h2 className="hidden print:block text-lg font-semibold mb-3">Historial de bitácora — {usuario.nombre}</h2>

                {mostrarForm && (
                  <form onSubmit={registrarHoras} className="print:hidden mb-4 p-3 bg-gray-50 rounded-lg space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <input type="date" required value={nuevaHora.fecha} onChange={(e) => setNuevaHora({ ...nuevaHora, fecha: e.target.value })} className="text-sm px-2 py-1.5 border border-gray-200 rounded-md" />
                      <input type="number" step="0.5" min="0" required placeholder="Horas" value={nuevaHora.horas} onChange={(e) => setNuevaHora({ ...nuevaHora, horas: e.target.value })} className="text-sm px-2 py-1.5 border border-gray-200 rounded-md" />
                    </div>
                    <input type="text" required placeholder="Descripción de la actividad" value={nuevaHora.descripcion} onChange={(e) => setNuevaHora({ ...nuevaHora, descripcion: e.target.value })} className="w-full text-sm px-2 py-1.5 border border-gray-200 rounded-md" />
                    <input type="text" placeholder="Empresa / organización" value={nuevaHora.empresa} onChange={(e) => setNuevaHora({ ...nuevaHora, empresa: e.target.value })} className="w-full text-sm px-2 py-1.5 border border-gray-200 rounded-md" />
                    <input type="text" placeholder="Supervisor" value={nuevaHora.supervisor} onChange={(e) => setNuevaHora({ ...nuevaHora, supervisor: e.target.value })} className="w-full text-sm px-2 py-1.5 border border-gray-200 rounded-md" />
                    <textarea placeholder="Observaciones (opcional)" value={nuevaHora.observaciones} onChange={(e) => setNuevaHora({ ...nuevaHora, observaciones: e.target.value })} className="w-full text-sm px-2 py-1.5 border border-gray-200 rounded-md" rows={2} />
                    <p className="text-[11px] text-gray-400">📎 Evidencias y firma del supervisor se adjuntan luego en la revisión presencial con la Coordinación.</p>
                    <button type="submit" disabled={guardando} className="w-full text-sm font-medium text-white bg-[#2B6477] py-1.5 rounded-md hover:bg-[#1F5567] disabled:opacity-50">
                      {guardando ? 'Guardando...' : 'Guardar registro'}
                    </button>
                  </form>
                )}

                <ul className="space-y-3 max-h-96 overflow-y-auto print:max-h-none">
                  {bitacora.map((b) => {
                    const extra = extras[b.id];
                    return (
                      <li key={b.id} className="text-sm border-b border-gray-50 pb-2">
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-700">{b.horas}h</span>
                          <span className="text-xs text-gray-400 font-mono-brand">{new Date(b.fecha).toLocaleDateString('es-CR')}</span>
                        </div>
                        <p className="text-gray-500 text-xs">{b.descripcion}</p>
                        {extra?.empresa && <p className="text-[11px] text-[#2B6477] font-mono-brand mt-0.5">🏢 {extra.empresa}{extra.supervisor ? ` · Sup: ${extra.supervisor}` : ''}</p>}
                        {extra?.observaciones && <p className="text-[11px] text-gray-400 italic mt-0.5">{extra.observaciones}</p>}
                      </li>
                    );
                  })}
                  {bitacora.length === 0 && <p className="text-gray-400 text-sm">Aún no hay horas registradas</p>}
                </ul>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 print:hidden">
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4 font-mono-brand">Documentos</h2>
                <ul className="space-y-3">
                  {documentos.map((d) => (
                    <li key={d.id} className="flex items-center justify-between text-sm">
                      <div>
                        <p className="text-gray-700">{d.nombre}</p>
                        {d.fecha_limite && <p className="text-xs text-gray-400">Fecha límite: {new Date(d.fecha_limite).toLocaleDateString('es-CR')}</p>}
                      </div>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${d.estado === 'entregado' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>
                        {d.estado}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        )}

        {tab === 'que-es' && (
          <div className="space-y-6 print:hidden">
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 font-mono-brand">¿Qué es el TCU?</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{tcuQueEs}</p>
            </section>
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4 font-mono-brand">Cómo funciona</h2>
              <div className="space-y-0">
                {tcuComoFunciona.map((paso, i) => (
                  <div key={i} className="flex gap-4 pb-4 last:pb-0">
                    <div className="flex flex-col items-center">
                      <div className="w-6 h-6 rounded-full bg-[#2B6477] text-white text-[10px] flex items-center justify-center font-semibold">{i + 1}</div>
                      {i < tcuComoFunciona.length - 1 && <div className="w-0.5 flex-1 bg-gray-100 my-1" />}
                    </div>
                    <p className="text-sm text-gray-600 pb-2">{paso}</p>
                  </div>
                ))}
              </div>
            </section>
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 font-mono-brand">Requisitos</h2>
              <ul className="space-y-1.5">
                {tcuRequisitos.map((r, i) => <li key={i} className="text-sm text-gray-600">• {r}</li>)}
              </ul>
            </section>
          </div>
        )}

        {tab === 'reglamento' && (
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 print:hidden">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4 font-mono-brand">Reglamento resumido</h2>
            <div className="space-y-4">
              {tcuReglamento.map((r, i) => (
                <div key={i} className="border-b border-gray-50 pb-3 last:border-0">
                  <p className="text-sm font-medium text-gray-800">{r.articulo}</p>
                  <p className="text-sm text-gray-500">{r.detalle}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {tab === 'fechas' && (
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 print:hidden">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4 font-mono-brand">Fechas importantes</h2>
            <div className="space-y-0">
              {tcuFechasImportantes.map((f, i) => (
                <div key={i} className="flex gap-4 pb-4 last:pb-0">
                  <div className="w-16 text-center shrink-0">
                    <p className="font-serif-brand text-lg text-[#2B6477] leading-none">{new Date(f.fecha).getDate()}</p>
                    <p className="text-[10px] uppercase text-gray-400 font-mono-brand">{new Date(f.fecha).toLocaleDateString('es-CR', { month: 'short' })}</p>
                  </div>
                  <p className="text-sm text-gray-600 pt-1">{f.hito}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {tab === 'documentos' && (
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 print:hidden">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4 font-mono-brand">Documentación requerida</h2>
            <div className="space-y-3">
              {tcuDocumentacion.map((d, i) => (
                <div key={i} className="bg-gray-50 rounded-lg px-4 py-3">
                  <p className="text-sm font-medium text-gray-800">{d.nombre}</p>
                  <p className="text-xs text-gray-500">{d.descripcion}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {tab === 'faq' && (
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 print:hidden">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4 font-mono-brand">Preguntas frecuentes</h2>
            <div className="space-y-4">
              {faqTcuEjemplo.map((f, i) => (
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
