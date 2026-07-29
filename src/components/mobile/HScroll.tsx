'use client';

import { useRef, type ReactNode } from 'react';

/** Fila horizontal con scroll táctil, sin barra nativa, y flechitas redondas
 * a los costados — mismo tratamiento aplicado a historias, filtros y chips. */
export default function HScroll({ children, scrollGap = 160 }: { children: ReactNode; scrollGap?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) => ref.current?.scrollBy({ left: dir * scrollGap, behavior: 'smooth' });

  return (
    <div className="relative">
      <div ref={ref} className="c360-no-scrollbar flex gap-2 overflow-x-auto py-1" style={{ padding: '0 26px 6px' }}>
        {children}
      </div>
      <button
        onClick={() => scroll(-1)}
        aria-label="Desplazar a la izquierda"
        className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full border shadow-md"
        style={{ background: 'var(--c360-surface)', borderColor: 'var(--c360-border)', boxShadow: '0 2px 8px rgba(0,0,0,0.25)' }}
      >
        <svg width="8" height="12" viewBox="0 0 8 12">
          <path d="M6.5 1L1.5 6l5 5" stroke="var(--c360-text2)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      </button>
      <button
        onClick={() => scroll(1)}
        aria-label="Desplazar a la derecha"
        className="absolute right-0 top-1 flex h-6 w-6 items-center justify-center rounded-full border shadow-md"
        style={{ background: 'var(--c360-surface)', borderColor: 'var(--c360-border)', boxShadow: '0 2px 8px rgba(0,0,0,0.25)' }}
      >
        <svg width="8" height="12" viewBox="0 0 8 12">
          <path d="M1.5 1L6.5 6l-5 5" stroke="var(--c360-text2)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      </button>
    </div>
  );
}
