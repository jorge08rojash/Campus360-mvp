'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomTabBar() {
  const pathname = usePathname();
  const colorFor = (href: string) => (pathname === href ? 'var(--c360-accent)' : 'var(--c360-text3)');

  return (
    <div
      className="relative z-30 flex flex-shrink-0 items-center justify-around border-t"
      style={{ padding: '6px 6px 26px', background: 'var(--c360-surface)', borderColor: 'var(--c360-border)' }}
    >
      <Link href="/inicio" className="flex flex-col items-center gap-[3px] px-2 py-1.5">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M4 11L12 4l8 7v8a1 1 0 01-1 1h-4v-6H9v6H5a1 1 0 01-1-1v-8z" stroke={colorFor('/inicio')} strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
        <span className="text-[10px] font-semibold" style={{ color: colorFor('/inicio') }}>Inicio</span>
      </Link>

      <Link href="/descubrir" className="flex flex-col items-center gap-[3px] px-2 py-1.5">
        <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
          <rect x="1" y="1" width="8" height="8" rx="2" stroke={colorFor('/descubrir')} strokeWidth="1.8" />
          <rect x="13" y="1" width="8" height="8" rx="2" stroke={colorFor('/descubrir')} strokeWidth="1.8" />
          <rect x="1" y="13" width="8" height="8" rx="2" stroke={colorFor('/descubrir')} strokeWidth="1.8" />
          <rect x="13" y="13" width="8" height="8" rx="2" stroke={colorFor('/descubrir')} strokeWidth="1.8" />
        </svg>
        <span className="text-[10px] font-semibold" style={{ color: colorFor('/descubrir') }}>Descubrir</span>
      </Link>

      <Link href="/asistente" className="flex flex-col items-center gap-0.5">
        <div
          className="flex h-[54px] w-[54px] items-center justify-center overflow-hidden rounded-full border-4"
          style={{
            background: 'var(--c360-accent)',
            borderColor: 'var(--c360-surface)',
            marginTop: -28,
            boxShadow: '0 6px 16px rgba(244,201,63,0.28)',
            animation: 'c360-pulse-glow 2.4s ease-in-out infinite',
          }}
        >
          <Image src="/campus360/rasta-mascot.png" alt="Rasta" width={54} height={54} className="h-full w-full object-contain" />
        </div>
        <span className="text-[10px] font-bold" style={{ color: 'var(--c360-accent)' }}>Rasta</span>
      </Link>

      <Link href="/camino" className="flex flex-col items-center gap-[3px] px-2 py-1.5">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke={colorFor('/camino')} strokeWidth="1.8" fill="none" />
          <circle cx="12" cy="12" r="3" fill={colorFor('/camino')} />
        </svg>
        <span className="text-[10px] font-semibold" style={{ color: colorFor('/camino') }}>Mi Camino</span>
      </Link>

      <Link href="/perfil" className="flex flex-col items-center gap-[3px] px-2 py-1.5">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="8" r="4" stroke={colorFor('/perfil')} strokeWidth="1.8" />
          <path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6" stroke={colorFor('/perfil')} strokeWidth="1.8" strokeLinecap="round" fill="none" />
        </svg>
        <span className="text-[10px] font-semibold" style={{ color: colorFor('/perfil') }}>Perfil</span>
      </Link>
    </div>
  );
}
