'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase, Perfil, Recordatorio } from '@/lib/supabase';
import { fotoDePerfil } from '@/lib/fotos';
import { buscarGlobal } from '@/lib/busqueda';
import Avatar from './Avatar';
import { breadcrumbLabels } from './Sidebar';

const accionesCrear = [
  { href: '/tcu', label: 'Registrar horas TCU', icon: '🤝' },
  { href: '/tutorias', label: 'Solicitar tutoría', icon: '🎓' },
  { href: '/eventos', label: 'Proponer evento', icon: '📅' },
  { href: '/agenda', label: 'Agregar recordatorio', icon: '🗓️' },
];

export default function TopBar({ usuario }: { usuario: Perfil }) {
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [buscadorActivo, setBuscadorActivo] = useState(false);
  const [crearAbierto, setCrearAbierto] = useState(false);
  const [notisAbiertas, setNotisAbiertas] = useState(false);
  const [recordatorios, setRecordatorios] = useState<Recordatorio[]>([]);

  const resultados = useMemo(() => buscarGlobal(query), [query]);

  useEffect(() => {
    supabase
      .from('recordatorios')
      .select('*')
      .eq('usuario_id', usuario.id)
      .eq('estado', 'pendiente')
      .order('fecha_limite', { ascending: true })
      .then(({ data }) => setRecordatorios(data || []));
  }, [usuario.id]);

  const segmento = '/' + (pathname.split('/')[1] || '');
  const seccion = breadcrumbLabels[segmento];

  return (
    <div className="hidden md:flex items-center gap-4 px-8 py-4 bg-[#FFFFFF] border-b border-black/5 sticky top-0 z-10">
      {/* Breadcrumb */}
      <div className="text-xs font-mono-brand text-gray-400 whitespace-nowrap">
        <span>Inicio</span>
        {seccion && seccion !== 'Inicio' && (
          <>
            <span className="mx-1.5">›</span>
            <span className="text-[#2B6477] font-medium">{seccion}</span>
          </>
        )}
      </div>

      {/* Buscador global */}
      <div className="flex-1 max-w-xl relative">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setBuscadorActivo(true)}
            onBlur={() => setTimeout(() => setBuscadorActivo(false), 150)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && resultados.length > 0) {
                router.push(resultados[0].href);
                setQuery('');
              }
              if (e.key === 'Escape') setQuery('');
            }}
            type="text"
            placeholder="Buscar tutorías, eventos, trámites..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-black/10 bg-white text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B5E7B]/30"
          />
        </div>
        {buscadorActivo && query.trim().length >= 2 && (
          <div className="absolute left-0 right-0 mt-2 bg-white border border-black/10 rounded-xl shadow-lg py-2 z-30 max-h-80 overflow-y-auto">
            {resultados.length === 0 && (
              <p className="px-4 py-3 text-sm text-gray-400">Sin resultados para “{query}”. Probá con otra palabra.</p>
            )}
            {resultados.map((r) => (
              <Link
                key={r.id}
                href={r.href}
                onClick={() => setQuery('')}
                className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#E8F0E5] transition-colors"
              >
                <span className="text-base shrink-0">{r.icono}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-800 truncate">{r.titulo}</p>
                  <p className="text-xs text-gray-400 truncate">{r.subtitulo}</p>
                </div>
                <span className="text-[9px] font-semibold uppercase text-[#2B6477] bg-[#2B6477]/8 px-2 py-0.5 rounded-full shrink-0 font-mono-brand">
                  {r.tipo}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Crear */}
      <div className="relative">
        <button
          onClick={() => setCrearAbierto((v) => !v)}
          onBlur={() => setTimeout(() => setCrearAbierto(false), 150)}
          className="flex items-center gap-1.5 bg-[#2B6477] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#1F5567] transition-colors"
          aria-haspopup="true"
          aria-expanded={crearAbierto}
        >
          <span className="text-[#FFFFFF]">+</span> Crear
        </button>
        {crearAbierto && (
          <div className="absolute right-0 mt-2 w-64 bg-white border border-black/10 rounded-xl shadow-lg py-2 z-20">
            {accionesCrear.map((a) => (
              <Link
                key={a.href}
                href={a.href}
                className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-[#E8F0E5]"
              >
                <span>{a.icon}</span>
                {a.label}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Notificaciones */}
      <div className="relative">
        <button
          onClick={() => setNotisAbiertas((v) => !v)}
          onBlur={() => setTimeout(() => setNotisAbiertas(false), 150)}
          className="relative w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors"
          aria-label="Notificaciones"
        >
          🔔
          {recordatorios.length > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-[#D9A441] text-white text-[9px] font-semibold flex items-center justify-center">
              {recordatorios.length}
            </span>
          )}
        </button>
        {notisAbiertas && (
          <div className="absolute right-0 mt-2 w-72 bg-white border border-black/10 rounded-xl shadow-lg py-2 z-20">
            <p className="px-4 py-1.5 text-xs font-semibold text-gray-400 uppercase font-mono-brand">Recordatorios pendientes</p>
            {recordatorios.length === 0 && (
              <p className="px-4 py-3 text-sm text-gray-400">Estás al día, no tenés pendientes. 🎉</p>
            )}
            {recordatorios.slice(0, 5).map((r) => (
              <Link
                key={r.id}
                href="/agenda"
                className="flex items-start gap-2.5 px-4 py-2.5 hover:bg-[#E8F0E5] transition-colors"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                  style={{ background: r.prioridad === 'alta' ? '#C0392B' : r.prioridad === 'media' ? '#D9A441' : '#9CA3AF' }}
                />
                <div className="min-w-0">
                  <p className="text-sm text-gray-700 truncate">{r.titulo}</p>
                  {r.fecha_limite && (
                    <p className="text-xs text-gray-400">Vence {new Date(r.fecha_limite).toLocaleDateString('es-CR')}</p>
                  )}
                </div>
              </Link>
            ))}
            {recordatorios.length > 0 && (
              <Link href="/agenda" className="block text-center text-xs font-medium text-[#2B6477] py-2 hover:bg-gray-50">
                Ver toda la agenda
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Avatar */}
      <Link href="/perfil" title={usuario.nombre}>
        <Avatar nombre={usuario.nombre} fotoUrl={fotoDePerfil(usuario.correo)} size={36} />
      </Link>
    </div>
  );
}
