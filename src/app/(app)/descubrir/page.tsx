'use client';

import { useState } from 'react';
import { useAppShell } from '@/components/mobile/AppShellContext';
import CoverPhoto from '@/components/mobile/CoverPhoto';
import HScroll from '@/components/mobile/HScroll';
import { itemsPorTipo, type ItemTipo } from '@/lib/catalogo';

const FILTROS: { key: ItemTipo | 'todo'; label: string }[] = [
  { key: 'todo', label: 'Todo' },
  { key: 'tutoria', label: 'Tutorías' },
  { key: 'evento', label: 'Eventos' },
  { key: 'vida', label: 'Vida U' },
  { key: 'oportunidad', label: 'Oportunidades' },
  { key: 'beneficio', label: 'Beneficios' },
];

export default function DescubrirPage() {
  const { usuario, abrirFicha } = useAppShell();
  const [filtro, setFiltro] = useState<ItemTipo | 'todo'>('todo');
  const items = itemsPorTipo(filtro);

  return (
    <div className="c360-scroll-page h-full overflow-y-auto box-border" style={{ padding: '54px 16px 110px' }}>
      <div className="c360-heading mb-1 text-[23px] font-bold">Descubrir</div>
      <div className="mb-4 text-[12.5px]" style={{ color: 'var(--c360-text2)' }}>Recomendado para {usuario.carrera}</div>

      <div className="relative mb-4">
        <HScroll>
          {FILTROS.map((f) => {
            const activo = filtro === f.key;
            return (
              <button
                key={f.key}
                onClick={() => setFiltro(f.key)}
                className="shrink-0 rounded-full border px-4 py-[9px] text-[12.5px] font-semibold"
                style={{
                  borderColor: 'var(--c360-border)',
                  background: activo ? 'var(--c360-accent)' : 'var(--c360-surface)',
                  color: activo ? 'var(--c360-accent-fg)' : 'var(--c360-text)',
                }}
              >
                {f.label}
              </button>
            );
          })}
        </HScroll>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {items.map((d) => (
          <button
            key={d.id}
            onClick={() => abrirFicha(d.tipo, d.id)}
            className="flex flex-col gap-2 rounded-[20px] p-3 text-left"
            style={{ background: 'var(--c360-surface)' }}
          >
            <CoverPhoto tag={d.tag} colorFg={d.tagFg} height={92} radius={14} />
            <span className="inline-flex w-fit rounded-full px-2 py-[3px] text-[9.5px] font-bold" style={{ background: d.tagBg, color: d.tagFg }}>{d.tag}</span>
            <div className="text-[12.5px] font-bold leading-tight" style={{ color: 'var(--c360-accent)' }}>{d.titulo}</div>
            <div className="text-[10.5px]" style={{ color: 'var(--c360-text2)' }}>{d.when}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
