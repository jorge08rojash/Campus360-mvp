'use client';

import { useEffect, useState } from 'react';
import { useUsuarioActual } from '@/lib/useUsuarioActual';
import { usePageTitle } from '@/lib/usePageTitle';
import { supabase, Recordatorio } from '@/lib/supabase';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { leerColeccion } from '@/lib/simulatedStore';

type TutoriaAgendada = { id: string; nombre: string; materia: string; fecha: string };
type EventoRegistrado = { id: string; titulo: string; fecha: string };
type Inscripcion = { id: string; titulo: string; fecha: string };
type NotaPersonal = { id: string; titulo: string; fecha: string };

type ItemCalendario = {
  id: string; titulo: string; fecha: string; tipo: 'TCU' | 'Tutoría' | 'Evento' | 'Vida U' | 'Nota';
  responsable: string; estado: string; notas: string;
};

const colorTipo: Record<string, string> = {
  TCU: 'bg-[#2B6477]/10 text-[#2B6477] border-l-[#2B6477]',
  Tutoría: 'bg-[#6B8F71]/15 text-[#4E6B4A] border-l-[#6B8F71]',
  Evento: 'bg-[#D9A441]/15 text-[#8a6417] border-l-[#D9A441]',
  'Vida U': 'bg-[#B5566B]/15 text-[#9E4A5C] border-l-[#B5566B]',
  Nota: 'bg-gray-100 text-gray-500 border-l-gray-300',
};

