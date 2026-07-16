'use client';

import { useMemo, useState } from 'react';
import { useUsuarioActual } from '@/lib/useUsuarioActual';
import { usePageTitle } from '@/lib/usePageTitle';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { ToastStack, useToast } from '@/components/Toast';
import { categorias, busquedasPopulares, misGuardados, documentos, cambiosDelMes, badgeCategoria, Documento } from '@/data/documentos';

const iconoTipo: Record<Documento['tipo'], string> = { PDF: '📄', DOCX: '📝', XLSX: '📊' };
const tiposDisponibles: Documento['tipo'][] = ['PDF', 'DOCX', 'XLSX'];
const estadosDisponibles: Documento['estadoVersion'][] = ['vigente', 'final', 'borrador'];

export default function DocumentosPage() {
  const { usuario, cargando, cerrarSesion } = useUsuarioActual();
  usePageTitle('Bóveda de Documentos');
  const [query, setQuery] = useState('');
  const [categoriaActiva, setCategoriaActiva] = useState<Documento['categoria'] | null>(null);
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false);
  const [tiposActivos, setTiposActivos] = useState<Documento['tipo'][]>([]);
  const [estadosActivos, setEstadosActivos] = useState<Documento['estadoVersion'][]>([]);
  const [verTodos, setVerTodos] = useState(false);
  const [docEnVista, setDocEnVista] = useState<Documento | null>(null);
  const [solicitudAbierta, setSolicitudAbierta] = useState(false);
  const [nombreSolicitud, setNombreSolicitud] = useState('');
  const [detalleSolicitud, setDetalleSolicitud] = useState('');
  const { toasts, mostrarToast } = useToast();

  const resultados = useMemo(() => {
    return [...documentos]
      .filter((d) => {
        const coincideTexto = query.trim() === '' || d.nombre.toLowerCase().includes(query.toLowerCase());
        const coincideCategoria = !categoriaActiva || d.categoria === categoriaActiva;
        const coincideTipo = tiposActivos.length === 0 || tiposActivos.includes(d.tipo);
        const coincideEstado = estadosActivos.length === 0 || estadosActivos.includes(d.estadoVersion);
        return coincideTexto && coincideCategoria && coincideTipo && coincideEstado;
      })
      .sort((a, b) => a.actualizadoOrden - b.actualizadoOrden);
  }, [query, categoriaActiva, tiposActivos, estadosActivos]);

  if (cargando || !usuario) return null;

  function alternar<T>(lista: T[], valor: T, set: (v: T[]) => void) {
    set(lista.includes(valor) ? lista.filter((v) => v !== valor) : [...lista, valor]);
  }

  function enviarSolicitud(e: React.FormEvent) {
    e.preventDefault();
    if (!nombreSolicitud.trim()) return;
    mostrarToast(`Solicitud enviada: "${nombreSolicitud}". Te avisamos cuando esté disponible.`, 'exito');
    setNombreSolicitud('');
    setDetalleSolicitud('');
    setSolicitudAbierta(false);
  }

  const filtrosActivos = tiposActivos.length + estadosActivos.length;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#FFFFFF]">
      <Sidebar usuario={usuario} cerrarSesion={cerrarSesion} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar usuario={usuario} />
        <main className="flex-1 px-6 py-8 md:px-10 md:py-10 max-w-6xl">
          <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
            <h1 className="font-serif-brand text-3xl text-[#2B6477]">Bóveda de documentos</h1>
            <span className="text-xs font-medium text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full flex items-center gap-1.5">
              ✓ Verificados por Universidad Fidélitas
            </span>
          </div>
          <p className="text-gray-500 text-sm mb-6">
            Accede a recursos oficiales, guías de usuario y plantillas académicas actualizadas.
          </p>

          {/* Buscador */}
          <div className="flex gap-3 mb-3 relative">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar documentos por nombre, categoría o palabra clave..."
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2B6477]/20"
              />
            </div>
            <div className="relative">
              <button
                onClick={() => setFiltrosAbiertos((v) => !v)}
                className={`relative flex items-center gap-1.5 text-sm font-medium border px-4 py-3 rounded-xl transition-colors whitespace-nowrap ${
                  filtrosActivos > 0 ? 'border-[#2B6477] text-[#2B6477] bg-[#2B6477]/5' : 'border-gray-200 hover:border-[#2B6477] hover:text-[#2B6477]'
                }`}
              >
                ☰ Filtros avanzados
                {filtrosActivos > 0 && (
                  <span className="w-4 h-4 rounded-full bg-[#2B6477] text-white text-[9px] flex items-center justify-center">{filtrosActivos}</span>
                )}
              </button>
              {filtrosAbiertos && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg p-4 z-20">
                  <p className="text-[10px] uppercase font-semibold text-gray-400 mb-2">Tipo de archivo</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {tiposDisponibles.map((t) => (
                      <button
                        key={t}
                        onClick={() => alternar(tiposActivos, t, setTiposActivos)}
                        className={`text-xs font-medium px-2.5 py-1 rounded-full border transition-colors ${
                          tiposActivos.includes(t) ? 'bg-[#2B6477] text-white border-[#2B6477]' : 'border-gray-200 text-gray-500'
                        }`}
                      >
                        {iconoTipo[t]} {t}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] uppercase font-semibold text-gray-400 mb-2">Estado de versión</p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {estadosDisponibles.map((e) => (
                      <button
                        key={e}
                        onClick={() => alternar(estadosActivos, e, setEstadosActivos)}
                        className={`text-xs font-medium px-2.5 py-1 rounded-full border capitalize transition-colors ${
                          estadosActivos.includes(e) ? 'bg-[#2B6477] text-white border-[#2B6477]' : 'border-gray-200 text-gray-500'
                        }`}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                  {filtrosActivos > 0 && (
                    <button
                      onClick={() => { setTiposActivos([]); setEstadosActivos([]); }}
                      className="text-xs text-[#2B6477] hover:underline"
                    >
                      Limpiar filtros
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 mb-8 text-xs text-gray-400">
            <span>Búsquedas populares:</span>
            {busquedasPopulares.map((b) => (
              <button
                key={b}
                onClick={() => setQuery(b)}
                className="px-2.5 py-1 rounded-full bg-white border border-gray-200 hover:border-[#2B6477]/40 text-gray-600"
              >
                {b}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
            <div>
              {/* Categorías */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-6">
                {categorias.map((c) => (
                  <button
                    key={c.nombre}
                    onClick={() => setCategoriaActiva(categoriaActiva === c.nombre ? null : c.nombre)}
                    className={`text-left bg-white rounded-2xl border p-3.5 transition-colors ${
                      categoriaActiva === c.nombre ? 'border-[#2B6477]' : 'border-gray-100 hover:border-[#2B6477]/40'
                    }`}
                  >
                    <span
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-base mb-2"
                      style={{ background: c.colorFondo, color: c.colorTexto }}
                    >
                      {c.icono}
                    </span>
                    <p className="font-medium text-gray-800 text-xs">{c.nombre}</p>
                    <p className="text-[10px] text-gray-400">{c.cantidad} archivos</p>
                  </button>
                ))}
              </div>

              {/* Tabla de documentos */}
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="grid grid-cols-[1fr_110px_90px_100px_32px] gap-2 px-5 py-2.5 text-[10px] uppercase font-semibold text-gray-400 border-b border-gray-50">
                  <span>Documento</span>
                  <span>Categoría</span>
                  <span>Versión</span>
                  <span>Actualizado</span>
                  <span></span>
                </div>
                {(verTodos ? resultados : resultados.slice(0, 6)).map((d) => {
                  const badge = badgeCategoria[d.categoria];
                  return (
                    <div key={d.id} className="grid grid-cols-[1fr_110px_90px_100px_32px] gap-2 items-center px-5 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-lg shrink-0">{iconoTipo[d.tipo]}</span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-gray-800 truncate">{d.nombre}</p>
                            {d.esNuevo && (
                              <span className="text-[8px] font-semibold uppercase px-1.5 py-0.5 rounded-full bg-[#D9A441]/15 text-[#8a6417] shrink-0">
                                Actualizado
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 truncate">{d.descripcion}</p>
                        </div>
                      </div>
                      <span
                        className="text-[10px] font-medium px-2 py-1 rounded-full text-center w-fit"
                        style={{ background: badge.bg, color: badge.text }}
                      >
                        {d.categoria}
                      </span>
                      <span className="text-xs text-gray-500">
                        {d.version} <span className="text-gray-300">· {d.estadoVersion}</span>
                      </span>
                      <span className="text-xs text-gray-400">{d.actualizado}</span>
                      <button onClick={() => setDocEnVista(d)} className="text-gray-300 hover:text-[#2B6477] transition-colors" title="Ver documento">👁</button>
                    </div>
                  );
                })}
                {resultados.length === 0 && (
                  <p className="text-sm text-gray-400 px-5 py-6 text-center">No se encontraron documentos con esos filtros.</p>
                )}
                {resultados.length > 6 && (
                  <button
                    onClick={() => setVerTodos((v) => !v)}
                    className="w-full text-center text-sm font-medium text-[#2B6477] py-3 hover:bg-gray-50 transition-colors"
                  >
                    {verTodos ? 'Ver menos ⌃' : `Ver todos los documentos (${resultados.length}) ⌄`}
                  </button>
                )}
              </div>
            </div>

            {/* Columna lateral */}
            <div className="space-y-5">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <h2 className="font-semibold text-[#2B6477] text-sm">Mis guardados</h2>
                  <span className="text-[10px] font-semibold bg-[#2B6477]/10 text-[#2B6477] w-5 h-5 rounded-full flex items-center justify-center">
                    {misGuardados.length}
                  </span>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50">
                  {misGuardados.map((d) => (
                    <button key={d.id} onClick={() => setDocEnVista(d)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left">
                      <span className="text-lg shrink-0">{iconoTipo[d.tipo]}</span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{d.nombre}</p>
                        <p className="text-xs text-gray-400">
                          {d.tipo} · {d.tamano}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="font-semibold text-[#2B6477] text-sm mb-3">Cambios este mes</h2>
                <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
                  {cambiosDelMes.map((c, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <span className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: c.color }} />
                      <div className="min-w-0">
                        <p className="text-xs text-gray-700">{c.texto}</p>
                        <p className="text-[10px] text-gray-400">{c.fecha}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#2B6477] text-white rounded-2xl p-5">
                <p className="text-sm font-medium mb-1.5">¿No encontrás un documento?</p>
                <p className="text-xs text-white/70 mb-4 leading-relaxed">
                  Nuestro asistente IA puede ayudarte a localizar cualquier recurso o guiarte en el proceso de solicitud.
                </p>
                <div className="space-y-2">
                  <a href="/asistente" className="block text-center text-xs font-medium bg-white text-[#2B6477] py-2 rounded-lg hover:bg-white/90 transition-colors">
                    ✦ Preguntar a Campus IA
                  </a>
                  <button
                    onClick={() => setSolicitudAbierta(true)}
                    className="block w-full text-center text-xs font-medium bg-white/10 border border-white/20 py-2 rounded-lg hover:bg-white/15 transition-colors"
                  >
                    Solicitar documento
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal: ver documento */}
      {docEnVista && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 px-4" onClick={() => setDocEnVista(null)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{iconoTipo[docEnVista.tipo]}</span>
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm">{docEnVista.nombre}</h3>
                  <p className="text-xs text-gray-400">{docEnVista.categoria}</p>
                </div>
              </div>
              <button onClick={() => setDocEnVista(null)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <p className="text-sm text-gray-500 mb-4">{docEnVista.descripcion}</p>
            <div className="grid grid-cols-2 gap-3 text-xs mb-5">
              <div><p className="text-gray-400">Versión</p><p className="text-gray-700 font-medium">{docEnVista.version} · {docEnVista.estadoVersion}</p></div>
              <div><p className="text-gray-400">Tamaño</p><p className="text-gray-700 font-medium">{docEnVista.tamano}</p></div>
              <div><p className="text-gray-400">Actualizado</p><p className="text-gray-700 font-medium">{docEnVista.actualizado}</p></div>
              <div><p className="text-gray-400">Formato</p><p className="text-gray-700 font-medium">{docEnVista.tipo}</p></div>
            </div>
            <a
              href={docEnVista.archivo}
              download
              onClick={() => { mostrarToast(`Descargando "${docEnVista.nombre}"`, 'exito'); setDocEnVista(null); }}
              className="block text-center w-full bg-[#2B6477] text-white text-sm font-medium py-2.5 rounded-lg hover:bg-[#1F5567] transition-colors"
            >
              ⬇ Descargar PDF
            </a>
          </div>
        </div>
      )}

      {/* Modal: solicitar documento */}
      {solicitudAbierta && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 px-4" onClick={() => setSolicitudAbierta(false)}>
          <form onSubmit={enviarSolicitud} className="bg-white rounded-2xl p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Solicitar documento</h3>
              <button type="button" onClick={() => setSolicitudAbierta(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">¿Qué documento necesitás?</label>
            <input
              value={nombreSolicitud}
              onChange={(e) => setNombreSolicitud(e.target.value)}
              required
              placeholder="Ej. Constancia de estudiante regular"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-[#2B6477]/20"
            />
            <label className="text-xs font-medium text-gray-500 mb-1 block">Detalle (opcional)</label>
            <textarea
              value={detalleSolicitud}
              onChange={(e) => setDetalleSolicitud(e.target.value)}
              rows={3}
              placeholder="Contanos para qué lo necesitás o cualquier detalle adicional"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-[#2B6477]/20 resize-none"
            />
            <button type="submit" className="w-full bg-[#2B6477] text-white text-sm font-medium py-2.5 rounded-lg hover:bg-[#1F5567] transition-colors">
              Enviar solicitud
            </button>
          </form>
        </div>
      )}

      <ToastStack toasts={toasts} />
    </div>
  );
}
