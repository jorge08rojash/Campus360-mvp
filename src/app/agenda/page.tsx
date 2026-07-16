'use client';

import { useEffect, useState } from 'react';
import { useUsuarioActual } from '@/lib/useUsuarioActual';
import { usePageTitle } from '@/lib/usePageTitle';
import { supabase, Recordatorio } from '@/lib/supabase';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { ConfirmDialog, useConfirm } from '@/components/ConfirmDialog';
import { leerColeccion, agregarItem, quitarItem } from '@/lib/simulatedStore';

type TutoriaAgendada = { id: string; nombre: string; materia: string; fecha: string };
type EventoRegistrado = { id: string; titulo: string; fecha: string };
type NotaPersonal = { id: string; titulo: string; fecha: string };

type ItemAgenda = {
  id: string;
  titulo: string;
  fecha: string;
  tipo: 'TCU' | 'Tutoría' | 'Evento' | 'Nota';
  eliminable?: boolean;
};

export default function AgendaPage() {
  const { usuario, cargando, cerrarSesion } = useUsuarioActual();
  usePageTitle('Agenda');
  const { estado: confirmState, pedirConfirmacion, cerrar: cerrarConfirm } = useConfirm();
  const [recordatorios, setRecordatorios] = useState<Recordatorio[]>([]);
  const [tutorias, setTutorias] = useState<TutoriaAgendada[]>([]);
  const [eventos, setEventos] = useState<EventoRegistrado[]>([]);
  const [notas, setNotas] = useState<NotaPersonal[]>([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [nuevaNota, setNuevaNota] = useState({ titulo: '', fecha: '' });

  useEffect(() => {
    if (!usuario) return;
    supabase
      .from('recordatorios')
      .select('*')
      .eq('usuario_id', usuario.id)
      .eq('estado', 'pendiente')
      .then(({ data }) => setRecordatorios(data || []));
    setTutorias(leerColeccion<TutoriaAgendada>(usuario.id, 'tutorias'));
    setEventos(leerColeccion<EventoRegistrado>(usuario.id, 'eventos'));
    setNotas(leerColeccion<NotaPersonal>(usuario.id, 'notas_agenda'));
  }, [usuario]);

  if (cargando || !usuario) return null;

  function agregarNota(e: React.FormEvent) {
    e.preventDefault();
    if (!usuario || !nuevaNota.titulo || !nuevaNota.fecha) return;
    const nota: NotaPersonal = { id: `nota-${Date.now()}`, titulo: nuevaNota.titulo, fecha: nuevaNota.fecha };
    setNotas(agregarItem<NotaPersonal>(usuario.id, 'notas_agenda', nota));
    setNuevaNota({ titulo: '', fecha: '' });
    setMostrarForm(false);
  }

  function eliminarNota(id: string) {
    if (!usuario) return;
    pedirConfirmacion({
      titulo: '¿Eliminar esta nota?',
      mensaje: 'Esta acción no se puede deshacer.',
      textoConfirmar: 'Eliminar',
      onConfirmar: () => setNotas(quitarItem<NotaPersonal>(usuario.id, 'notas_agenda', id)),
    });
  }

  const items: ItemAgenda[] = [
    ...recordatorios.map((r) => ({ id: r.id, titulo: r.titulo, fecha: r.fecha_limite || '', tipo: 'TCU' as const })),
    ...tutorias.map((t) => ({ id: t.id, titulo: `Tutoría: ${t.materia} con ${t.nombre}`, fecha: t.fecha, tipo: 'Tutoría' as const })),
    ...eventos.map((e) => ({ id: e.id, titulo: e.titulo, fecha: e.fecha, tipo: 'Evento' as const })),
    ...notas.map((n) => ({ id: n.id, titulo: n.titulo, fecha: n.fecha, tipo: 'Nota' as const, eliminable: true })),
  ].sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

  const colorTipo: Record<string, string> = {
    TCU: 'bg-[#2B6477]/10 text-[#2B6477]',
    Tutoría: 'bg-[#6B8F71]/15 text-[#4E6B4A]',
    Evento: 'bg-[#D9A441]/15 text-[#8a6417]',
    Nota: 'bg-gray-100 text-gray-500',
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#FFFFFF]">
      <Sidebar usuario={usuario} cerrarSesion={cerrarSesion} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar usuario={usuario} />
      <main className="flex-1 px-6 py-8 md:px-10 md:py-10 max-w-3xl">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="font-serif-brand text-3xl text-[#2B6477]">Mi agenda</h1>
          <span className="text-[10px] font-medium uppercase tracking-wide bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-mono-brand">
            Vista previa
          </span>
        </div>
        <p className="text-gray-500 mb-6">Todo lo que tenés pendiente, en una sola línea de tiempo</p>

        <button
          onClick={() => setMostrarForm(!mostrarForm)}
          className="text-sm font-medium bg-[#2B6477] text-white px-4 py-2 rounded-lg hover:bg-[#1F5567] mb-6"
        >
          {mostrarForm ? 'Cancelar' : '+ Agregar recordatorio personal'}
        </button>

        {mostrarForm && (
          <form onSubmit={agregarNota} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6 space-y-2">
            <input
              required
              placeholder="¿Qué querés recordar?"
              value={nuevaNota.titulo}
              onChange={(e) => setNuevaNota({ ...nuevaNota, titulo: e.target.value })}
              className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg"
            />
            <input
              required
              type="date"
              value={nuevaNota.fecha}
              onChange={(e) => setNuevaNota({ ...nuevaNota, fecha: e.target.value })}
              className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg"
            />
            <button type="submit" className="w-full text-sm font-medium bg-[#2B6477] text-white py-2 rounded-lg hover:bg-[#1F5567]">
              Guardar
            </button>
          </form>
        )}

        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between gap-3">
              <div className="flex items-center gap-4">
                <div className="w-11 text-center flex-shrink-0">
                  {item.fecha ? (
                    <>
                      <p className="text-[10px] uppercase text-gray-400 font-mono-brand">
                        {new Date(item.fecha).toLocaleDateString('es-CR', { month: 'short' }).replace('.', '')}
                      </p>
                      <p className="font-serif-brand text-xl text-[#2B6477] leading-none">{new Date(item.fecha).getDate()}</p>
                    </>
                  ) : (
                    <p className="text-lg">📌</p>
                  )}
                </div>
                <div>
                  <span className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded-full mb-1 font-mono-brand ${colorTipo[item.tipo]}`}>
                    {item.tipo}
                  </span>
                  <p className="text-sm font-medium text-gray-800">{item.titulo}</p>
                </div>
              </div>
              {item.eliminable && (
                <button onClick={() => eliminarNota(item.id)} className="text-xs text-gray-400 hover:text-[#2B6477]">
                  ✕
                </button>
              )}
            </div>
          ))}
          {items.length === 0 && (
            <div className="text-center py-16">
              <div className="w-14 h-14 rounded-2xl bg-[#2B6477]/8 flex items-center justify-center text-2xl mx-auto mb-4">🗓️</div>
              <p className="text-gray-600 font-medium mb-1">Tu agenda está vacía</p>
              <p className="text-gray-400 text-sm max-w-xs mx-auto">Agendá una tutoría, registrate a un evento o agregá un recordatorio para verlo acá.</p>
            </div>
          )}
        </div>
      </main>
      </div>
      <ConfirmDialog estado={confirmState} cerrar={cerrarConfirm} />
    </div>
  );
}
