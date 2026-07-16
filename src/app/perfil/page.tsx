'use client';

import { useEffect, useRef, useState } from 'react';
import { useUsuarioActual } from '@/lib/useUsuarioActual';
import { usePageTitle } from '@/lib/usePageTitle';
import { supabase, TcuProceso } from '@/lib/supabase';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { leerColeccion, guardarColeccion } from '@/lib/simulatedStore';
import { fotoDePerfil } from '@/lib/fotos';

type PerfilExtra = {
  foto: string | null; portada: string;
  telefono: string; bio: string; idioma: string; linkedin: string; instagram: string;
  notifEmail: boolean; notifPush: boolean; perfilPublico: boolean;
};

const portadas = ['#2B6477', '#6B8F71', '#D9A441', '#B5566B'];

const defaultExtra: PerfilExtra = {
  foto: null, portada: '#2B6477', telefono: '', bio: '', idioma: 'Español', linkedin: '', instagram: '',
  notifEmail: true, notifPush: true, perfilPublico: false,
};

const tabs = [
  { id: 'info', label: 'Información' },
  { id: 'estadisticas', label: 'Estadísticas' },
  { id: 'preferencias', label: 'Preferencias' },
  { id: 'seguridad', label: 'Seguridad' },
] as const;

export default function PerfilPage() {
  const { usuario, cargando, cerrarSesion } = useUsuarioActual();
  usePageTitle('Mi Perfil');
  const [extra, setExtra] = useState<PerfilExtra>(defaultExtra);
  const [editando, setEditando] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const [tab, setTab] = useState<(typeof tabs)[number]['id']>('info');
  const [proceso, setProceso] = useState<TcuProceso | null>(null);
  const [conteos, setConteos] = useState({ tutorias: 0, eventos: 0, actividades: 0, certificaciones: 0, conexiones: 0 });
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!usuario) return;
    const guardadoExtra = leerColeccion<[string, unknown]>(usuario.id, 'perfil_extra');
    if (guardadoExtra.length) {
      setExtra({ ...defaultExtra, ...Object.fromEntries(guardadoExtra) } as PerfilExtra);
    }
    supabase.from('tcu_proceso').select('*').eq('usuario_id', usuario.id).single().then(({ data }) => setProceso(data));
    setConteos({
      tutorias: leerColeccion(usuario.id, 'tutorias').length,
      eventos: leerColeccion(usuario.id, 'eventos').length,
      actividades: leerColeccion(usuario.id, 'actividades').length,
      certificaciones: leerColeccion(usuario.id, 'certificaciones_obtenidas').length,
      conexiones: leerColeccion(usuario.id, 'conexiones').length,
    });
  }, [usuario]);

  if (cargando || !usuario) return null;

  function persistir(nuevo: PerfilExtra) {
    setExtra(nuevo);
    guardarColeccion(usuario!.id, 'perfil_extra', Object.entries(nuevo));
  }

  function subirFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => persistir({ ...extra, foto: reader.result as string });
    reader.readAsDataURL(file);
  }

  function guardarInfo(e: React.FormEvent) {
    e.preventDefault();
    setEditando(false);
    setGuardado(true);
    setTimeout(() => setGuardado(false), 3000);
  }

  const pctTcu = proceso ? Math.round((proceso.horas_completadas / proceso.horas_requeridas) * 100) : 0;
  const puntos = conteos.eventos * 45 + conteos.tutorias * 20 + conteos.actividades * 60 + (proceso?.horas_completadas ?? 0) * 2;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#FFFFFF]">
      <Sidebar usuario={usuario} cerrarSesion={cerrarSesion} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar usuario={usuario} />
      <main className="flex-1 max-w-3xl">
        {/* Portada */}
        <div className="h-32 relative" style={{ backgroundColor: extra.portada }}>
          <div className="absolute -bottom-10 left-6 flex items-end gap-4">
            <button
              onClick={() => fileRef.current?.click()}
              className="w-24 h-24 rounded-full border-4 border-[#FFFFFF] bg-[#2B6477] text-white flex items-center justify-center text-2xl font-serif-brand font-semibold overflow-hidden relative group"
            >
              {extra.foto || fotoDePerfil(usuario.correo) ? (
                <img src={extra.foto || fotoDePerfil(usuario.correo)} alt="Foto de perfil" className="w-full h-full object-cover" />
              ) : (
                usuario.nombre.charAt(0)
              )}
              <span className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] transition-opacity">
                Cambiar
              </span>
            </button>
            <input ref={fileRef} type="file" accept="image/*" onChange={subirFoto} className="hidden" />
          </div>
          <div className="absolute top-3 right-3 flex gap-1.5">
            {portadas.map((c) => (
              <button key={c} onClick={() => persistir({ ...extra, portada: c })} className="w-5 h-5 rounded-full border-2 border-white/60" style={{ backgroundColor: c }} />
            ))}
          </div>
        </div>

        <div className="px-6 pt-14 pb-8">
          <h1 className="font-serif-brand text-2xl text-[#2B6477]">{usuario.nombre}</h1>
          <p className="text-sm text-gray-500 mb-1">{usuario.correo}</p>
          {extra.bio && <p className="text-sm text-gray-600 mt-2 max-w-lg">{extra.bio}</p>}

          {guardado && (
            <div className="bg-green-50 text-green-700 text-sm px-3 py-2 rounded-lg my-4">✓ Cambios guardados</div>
          )}

          <div className="flex gap-1 my-6 overflow-x-auto border-b border-gray-200">
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

          {tab === 'info' && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              {!editando ? (
                <>
                  <dl className="space-y-3 text-sm mb-6">
                    <div className="flex justify-between border-b border-gray-50 pb-2"><dt className="text-gray-500">Carrera</dt><dd className="text-gray-800 font-medium">{usuario.carrera}</dd></div>
                    <div className="flex justify-between border-b border-gray-50 pb-2"><dt className="text-gray-500">Cuatrimestre</dt><dd className="text-gray-800 font-medium">{usuario.cuatrimestre}</dd></div>
                    <div className="flex justify-between border-b border-gray-50 pb-2"><dt className="text-gray-500">Teléfono</dt><dd className="text-gray-800 font-medium">{extra.telefono || '—'}</dd></div>
                    <div className="flex justify-between border-b border-gray-50 pb-2"><dt className="text-gray-500">LinkedIn</dt><dd className="text-gray-800 font-medium">{extra.linkedin || '—'}</dd></div>
                    <div className="flex justify-between"><dt className="text-gray-500">Idioma</dt><dd className="text-gray-800 font-medium">{extra.idioma}</dd></div>
                  </dl>
                  <button onClick={() => setEditando(true)} className="w-full text-sm font-medium border border-[#2B6477] text-[#2B6477] py-2 rounded-lg hover:bg-[#2B6477] hover:text-white transition-colors">
                    Editar perfil
                  </button>
                </>
              ) : (
                <form onSubmit={guardarInfo} className="space-y-3">
                  <div><label className="text-xs text-gray-500">Biografía</label><textarea value={extra.bio} onChange={(e) => setExtra({ ...extra, bio: e.target.value })} className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg mt-1" rows={2} /></div>
                  <div><label className="text-xs text-gray-500">Teléfono</label><input value={extra.telefono} onChange={(e) => setExtra({ ...extra, telefono: e.target.value })} className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg mt-1" /></div>
                  <div><label className="text-xs text-gray-500">LinkedIn</label><input value={extra.linkedin} onChange={(e) => setExtra({ ...extra, linkedin: e.target.value })} className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg mt-1" /></div>
                  <div><label className="text-xs text-gray-500">Instagram</label><input value={extra.instagram} onChange={(e) => setExtra({ ...extra, instagram: e.target.value })} className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg mt-1" /></div>
                  <div>
                    <label className="text-xs text-gray-500">Idioma</label>
                    <select value={extra.idioma} onChange={(e) => setExtra({ ...extra, idioma: e.target.value })} className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg mt-1">
                      <option>Español</option><option>Inglés</option><option>Portugués</option>
                    </select>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button type="submit" onClick={() => persistir(extra)} className="flex-1 text-sm font-medium bg-[#2B6477] text-white py-2 rounded-lg hover:bg-[#1F5567]">Guardar</button>
                    <button type="button" onClick={() => setEditando(false)} className="flex-1 text-sm font-medium border border-gray-200 text-gray-600 py-2 rounded-lg hover:bg-gray-50">Cancelar</button>
                  </div>
                </form>
              )}
            </div>
          )}

          {tab === 'estadisticas' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                ['Horas TCU', `${proceso?.horas_completadas ?? 0}/${proceso?.horas_requeridas ?? 150}`],
                ['Progreso TCU', `${pctTcu}%`],
                ['Eventos asistidos', conteos.eventos],
                ['Tutorías', conteos.tutorias],
                ['Vida universitaria', conteos.actividades],
                ['Certificaciones', conteos.certificaciones],
                ['Conexiones', conteos.conexiones],
                ['Puntos Campus360', puntos],
                ['Avance de carrera', `${usuario.avance_carrera}%`],
              ].map(([label, val]) => (
                <div key={label as string} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1 font-mono-brand">{label}</p>
                  <p className="font-serif-brand text-xl text-[#2B6477]">{val}</p>
                </div>
              ))}
              <a href="/oportunidades/panel" className="col-span-2 sm:col-span-3 text-center text-sm font-medium bg-[#2B6477] text-white py-2.5 rounded-xl hover:bg-[#1F5567]">
                Ver mi Índice de Desarrollo Universitario →
              </a>
            </div>
          )}

          {tab === 'preferencias' && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
              {[
                { key: 'notifEmail' as const, label: 'Notificaciones por correo' },
                { key: 'notifPush' as const, label: 'Notificaciones push' },
                { key: 'perfilPublico' as const, label: 'Perfil visible en Networking' },
              ].map((pref) => (
                <div key={pref.key} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{pref.label}</span>
                  <button
                    onClick={() => persistir({ ...extra, [pref.key]: !extra[pref.key] })}
                    className={`w-10 h-6 rounded-full transition-colors relative ${extra[pref.key] ? 'bg-[#2B6477]' : 'bg-gray-200'}`}
                  >
                    <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${extra[pref.key] ? 'translate-x-4' : 'translate-x-0.5'}`} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {tab === 'seguridad' && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 font-mono-brand">Cambiar contraseña</h2>
              <form
                onSubmit={(e) => { e.preventDefault(); setGuardado(true); setTimeout(() => setGuardado(false), 3000); }}
                className="space-y-3"
              >
                <input type="password" placeholder="Contraseña actual" className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg" />
                <input type="password" placeholder="Nueva contraseña" className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg" />
                <button type="submit" className="text-sm font-medium bg-[#2B6477] text-white px-4 py-2 rounded-lg hover:bg-[#1F5567]">
                  Actualizar contraseña
                </button>
              </form>
              <p className="text-xs text-gray-400 mt-3">Vista de prueba — no modifica credenciales reales.</p>
            </div>
          )}
        </div>
      </main>
      </div>
    </div>
  );
}