export default function CalendarioPage() {
  const { usuario, cargando, cerrarSesion } = useUsuarioActual();
  usePageTitle('Calendario');
  const [items, setItems] = useState<ItemCalendario[]>([]);
  const [seleccionado, setSeleccionado] = useState<ItemCalendario | null>(null);
  const [avisoSync, setAvisoSync] = useState<string | null>(null);

  useEffect(() => {
    if (!usuario) return;
    async function cargar() {
      const { data: recordatorios } = await supabase
        .from('recordatorios')
        .select('*')
        .eq('usuario_id', usuario!.id)
        .eq('estado', 'pendiente');

      const tutorias = leerColeccion<TutoriaAgendada>(usuario!.id, 'tutorias');
      const eventos = leerColeccion<EventoRegistrado>(usuario!.id, 'eventos');
      const actividades = leerColeccion<Inscripcion>(usuario!.id, 'actividades');
      const notas = leerColeccion<NotaPersonal>(usuario!.id, 'notas_agenda');

      const todos: ItemCalendario[] = [
        ...(recordatorios || []).map((r: Recordatorio) => ({
          id: r.id, titulo: r.titulo, fecha: r.fecha_limite || '', tipo: 'TCU' as const,
          responsable: 'Coordinación de TCU', estado: r.prioridad, notas: 'Entrega asociada al proceso de TCU.',
        })),
        ...tutorias.map((t) => ({
          id: t.id, titulo: `Tutoría: ${t.materia}`, fecha: t.fecha, tipo: 'Tutoría' as const,
          responsable: t.nombre, estado: 'Agendada', notas: 'Sesión de tutoría académica agendada desde Campus360.',
        })),
        ...eventos.map((e) => ({
          id: e.id, titulo: e.titulo, fecha: e.fecha, tipo: 'Evento' as const,
          responsable: 'Organizador del evento', estado: 'Registrado', notas: 'Revisá el detalle del evento para agenda y ubicación.',
        })),
        ...actividades.map((a) => ({
          id: a.id, titulo: a.titulo, fecha: a.fecha, tipo: 'Vida U' as const,
          responsable: 'Vida Estudiantil', estado: 'Inscrito', notas: 'Actividad de vida universitaria.',
        })),
        ...notas.map((n) => ({
          id: n.id, titulo: n.titulo, fecha: n.fecha, tipo: 'Nota' as const,
          responsable: 'Vos', estado: 'Personal', notas: 'Recordatorio personal agregado manualmente.',
        })),
      ].sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

      setItems(todos);
    }
    cargar();
  }, [usuario]);

  if (cargando || !usuario) return null;

  function sincronizar(servicio: string) {
    setAvisoSync(`Simulación: se generó el enlace de sincronización con ${servicio}. En la versión final esto abriría el flujo real de autorización.`);
    setTimeout(() => setAvisoSync(null), 4000);
  }

  // Agrupar por mes
  const grupos = items.reduce<Record<string, ItemCalendario[]>>((acc, item) => {
    if (!item.fecha) return acc;
    const key = new Date(item.fecha).toLocaleDateString('es-CR', { month: 'long', year: 'numeric' });
    acc[key] = acc[key] || [];
    acc[key].push(item);
    return acc;
  }, {});

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#FFFFFF]">
      <Sidebar usuario={usuario} cerrarSesion={cerrarSesion} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar usuario={usuario} />
      <main className="flex-1 px-6 py-8 md:px-10 md:py-10 max-w-4xl">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-1">
          <h1 className="font-serif-brand text-3xl text-[#2B6477]">Calendario</h1>
          <div className="flex gap-2">
            <button onClick={() => sincronizar('Google Calendar')} className="text-xs font-medium border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg hover:border-[#2B6477] hover:text-[#2B6477]">
              Sincronizar con Google Calendar
            </button>
            <button onClick={() => sincronizar('Outlook')} className="text-xs font-medium border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg hover:border-[#2B6477] hover:text-[#2B6477]">
              Sincronizar con Outlook
            </button>
          </div>
        </div>
        <p className="text-gray-500 mb-6">Hacé clic en cualquier actividad para ver el detalle completo</p>

        {avisoSync && (
          <div className="bg-[#2B6477]/20 border border-[#2B6477] text-[#2B6477] text-sm px-4 py-2.5 rounded-xl mb-4">
            ℹ️ {avisoSync}
          </div>
        )}

        {Object.entries(grupos).map(([mes, lista]) => (
          <div key={mes} className="mb-6">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 font-mono-brand capitalize">{mes}</h2>
            <div className="space-y-2">
              {lista.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSeleccionado(item)}
                  className={`w-full text-left bg-white rounded-xl p-4 shadow-sm border-l-4 flex items-center justify-between hover:shadow-md transition-shadow ${colorTipo[item.tipo].split(' ')[2]}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 text-center shrink-0">
                      <p className="font-serif-brand text-xl text-[#2B6477] leading-none">{new Date(item.fecha).getDate()}</p>
                    </div>
                    <div>
                      <span className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded-full mb-1 font-mono-brand ${colorTipo[item.tipo].split(' ').slice(0, 2).join(' ')}`}>
                        {item.tipo}
                      </span>
                      <p className="text-sm font-medium text-gray-800">{item.titulo}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-300">→</span>
                </button>
              ))}
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-gray-400 text-sm">Tu calendario está vacío por ahora.</p>}
      </main>
      </div>

      {/* Panel de detalle */}
      {seleccionado && (
        <div className="fixed inset-0 bg-black/30 flex justify-end z-30" onClick={() => setSeleccionado(null)}>
          <div className="bg-white w-full max-w-md h-full p-6 overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSeleccionado(null)} className="text-xs text-gray-400 hover:text-[#2B6477] mb-4">✕ Cerrar</button>
            <span className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded-full mb-2 font-mono-brand ${colorTipo[seleccionado.tipo].split(' ').slice(0, 2).join(' ')}`}>
              {seleccionado.tipo}
            </span>
            <h2 className="font-serif-brand text-2xl text-[#2B6477] mb-4">{seleccionado.titulo}</h2>
            <dl className="space-y-3 text-sm mb-6">
              <div><dt className="text-[10px] uppercase text-gray-400 font-mono-brand">Fecha</dt><dd className="text-gray-700">{new Date(seleccionado.fecha).toLocaleDateString('es-CR', { weekday: 'long', day: 'numeric', month: 'long' })}</dd></div>
              <div><dt className="text-[10px] uppercase text-gray-400 font-mono-brand">Responsable</dt><dd className="text-gray-700">{seleccionado.responsable}</dd></div>
              <div><dt className="text-[10px] uppercase text-gray-400 font-mono-brand">Estado</dt><dd className="text-gray-700">{seleccionado.estado}</dd></div>
              <div><dt className="text-[10px] uppercase text-gray-400 font-mono-brand">Notas</dt><dd className="text-gray-700">{seleccionado.notas}</dd></div>
            </dl>
            <div className="flex gap-2">
              <button onClick={() => sincronizar('Google Calendar')} className="flex-1 text-xs font-medium border border-gray-200 text-gray-600 py-2 rounded-lg hover:border-[#2B6477] hover:text-[#2B6477]">
                Agregar a Google Calendar
              </button>
              <button onClick={() => sincronizar('Outlook')} className="flex-1 text-xs font-medium border border-gray-200 text-gray-600 py-2 rounded-lg hover:border-[#2B6477] hover:text-[#2B6477]">
                Agregar a Outlook
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
