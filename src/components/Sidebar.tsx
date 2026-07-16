'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Perfil, supabase } from '@/lib/supabase';
import { fotoDePerfil } from '@/lib/fotos';
import Avatar from './Avatar';

export const links = [
  { href: '/inicio', label: 'Inicio', icon: '🏠' },
  { href: '/tutorias', label: 'Tutorías', icon: '🎓' },
  { href: '/eventos', label: 'Eventos', icon: '📅' },
  { href: '/tcu', label: 'TCU', icon: '🤝' },
  { href: '/tesis', label: 'Tesis', icon: '📘' },
  { href: '/agenda', label: 'Agenda', icon: '🗓️' },
  { href: '/beneficios', label: 'Beneficios', icon: '🏆' },
  { href: '/documentos', label: 'Bóveda de Documentos', icon: '🗂️' },
  { href: '/vida-universitaria', label: 'Vida Universitaria', icon: '🎉' },
  { href: '/oportunidades', label: 'Oportunidades', icon: '🚀' },
  { href: '/calendario', label: 'Calendario', icon: '📆' },
  { href: '/asistente', label: 'Asistente IA', icon: '✨' },
  { href: '/administrativo', label: 'Centro Admin.', icon: '🏛️' },
  { href: '/avisos', label: 'Avisos', icon: '🔔' },
  { href: '/perfil', label: 'Perfil', icon: '👤' },
];

// Navegación agrupada por secciones lógicas (mejora la jerarquía visual)
export const gruposNav: { titulo: string | null; items: { href: string; label: string; icon: string }[] }[] = [
  {
    titulo: null,
    items: [
      { href: '/inicio', label: 'Inicio', icon: '🏠' },
      { href: '/asistente', label: 'Asistente IA', icon: '✨' },
    ],
  },
  {
    titulo: 'Académico',
    items: [
      { href: '/tutorias', label: 'Tutorías', icon: '🎓' },
      { href: '/tcu', label: 'TCU', icon: '🤝' },
      { href: '/tesis', label: 'Tesis', icon: '📘' },
      { href: '/documentos', label: 'Bóveda de Documentos', icon: '🗂️' },
    ],
  },
  {
    titulo: 'Campus',
    items: [
      { href: '/eventos', label: 'Eventos', icon: '📅' },
      { href: '/vida-universitaria', label: 'Vida Universitaria', icon: '🎉' },
      { href: '/oportunidades', label: 'Oportunidades', icon: '🚀' },
      { href: '/beneficios', label: 'Beneficios', icon: '🏆' },
    ],
  },
  {
    titulo: 'Mi organización',
    items: [
      { href: '/agenda', label: 'Agenda', icon: '🗓️' },
      { href: '/calendario', label: 'Calendario', icon: '📆' },
      { href: '/avisos', label: 'Avisos', icon: '🔔' },
      { href: '/administrativo', label: 'Centro Admin.', icon: '🏛️' },
    ],
  },
];

// Etiquetas para breadcrumbs (usadas por TopBar)
export const breadcrumbLabels: Record<string, string> = Object.fromEntries(
  links.map((l) => [l.href, l.label])
);

export default function Sidebar({ usuario, cerrarSesion }: { usuario: Perfil; cerrarSesion: () => void }) {
  const pathname = usePathname();
  const [pendientes, setPendientes] = useState(0);

  useEffect(() => {
    supabase
      .from('recordatorios')
      .select('id', { count: 'exact', head: true })
      .eq('usuario_id', usuario.id)
      .eq('estado', 'pendiente')
      .then(({ count }) => setPendientes(count || 0));
  }, [usuario.id]);

  return (
    <>
      {/* Sidebar desktop */}
      <aside className="hidden md:flex flex-col w-60 shrink-0 bg-[#2B6477] text-white min-h-screen sticky top-0">
        <div className="px-6 py-7">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full border-2 border-[#FFFFFF] flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-[#FFFFFF]" />
            </span>
            <span className="font-serif-brand text-xl font-semibold">
              Campus<span className="text-[#FFFFFF]">360</span>
            </span>
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-4 overflow-y-auto pb-4">
          {gruposNav.map((grupo, gi) => (
            <div key={gi}>
              {grupo.titulo && (
                <p className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-wider text-white/35 font-mono-brand">
                  {grupo.titulo}
                </p>
              )}
              <div className="space-y-0.5">
                {grupo.items.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      pathname === link.href
                        ? 'bg-white/10 text-[#FFFFFF]'
                        : 'text-white/70 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className="text-base">{link.icon}</span>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="px-6 py-5 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <Avatar nombre={usuario.nombre} fotoUrl={fotoDePerfil(usuario.correo)} size={36} bg="#1F5567" className="ring-2 ring-white/20" />
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{usuario.nombre}</p>
              <p className="text-xs text-white/50 truncate">{usuario.carrera}</p>
            </div>
          </div>
          <button
            onClick={cerrarSesion}
            className="text-xs font-medium text-white/60 hover:text-[#2B6477] transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Nav móvil */}
      <header className="md:hidden bg-[#2B6477] text-white sticky top-0 z-10">
        <div className="flex items-center justify-between px-4 py-3">
          <span className="font-serif-brand text-lg font-semibold">
            Campus<span className="text-[#FFFFFF]">360</span>
          </span>
          <div className="flex items-center gap-3">
            <Link href="/inicio" className="text-lg" aria-label="Buscar">🔍</Link>
            <Link href="/avisos" className="relative" aria-label="Notificaciones">
              <span className="text-lg">🔔</span>
              {pendientes > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[15px] h-[15px] px-1 rounded-full bg-[#D9A441] text-white text-[9px] font-semibold flex items-center justify-center">
                  {pendientes}
                </span>
              )}
            </Link>
            <Link href="/perfil">
              <Avatar nombre={usuario.nombre} fotoUrl={fotoDePerfil(usuario.correo)} size={28} bg="rgba(255,255,255,0.15)" />
            </Link>
            <button onClick={cerrarSesion} className="text-xs text-white/60">
              Salir
            </button>
          </div>
        </div>
        <nav className="flex overflow-x-auto px-4 pb-3 gap-2 items-center">
          {gruposNav.map((grupo, gi) => (
            <div key={gi} className="flex items-center gap-2">
              {gi > 0 && <span className="w-px h-4 bg-white/15 shrink-0" />}
              {grupo.items.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs font-medium px-3 py-1.5 rounded-full whitespace-nowrap ${
                    pathname === link.href ? 'bg-[#FFFFFF] text-[#2B6477]' : 'bg-white/10 text-white/70'
                  }`}
                >
                  {link.icon} {link.label}
                </Link>
              ))}
            </div>
          ))}
        </nav>
      </header>
    </>
  );
}
