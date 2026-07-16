'use client';

import { useEffect, useRef, useState } from 'react';
import { useUsuarioActual } from '@/lib/useUsuarioActual';
import { usePageTitle } from '@/lib/usePageTitle';
import { supabase, TcuProceso, Recordatorio } from '@/lib/supabase';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { leerColeccion, guardarColeccion } from '@/lib/simulatedStore';

type Mensaje = { id: string; rol: 'usuario' | 'asistente'; texto: string; hora: string };

const sugerencias = [
  '¿Cuántas horas de TCU me faltan?',
  '¿Cuándo entrego mi próximo documento?',
  'Recomendame una tutoría',
  '¿Qué eventos hay esta semana?',
];

const conversacionesRecientes: { id: string; titulo: string; hora: string; mensajes: { rol: 'usuario' | 'asistente'; texto: string }[] }[] = [
  {
    id: 'c1',
    titulo: 'Repaso Integrales Dobles',
    hora: 'Hace 3h',
    mensajes: [
      { rol: 'usuario', texto: '¿Hay tutorías de Cálculo esta semana?' },
      { rol: 'asistente', texto: 'Sí, la Lic. Mariana Solano da tutoría de Cálculo Diferencial los viernes de 2 a 6 pm, modalidad virtual. Podés agendar desde el módulo de Tutorías.' },
      { rol: 'usuario', texto: 'Perfecto, gracias.' },
      { rol: 'asistente', texto: '¡Con gusto! Cualquier otra duda, contame. 🙂' },
    ],
  },
  {
    id: 'c2',
    titulo: 'Dudas sobre TCU comunitario',
    hora: 'Ayer',
    mensajes: [
      { rol: 'usuario', texto: '¿Cuántas horas de TCU me faltan?' },
      { rol: 'asistente', texto: 'Según tu proceso, vas avanzado en tu TCU. Te recomiendo revisar el módulo TCU para ver el detalle exacto de horas y tu etapa actual.' },
    ],
  },
  {
    id: 'c3',
    titulo: 'Requisitos de tesis',
    hora: 'Hace 4 días',
    mensajes: [
      { rol: 'usuario', texto: '¿Qué necesito para arrancar la tesis?' },
      { rol: 'asistente', texto: 'Podés ver tu ruta de tesis completa en el módulo de Tesis, con las 5 etapas y preguntas frecuentes sobre anteproyecto, tutor y defensa.' },
    ],
  },
];

function horaActual() {
  return new Date().toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' });
}

