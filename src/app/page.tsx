'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function Splash() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace('/inicio');
    });
  }, [router]);

  return (
    <div className="relative box-border flex h-dvh w-full flex-col overflow-hidden bg-[#152238]">
      <div className="absolute left-0 right-0 top-[30px] h-[210px]">
        <div className="absolute left-[-30px] top-5 h-[140px] w-[140px] rounded-full bg-[#F4C93F]/[0.16]" />
        <div className="absolute left-[70px] top-0 h-[130px] w-[130px] rounded-full bg-white/5" />
        <div className="absolute left-[150px] top-[50px] h-[100px] w-[100px] rounded-full bg-[#FF6B5B]/[0.14]" />
        <div className="absolute left-[230px] top-[10px] h-[120px] w-[120px] rounded-full bg-white/5" />
        <div className="absolute left-[300px] top-[70px] h-[90px] w-[90px] rounded-full bg-[#3DDBB0]/[0.12]" />
      </div>
      <div className="absolute left-[-40px] top-[400px] h-[150px] w-[150px] rounded-full bg-[#F4C93F]/[0.09] blur-[6px]" />
      <div className="absolute left-[260px] top-[520px] h-[170px] w-[170px] rounded-full bg-[#3DDBB0]/[0.08] blur-[6px]" />
      <div className="absolute left-[60px] top-[640px] h-[110px] w-[110px] rounded-full bg-[#FF6B5B]/[0.08] blur-[6px]" />

      {[
        [78, 32, 12, 0.9], [140, 190, 8, 0.7], [100, 300, 7, 0.6], [200, 110, 9, 0.7],
        [250, 330, 6, 0.55], [320, 50, 7, 0.6], [420, 340, 8, 0.55], [480, 70, 6, 0.5],
        [560, 290, 7, 0.5], [620, 150, 6, 0.45],
      ].map(([top, left, size, op], i) => (
        <div
          key={i}
          className="absolute rounded-full bg-[#F4C93F]"
          style={{ top, left, width: size, height: size, opacity: op }}
        />
      ))}

      <div className="relative z-[1] flex h-full flex-col items-center justify-center gap-[22px] p-10 text-center">
        <svg width="88" height="88" viewBox="0 0 100 100" style={{ filter: 'drop-shadow(0 10px 20px rgba(244,201,63,0.25))' }}>
          <circle cx="50" cy="50" r="48" fill="#0D1420" />
          <circle cx="50" cy="50" r="37" fill="#152238" />
          <circle cx="50" cy="50" r="31" fill="#F4C93F" />
          <circle cx="50" cy="50" r="23" fill="#152238" />
          <circle cx="50" cy="50" r="17" fill="#F4C93F" />
        </svg>
        <div className="font-['Space_Grotesk',sans-serif] text-2xl font-bold text-white">¡Bienvenido a Campus360!</div>
        <button
          onClick={() => router.push('/login')}
          className="w-full max-w-[230px] rounded-full bg-[#F4C93F] py-4 text-[15.5px] font-bold text-[#152238] shadow-[0_8px_20px_rgba(244,201,63,0.3)]"
        >
          Ingresar
        </button>
        <div className="w-full max-w-[230px]">
          <div className="mb-2 whitespace-nowrap text-[11px] text-white/55">Te llevaremos al campus en unos segundos...</div>
          <div className="h-1 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-[45%] rounded-full bg-[#F4C93F]" />
          </div>
        </div>
      </div>
    </div>
  );
}
