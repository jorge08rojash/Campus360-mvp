'use client';

import { useEffect, useState } from 'react';
import { useUsuarioActual } from '@/lib/useUsuarioActual';
import { usePageTitle } from '@/lib/usePageTitle';
import { supabase, Recordatorio } from '@/lib/supabase';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

export default function AvisosPage() {
  const { usuario, cargando, cerrarSesion } = useUsuarioActual();
  usePageTitle('Avisos');
  const [recordatorios, setRecordatorios] = useState<Recordatorio[]>([]);

  async function cargar(usuarioId: string) {
    const { data } = await supabase
      .from('recordatorios')
      .select('*')
      .eq('usuario_id', usuarioId)
      .order('fecha_limite', { ascending: true });
    setRecordatorios(data || []);
  }

  useEffect(() => {
    if (!usuario) return;
    cargar(usuario.id);
  }, [usuario]);

  async function marcarListo(id: string) {
    await supabase.from('recordatorios').update({ estado: 'listo' }).eq('id', id);
    if (usuario) cargar(usuario.id);
  }

  if (cargando || !usuario) return null;

  const coloresPrioridad: Record<string, string> = {
    alta: 'border-l-[#2B6477]',
    media: 'border-l-yellow-400',
    baja: 'border-l-gray-300',
  };

  const pendientes = recordatorios.filter((r) => r.estado === 'pendiente');
  const listos = recordatorios.filter((r) => r.estado === 'listo');

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#FFFFFF]">
      <Sidebar usuario={usuario} cerrarSesion={cerrarSesion} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar usuario={usuario} />
      <main className="flex-1 px-6 py-8 md:px-10 md:py-10 max-w-2xl">
        <h1 className="font-serif-brand text-3xl text-[#2B6477] mb-1">Avisos y recordatorios</h1>
        <p className="text-gray-500 mb-8">Tus alertas de TCU y trámites pendientes</p>

        {pendientes.length > 0 && (
          <>
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 font-mono-brand">
              Pendientes
            </h2>
            <ul className="space-y-3 mb-8">
              {pendientes.map((r) => (
                <li
                  key={r.id}
                  className={`bg-white rounded-xl p-4 shadow-sm border-l-4 ${coloresPrioridad[r.prioridad]} flex items-center justify-between`}
                >
                  <div>
                    <p className="text-sm font-medium text-gray-800">{r.titulo}</p>
                    {r.fecha_limite && (
                      <p className="text-xs text-gray-400">
                        Vence: {new Date(r.fecha_limite).toLocaleDateString('es-CR')}
                      </p>
                    )}
                    <span className="text-[10px] uppercase tracking-wide text-gray-400 font-mono-brand">{r.tipo}</span>
                  </div>
                  <button
                    onClick={() => marcarListo(r.id)}
                    className="text-xs font-medium text-[#2B6477] border border-[#2B6477] px-3 py-1 rounded-lg hover:bg-[#2B6477] hover:text-white transition-colors"
                  >
                    Marcar listo
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}

        {listos.length > 0 && (
          <>
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 font-mono-brand">
              Completados
            </h2>
            <ul className="space-y-3">
              {listos.map((r) => (
                <li
                  key={r.id}
                  className="bg-white/60 rounded-xl p-4 border-l-4 border-l-gray-200 opacity-60"
                >
                  <p className="text-sm font-medium text-gray-400 line-through">{r.titulo}</p>
                </li>
              ))}
            </ul>
          </>
        )}

        {recordatorios.length === 0 && (
          <div className="text-center py-16">
            <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center text-2xl mx-auto mb-4">🎉</div>
            <p className="text-gray-600 font-medium mb-1">Estás al día</p>
            <p className="text-gray-400 text-sm">No tenés recordatorios pendientes por ahora.</p>
          </div>
        )}
      </main>
      </div>
    </div>
  );
}
