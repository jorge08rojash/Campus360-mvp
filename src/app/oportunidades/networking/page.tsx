'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useUsuarioActual } from '@/lib/useUsuarioActual';
import { usePageTitle } from '@/lib/usePageTitle';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { personasNetworking } from '@/data/oportunidades';
import { leerColeccion, agregarItem, quitarItem } from '@/lib/simulatedStore';

type Conexion = { id: string; personaId: string; nombre: string };

const roles = ['Todos', 'Estudiante', 'Profesor', 'Egresado', 'Investigador', 'Empresa'];

const colorRol: Record<string, string> = {
  Estudiante: 'bg-[#2B6477]/10 text-[#2B6477]',
  Profesor: 'bg-[#6B8F71]/15 text-[#4E6B4A]',
  Egresado: 'bg-[#D9A441]/15 text-[#8a6417]',
  Investigador: 'bg-[#7A6FA6]/15 text-[#5B4E8C]',
  Empresa: 'bg-[#B5566B]/15 text-[#9E4A5C]',
};

export default function NetworkingPage() {
  const { usuario, cargando, cerrarSesion } = useUsuarioActual();
  usePageTitle('Networking');
  const [rol, setRol] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');
  const [conexiones, setConexiones] = useState<Conexion[]>([]);

  useEffect(() => {
    if (usuario) setConexiones(leerColeccion<Conexion>(usuario.id, 'conexiones'));
  }, [usuario]);

  if (cargando || !usuario) return null;

  function toggle(p: (typeof personasNetworking)[number]) {
    if (!usuario) return;
    const existente = conexiones.find((c) => c.personaId === p.id);
    if (existente) {
      setConexiones(quitarItem<Conexion>(usuario.id, 'conexiones', existente.id));
    } else {
      setConexiones(agregarItem<Conexion>(usuario.id, 'conexiones', { id: `c-${p.id}`, personaId: p.id, nombre: p.nombre }));
    }
  }

  const lista = personasNetworking.filter((p) => {
    const r = rol === 'Todos' || p.rol === rol;
    const b = (p.nombre + p.carreraOArea + p.intereses.join(' ')).toLowerCase().includes(busqueda.toLowerCase());
    return r && b;
  });

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#FFFFFF]">
      <Sidebar usuario={usuario} cerrarSesion={cerrarSesion} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar usuario={usuario} />
      <main className="flex-1 px-6 py-8 md:px-10 md:py-10 max-w-4xl">
        <Link href="/oportunidades" className="text-xs text-gray-400 hover:text-[#2B6477] font-mono-brand mb-2 inline-block">
          ← Centro de Oportunidades
        </Link>
        <h1 className="font-serif-brand text-3xl text-[#2B6477] mb-1">Networking</h1>
        <p className="text-gray-500 mb-6">Descubrí personas con intereses similares · {conexiones.length} conexión(es)</p>

        <input
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre, carrera o interés…"
          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-[#2B6477]/20"
        />

        <div className="flex flex-wrap gap-2 mb-6">
          {roles.map((r) => (
            <button key={r} onClick={() => setRol(r)} className={`text-xs font-medium px-3 py-1.5 rounded-full transition-all ${rol === r ? 'bg-[#2B6477] text-white' : 'bg-white text-gray-500 border border-gray-200 hover:border-[#2B6477]'}`}>
              {r}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {lista.map((p) => {
            const conectado = conexiones.some((c) => c.personaId === p.id);
            return (
              <div key={p.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-11 h-11 rounded-full bg-[#1B5E7B] text-white flex items-center justify-center text-sm font-semibold shrink-0">
                    {p.iniciales}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-800 text-sm truncate">{p.nombre}</h3>
                    <span className={`inline-block text-[9px] font-semibold uppercase px-2 py-0.5 rounded-full font-mono-brand ${colorRol[p.rol]}`}>
                      {p.rol}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mb-2">{p.carreraOArea}</p>
                <p className="text-xs text-gray-600 mb-3">{p.bio}</p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {p.intereses.map((i) => (
                    <span key={i} className="text-[10px] bg-gray-50 text-gray-500 px-2 py-0.5 rounded-full">{i}</span>
                  ))}
                </div>
                <button
                  onClick={() => toggle(p)}
                  className={`w-full text-xs font-medium py-2 rounded-lg transition-colors ${
                    conectado ? 'bg-[#2B6477]/30 text-[#2B6477]' : 'bg-[#2B6477] text-white hover:bg-[#1F5567]'
                  }`}
                >
                  {conectado ? '✓ Conectado' : '+ Conectar'}
                </button>
              </div>
            );
          })}
        </div>
      </main>
      </div>
    </div>
  );
}