export default function AsistentePage() {
  const { usuario, cargando, cerrarSesion } = useUsuarioActual();
  usePageTitle('Asistente IA');
  const [proceso, setProceso] = useState<TcuProceso | null>(null);
  const [recordatorios, setRecordatorios] = useState<Recordatorio[]>([]);
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [input, setInput] = useState('');
  const [escribiendo, setEscribiendo] = useState(false);
  const [conversacionActiva, setConversacionActiva] = useState<string | null>(null);
  const finRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!usuario) return;
    supabase.from('tcu_proceso').select('*').eq('usuario_id', usuario.id).single().then(({ data }) => setProceso(data));
    supabase
      .from('recordatorios')
      .select('*')
      .eq('usuario_id', usuario.id)
      .eq('estado', 'pendiente')
      .order('fecha_limite', { ascending: true })
      .then(({ data }) => setRecordatorios(data || []));

    const historial = leerColeccion<Mensaje>(usuario.id, 'chat_asistente');
    if (historial.length > 0) {
      setMensajes(historial);
    } else {
      setMensajes([
        {
          id: 'inicial',
          rol: 'asistente',
          texto: `¡Hola, ${usuario.nombre.split(' ')[0]}! Soy Campus IA, tu asistente de orientación. Puedo ayudarte con dudas sobre tu TCU, tesis, tutorías y eventos. No sustituyo los canales oficiales de la universidad. ¿En qué te ayudo hoy?`,
          hora: horaActual(),
        },
      ]);
    }
  }, [usuario]);

  useEffect(() => {
    finRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes, escribiendo]);

  if (cargando || !usuario) return null;

  function responder(pregunta: string): string {
    const p = pregunta.toLowerCase();
    if (p.includes('hora') && p.includes('tcu')) {
      if (!proceso) return 'No encuentro tu progreso de TCU en este momento.';
      const faltan = proceso.horas_requeridas - proceso.horas_completadas;
      return `Vas ${proceso.horas_completadas}/${proceso.horas_requeridas} horas de TCU. Te faltan ${faltan} horas. Etapa actual: ${proceso.etapa_actual}.`;
    }
    if (p.includes('entrego') || p.includes('documento') || p.includes('bitácora') || p.includes('bitacora')) {
      const prox = recordatorios[0];
      if (!prox) return 'No tenés entregas pendientes registradas por ahora. 🎉';
      return `Tu próxima entrega es "${prox.titulo}"${prox.fecha_limite ? `, vence el ${new Date(prox.fecha_limite).toLocaleDateString('es-CR')}` : ''}. ¿Querés que te lo recuerde en tu Agenda?`;
    }
    if (p.includes('tutor')) {
      return 'Te recomiendo revisar el módulo de Tutorías — filtrá por tu materia y modalidad preferida. Hay tutores disponibles en Cálculo, Bases de Datos, POO y más.';
    }
    if (p.includes('evento') || p.includes('charla') || p.includes('conferencia')) {
      return 'Esta semana hay varias actividades en el módulo de Eventos: charlas, talleres y ferias. Podés filtrar por categoría y registrarte con un clic.';
    }
    if (p.includes('tesis')) {
      return 'Podés ver tu ruta de tesis completa en el módulo de Tesis, con las 5 etapas y preguntas frecuentes sobre anteproyecto, tutor y defensa.';
    }
    if (p.includes('gracias')) {
      return '¡Con gusto! Cualquier otra duda, contame. 🙂';
    }
    return 'Puedo orientarte sobre TCU, tesis, tutorías, eventos y recordatorios. ¿Podés darme un poco más de detalle sobre lo que necesitás?';
  }

  function enviar(texto?: string) {
    const contenido = (texto ?? input).trim();
    if (!contenido || !usuario) return;
    const nuevoUsuario: Mensaje = { id: `u-${Date.now()}`, rol: 'usuario', texto: contenido, hora: horaActual() };
    const historialConUsuario = [...mensajes, nuevoUsuario];
    setMensajes(historialConUsuario);
    guardarColeccion(usuario.id, 'chat_asistente', historialConUsuario);
    setInput('');
    setEscribiendo(true);

    setTimeout(() => {
      const respuesta: Mensaje = { id: `a-${Date.now()}`, rol: 'asistente', texto: responder(contenido), hora: horaActual() };
      const historialFinal = [...historialConUsuario, respuesta];
      setMensajes(historialFinal);
      guardarColeccion(usuario.id, 'chat_asistente', historialFinal);
      setEscribiendo(false);
    }, 900);
  }

  function nuevaConversacion() {
    if (!usuario) return;
    setConversacionActiva(null);
    const inicial: Mensaje = {
      id: 'inicial',
      rol: 'asistente',
      texto: `¡Hola, ${usuario.nombre.split(' ')[0]}! Soy Campus IA, tu asistente de orientación. Puedo ayudarte con dudas sobre tu TCU, tesis, tutorías y eventos. No sustituyo los canales oficiales de la universidad. ¿En qué te ayudo hoy?`,
      hora: horaActual(),
    };
    setMensajes([inicial]);
    guardarColeccion(usuario.id, 'chat_asistente', [inicial]);
  }

  function abrirConversacion(id: string) {
    const conv = conversacionesRecientes.find((c) => c.id === id);
    if (!conv) return;
    setConversacionActiva(id);
    const cargados: Mensaje[] = conv.mensajes.map((m, i) => ({
      id: `${id}-${i}`,
      rol: m.rol,
      texto: m.texto,
      hora: conv.hora,
    }));
    setMensajes(cargados);
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#FFFFFF]">
      <Sidebar usuario={usuario} cerrarSesion={cerrarSesion} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar usuario={usuario} />
        <main className="flex-1 flex overflow-hidden">
          {/* Conversaciones recientes */}
          <div className="hidden lg:flex flex-col w-64 shrink-0 border-r border-gray-100 px-4 py-6">
            <button
              onClick={nuevaConversacion}
              className="w-full text-sm font-medium bg-[#2B6477] text-white rounded-lg py-2.5 mb-5 hover:bg-[#1F5567] transition-colors"
            >
              + Nueva conversación
            </button>
            <p className="text-[10px] uppercase tracking-wide text-gray-400 font-mono-brand mb-2 px-1">Conversaciones recientes</p>
            <div className="space-y-1">
              {conversacionesRecientes.map((c) => (
                <button
                  key={c.id}
                  onClick={() => abrirConversacion(c.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors ${
                    conversacionActiva === c.id ? 'bg-[#2B6477]/8' : 'hover:bg-gray-50'
                  }`}
                >
                  <p className="text-sm text-gray-700 truncate">{c.titulo}</p>
                  <p className="text-xs text-gray-400">{c.hora}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Panel de chat */}
          <div className="flex-1 flex flex-col px-6 py-6 md:px-10 md:py-8 max-w-3xl mx-auto w-full">
            <div className="flex items-center gap-3 mb-1">
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-full bg-[#2B6477] flex items-center justify-center text-white text-base">✦</div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-serif-brand text-xl text-[#2B6477]">Campus IA</h1>
                  <span className="text-[9px] font-medium uppercase tracking-wide bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-mono-brand">
                    Vista previa
                  </span>
                </div>
                <p className="text-xs text-green-600 flex items-center gap-1">● En línea · orientación general</p>
              </div>
            </div>
            <p className="text-gray-400 text-xs mb-6">No sustituye los canales oficiales de la universidad.</p>

            <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1">
              {mensajes.map((m) => (
                <div key={m.id} className={`flex gap-2.5 ${m.rol === 'usuario' ? 'justify-end' : 'justify-start'}`}>
                  {m.rol === 'asistente' && (
                    <div className="w-7 h-7 rounded-full bg-[#2B6477] text-white flex items-center justify-center text-xs shrink-0 mt-0.5">✦</div>
                  )}
                  <div className={`max-w-[75%] flex flex-col ${m.rol === 'usuario' ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                        m.rol === 'usuario'
                          ? 'bg-[#2B6477] text-white rounded-tr-sm'
                          : 'bg-gray-50 border border-gray-100 text-gray-700 rounded-tl-sm'
                      }`}
                    >
                      {m.texto}
                    </div>
                    <span className="text-[10px] text-gray-300 mt-1 px-1">{m.hora}</span>
                  </div>
                  {m.rol === 'usuario' && (
                    <div className="w-7 h-7 rounded-full bg-[#2B6477]/15 text-[#2B6477] flex items-center justify-center text-[10px] font-semibold shrink-0 mt-0.5">
                      {usuario.nombre.charAt(0)}
                    </div>
                  )}
                </div>
              ))}
              {escribiendo && (
                <div className="flex gap-2.5 justify-start">
                  <div className="w-7 h-7 rounded-full bg-[#2B6477] text-white flex items-center justify-center text-xs shrink-0">✦</div>
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce" />
                  </div>
                </div>
              )}
              <div ref={finRef} />
            </div>

            <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
              {sugerencias.map((s) => (
                <button
                  key={s}
                  onClick={() => enviar(s)}
                  className="text-xs whitespace-nowrap bg-white border border-gray-200 text-gray-600 px-3 py-1.5 rounded-full hover:border-[#2B6477] hover:text-[#2B6477] transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                enviar();
              }}
              className="flex gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribí tu pregunta…"
                className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B6477]/20"
              />
              <button type="submit" className="bg-[#2B6477] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#1F5567] transition-colors">
                Enviar
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
