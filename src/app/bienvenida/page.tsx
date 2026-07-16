'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useUsuarioActual } from '@/lib/useUsuarioActual';
import { usePageTitle } from '@/lib/usePageTitle';

const SEGUNDOS_AUTO = 3;

export default function BienvenidaPage() {
  const { usuario, cargando } = useUsuarioActual();
  usePageTitle('Bienvenida');
  const router = useRouter();
  const yaNavegoRef = useRef(false);

  function continuar() {
    if (yaNavegoRef.current) return;
    yaNavegoRef.current = true;
    localStorage.setItem('campus360_bienvenida_vista', '1');
    router.push('/inicio');
  }

  useEffect(() => {
    if (cargando || !usuario) return;
    const timer = setTimeout(continuar, SEGUNDOS_AUTO * 1000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cargando, usuario]);

  if (cargando || !usuario) return null;

  return (
    <main className="min-h-screen bg-[#E8F0E5] flex flex-col items-center justify-center px-4 text-center relative overflow-hidden">
      {/* Decoración: racimo de burbujas superior */}
      <svg
        className="absolute top-0 left-0 w-full h-56 sm:h-64 text-[#2B6477]"
        viewBox="0 0 1000 220"
        preserveAspectRatio="xMidYMin slice"
        fill="none"
      >
        {[
          [40, 40, 46], [110, 20, 60], [190, 55, 50], [260, 15, 42], [330, 50, 58],
          [410, 25, 46], [480, 10, 52], [550, 45, 44], [620, 20, 60], [690, 55, 48],
          [760, 15, 42], [830, 45, 56], [900, 25, 46], [960, 60, 40],
          [75, 90, 34], [150, 100, 30], [230, 95, 36], [300, 105, 28], [380, 95, 32],
          [460, 100, 30], [540, 95, 34], [610, 105, 28], [690, 100, 32], [770, 95, 30],
          [850, 100, 34], [920, 95, 28],
        ].map(([cx, cy, r], i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill="currentColor" opacity={0.08 + (i % 4) * 0.05} />
        ))}
        {[[25, 95, 5], [340, 130, 4], [610, 20, 5], [860, 115, 4], [480, 100, 5]].map(([cx, cy, r], i) => (
          <circle key={`d${i}`} cx={cx} cy={cy} r={r} fill="#D9A441" opacity={0.5} />
        ))}
      </svg>

      {/* Anillos decorativos sueltos */}
      <span className="absolute top-[22%] left-[8%] w-6 h-6 rounded-full border border-[#2B6477]/25 hidden sm:block" />
      <span className="absolute top-[10%] right-[6%] text-[#2B6477]/25 text-3xl font-light hidden sm:block">+</span>
      <span className="absolute bottom-[28%] right-[4%] w-5 h-5 rounded-full border border-[#2B6477]/20 hidden sm:block" />
      <svg className="absolute bottom-0 right-0 w-64 h-64 text-[#2B6477]/10 hidden sm:block" viewBox="0 0 200 200" fill="none">
        <path d="M200 200 Q 60 200 60 60" stroke="currentColor" strokeWidth="1" />
        <path d="M200 200 Q 100 200 100 100" stroke="currentColor" strokeWidth="1" />
      </svg>

      {/* Icono central: círculos concéntricos */}
      <div className="relative w-32 h-32 flex items-center justify-center mb-10 z-10">
        <span className="absolute inset-0 rounded-full border-[3px] border-[#2B6477]" />
        <span className="absolute inset-[18px] rounded-full border-2 border-[#2B6477]" />
        <span className="w-4 h-4 rounded-full bg-[#7FB3C7]" />
      </div>

      <h1 className="font-serif-brand text-3xl sm:text-4xl text-[#2B6477] mb-3 z-10">¡Bienvenido a Campus360!</h1>
      <p className="text-gray-500 mb-10 z-10">
        Listo, {usuario.nombre.split(' ')[0]}. Vamos a empezar.
      </p>

      <button
        onClick={continuar}
        className="bg-[#2B6477] text-white font-medium px-10 py-3.5 rounded-full hover:bg-[#1F5567] transition-colors z-10"
      >
        Entrar
      </button>

      <p className="text-xs text-gray-400 mt-4 z-10">Te llevaremos al inicio en unos segundos…</p>
      <div className="w-40 h-1 bg-[#2B6477]/15 rounded-full overflow-hidden mt-2 z-10">
        <div
          className="h-full bg-[#2B6477] rounded-full"
          style={{ animation: `avanzar-bienvenida ${SEGUNDOS_AUTO}s linear forwards` }}
        />
      </div>
      <style>{`
        @keyframes avanzar-bienvenida {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </main>
  );
}
