'use client';

import { useEffect, useState } from 'react';
import { useUsuarioActual } from '@/lib/useUsuarioActual';
import { usePageTitle } from '@/lib/usePageTitle';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import Avatar from '@/components/Avatar';
import { ConfirmDialog, useConfirm } from '@/components/ConfirmDialog';
import { tutoresEjemplo, materiasEjemplo } from '@/lib/datosSimulados';
import { leerColeccion, agregarItem, quitarItem } from '@/lib/simulatedStore';

type TutoriaAgendada = { id: string; tutorId: string; nombre: string; materia: string; fecha: string };

const colorTipoTutor: Record<string, string> = {
  Institucional: 'bg-[#2B6477]/10 text-[#2B6477]',
  Gratuita: 'bg-[#6B8F71]/15 text-[#4E6B4A]',
  Premium: 'bg-[#D9A441]/15 text-[#8a6417]',
};

const filtros = ['Todas', 'Virtual', 'Presencial', 'Mejor valoradas', 'Institucional', 'Gratuita', 'Premium'];

export default function TutoriasPage() {
  const { usuario, cargando, cerrarSesion } = useUsuarioActual();
  usePageTitle('Tutorías');
  const { estado: confirmState, pedirConfirmacion, cerrar: cerrarConfirm } = useConfirm();
  const [filtro, setFiltro] = useState('Todas');
  const [busqueda, setBusqueda] = useState('');
  const [misTutorias, setMisTutorias] = useState<TutoriaAgendada[]>([]);
  const [confirmando, setConfirmando] = useState<string | null>(null);

  useEffect(() => {
    if (usuario) setMisTutorias(leerColeccion<TutoriaAgendada>(usuario.id, 'tutorias'));
  }, [usuario]);

  if (cargando || !usuario) return null;

  function agendar(t: (typeof tutoresEjemplo)[number]) {
    setConfirmando(t.id);
    const nueva: TutoriaAgendada = {
      id: `${t.id}-${Date.now()}`,
      tutorId: t.id,
      nombre: t.nombre,
      materia: t.materia,
      fecha: new Date().toISOString(),
    };
    const actualizadas = agregarItem<TutoriaAgendada>(usuario!.id, 'tutorias', nueva);
    setMisTutorias(actualizadas);
    setTimeout(() => setConfirmando(null), 2500);
  }

  function cancelar(id: string) {
    pedirConfirmacion({
      titulo: '¿Cancelar esta tutoría?',
      mensaje: 'Se quitará de tu lista de tutorías agendadas.',
      textoConfirmar: 'Cancelar tutoría',
      onConfirmar: () => setMisTutorias(quitarItem<TutoriaAgendada>(usuario!.id, 'tutorias', id)),
    });
  }

  let tutores = tutoresEjemplo.filter((t) => (t.nombre + t.materia).toLowerCase().includes(busqueda.toLowerCase()));
  if (filtro === 'Virtual') tutores = tutores.filter((t) => t.modalidad.includes('Virtual'));
  if (filtro === 'Presencial') tutores = tutores.filter((t) => t.modalidad.includes('Presencial'));
  if (filtro === 'Mejor valoradas') tutores = [...tutores].sort((a, b) => b.rating - a.rating);
  if (['Institucional', 'Gratuita', 'Premium'].includes(filtro)) tutores = tutores.filter((t) => t.tipo === filtro);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#FFFFFF]">
      <Sidebar usuario={usuario} cerrarSesion={cerrarSesion} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar usuario={usuario} />
      <main className="flex-1 px-6 py-8 md:px-10 md:py-10 max-w-5xl">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="font-serif-brand text-3xl text-[#2B6477]">Encontrá tu tutor</h1>
          <span className="text-[10px] font-medium uppercase tracking-wide bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-mono-brand">
            Vista previa
          </span>
        </div>
        <p className="text-gray-500 mb-6">
          {tutoresEjemplo.length} tutores disponibles en {materiasEjemplo.length} materias
        </p>

        {misTutorias.length > 0 && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 font-mono-brand">
              Mis tutorías agendadas ({misTutorias.length})
            </h2>
            <div className="space-y-2">
              {misTutorias.map((m) => (
                <div key={m.id} className="flex items-center justify-between text-sm bg-[#2B6477]/5 rounded-lg px-3 py-2">
                  <div>
                    <span className="font-medium text-gray-800">{m.materia}</span>
                    <span className="text-gray-400"> · con {m.nombre}</span>
                  </div>
                  <button onClick={() => cancelar(m.id)} className="text-xs text-[#2B6477] hover:underline">
                    Cancelar
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <input
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por materia o tutor…"
          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-[#2B6477]/20"
        />

        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {filtros.map((f) => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className={`text-xs font-medium px-3 py-1.5 rounded-full whitespace-nowrap transition-colors ${
                filtro === f ? 'bg-[#2B6477] text-white' : 'bg-white text-gray-500 border border-gray-200 hover:border-[#2B6477]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tutores.map((t) => {
            const yaAgendada = misTutorias.some((m) => m.tutorId === t.id);
            return (
              <div key={t.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <Avatar nombre={t.nombre} fotoUrl={t.foto_url} size={44} />
                    <div>
                      <h3 className="font-semibold text-gray-800 text-sm">{t.nombre}</h3>
                      <p className="text-sm text-[#2B6477] font-medium">{t.materia}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full font-mono-brand whitespace-nowrap ${colorTipoTutor[t.tipo] || 'bg-gray-100 text-gray-500'}`}>
                    {t.tipo}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-yellow-500 mb-2 font-mono-brand">
                  {'★'.repeat(Math.round(t.rating))}
                  <span className="text-gray-400 ml-1">{t.rating} ({t.reseñas})</span>
                </div>
                <div className="space-y-1 text-xs text-gray-500 mb-4">
                  <p>📍 {t.modalidad}</p>
                  <p>🕒 {t.horario}</p>
                </div>
                <button
                  onClick={() => agendar(t)}
                  disabled={confirmando === t.id}
                  className={`w-full text-sm font-medium py-2 rounded-lg transition-colors ${
                    yaAgendada
                      ? 'bg-[#2B6477]/10 text-[#2B6477]'
                      : 'bg-[#2B6477] text-white hover:bg-[#1F5567] disabled:bg-green-600'
                  }`}
                >
                  {confirmando === t.id ? '✓ Solicitud enviada' : yaAgendada ? '+ Agendar otra sesión' : 'Agendar tutoría'}
                </button>
              </div>
            );
          })}
          {tutores.length === 0 && (
            <div className="col-span-3 text-center py-16">
              <div className="w-14 h-14 rounded-2xl bg-[#2B6477]/8 flex items-center justify-center text-2xl mx-auto mb-4">🔍</div>
              <p className="text-gray-600 font-medium mb-1">No hay tutores con ese filtro</p>
              <p className="text-gray-400 text-sm">Probá con otra materia o modalidad.</p>
            </div>
          )}
        </div>
      </main>
      </div>
      <ConfirmDialog estado={confirmState} cerrar={cerrarConfirm} />
    </div>
  );
}
