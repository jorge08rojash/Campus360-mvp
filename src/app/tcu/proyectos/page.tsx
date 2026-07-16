'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useUsuarioActual } from '@/lib/useUsuarioActual';
import { usePageTitle } from '@/lib/usePageTitle';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { proyectosTcu, provinciasTcu, areasTcu } from '@/data/proyectosTcu';
import { leerColeccion, guardarColeccion } from '@/lib/simulatedStore';

const tiposOrg = ['Todos', 'ONG', 'Municipalidad', 'Fundación', 'Institución pública', 'Empresa privada', 'Proyecto universitario'];
const modalidades = ['Todas', 'Presencial', 'Virtual', 'Híbrido'];

export default function BancoProyectosPage() {
  const { usuario, cargando, cerrarSesion } = useUsuarioActual();
  usePageTitle('Proyectos TCU');
  const [busqueda, setBusqueda] = useState('');
  const [tipoOrg, setTipoOrg] = useState('Todos');
  const [modalidad, setModalidad] = useState('Todas');
  const [provincia, setProvincia] = useState('Todas');
  const [area, setArea] = useState('Todas');
  const [comparacion, setComparacion] = useState<string[]>([]);

  useEffect(() => {
    if (usuario) setComparacion(leerColeccion<string>(usuario.id, 'tcu_comparacion'));
  }, [usuario]);

  if (cargando || !usuario) return null;

  function toggleComparar(id: string) {
    if (!usuario) return;
    let nueva: string[];
    if (comparacion.includes(id)) {
      nueva = comparacion.filter((c) => c !== id);
    } else {
      if (comparacion.length >= 3) return;
      nueva = [...comparacion, id];
    }
    setComparacion(nueva);
    guardarColeccion(usuario.id, 'tcu_comparacion', nueva);
  }

  const lista = proyectosTcu.filter((p) => {
    const b = (p.nombre + p.organizacion + p.descripcion).toLowerCase().includes(busqueda.toLowerCase());
    const t = tipoOrg === 'Todos' || p.tipoOrg === tipoOrg;
    const m = modalidad === 'Todas' || p.modalidad === modalidad;
    const pr = provincia === 'Todas' || p.provincia === provincia;
    const a = area === 'Todas' || p.area === area;
    return b && t && m && pr && a;
  });

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#FFFFFF]">
      <Sidebar usuario={usuario} cerrarSesion={cerrarSesion} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar usuario={usuario} />
      <main className="flex-1 px-6 py-8 md:px-10 md:py-10 max-w-5xl pb-24">
        <Link href="/tcu" className="text-xs text-gray-400 hover:text-[#2B6477] font-mono-brand mb-2 inline-block">
          ← Volver a TCU
        </Link>
        <h1 className="font-serif-brand text-3xl text-[#2B6477] mb-1">Banco de proyectos</h1>
        <p className="text-gray-500 mb-6">{proyectosTcu.length} proyectos disponibles · elegí y compará hasta 3</p>

        <input
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre u organización…"
          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-[#2B6477]/20"
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-6">
          <select value={tipoOrg} onChange={(e) => setTipoOrg(e.target.value)} className="text-xs bg-white border border-gray-200 rounded-lg px-3 py-2">
            {tiposOrg.map((t) => <option key={t}>{t}</option>)}
          </select>
          <select value={modalidad} onChange={(e) => setModalidad(e.target.value)} className="text-xs bg-white border border-gray-200 rounded-lg px-3 py-2">
            {modalidades.map((m) => <option key={m}>{m}</option>)}
          </select>
          <select value={provincia} onChange={(e) => setProvincia(e.target.value)} className="text-xs bg-white border border-gray-200 rounded-lg px-3 py-2">
            <option>Todas</option>
            {provinciasTcu.map((p) => <option key={p}>{p}</option>)}
          </select>
          <select value={area} onChange={(e) => setArea(e.target.value)} className="text-xs bg-white border border-gray-200 rounded-lg px-3 py-2">
            <option>Todas</option>
            {areasTcu.map((a) => <option key={a}>{a}</option>)}
          </select>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {lista.map((p) => {
            const enComparacion = comparacion.includes(p.id);
            const llenado = Math.round((p.inscritos / p.cupos) * 100);
            return (
              <div key={p.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex justify-between items-start gap-2 mb-2">
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-[#2B6477]/10 text-[#2B6477] font-mono-brand">
                    {p.tipoOrg}
                  </span>
                  <label className="flex items-center gap-1 text-[10px] text-gray-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enComparacion}
                      onChange={() => toggleComparar(p.id)}
                      disabled={!enComparacion && comparacion.length >= 3}
                    />
                    Comparar
                  </label>
                </div>
                <Link href={`/tcu/proyectos/${p.slug}`} className="group block">
                  <h3 className="font-semibold text-gray-800 text-sm mb-1 group-hover:text-[#2B6477] leading-snug">{p.nombre}</h3>
                  <p className="text-xs text-gray-500 mb-3">{p.organizacion}</p>
                </Link>
                <div className="text-xs text-gray-500 space-y-1 mb-3">
                  <p>📍 {p.canton}, {p.provincia} · {p.modalidad}</p>
                  <p>🕒 {p.horario}</p>
                  <p>🎓 {p.carreras.join(', ')}</p>
                </div>
                <div className="flex justify-between text-[10px] text-gray-400 mb-1 font-mono-brand">
                  <span>{p.inscritos}/{p.cupos} cupos</span>
                  <span>{p.horasDisponibles}h disponibles</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1 mb-3">
                  <div className="bg-[#2B6477] h-1 rounded-full" style={{ width: `${llenado}%` }} />
                </div>
                <Link href={`/tcu/proyectos/${p.slug}`} className="text-xs font-medium text-[#2B6477] hover:underline">
                  Ver detalle →
                </Link>
              </div>
            );
          })}
        </div>
        {lista.length === 0 && (
          <div className="text-center py-16">
            <div className="w-14 h-14 rounded-2xl bg-[#2B6477]/8 flex items-center justify-center text-2xl mx-auto mb-4">🤝</div>
            <p className="text-gray-600 font-medium mb-1">No hay proyectos con esos filtros</p>
            <p className="text-gray-400 text-sm">Probá ajustando la provincia o la modalidad.</p>
          </div>
        )}

        {comparacion.length > 0 && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#2B6477] text-white rounded-2xl px-5 py-3 shadow-xl flex items-center gap-4 z-20">
            <span className="text-sm font-mono-brand">{comparacion.length} proyecto(s) seleccionados</span>
            <Link href="/tcu/proyectos/comparar" className="text-xs font-semibold bg-[#2B6477] text-white px-4 py-1.5 rounded-lg hover:bg-[#1F5567]">
              Comparar →
            </Link>
          </div>
        )}
      </main>
      </div>
    </div>
  );
}
